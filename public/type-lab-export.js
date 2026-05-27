import { createTypeLabDocument } from './type-lab-state-model.js';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function ease(name, t) {
  const x = clamp(t, 0, 1);
  if (name === 'easeInOutSine') return 0.5 - 0.5 * Math.cos(Math.PI * x);
  if (name === 'easeInOutCubic') return x < 0.5 ? 4 * x * x * x : 1 - ((-2 * x + 2) ** 3) / 2;
  if (name === 'easeOutExpo') return x === 1 ? 1 : 1 - 2 ** (-10 * x);
  return x;
}

function rotatePoint(x, y, a) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: x * c - y * s, y: x * s + y * c };
}

function cubicPoint(p0, p1, p2, p3, t) {
  const omt = 1 - t;
  const omt2 = omt * omt;
  const t2 = t * t;
  return {
    x: omt2 * omt * p0.x + 3 * omt2 * t * p1.x + 3 * omt * t2 * p2.x + t2 * t * p3.x,
    y: omt2 * omt * p0.y + 3 * omt2 * t * p1.y + 3 * omt * t2 * p2.y + t2 * t * p3.y,
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

function buildPathSampler(pathPoints, smoothness = 1) {
  if (!Array.isArray(pathPoints) || pathPoints.length < 2) return null;
  const s = clamp(smoothness, 0, 2);
  const segments = [];
  for (let i = 0; i < pathPoints.length - 1; i += 1) {
    const p0 = pathPoints[Math.max(0, i - 1)];
    const p1 = pathPoints[i];
    const p2 = pathPoints[i + 1];
    const p3 = pathPoints[Math.min(pathPoints.length - 1, i + 2)];
    const c1 = { x: p1.x + ((p2.x - p0.x) * s) / 6, y: p1.y + ((p2.y - p0.y) * s) / 6 };
    const c2 = { x: p2.x - ((p3.x - p1.x) * s) / 6, y: p2.y - ((p3.y - p1.y) * s) / 6 };
    segments.push({ p0: p1, p1: c1, p2: c2, p3: p2 });
  }
  const samples = [];
  let total = 0;
  let prev = null;
  segments.forEach((seg, i) => {
    const steps = 72;
    const startJ = i === 0 ? 0 : 1;
    for (let j = startJ; j <= steps; j += 1) {
      const t = j / steps;
      const p = cubicPoint(seg.p0, seg.p1, seg.p2, seg.p3, t);
      const tg = cubicTangent(seg.p0, seg.p1, seg.p2, seg.p3, t);
      if (prev) total += Math.hypot(p.x - prev.x, p.y - prev.y);
      samples.push({ x: p.x, y: p.y, tx: tg.x, ty: tg.y, len: total });
      prev = p;
    }
  });
  const safeTotal = total || 1;
  return {
    sample(u) {
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
      const tx = lerp(a.tx, b.tx, k);
      const ty = lerp(a.ty, b.ty, k);
      const tlen = Math.hypot(tx, ty) || 1;
      return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), tx: tx / tlen, ty: ty / tlen };
    },
  };
}

function evaluateKeyframeParams(doc, timeSec) {
  const params = { ...(doc.scene?.params || {}) };
  const key = doc.animation?.keyframes || {};
  const opts = doc.animation?.keyframeOptions || {};
  if (!key.start || !key.end) return params;
  const dur = Math.max(0.2, opts.duration || 3.5);
  const raw = timeSec / dur;
  let ft = raw;
  if (opts.pingPong) {
    if (opts.loop) {
      const c = raw % 2;
      ft = c <= 1 ? c : 2 - c;
    } else {
      ft = raw >= 2 ? 0 : raw <= 1 ? raw : 2 - raw;
    }
  } else if (opts.loop) {
    ft = raw % 1;
  } else {
    ft = Math.min(1, raw);
  }
  const et = ease(opts.easing || 'linear', ft);
  Object.keys(key.start).forEach((k) => {
    if (typeof key.start[k] === 'number' && typeof key.end[k] === 'number') {
      params[k] = lerp(key.start[k], key.end[k], et);
    }
  });
  return params;
}

