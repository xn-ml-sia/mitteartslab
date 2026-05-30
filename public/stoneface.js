import { SHADER_SOURCES } from './shader-deck-shaders.js';

const viewport = document.querySelector('.stonefaceViewport');
const container = document.querySelector('.stonefaceCanvas');
const template = document.getElementById('stone-card-template');
const titleNode = document.getElementById('stoneface-title');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionPaused = true;
const disableCardMotion = reduceMotion || motionPaused;
const disableDrawerMotion = reduceMotion;
const drawer = document.getElementById('stoneface-drawer');
const drawerBackdrop = document.getElementById('stoneface-drawer-backdrop');
const drawerClose = document.getElementById('drawer-close');
const drawerEmotion = document.getElementById('drawer-emotion');
const drawerMeta = document.getElementById('drawer-meta');
const drawerCaption = document.getElementById('drawer-caption');
const drawerRationale = document.getElementById('drawer-rationale');
const drawerChips = document.getElementById('drawer-chips');
const drawerShape = document.getElementById('drawer-shape');
const drawerNoise = document.getElementById('drawer-noise');
const drawerCut = document.getElementById('drawer-cut');
const drawerSeed = document.getElementById('drawer-seed');
const drawerPreviewCanvas = document.getElementById('drawer-stone-canvas');

const STONEFACE_SET = [
  { emotion: 'accountability', punLevel: 1, mode: 'repair', caption: ['I own the crack; no blame-shifting shale today.', 'I am here to patch it, not bury it in sediment.'] },
  { emotion: 'belonging', punLevel: 2, mode: 'inclusion', caption: ['You are not an extra pebble; you are part of the bedrock.', 'Scoot closer, the circle has room and zero gravel gatekeeping.'] },
  { emotion: 'grief', punLevel: 0, mode: 'witness', variantOverride: 'flatter', caption: ['I hold this silence like a warm river stone.', 'No fix-it landslide, just steady presence at your edge.'] },
  { emotion: 'hope', punLevel: 1, mode: 'renewal', caption: ['Tiny glint, big insistence; dawn still mineralizes.', 'Call it a quartz of faith, still growing in pressure.'] },
  { emotion: 'protection', punLevel: 1, mode: 'guard', caption: ['I stand here like a cairn when the weather gets loud.', 'Lean on me; my boundaries are firm, not cold.'] },
  { emotion: 'vulnerability', punLevel: 2, mode: 'open', caption: ['Today I skip the armor and show the fault lines.', 'Consider this my soft-rock era, no polish cosplay.'] },
  { emotion: 'trust', punLevel: 1, mode: 'consistency', caption: ['Test me by seasons, not by sparkle.', 'I am built like basalt: quiet, repeatable, and load-bearing.'] },
  { emotion: 'reconciliation', punLevel: 2, mode: 'return', variantOverride: 'rounder', caption: ['I came back to the fracture with both hands open.', 'Let us make tectonic peace, one careful shift at a time.'] },
  { emotion: 'devotion', punLevel: 1, mode: 'continuity', caption: ['I choose you again, and then again, and then again.', 'Stone-cold fact: this is commitment, not a mood.'] },
  { emotion: 'distance', punLevel: 2, mode: 'reach', variantOverride: 'edgy', caption: ['Miles apart, still in each other\'s orbit.', 'A stone\'s throw joke, but my reach is the real thing.'] },
  { emotion: 'forgiveness', punLevel: 1, mode: 'mercy', variantOverride: 'flatter', caption: ['I do not erase the scar; I soften the edge.', 'We can weather this without becoming rubble.'] },
  { emotion: 'new_beginning', punLevel: 2, mode: 'fresh-layer', variantOverride: 'rounder', caption: ['Fresh layer, same mountain, better map.', 'New chapter carved in bedrock, not in panic.'] },
];

const INDEX_BASE_PROFILE = {
  shapeProfile: [0.5, 0.5, 0.5, 0.5],
  cutDepth: 0.5,
  morphSeed: 0.3,
};

