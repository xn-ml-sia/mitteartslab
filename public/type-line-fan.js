const ALPHA_THRESHOLD = 128;
const MAX_DPR = 2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeByName(name, t) {
  const x = clamp(t, 0, 1);
  if (name === 'easeInOutSine') return 0.5 - 0.5 * Math.cos(Math.PI * x);
  if (name === 'easeInOutCubic') return x < 0.5 ? 4 * x * x * x : 1 - ((-2 * x + 2) ** 3) / 2;
  if (name === 'easeOutExpo') return x === 1 ? 1 : 1 - 2 ** (-10 * x);
  return x;
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

function cubicPoint(p0, p1, p2, p3, t) {
  const omt = 1 - t;
  const omt2 = omt * omt;
  const t2 = t * t;
  const b0 = omt2 * omt;
  const b1 = 3 * omt2 * t;
  const b2 = 3 * omt * t2;
  const b3 = t2 * t;
  return {
    x: b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
    y: b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
  };
}

function cubicTangent(p0, p1, p2, p3, t) {
  const omt = 1 - t;
  const d0 = -3 * omt * omt;
  const d1 = 3 * omt * omt - 6 * omt * t;
  const d2 = 6 * omt * t - 3 * t * t;
  const d3 = 3 * t * t;
  const x = d0 * p0.x + d1 * p1.x + d2 * p2.x + d3 * p3.x;
  const y = d0 * p0.y + d1 * p1.y + d2 * p2.y + d3 * p3.y;
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
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

  function buildPathSegments(pathPoints, smoothness) {
    const points = Array.isArray(pathPoints) ? pathPoints : [];
    if (points.length < 2) return [];
    const s = clamp(smoothness ?? 1, 0, 2);
    const segments = [];
    for (let i = 0; i < points.length - 1; i += 1) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const c1 = {
        x: p1.x + ((p2.x - p0.x) * s) / 6,
        y: p1.y + ((p2.y - p0.y) * s) / 6,
      };
      const c2 = {
        x: p2.x - ((p3.x - p1.x) * s) / 6,
        y: p2.y - ((p3.y - p1.y) * s) / 6,
      };
      segments.push({ p0: p1, p1: c1, p2: c2, p3: p2 });
    }
    return segments;
  }

  function buildPathSampler(pathPoints, rawOptions = {}) {
    const options = {
      smoothness: rawOptions.smoothness ?? 1,
      samplesPerSegment: clamp(Math.round(rawOptions.samplesPerSegment ?? 72), 8, 200),
    };
    const segments = buildPathSegments(pathPoints, options.smoothness);
    if (!segments.length) return null;
    const samples = [];
    let totalLen = 0;
    let prev = null;
    for (let i = 0; i < segments.length; i += 1) {
      const seg = segments[i];
      const steps = options.samplesPerSegment;
      const startJ = i === 0 ? 0 : 1;
      for (let j = startJ; j <= steps; j += 1) {
        const t = j / steps;
        const point = cubicPoint(seg.p0, seg.p1, seg.p2, seg.p3, t);
        const tangent = cubicTangent(seg.p0, seg.p1, seg.p2, seg.p3, t);
        if (prev) totalLen += Math.hypot(point.x - prev.x, point.y - prev.y);
        samples.push({ x: point.x, y: point.y, tx: tangent.x, ty: tangent.y, len: totalLen });
        prev = point;
      }
    }
    const safeTotal = totalLen || 1;
    function sampleAt(u) {
      const wrapped = ((u % 1) + 1) % 1;
      const target = wrapped * safeTotal;
      let lo = 0;
      let hi = samples.length - 1;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (samples[mid].len < target) lo = mid + 1;
        else hi = mid;
      }
      const b = samples[clamp(lo, 0, samples.length - 1)];
      const a = samples[Math.max(0, lo - 1)];
      const span = Math.max(1e-6, b.len - a.len);
      const k = clamp((target - a.len) / span, 0, 1);
      return {
        x: lerp(a.x, b.x, k),
        y: lerp(a.y, b.y, k),
        tx: lerp(a.tx, b.tx, k),
        ty: lerp(a.ty, b.ty, k),
      };
    }
    return {
      getPointAt(u) {
        const s = sampleAt(u);
        return { x: s.x, y: s.y };
      },
      getTangentAt(u) {
        const s = sampleAt(u);
        const len = Math.hypot(s.tx, s.ty) || 1;
        return { x: s.tx / len, y: s.ty / len };
      },
      getSampleAt(u) {
        const s = sampleAt(u);
        const len = Math.hypot(s.tx, s.ty) || 1;
        return { x: s.x, y: s.y, tx: s.tx / len, ty: s.ty / len };
      },
      segments,
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

  function transformSliceModelAlongPath(model, rawParams) {
    if (!model) return [];
    const params = {
      pathPoints: Array.isArray(rawParams.pathPoints) ? rawParams.pathPoints : [],
      pathSpan: rawParams.pathSpan ?? 1,
      pathOffset: rawParams.pathOffset ?? 0,
      pathStagger: rawParams.pathStagger ?? 0,
      pathEasing: rawParams.pathEasing || 'linear',
      followTangent: rawParams.followTangent ?? true,
      tangentStrength: rawParams.tangentStrength ?? 1,
      pathSmoothness: rawParams.pathSmoothness ?? 1,
    };
    const sampler = buildPathSampler(params.pathPoints, { smoothness: params.pathSmoothness });
    if (!sampler) return transformSliceModel(model, rawParams);

    const transformed = [];
    const baseX = model.bbox.x;
    const count = model.lineCount;
    for (let i = 0; i < count; i += 1) {
      const rawT = count <= 1 ? 0 : i / (count - 1);
      const t = easeByName(params.pathEasing, rawT);
      const u = params.pathOffset + t * params.pathSpan + rawT * params.pathStagger;
      const sample = sampler.getSampleAt(u);
      const tangentAngle = Math.atan2(sample.ty, sample.tx) * clamp(params.tangentStrength, 0, 1);
      const row = model.rows[i];
      const baseY = model.rowY[i];
      for (let j = 0; j < row.length; j += 1) {
        const seg = row[j];
        const aLocal = { x: seg.x1 - baseX, y: seg.y1 - baseY };
        const bLocal = { x: seg.x2 - baseX, y: seg.y2 - baseY };
        const a = params.followTangent ? rotatePoint(aLocal.x, aLocal.y, tangentAngle) : aLocal;
        const b = params.followTangent ? rotatePoint(bLocal.x, bLocal.y, tangentAngle) : bLocal;
        transformed.push({
          x1: sample.x + a.x,
          y1: sample.y + a.y,
          x2: sample.x + b.x,
          y2: sample.y + b.y,
          stroke: seg.stroke,
          color: seg.color,
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

    transformSliceModelAlongPath,

    buildPathSampler,

    render(rawParams) {
      const model = createSliceModel(rawParams);
      if (Array.isArray(rawParams.pathPoints) && rawParams.pathPoints.length >= 2) {
        return transformSliceModelAlongPath(model, rawParams);
      }
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