function transformPivot(model, params, width, height) {
  const pivot = { x: (params.pivotX / 100) * width, y: (params.pivotY / 100) * height };
  const relativeAngle = params.fanAngle - params.collapseZero;
  const totalAngle = (relativeAngle * Math.PI) / 180;
  const baseAngle = (params.pivotRotation * Math.PI) / 180;
  const open = clamp(Math.abs(relativeAngle) / 180, 0, 1);
  const out = [];
  for (let i = 0; i < model.lineCount; i += 1) {
    const t = model.lineCount <= 1 ? 0 : i / (model.lineCount - 1);
    const fanT = Math.pow(t, params.fanCurve);
    const radiusScale = 1 + params.radiusGain * fanT;
    const row = model.rows[i];
    for (let j = 0; j < row.length; j += 1) {
      const seg = row[j];
      const a0 = { x: seg.x1 - pivot.x, y: seg.y1 - pivot.y };
      const b0 = { x: seg.x2 - pivot.x, y: seg.y2 - pivot.y };
      const aLocal = rotatePoint(a0.x, a0.y, -baseAngle);
      const bLocal = rotatePoint(b0.x, b0.y, -baseAngle);
      const aFan = rotatePoint(aLocal.x, aLocal.y, totalAngle * fanT);
      const bFan = rotatePoint(bLocal.x, bLocal.y, totalAngle * fanT);
      const collapsedY = (t - 0.5) * params.collapseThickness;
      const aComp = { x: aFan.x, y: lerp(collapsedY, aFan.y, open) };
      const bComp = { x: bFan.x, y: lerp(collapsedY, bFan.y, open) };
      const aG = rotatePoint(aComp.x, aComp.y, baseAngle);
      const bG = rotatePoint(bComp.x, bComp.y, baseAngle);
      out.push({ x1: pivot.x + aG.x * radiusScale, y1: pivot.y + aG.y * radiusScale, x2: pivot.x + bG.x * radiusScale, y2: pivot.y + bG.y * radiusScale, stroke: seg.stroke, color: seg.color });
    }
  }
  return out;
}

function transformPath(doc, model, params, timeSec) {
  const width = doc.scene.width || 1600;
  const height = doc.scene.height || 900;
  const sampler = buildPathSampler(doc.scene.pathPoints || [], params.pathSmoothness || 1);
  if (!sampler) return transformPivot(model, params, width, height);
  const anim = doc.animation?.path || {};
  let offset = params.pathOffset;
  if (anim.enabled) {
    const phase = (anim.speed || 0) * timeSec;
    if (anim.pingPong) {
      const cycle = ((phase % 2) + 2) % 2;
      offset += cycle <= 1 ? cycle : 2 - cycle;
    } else {
      offset += phase;
    }
  }
  const out = [];
  for (let i = 0; i < model.lineCount; i += 1) {
    const rawT = model.lineCount <= 1 ? 0 : i / (model.lineCount - 1);
    const t = ease(params.pathEasing || 'linear', rawT);
    const u = offset + t * params.pathSpan + rawT * params.pathStagger;
    const sample = sampler.sample(u);
    const tangentAngle = Math.atan2(sample.ty, sample.tx) * clamp(params.tangentStrength, 0, 1);
    const row = model.rows[i];
    const baseX = model.bbox.x;
    const baseY = model.rowY[i];
    for (let j = 0; j < row.length; j += 1) {
      const seg = row[j];
      const aL = { x: seg.x1 - baseX, y: seg.y1 - baseY };
      const bL = { x: seg.x2 - baseX, y: seg.y2 - baseY };
      const a = params.followTangent ? rotatePoint(aL.x, aL.y, tangentAngle) : aL;
      const b = params.followTangent ? rotatePoint(bL.x, bL.y, tangentAngle) : bL;
      out.push({ x1: sample.x + a.x, y1: sample.y + a.y, x2: sample.x + b.x, y2: sample.y + b.y, stroke: seg.stroke, color: seg.color });
    }
  }
  return out;
}