const hashString = (str) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const makeRng = (seed) => {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const humanize = (v) => String(v || '').replace(/_/g, ' ');
const EMOTION_PROFILE_HINTS = {
  accountability: { shape: [0.56, 0.62, 0.48, 0.44], cutDepth: 0.58, view: [0.68, 0.52] },
  belonging: { shape: [0.61, 0.56, 0.58, 0.52], cutDepth: 0.46, view: [0.4, 0.5] },
  grief: { shape: [0.78, 0.26, 0.73, 0.28], cutDepth: 0.33, view: [0.12, 0.66] },
  hope: { shape: [0.63, 0.52, 0.48, 0.64], cutDepth: 0.48, view: [0.58, 0.38] },
  protection: { shape: [0.54, 0.66, 0.44, 0.42], cutDepth: 0.57, view: [0.73, 0.5] },
  vulnerability: { shape: [0.49, 0.44, 0.57, 0.72], cutDepth: 0.44, view: [0.26, 0.45] },
  trust: { shape: [0.57, 0.61, 0.52, 0.39], cutDepth: 0.55, view: [0.65, 0.49] },
  reconciliation: { shape: [0.61, 0.7, 0.56, 0.74], cutDepth: 0.54, view: [0.84, 0.34] },
  devotion: { shape: [0.6, 0.58, 0.47, 0.56], cutDepth: 0.53, view: [0.62, 0.44] },
  distance: { shape: [0.3, 0.41, 0.82, 0.22], cutDepth: 0.67, view: [0.08, 0.72] },
  forgiveness: { shape: [0.82, 0.08, 0.73, 0.18], cutDepth: 0.26, view: [0.28, 0.69] },
  new_beginning: { shape: [0.74, 0.72, 0.6, 0.84], cutDepth: 0.39, view: [0.78, 0.28] },
};
const VIEW_SEQUENCE = [
  [0.18, 0.58], // left three-quarter
  [0.32, 0.46], // left front
  [0.5, 0.4], // frontal high
  [0.68, 0.46], // right front
  [0.82, 0.58], // right three-quarter
  [0.5, 0.64], // lower frontal
];
const SHAPE_VARIANTS = [
  { id: 'rounder', cutOffset: -0.1 },
  { id: 'flatter', cutOffset: -0.03 },
  { id: 'edgy', cutOffset: 0.12 },
];

const buildExpression = (entry, idx) => {
  const textSeed = hashString(`${entry.caption[0]}|${entry.caption[1]}`);
  const seed = `${entry.emotion}:${entry.mode}:${entry.punLevel}:${idx}:${textSeed}`;
  const h = hashString(seed);
  const rng = makeRng(h ^ textSeed);
  const base = [rng(), rng(), rng(), rng()];
  const hint = EMOTION_PROFILE_HINTS[entry.emotion] || {
    shape: [0.5, 0.5, 0.5, 0.5],
    cutDepth: 0.5,
    view: [0.5, 0.5],
  };
  const wildShape = base.map((n, i) => clamp(i % 2 === 0 ? Math.pow(n, 0.55) : 1 - Math.pow(1 - n, 0.55), 0, 1));
  const shaped = wildShape.map((v, i) => lerp(hint.shape[i], v, 0.35));
  const variant = SHAPE_VARIANTS.find((v) => v.id === entry.variantOverride) || SHAPE_VARIANTS[Math.abs((h + idx * 31) % SHAPE_VARIANTS.length)];
  let shapeProfile = shaped.map((v) => clamp(lerp(INDEX_BASE_PROFILE.shapeProfile[0], v, 0.58), 0.12, 0.88));
  if (variant.id === 'rounder') {
    shapeProfile[0] = lerp(shapeProfile[0], 0.62, 0.58);
    shapeProfile[1] = lerp(shapeProfile[1], 0.6, 0.58);
    shapeProfile[2] = lerp(shapeProfile[2], 0.62, 0.58);
  } else if (variant.id === 'flatter') {
    shapeProfile[0] = lerp(shapeProfile[0], 0.68, 0.62);
    shapeProfile[1] = lerp(shapeProfile[1], 0.31, 0.7);
    shapeProfile[2] = lerp(shapeProfile[2], 0.66, 0.62);
  } else {
    shapeProfile[0] = clamp(shapeProfile[0] + (base[0] - 0.5) * 0.28 + 0.08, 0.12, 0.9);
    shapeProfile[1] = clamp(shapeProfile[1] - 0.11 + (base[1] - 0.5) * 0.1, 0.12, 0.88);
    shapeProfile[2] = clamp(shapeProfile[2] + (base[2] - 0.5) * 0.26 + 0.06, 0.12, 0.9);
  }
  // Dedicated branch: keep forgiveness in a low, weathered suiseki-like profile.
  if (entry.emotion === 'forgiveness') {
    shapeProfile[0] = lerp(shapeProfile[0], 0.86, 0.82);
    shapeProfile[1] = lerp(shapeProfile[1], 0.06, 0.9);
    shapeProfile[2] = lerp(shapeProfile[2], 0.78, 0.82);
    shapeProfile[3] = lerp(shapeProfile[3], 0.14, 0.78);
  }
  const profile = {
    shapeProfile,
    cutDepth: clamp(lerp(hint.cutDepth, 0.36 + base[2] * 0.34, 0.38) + variant.cutOffset, 0.26, 0.78),
    morphSeed: lerp(INDEX_BASE_PROFILE.morphSeed, (h % 997) / 997, 0.4),
  };
  if (entry.emotion === 'forgiveness') {
    profile.cutDepth = clamp(lerp(profile.cutDepth, 0.24, 0.82), 0.18, 0.34);
  }
  const contour = (profile.shapeProfile[0] + profile.shapeProfile[1] + profile.shapeProfile[2]) / 3;
  const contourMood = contour < 0.46 ? 'compact silhouette' : contour > 0.58 ? 'broad silhouette' : 'balanced silhouette';
  const cutMood = profile.cutDepth < 0.46 ? 'gentle carving' : profile.cutDepth > 0.56 ? 'deeper carving' : 'measured carving';
  const cadenceBank = [
    'punchline-first cadence',
    'slow burn cadence',
    'dry-delivery cadence',
    'warm snark cadence',
    'quiet flex cadence',
    'wry confession cadence',
  ];
  const cadence = cadenceBank[h % cadenceBank.length];
  const lineA = entry.caption[0];
  const lineB = entry.caption[1];
  const meta = `${entry.emotion} / pun ${entry.punLevel} / ${entry.mode} / ${variant.id} / ${cadence}`;
  const rationale = `This piece leans ${variant.id}, reading as a ${contourMood} with ${cutMood}, so the tone lands ${entry.mode === 'witness' ? 'tender' : 'intentional'} instead of generic. Morph seed ${profile.morphSeed.toFixed(3)} keeps its rhythm one-of-one while staying reproducible.`;
  const seq = VIEW_SEQUENCE[idx % VIEW_SEQUENCE.length];
  const seqX = seq[0] + ((Math.floor(idx / VIEW_SEQUENCE.length) % 2) * 2 - 1) * 0.04;
  const seqY = seq[1] + (((idx + 1) % 3) - 1) * 0.03;
  const viewNormX = clamp(lerp(seqX, hint.view[0], 0.35), 0.15, 0.85);
  const viewNormY = clamp(lerp(seqY, hint.view[1], 0.35), 0.2, 0.8);
  const forgivenessViewX = 0.24;
  const forgivenessViewY = 0.74;
  const viewMouse = entry.emotion === 'forgiveness'
    ? { x: forgivenessViewX * 512, y: (1 - forgivenessViewY) * 512, z: 1, w: 1 }
    : { x: viewNormX * 512, y: (1 - viewNormY) * 512, z: 1, w: 1 };
  return { emotion: entry.emotion, punLevel: entry.punLevel, mode: entry.mode, variant: variant.id, meta, lineA, lineB, rationale, profile, viewMouse };
};

const createCard = (expression, idx) => {
  const node = template.content.firstElementChild.cloneNode(true);
  node.dataset.emotion = expression.emotion;
  const caption = node.querySelector('.attribution');
  caption.innerHTML = `<span class="stone-caption-meta">${expression.meta}</span><span class="stone-caption-line">${expression.lineA}</span><span class="stone-caption-line">${expression.lineB}</span>`;
  node.style.setProperty('--stagger-delay', `${Math.min(idx * 70, 900)}ms`);
  return node;
};

const createStoneRenderer = (fragmentShaderSource) => {
  const glCanvas = document.createElement('canvas');
  glCanvas.width = 512;
  glCanvas.height = 512;
  const gl = glCanvas.getContext('webgl2', { antialias: true, alpha: false });
  if (!gl) return null;
  const vertexSrc = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos,0.0,1.0); }`;

  const fragmentSrc = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
out vec4 outColor;
${fragmentShaderSource}
void main(){ vec4 fragColor = vec4(0.0); mainImage(fragColor, gl_FragCoord.xy); outColor = fragColor; }`;

  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  };
  const vs = compile(gl.VERTEX_SHADER, vertexSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, 'aPos');
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const u = {
    iResolution: gl.getUniformLocation(program, 'iResolution'),
    iTime: gl.getUniformLocation(program, 'iTime'),
    iMouse: gl.getUniformLocation(program, 'iMouse'),
    uShapeProfile: gl.getUniformLocation(program, 'uShapeProfile'),
    uCutDepth: gl.getUniformLocation(program, 'uCutDepth'),
    uMorphSeed: gl.getUniformLocation(program, 'uMorphSeed'),
  };

  const renderProfileToCanvas = (targetCanvas, profile, timeSec = 0, mouse = null) => {
    if (!(targetCanvas instanceof HTMLCanvasElement)) return false;
    const width = 512;
    const height = 512;
    glCanvas.width = width;
    glCanvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform3f(u.iResolution, width, height, 1.0);
    gl.uniform1f(u.iTime, reduceMotion ? 0 : timeSec);
    if (mouse) gl.uniform4f(u.iMouse, mouse.x, mouse.y, mouse.z, mouse.w);
    else gl.uniform4f(u.iMouse, 0, 0, 0, 0);
    gl.uniform4f(u.uShapeProfile, ...profile.shapeProfile);
    gl.uniform1f(u.uCutDepth, profile.cutDepth);
    gl.uniform1f(u.uMorphSeed, profile.morphSeed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return false;
    targetCanvas.width = width;
    targetCanvas.height = height;
    ctx.drawImage(glCanvas, 0, 0, width, height);
    return true;
  };
  return { renderProfileToCanvas };
};

