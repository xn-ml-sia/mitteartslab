const ALPHA_THRESHOLD = 128;
const MAX_DPR = 2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function rotatePoint(x, y, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: x * c - y * s, y: x * s + y * c };
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '').trim();
  const safe = normalized.length === 6 ? normalized : 'c2e530';
  return [
    Number.parseInt(safe.slice(0, 2), 16),
    Number.parseInt(safe.slice(2, 4), 16),
    Number.parseInt(safe.slice(4, 6), 16),
  ];
}

function lerpColor(a, b, t) {
  const start = hexToRgb(a);
  const end = hexToRgb(b);
  const toHex = (n) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(lerp(start[0], end[0], t))}${toHex(lerp(start[1], end[1], t))}${toHex(lerp(start[2], end[2], t))}`;
}

function formatLine(segment) {
  return `<line x1="${segment.x1.toFixed(2)}" y1="${segment.y1.toFixed(2)}" x2="${segment.x2.toFixed(2)}" y2="${segment.y2.toFixed(2)}" stroke="${segment.color}" stroke-width="${segment.stroke.toFixed(2)}" stroke-linecap="round" />`;
}

export function createTypeLineFan() {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const maskCanvas = document.createElement('canvas');
  const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });

  let alpha = null;
  let maskWidthPx = 0;
  let maskHeightPx = 0;
  let logicalWidth = 0;
  let logicalHeight = 0;
  let bbox = { x: 0, y: 0, w: 0, h: 0 };
  let maskSignature = '';

  function logicalToPixelX(x) {
    return Math.round(clamp(x, 0, logicalWidth - 1) * dpr);
  }

  function logicalToPixelY(y) {
    return Math.round(clamp(y, 0, logicalHeight - 1) * dpr);
  }

  function alphaAtLogical(x, y) {
    if (!alpha) return 0;
    const px = logicalToPixelX(x);
    const py = logicalToPixelY(y);
    if (px < 0 || py < 0 || px >= maskWidthPx || py >= maskHeightPx) return 0;
    return alpha[(py * maskWidthPx + px) * 4 + 3];
  }

  function scanRowSegments(yLogical, xStartLogical, xEndLogical) {
    const segments = [];
    let runStart = null;
    const y = Math.round(yLogical);
    const xStart = Math.round(xStartLogical);
    const xEnd = Math.round(xEndLogical);

    for (let x = xStart; x <= xEnd; x += 1) {
      const inside = alphaAtLogical(x, y) > ALPHA_THRESHOLD;
      if (inside && runStart === null) runStart = x;
      if (!inside && runStart !== null) {
        segments.push({ x1: runStart, y1: y, x2: x, y2: y });
        runStart = null;
      }
    }

    if (runStart !== null) segments.push({ x1: runStart, y1: y, x2: xEnd, y2: y });
    return segments;
  }

  function createSliceModel(rawParams) {
    if (!alpha) return null;
    const params = {
      lineCount: rawParams.lineCount ?? 100,
      strokeMin: rawParams.strokeMin ?? 0.8,
      strokeMax: rawParams.strokeMax ?? 5.2,
      strokeThreshold: rawParams.strokeThreshold ?? 0,
      lineSizeVariance: rawParams.lineSizeVariance ?? 0.3,
      colorStart: rawParams.colorStart || '#d2ef36',
      colorEnd: rawParams.colorEnd || '#76862a',
    };

    const count = clamp(Math.round(params.lineCount), 2, 400);
    const rowY = new Array(count);
    const rows = new Array(count);

    for (let i = 0; i < count; i += 1) {
      const t = count <= 1 ? 0 : i / (count - 1);
      rowY[i] = bbox.y + t * bbox.h;
      const baseStroke = lerp(params.strokeMax, params.strokeMin, t);
      const wave = 0.5 + 0.5 * Math.sin(t * Math.PI * 4);
      const varianceScale = lerp(1 - params.lineSizeVariance, 1 + params.lineSizeVariance, wave);
      const stroke = baseStroke * varianceScale;
      if (stroke < params.strokeThreshold) {
        rows[i] = [];
        continue;
      }

      const color = lerpColor(params.colorStart, params.colorEnd, t);
      const rawSegments = scanRowSegments(rowY[i], bbox.x, bbox.x + bbox.w);
      rows[i] = rawSegments.map((segment) => ({ ...segment, stroke, color }));
    }

    return {
      rows,
      rowY,
      bbox: { ...bbox },
      lineCount: count,
    };
  }

  function transformSliceModel(model, rawParams) {
    if (!model) return [];
    const params = {
      pivot: rawParams.pivot ?? { x: model.bbox.x, y: model.bbox.y },
      pivotRotationDeg: rawParams.pivotRotationDeg ?? 0,
      fanAngleDeg: rawParams.fanAngleDeg ?? 180,
      collapseZeroDeg: rawParams.collapseZeroDeg ?? 0,
      collapseThickness: rawParams.collapseThickness ?? 6,
      fanCurve: rawParams.fanCurve ?? 1.8,
      radiusGain: rawParams.radiusGain ?? 1.4,
    };

    const count = model.lineCount;
    const relativeAngleDeg = params.fanAngleDeg - params.collapseZeroDeg;
    const totalAngle = (relativeAngleDeg * Math.PI) / 180;
    const baseAngle = (params.pivotRotationDeg * Math.PI) / 180;
    const openAmount = clamp(Math.abs(relativeAngleDeg) / 180, 0, 1);

    const transformed = [];
    for (let i = 0; i < count; i += 1) {
      const t = count <= 1 ? 0 : i / (count - 1);
      const fanT = Math.pow(t, params.fanCurve);
      const radiusScale = 1 + params.radiusGain * fanT;
      const row = model.rows[i];
      for (let j = 0; j < row.length; j += 1) {
        const segment = row[j];
        const a0x = segment.x1 - params.pivot.x;
        const a0y = segment.y1 - params.pivot.y;
        const b0x = segment.x2 - params.pivot.x;
        const b0y = segment.y2 - params.pivot.y;

        const aLocal = rotatePoint(a0x, a0y, -baseAngle);
        const bLocal = rotatePoint(b0x, b0y, -baseAngle);

        const aFan = rotatePoint(aLocal.x, aLocal.y, totalAngle * fanT);
        const bFan = rotatePoint(bLocal.x, bLocal.y, totalAngle * fanT);

        const collapsedY = (t - 0.5) * params.collapseThickness;
        const aCompressed = { x: aFan.x, y: lerp(collapsedY, aFan.y, openAmount) };
        const bCompressed = { x: bFan.x, y: lerp(collapsedY, bFan.y, openAmount) };

        const aGlobal = rotatePoint(aCompressed.x, aCompressed.y, baseAngle);
        const bGlobal = rotatePoint(bCompressed.x, bCompressed.y, baseAngle);

        transformed.push({
          x1: params.pivot.x + aGlobal.x * radiusScale,
          y1: params.pivot.y + aGlobal.y * radiusScale,
          x2: params.pivot.x + bGlobal.x * radiusScale,
          y2: params.pivot.y + bGlobal.y * radiusScale,
          stroke: segment.stroke,
          color: segment.color,
        });
      }
    }

    return transformed;
  }

  return {
    setMask({ text, font, fontSize, width, height, textX = width * 0.5, textY = 8, padding = 36 }) {
      const signature = [text, font, fontSize, width, height, textX, textY, padding].join('|');
      if (signature === maskSignature && alpha) return bbox;

      logicalWidth = Math.max(1, width);
      logicalHeight = Math.max(1, height);
      maskWidthPx = Math.max(1, Math.round(logicalWidth * dpr));
      maskHeightPx = Math.max(1, Math.round(logicalHeight * dpr));
      maskCanvas.width = maskWidthPx;
      maskCanvas.height = maskHeightPx;

      maskCtx.setTransform(1, 0, 0, 1, 0, 0);
      maskCtx.scale(dpr, dpr);
      maskCtx.clearRect(0, 0, logicalWidth, logicalHeight);
      maskCtx.fillStyle = '#000';
      maskCtx.textAlign = 'center';
      maskCtx.textBaseline = 'top';
      maskCtx.font = font;
      maskCtx.fillText(text, textX, textY);

      const pixels = maskCtx.getImageData(0, 0, maskWidthPx, maskHeightPx);
      alpha = pixels.data;

      let minX = maskWidthPx;
      let minY = maskHeightPx;
      let maxX = 0;
      let maxY = 0;
      for (let y = 0; y < maskHeightPx; y += 1) {
        for (let x = 0; x < maskWidthPx; x += 1) {
          if (alpha[(y * maskWidthPx + x) * 4 + 3] > ALPHA_THRESHOLD) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      if (maxX <= minX || maxY <= minY) {
        bbox = { x: 0, y: 0, w: logicalWidth, h: logicalHeight };
      } else {
        const padPx = Math.round(padding * dpr);
        minX = Math.max(0, minX - padPx);
        minY = Math.max(0, minY - padPx);
        maxX = Math.min(maskWidthPx - 1, maxX + padPx);
        maxY = Math.min(maskHeightPx - 1, maxY + padPx);
        bbox = {
          x: minX / dpr,
          y: minY / dpr,
          w: (maxX - minX) / dpr,
          h: (maxY - minY) / dpr,
        };
      }

      maskSignature = signature;
      return bbox;
    },

    createSliceModel,

    transformSliceModel,

    render(rawParams) {
      const model = createSliceModel(rawParams);
      return transformSliceModel(model, rawParams);
    },

    toSvg(segments, { width, height, filterMarkup = '', filterUrl = '' }) {
      const filterAttr = filterUrl ? ` filter="${filterUrl}"` : '';
      const lineMarkup = segments.map(formatLine).join('\n    ');
      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    ${filterMarkup}
  </defs>
  <rect width="100%" height="100%" fill="#050505" />
  <g id="type-lines"${filterAttr}>
    ${lineMarkup}
  </g>
</svg>`;
    },

    getBbox() {
      return bbox;
    },
  };
}