function applyTextOffset(segments, params, scene) {
  const tx = typeof params.textX === 'number' ? params.textX - (scene.textX || 0) : 0;
  const ty = typeof params.textY === 'number' ? params.textY - (scene.textY || 0) : 0;
  if (!tx && !ty) return segments;
  return segments.map((s) => ({ ...s, x1: s.x1 + tx, y1: s.y1 + ty, x2: s.x2 + tx, y2: s.y2 + ty }));
}

function applySkew(segments, params) {
  const skewX = params.skewX || 0;
  const skewY = params.skewY || 0;
  if (!skewX && !skewY) return segments;
  let minY = Infinity;
  let maxY = -Infinity;
  segments.forEach((s) => { minY = Math.min(minY, s.y1, s.y2); maxY = Math.max(maxY, s.y1, s.y2); });
  const span = Math.max(1e-6, maxY - minY);
  return segments.map((s) => {
    const t1 = (s.y1 - minY) / span;
    const t2 = (s.y2 - minY) / span;
    const f1 = lerp(-0.5, 0.5, t1);
    const f2 = lerp(-0.5, 0.5, t2);
    return { ...s, x1: s.x1 + skewX * f1, x2: s.x2 + skewX * f2, y1: s.y1 + skewY * f1, y2: s.y2 + skewY * f2 };
  });
}

export function evaluateDocumentSegments(doc, timeSec = 0) {
  const model = doc.scene.model;
  const params = evaluateKeyframeParams(doc, timeSec);
  const width = doc.scene.width || 1600;
  const height = doc.scene.height || 900;
  let segments =
    doc.scene.transformMode === 'path'
      ? transformPath(doc, model, params, timeSec)
      : transformPivot(model, params, width, height);
  segments = applyTextOffset(segments, params, doc.scene);
  segments = applySkew(segments, params);
  return segments;
}