if (!viewport || !container || !template) {
  throw new Error('landing stoneface mount not found');
}

const expressions = STONEFACE_SET.map((entry, idx) => buildExpression(entry, idx));
const renderer = createStoneRenderer(SHADER_SOURCES.sec2_rock || '');
const cardEntries = expressions.map((expr, idx) => {
  const card = createCard(expr, idx);
  card.dataset.index = String(idx);
  container.appendChild(card);
  const shaderCanvas = card.querySelector('.stoneShaderCanvas');
  const ok = renderer ? renderer.renderProfileToCanvas(shaderCanvas, expr.profile, idx * 0.05, expr.viewMouse) : false;
  if (!ok) {
    card.classList.add('is-fallback');
    const line = card.querySelector('.stone-caption-line');
    if (line) line.textContent = `${expr.lineA} (fallback render)`;
  }
  return { card, shaderCanvas, profile: expr.profile, fallback: !ok, expression: expr, mouse: null, viewMouse: expr.viewMouse, seedTime: idx * 0.07 };
});

const state = {
  isMobile: window.innerWidth < 768,
  zoom: window.innerWidth < 768 ? 0.44 : 0.78,
  itemWidth: 460,
  itemHeight: 488,
  canvasWidth: 0,
  canvasHeight: 0,
  cameraX: 0,
  cameraY: 0,
  targetX: 0,
  targetY: 0,
  isDragging: false,
  lastX: 0,
  lastY: 0,
  raf: 0,
};

const captionHeight = 84;
const minGap = 70;
const jitter = 34;

const applyBounds = (x, y) => {
  const minX = Math.min(window.innerWidth - state.canvasWidth * state.zoom, 0);
  const minY = Math.min(window.innerHeight - state.canvasHeight * state.zoom, 0);
  return { x: Math.min(0, Math.max(minX, x)), y: Math.min(0, Math.max(minY, y)) };
};

const setCamera = (x, y) => {
  state.cameraX = x;
  state.cameraY = y;
  container.style.transform = `translate(${x}px, ${y}px) scale(${state.zoom})`;
  container.style.transformOrigin = '0 0';
};

const animate = () => {
  state.raf = 0;
  const dx = state.targetX - state.cameraX;
  const dy = state.targetY - state.cameraY;
  if (Math.hypot(dx, dy) < 0.4) {
    setCamera(state.targetX, state.targetY);
    return;
  }
  const bounded = applyBounds(state.cameraX + dx * 0.2, state.cameraY + dy * 0.2);
  setCamera(bounded.x, bounded.y);
  state.raf = requestAnimationFrame(animate);
};

const scheduleAnimation = () => {
  if (state.raf) cancelAnimationFrame(state.raf);
  state.raf = requestAnimationFrame(animate);
};

const intersects = (a, b) => !(
  a.x + a.w + minGap <= b.x ||
  b.x + b.w + minGap <= a.x ||
  a.y + a.h + minGap <= b.y ||
  b.y + b.h + minGap <= a.y
);