function downloadText(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function runtimeSourceString(sceneJson) {
  return `const SCENE = ${sceneJson};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function ease(name, t) {
  const x = clamp(t, 0, 1);
  if (name === 'easeInOutSine') return 0.5 - 0.5 * Math.cos(Math.PI * x);
  if (name === 'easeInOutCubic') return x < 0.5 ? 4 * x * x * x : 1 - ((-2 * x + 2) ** 3) / 2;
  if (name === 'easeOutExpo') return x === 1 ? 1 : 1 - 2 ** (-10 * x);
  return x;
}
function rotatePoint(x, y, a) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: x * c - y * s, y: x * s + y * c };
}
function cubicPoint(p0, p1, p2, p3, t) {
  const omt = 1 - t;
  const omt2 = omt * omt;
  const t2 = t * t;
  return {
    x: omt2 * omt * p0.x + 3 * omt2 * t * p1.x + 3 * omt * t2 * p2.x + t2 * t * p3.x,
    y: omt2 * omt * p0.y + 3 * omt2 * t * p1.y + 3 * omt * t2 * p2.y + t2 * t * p3.y,
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
function buildPathSampler(pathPoints, smoothness = 1) {
  if (!Array.isArray(pathPoints) || pathPoints.length < 2) return null;
  const s = clamp(smoothness, 0, 2);
  const segments = [];
  for (let i = 0; i < pathPoints.length - 1; i += 1) {
    const p0 = pathPoints[Math.max(0, i - 1)];
    const p1 = pathPoints[i];
    const p2 = pathPoints[i + 1];
    const p3 = pathPoints[Math.min(pathPoints.length - 1, i + 2)];
    const c1 = { x: p1.x + ((p2.x - p0.x) * s) / 6, y: p1.y + ((p2.y - p0.y) * s) / 6 };
    const c2 = { x: p2.x - ((p3.x - p1.x) * s) / 6, y: p2.y - ((p3.y - p1.y) * s) / 6 };
    segments.push({ p0: p1, p1: c1, p2: c2, p3: p2 });
  }
  const samples = [];
  let total = 0;
  let prev = null;
  segments.forEach((seg, i) => {
    const steps = 72;
    const startJ = i === 0 ? 0 : 1;
    for (let j = startJ; j <= steps; j += 1) {
      const t = j / steps;
      const p = cubicPoint(seg.p0, seg.p1, seg.p2, seg.p3, t);
      const tg = cubicTangent(seg.p0, seg.p1, seg.p2, seg.p3, t);
      if (prev) total += Math.hypot(p.x - prev.x, p.y - prev.y);
      samples.push({ x: p.x, y: p.y, tx: tg.x, ty: tg.y, len: total });
      prev = p;
    }
  });
  const safeTotal = total || 1;
  return {
    sample(u) {
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
      const tx = lerp(a.tx, b.tx, k);
      const ty = lerp(a.ty, b.ty, k);
      const tlen = Math.hypot(tx, ty) || 1;
      return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), tx: tx / tlen, ty: ty / tlen };
    },
  };
}
function evaluateKeyframeParams(scene, timeSec) {
  const params = { ...scene.params };
  const key = SCENE.animation?.keyframes || {};
  const opts = SCENE.animation?.keyframeOptions || {};
  if (!key.start || !key.end) return params;
  const dur = Math.max(0.2, opts.duration || 3.5);
  const raw = timeSec / dur;
  let ft = raw;
  if (opts.pingPong) {
    if (opts.loop) {
      const c = raw % 2;
      ft = c <= 1 ? c : 2 - c;
    } else {
      ft = raw >= 2 ? 0 : raw <= 1 ? raw : 2 - raw;
    }
  } else if (opts.loop) {
    ft = raw % 1;
  } else {
    ft = Math.min(1, raw);
  }
  const et = ease(opts.easing || 'linear', ft);
  Object.keys(key.start).forEach((k) => {
    if (typeof key.start[k] === 'number' && typeof key.end[k] === 'number') {
      params[k] = lerp(key.start[k], key.end[k], et);
    }
  });
  return params;
}
function transformPivot(model, params, width, height) {
  const pivot = { x: (params.pivotX / 100) * width, y: (params.pivotY / 100) * height };
  const relativeAngle = params.fanAngle - params.collapseZero;
  const totalAngle = (relativeAngle * Math.PI) / 180;
  const baseAngle = (params.pivotRotation * Math.PI) / 180;
  const open = clamp(Math.abs(relativeAngle) / 180, 0, 1);
  const out = [];
  for (let i = 0; i < model.lineCount; i += 1) {
    const t = model.lineCount <= 1 ? 0 : i / (model.lineCount - 1);
    const fanT = Math.pow(t, params.fanCurve);
    const radiusScale = 1 + params.radiusGain * fanT;
    const row = model.rows[i];
    for (let j = 0; j < row.length; j += 1) {
      const seg = row[j];
      const a0 = { x: seg.x1 - pivot.x, y: seg.y1 - pivot.y };
      const b0 = { x: seg.x2 - pivot.x, y: seg.y2 - pivot.y };
      const aLocal = rotatePoint(a0.x, a0.y, -baseAngle);
      const bLocal = rotatePoint(b0.x, b0.y, -baseAngle);
      const aFan = rotatePoint(aLocal.x, aLocal.y, totalAngle * fanT);
      const bFan = rotatePoint(bLocal.x, bLocal.y, totalAngle * fanT);
      const collapsedY = (t - 0.5) * params.collapseThickness;
      const aComp = { x: aFan.x, y: lerp(collapsedY, aFan.y, open) };
      const bComp = { x: bFan.x, y: lerp(collapsedY, bFan.y, open) };
      const aG = rotatePoint(aComp.x, aComp.y, baseAngle);
      const bG = rotatePoint(bComp.x, bComp.y, baseAngle);
      out.push({ x1: pivot.x + aG.x * radiusScale, y1: pivot.y + aG.y * radiusScale, x2: pivot.x + bG.x * radiusScale, y2: pivot.y + bG.y * radiusScale, stroke: seg.stroke, color: seg.color });
    }
  }
  return out;
}
function transformPath(model, params, pathPoints, width, height, timeSec) {
  const sampler = buildPathSampler(pathPoints, params.pathSmoothness || 1);
  if (!sampler) return transformPivot(model, params, width, height);
  const anim = SCENE.animation?.path || {};
  let offset = params.pathOffset;
  if (anim.enabled) {
    const phase = (anim.speed || 0) * timeSec;
    if (anim.pingPong) {
      const cycle = ((phase % 2) + 2) % 2;
      offset += cycle <= 1 ? cycle : 2 - cycle;
    } else {
      offset += phase;
    }
  }
  const out = [];
  for (let i = 0; i < model.lineCount; i += 1) {
    const rawT = model.lineCount <= 1 ? 0 : i / (model.lineCount - 1);
    const t = ease(params.pathEasing || 'linear', rawT);
    const u = offset + t * params.pathSpan + rawT * params.pathStagger;
    const sample = sampler.sample(u);
    const tangentAngle = Math.atan2(sample.ty, sample.tx) * clamp(params.tangentStrength, 0, 1);
    const row = model.rows[i];
    const baseX = model.bbox.x;
    const baseY = model.rowY[i];
    for (let j = 0; j < row.length; j += 1) {
      const seg = row[j];
      const aL = { x: seg.x1 - baseX, y: seg.y1 - baseY };
      const bL = { x: seg.x2 - baseX, y: seg.y2 - baseY };
      const a = params.followTangent ? rotatePoint(aL.x, aL.y, tangentAngle) : aL;
      const b = params.followTangent ? rotatePoint(bL.x, bL.y, tangentAngle) : bL;
      out.push({ x1: sample.x + a.x, y1: sample.y + a.y, x2: sample.x + b.x, y2: sample.y + b.y, stroke: seg.stroke, color: seg.color });
    }
  }
  return out;
}
function applySkew(segments, params) {
  const skewX = params.skewX || 0;
  const skewY = params.skewY || 0;
  if (!skewX && !skewY) return segments;
  let minY = Infinity;
  let maxY = -Infinity;
  segments.forEach((s) => { minY = Math.min(minY, s.y1, s.y2); maxY = Math.max(maxY, s.y1, s.y2); });
  const span = Math.max(1e-6, maxY - minY);
  return segments.map((s) => {
    const t1 = (s.y1 - minY) / span;
    const t2 = (s.y2 - minY) / span;
    const f1 = lerp(-0.5, 0.5, t1);
    const f2 = lerp(-0.5, 0.5, t2);
    return { ...s, x1: s.x1 + skewX * f1, x2: s.x2 + skewX * f2, y1: s.y1 + skewY * f1, y2: s.y2 + skewY * f2 };
  });
}
function applyTextOffset(segments, params, scene) {
  const tx = typeof params.textX === 'number' ? params.textX - (scene.textX || 0) : 0;
  const ty = typeof params.textY === 'number' ? params.textY - (scene.textY || 0) : 0;
  if (!tx && !ty) return segments;
  return segments.map((s) => ({ ...s, x1: s.x1 + tx, y1: s.y1 + ty, x2: s.x2 + tx, y2: s.y2 + ty }));
}
function lineMarkup(seg) {
  return '<line x1="' + seg.x1.toFixed(2) + '" y1="' + seg.y1.toFixed(2) + '" x2="' + seg.x2.toFixed(2) + '" y2="' + seg.y2.toFixed(2) + '" stroke="' + seg.color + '" stroke-width="' + seg.stroke.toFixed(2) + '" stroke-linecap="round" />';
}
function createTypeLabAnimation({ mount, scene, autoplay = true } = {}) {
  if (!mount) throw new Error('mount is required');
  const data = scene || SCENE;
  const width = data.scene.width || 1600;
  const height = data.scene.height || 900;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  mount.innerHTML = '';
  mount.appendChild(svg);
  let raf = 0;
  let startMs = performance.now();
  let pausedAt = 0;
  function renderAt(timeSec) {
    const params = evaluateKeyframeParams(data.scene, timeSec);
    const model = data.scene.model;
    let segs = data.scene.transformMode === 'path'
      ? transformPath(model, params, data.scene.pathPoints || [], width, height, timeSec)
      : transformPivot(model, params, width, height);
    segs = applyTextOffset(segs, params, data.scene);
    segs = applySkew(segs, params);
    svg.innerHTML = '<rect width="100%" height="100%" fill="#050505"></rect><g id="type-lines">' + segs.map(lineMarkup).join('') + '</g>';
  }
  function tick(now) {
    const t = (now - startMs) / 1000;
    renderAt(t);
    raf = requestAnimationFrame(tick);
  }
  if (autoplay) raf = requestAnimationFrame(tick);
  else renderAt(0);
  return {
    play() {
      if (raf) return;
      startMs = performance.now() - pausedAt * 1000;
      raf = requestAnimationFrame(tick);
    },
    pause() {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      pausedAt = (performance.now() - startMs) / 1000;
    },
    seek(t) {
      pausedAt = Number(t) || 0;
      if (!raf) renderAt(pausedAt);
      else startMs = performance.now() - pausedAt * 1000;
    },
    setScene(next) {
      if (!next) return;
      if (next.scene) {
        data.scene = {
          ...data.scene,
          ...next.scene,
          params: { ...data.scene.params, ...(next.scene.params || {}) },
          pathPoints: Array.isArray(next.scene.pathPoints) ? next.scene.pathPoints : data.scene.pathPoints,
          model: next.scene.model || data.scene.model,
        };
      }
      if (!raf) renderAt(pausedAt);
    },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      mount.innerHTML = '';
    },
  };
}
window.createTypeLabAnimation = createTypeLabAnimation;
`;
}

export function createExportApi({ store, engine }) {
  function buildExportScene() {
    const state = store.getState();
    const doc = createTypeLabDocument(state);
    const { params, runtime } = state;
    const text = (params.text || 'JAZZ').toUpperCase();
    const font = `700 ${params.fontSize}px "IBM Plex Mono", monospace`;
    engine.setMask({
      text,
      font,
      fontSize: params.fontSize,
      width: runtime.width,
      height: runtime.height,
      textX: runtime.textX,
      textY: runtime.textY,
      padding: 28,
    });
    const model =
      runtime.bakedModel ||
      engine.createSliceModel({
        lineCount: params.lineCount,
        strokeMin: params.strokeMin,
        strokeMax: params.strokeMax,
        strokeThreshold: params.strokeThreshold,
        lineSizeVariance: params.lineSizeVariance,
        colorStart: '#d2ef36',
        colorEnd: '#76862a',
      });
    doc.scene.model = model;
    return doc;
  }

  return {
    buildBundle() {
      const doc = buildExportScene();
      const sceneJson = JSON.stringify(doc, null, 2);
      return {
        js: runtimeSourceString(sceneJson),
        css: `.typeLabEmbed{width:100%;aspect-ratio:16/9;background:#050505;border:1px solid #171717}`,
        html: `<div id="type-lab-embed" class="typeLabEmbed"></div>
<script src="./type-lab-animation.js"></script>
<script>createTypeLabAnimation({ mount: document.getElementById('type-lab-embed'), autoplay: true });</script>`,
        json: sceneJson,
      };
    },
    getEmbedSnippet() {
      return this.buildBundle().html;
    },
    getConfigJson() {
      return this.buildBundle().json;
    },
    buildSceneDocument() {
      return buildExportScene();
    },
    evaluateSegmentsAt(timeSec = 0) {
      const doc = buildExportScene();
      return evaluateDocumentSegments(doc, timeSec);
    },
    downloadBundle() {
      const bundle = this.buildBundle();
      downloadText('type-lab-animation.js', bundle.js, 'text/javascript');
      downloadText('type-lab-animation.css', bundle.css, 'text/css');
      downloadText('type-lab-embed.html', bundle.html, 'text/html');
      downloadText('type-lab-scene.json', bundle.json, 'application/json');
    },
  };
}