const placeCards = () => {
  state.canvasWidth = state.itemWidth * 14;
  state.canvasHeight = state.itemHeight * 14;
  const cx = state.canvasWidth * 0.5;
  const cy = state.canvasHeight * 0.5;
  const rng = makeRng(hashString('landing-stone-v1'));
  const placed = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < cardEntries.length; i += 1) {
    const theta = i * golden + (rng() - 0.5) * 0.18;
    const baseRadius = Math.sqrt(i + 1) * Math.min(state.itemWidth, state.itemHeight) * 0.5;
    let accepted = null;
    for (let a = 0; a < 700; a += 1) {
      const push = a * 10;
      const x = cx + Math.cos(theta) * (baseRadius + push) + (rng() - 0.5) * jitter;
      const y = cy + Math.sin(theta) * (baseRadius + push) + (rng() - 0.5) * jitter;
      const candidate = { x, y, w: state.itemWidth, h: state.itemHeight + captionHeight };
      if (placed.some((p) => intersects(candidate, p))) continue;
      accepted = candidate;
      break;
    }
    if (!accepted) accepted = { x: cx + i * 30, y: cy + i * 20, w: state.itemWidth, h: state.itemHeight + captionHeight };
    placed.push(accepted);
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  placed.forEach((p) => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x + p.w);
    maxY = Math.max(maxY, p.y + p.h);
  });
  const pad = 200;
  const shiftX = -minX + pad;
  const shiftY = -minY + pad;
  state.canvasWidth = Math.ceil(maxX - minX + pad * 2);
  state.canvasHeight = Math.ceil(maxY - minY + pad * 2);
  container.style.width = `${state.canvasWidth}px`;
  container.style.height = `${state.canvasHeight}px`;
  cardEntries.forEach((entry, i) => {
    const { card } = entry;
    const p = placed[i];
    card.style.left = `${Math.round(p.x + shiftX)}px`;
    card.style.top = `${Math.round(p.y + shiftY)}px`;
    card.style.width = `${state.itemWidth}px`;
    card.style.height = `${state.itemHeight + captionHeight}px`;
    if (disableCardMotion) card.classList.add('is-visible');
    else requestAnimationFrame(() => card.classList.add('is-visible'));
  });
};

const recenter = () => {
  let focusX = state.canvasWidth * 0.5;
  let focusY = state.canvasHeight * 0.5;
  if (titleNode) {
    const cssLeft = parseFloat(titleNode.style.left || '0');
    const cssTop = parseFloat(titleNode.style.top || '0');
    if (Number.isFinite(cssLeft) && cssLeft > 0) focusX = cssLeft;
    if (Number.isFinite(cssTop) && cssTop > 0) focusY = cssTop;
  }
  const targetX = window.innerWidth * 0.5 - focusX * state.zoom;
  const targetY = window.innerHeight * 0.5 - focusY * state.zoom;
  const bounded = applyBounds(targetX, targetY);
  state.targetX = bounded.x;
  state.targetY = bounded.y;
  setCamera(bounded.x, bounded.y);
};

const refresh = () => {
  state.isMobile = window.innerWidth < 768;
  state.zoom = state.isMobile ? 0.42 : 0.78;
  state.itemWidth = state.isMobile ? 380 : 460;
  state.itemHeight = state.isMobile ? 402 : 488;
  placeCards();
  recenter();
};

const onPointerDown = (e) => {
  if (e.target instanceof Element && e.target.closest('.mediaItem')) return;
  state.isDragging = true;
  state.lastX = e.clientX;
  state.lastY = e.clientY;
  viewport.classList.add('is-dragging');
};
const onPointerMove = (e) => {
  if (!state.isDragging) return;
  const bounded = applyBounds(state.targetX + (e.clientX - state.lastX), state.targetY + (e.clientY - state.lastY));
  state.targetX = bounded.x;
  state.targetY = bounded.y;
  state.lastX = e.clientX;
  state.lastY = e.clientY;
  scheduleAnimation();
};
const onPointerUp = () => {
  state.isDragging = false;
  viewport.classList.remove('is-dragging');
};
const onWheel = (e) => {
  if (document.body.classList.contains('stoneface-drawer-open')) return;
  e.preventDefault();
  const bounded = applyBounds(state.targetX - e.deltaX * 1.5, state.targetY - e.deltaY * 1.5);
  state.targetX = bounded.x;
  state.targetY = bounded.y;
  scheduleAnimation();
};

const toShaderMouse = (ev, element) => {
  if (!(element instanceof Element)) return null;
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const xNorm = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
  const yNorm = clamp((ev.clientY - rect.top) / rect.height, 0, 1);
  return { x: xNorm * 512, y: (1 - yNorm) * 512, z: 1, w: 1 };
};

const isCardVisible = (card) => {
  const r = card.getBoundingClientRect();
  return r.right > -40 && r.bottom > -40 && r.left < window.innerWidth + 40 && r.top < window.innerHeight + 40;
};

refresh();
viewport.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove, { passive: true });
window.addEventListener('pointerup', onPointerUp, { passive: true });
viewport.addEventListener('wheel', onWheel, { passive: false });
window.addEventListener('resize', refresh, { passive: true });
const openDrawer = (entry) => {
  if (!drawer || !drawerBackdrop) return;
  const p = entry.profile;
  const e = entry.expression;
  if (drawerEmotion) drawerEmotion.textContent = humanize(e.emotion);
  if (drawerMeta) drawerMeta.textContent = `${e.meta}`;
  if (drawerChips) {
    const contour = ((p.shapeProfile[0] + p.shapeProfile[1] + p.shapeProfile[2]) / 3).toFixed(2);
    drawerChips.innerHTML = `
      <span class="stoneface-chip">pun ${e.punLevel}</span>
      <span class="stoneface-chip">${humanize(e.mode)}</span>
      <span class="stoneface-chip">${humanize(e.variant)}</span>
      <span class="stoneface-chip">contour ${contour}</span>
      <span class="stoneface-chip">classic wet stone</span>
    `;
  }
  if (drawerCaption) drawerCaption.textContent = `${e.lineA} ${e.lineB}`;
  if (drawerRationale) drawerRationale.textContent = e.rationale;
  if (drawerShape) drawerShape.textContent = `uShapeProfile: [${p.shapeProfile.map((v) => v.toFixed(2)).join(', ')}]`;
  if (drawerNoise) drawerNoise.textContent = 'DISPLACEMENT: 0.100';
  if (drawerCut) drawerCut.textContent = `uCutDepth: ${p.cutDepth.toFixed(3)}`;
  if (drawerSeed) drawerSeed.textContent = `uMorphSeed: ${p.morphSeed.toFixed(3)}`;
  drawerBackdrop.hidden = false;
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('stoneface-drawer-open');
  drawerMouse = e.viewMouse || null;
  drawerMouseActive = false;
  startDrawerAnimation(entry);
};

const closeDrawer = () => {
  if (!drawer || !drawerBackdrop) return;
  drawerBackdrop.hidden = true;
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('stoneface-drawer-open');
  stopDrawerAnimation();
};

let drawerAnimFrame = 0;
let drawerAnimEntry = null;
let drawerAnimStart = 0;
let drawerMouse = null;
let drawerMouseActive = false;
const animateDrawerStone = (ts) => {
  if (!drawerAnimEntry || !renderer || !drawerPreviewCanvas) return;
  if (disableDrawerMotion) {
    renderer.renderProfileToCanvas(drawerPreviewCanvas, drawerAnimEntry.profile, 0, drawerMouse);
    drawerAnimFrame = 0;
    return;
  }
  if (!drawerAnimStart) drawerAnimStart = ts;
  const tSec = (ts - drawerAnimStart) / 1000;
  renderer.renderProfileToCanvas(drawerPreviewCanvas, drawerAnimEntry.profile, tSec, drawerMouse);
  drawerAnimFrame = requestAnimationFrame(animateDrawerStone);
};

const startDrawerAnimation = (entry) => {
  drawerAnimEntry = entry;
  drawerAnimStart = 0;
  if (drawerAnimFrame) cancelAnimationFrame(drawerAnimFrame);
  if (disableDrawerMotion) {
    if (renderer && drawerPreviewCanvas) {
      renderer.renderProfileToCanvas(drawerPreviewCanvas, entry.profile, 0, drawerMouse);
    }
    drawerAnimFrame = 0;
    return;
  }
  drawerAnimFrame = requestAnimationFrame(animateDrawerStone);
};

const stopDrawerAnimation = () => {
  drawerAnimEntry = null;
  drawerMouse = null;
  drawerMouseActive = false;
  drawerAnimStart = 0;
  if (drawerAnimFrame) cancelAnimationFrame(drawerAnimFrame);
  drawerAnimFrame = 0;
};

let cardAnimFrame = 0;
let cardAnimStart = 0;
let cardAnimLast = 0;
const cardFrameStep = 1000 / 12;
const animateCards = (ts) => {
  if (!renderer || disableCardMotion) return;
  if (!cardAnimStart) cardAnimStart = ts;
  if (ts - cardAnimLast >= cardFrameStep) {
    cardAnimLast = ts;
    const tSec = (ts - cardAnimStart) / 1000;
    cardEntries.forEach((entry) => {
      if (entry.fallback || !entry.shaderCanvas) return;
      if (!isCardVisible(entry.card) && !entry.mouse) return;
      renderer.renderProfileToCanvas(entry.shaderCanvas, entry.profile, tSec + entry.seedTime, entry.mouse || entry.viewMouse);
    });
  }
  cardAnimFrame = requestAnimationFrame(animateCards);
};

const startCardAnimation = () => {
  if (disableCardMotion || !renderer || cardAnimFrame) return;
  cardAnimFrame = requestAnimationFrame(animateCards);
};

const stopCardAnimation = () => {
  if (!cardAnimFrame) return;
  cancelAnimationFrame(cardAnimFrame);
  cardAnimFrame = 0;
  cardAnimStart = 0;
  cardAnimLast = 0;
};

cardEntries.forEach((entry) => {
  entry.card.addEventListener('click', () => openDrawer(entry));
  entry.card.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    openDrawer(entry);
  });
  entry.card.addEventListener('pointerenter', (ev) => {
    entry.mouse = toShaderMouse(ev, entry.card);
  });
  entry.card.addEventListener('pointermove', (ev) => {
    entry.mouse = toShaderMouse(ev, entry.card);
  });
  entry.card.addEventListener('pointerleave', () => {
    entry.mouse = null;
  });
});

drawerPreviewCanvas?.addEventListener('pointerdown', (ev) => {
  drawerMouseActive = true;
  drawerMouse = toShaderMouse(ev, drawerPreviewCanvas);
  drawerPreviewCanvas.setPointerCapture?.(ev.pointerId);
});
drawerPreviewCanvas?.addEventListener('pointermove', (ev) => {
  if (!drawerMouseActive) return;
  drawerMouse = toShaderMouse(ev, drawerPreviewCanvas);
});
drawerPreviewCanvas?.addEventListener('pointerup', (ev) => {
  drawerMouseActive = false;
  drawerPreviewCanvas.releasePointerCapture?.(ev.pointerId);
});
drawerPreviewCanvas?.addEventListener('pointercancel', (ev) => {
  drawerMouseActive = false;
  drawerPreviewCanvas.releasePointerCapture?.(ev.pointerId);
});
drawerPreviewCanvas?.addEventListener('pointerleave', () => {
  if (!drawerMouseActive) drawerMouse = null;
});

drawerClose?.addEventListener('click', closeDrawer);
drawerBackdrop?.addEventListener('click', closeDrawer);
window.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape') closeDrawer();
});
startCardAnimation();

window.addEventListener('beforeunload', () => {
  stopDrawerAnimation();
  stopCardAnimation();
});
