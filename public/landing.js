import { SHADER_SOURCES } from './shader-deck-shaders.js';

const viewport = document.querySelector('.infiniteCanvasViewport');
const container = document.querySelector('.infiniteCanvasContainer');
const template = document.getElementById('stone-card-template');
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
  { emotion: 'accountability', punLevel: 1, mode: 'repair', stoneType: 'granite', lines: ['I carry this weight; no pebble gets outsourced.'] },
  { emotion: 'belonging', punLevel: 2, mode: 'inclusion', stoneType: 'smooth', lines: ['You are in the circle, not kicked into gravel.'] },
  { emotion: 'grief', punLevel: 0, mode: 'witness', stoneType: 'smooth', lines: ['I remember quietly; no dramatic landslide required.'] },
  { emotion: 'hope', punLevel: 1, mode: 'renewal', stoneType: 'smooth', lines: ['Small light, slow weathering, still moving toward warmth.'] },
  { emotion: 'protection', punLevel: 1, mode: 'guard', stoneType: 'granite', lines: ['I hold this edge for you, rock steady.'] },
  { emotion: 'vulnerability', punLevel: 2, mode: 'open', stoneType: 'granite', lines: ['No granite armor today, just honest sediment.'] },
  { emotion: 'trust', punLevel: 1, mode: 'consistency', stoneType: 'granite', lines: ['Test me over time; I am built for pressure.'] },
  { emotion: 'reconciliation', punLevel: 2, mode: 'return', stoneType: 'smooth', lines: ['Back at the fault line, choosing repair over rupture.'] },
  { emotion: 'devotion', punLevel: 1, mode: 'continuity', stoneType: 'granite', lines: ['I keep showing up, one stone-cold commitment at a time.'] },
  { emotion: 'distance', punLevel: 2, mode: 'reach', stoneType: 'smooth', lines: ['A stone throw away, still reaching anyway.'] },
  { emotion: 'forgiveness', punLevel: 1, mode: 'mercy', stoneType: 'smooth', lines: ['We can sand down edges without erasing history.'] },
  { emotion: 'new_beginning', punLevel: 2, mode: 'fresh-layer', stoneType: 'smooth', lines: ['New chapter, same bedrock, better geology.'] },
];

const STONE_MATERIALS = {
  smooth: { tint: [0.86, 0.93, 0.99], type: 0.88, grainScale: 3.1, grainContrast: 0.05, veinAmount: 0.1, fractureAmount: 0.04, glossiness: 0.92, scatter: 0.34 },
  granite: { tint: [0.74, 0.72, 0.7], type: 0.14, grainScale: 26.0, grainContrast: 0.96, veinAmount: 0.03, fractureAmount: 0.36, glossiness: 0.22, scatter: 0.06 },
};
const INDEX_BASE_PROFILE = {
  shapeProfile: [0.5, 0.5, 0.5, 0.5],
  noiseAmount: 0.1,
  cutDepth: 0.8,
  morphSeed: 0.3,
};
const INDEX_BASE_MATERIAL = {
  tint: [1.0, 1.0, 1.0],
  type: 0.2,
  grainScale: 6.0,
  grainContrast: 0.2,
  veinAmount: 0.08,
  fractureAmount: 0.2,
  glossiness: 0.4,
  scatter: 0.1,
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
const blendMaterial = (from, to, t) => ({
  tint: [
    lerp(from.tint[0], to.tint[0], t),
    lerp(from.tint[1], to.tint[1], t),
    lerp(from.tint[2], to.tint[2], t),
  ],
  type: lerp(from.type, to.type, t),
  grainScale: lerp(from.grainScale, to.grainScale, t),
  grainContrast: lerp(from.grainContrast, to.grainContrast, t),
  veinAmount: lerp(from.veinAmount, to.veinAmount, t),
  fractureAmount: lerp(from.fractureAmount, to.fractureAmount, t),
  glossiness: lerp(from.glossiness, to.glossiness, t),
  scatter: lerp(from.scatter, to.scatter, t),
});

const buildExpression = (entry, idx) => {
  const seed = `${entry.emotion}:${entry.mode}:${idx}`;
  const h = hashString(seed);
  const rng = makeRng(h);
  const base = [rng(), rng(), rng(), rng()];
  const wildShape = base.map((n, i) => clamp(i % 2 === 0 ? Math.pow(n, 0.55) : 1 - Math.pow(1 - n, 0.55), 0, 1));
  const profile = {
    shapeProfile: wildShape.map((v) => lerp(INDEX_BASE_PROFILE.shapeProfile[0], v, 0.42)),
    noiseAmount: lerp(INDEX_BASE_PROFILE.noiseAmount, 0.08 + base[1] * 0.24, 0.5),
    cutDepth: lerp(INDEX_BASE_PROFILE.cutDepth, 0.72 + base[2] * 0.42, 0.5),
    morphSeed: lerp(INDEX_BASE_PROFILE.morphSeed, (h % 997) / 997, 0.4),
  };
  const targetMaterial = STONE_MATERIALS[entry.stoneType] || STONE_MATERIALS.smooth;
  const material = blendMaterial(INDEX_BASE_MATERIAL, targetMaterial, entry.stoneType === 'granite' ? 0.58 : 0.5);
  if (entry.stoneType === 'granite') {
    profile.noiseAmount = clamp(profile.noiseAmount + 0.05, 0.0, 1.0);
    profile.cutDepth = clamp(profile.cutDepth + 0.05, 0.0, 1.4);
    material.grainContrast = clamp(material.grainContrast + 0.05, 0.0, 1.0);
    material.glossiness = clamp(material.glossiness - 0.05, 0.0, 1.0);
  } else {
    profile.noiseAmount = clamp(profile.noiseAmount - 0.04, 0.0, 1.0);
    profile.cutDepth = clamp(profile.cutDepth - 0.05, 0.0, 1.4);
    material.grainContrast = clamp(material.grainContrast - 0.03, 0.0, 1.0);
    material.glossiness = clamp(material.glossiness + 0.05, 0.0, 1.0);
  }
  const line = entry.lines[h % entry.lines.length];
  const meta = `${entry.emotion} / pun ${entry.punLevel} / ${entry.mode} / ${humanize(entry.stoneType)}`;
  const rationale = entry.stoneType === 'granite'
    ? `Granite mode leans coarse and grounded: denser grain, lower luster, and chunkier cuts to feel weighty under pressure.`
    : `Smooth mode leans polished and breathable: softer grain, higher sheen, and gentler cuts so the feeling reads calm but alive.`;
  return { emotion: entry.emotion, punLevel: entry.punLevel, mode: entry.mode, stoneType: entry.stoneType, meta, line, rationale, profile, material };
};

const createCard = (expression, idx) => {
  const node = template.content.firstElementChild.cloneNode(true);
  node.dataset.emotion = expression.emotion;
  const caption = node.querySelector('.attribution');
  caption.innerHTML = `<span class="stone-caption-meta">${expression.meta}</span><span class="stone-caption-line">${expression.line}</span>`;
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
    uNoiseAmount: gl.getUniformLocation(program, 'uNoiseAmount'),
    uCutDepth: gl.getUniformLocation(program, 'uCutDepth'),
    uMorphSeed: gl.getUniformLocation(program, 'uMorphSeed'),
    uStoneTint: gl.getUniformLocation(program, 'uStoneTint'),
    uStoneType: gl.getUniformLocation(program, 'uStoneType'),
    uGrainScale: gl.getUniformLocation(program, 'uGrainScale'),
    uGrainContrast: gl.getUniformLocation(program, 'uGrainContrast'),
    uVeinAmount: gl.getUniformLocation(program, 'uVeinAmount'),
    uFractureAmount: gl.getUniformLocation(program, 'uFractureAmount'),
    uGlossiness: gl.getUniformLocation(program, 'uGlossiness'),
    uScatter: gl.getUniformLocation(program, 'uScatter'),
  };

  const renderProfileToCanvas = (targetCanvas, profile, material, timeSec = 0, mouse = null) => {
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
    gl.uniform1f(u.uNoiseAmount, profile.noiseAmount);
    gl.uniform1f(u.uCutDepth, profile.cutDepth);
    gl.uniform1f(u.uMorphSeed, profile.morphSeed);
    if (u.uStoneTint) gl.uniform3f(u.uStoneTint, ...(material?.tint || [1, 1, 1]));
    if (u.uStoneType) gl.uniform1f(u.uStoneType, material?.type ?? 0.2);
    if (u.uGrainScale) gl.uniform1f(u.uGrainScale, material?.grainScale ?? 6.0);
    if (u.uGrainContrast) gl.uniform1f(u.uGrainContrast, material?.grainContrast ?? 0.2);
    if (u.uVeinAmount) gl.uniform1f(u.uVeinAmount, material?.veinAmount ?? 0.1);
    if (u.uFractureAmount) gl.uniform1f(u.uFractureAmount, material?.fractureAmount ?? 0.2);
    if (u.uGlossiness) gl.uniform1f(u.uGlossiness, material?.glossiness ?? 0.4);
    if (u.uScatter) gl.uniform1f(u.uScatter, material?.scatter ?? 0.1);
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
  throw new Error('landing gallery mount not found');
}

const expressions = STONEFACE_SET.map((entry, idx) => buildExpression(entry, idx));
const renderer = createStoneRenderer(SHADER_SOURCES.sec2_rock || '');
const cardEntries = expressions.map((expr, idx) => {
  const card = createCard(expr, idx);
  card.dataset.index = String(idx);
  container.appendChild(card);
  const shaderCanvas = card.querySelector('.stoneShaderCanvas');
  const ok = renderer ? renderer.renderProfileToCanvas(shaderCanvas, expr.profile, expr.material, idx * 0.05) : false;
  if (!ok) {
    card.classList.add('is-fallback');
    const line = card.querySelector('.stone-caption-line');
    if (line) line.textContent = `${expr.line} (fallback render)`;
  }
  return { card, shaderCanvas, profile: expr.profile, material: expr.material, fallback: !ok, expression: expr, mouse: null, seedTime: idx * 0.07 };
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

const captionHeight = 62;
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
  const targetX = window.innerWidth * 0.22 - state.canvasWidth * state.zoom * 0.5;
  const targetY = window.innerHeight * 0.2 - state.canvasHeight * state.zoom * 0.5;
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
    const wildness = ((p.noiseAmount * 0.55) + (p.cutDepth * 0.45)).toFixed(2);
    const typeLabel = humanize(e.stoneType);
    drawerChips.innerHTML = `
      <span class="stoneface-chip is-material">${typeLabel}</span>
      <span class="stoneface-chip">pun ${e.punLevel}</span>
      <span class="stoneface-chip">${humanize(e.mode)}</span>
      <span class="stoneface-chip">wildness ${wildness}</span>
    `;
  }
  if (drawerCaption) drawerCaption.textContent = e.line;
  if (drawerRationale) drawerRationale.textContent = e.rationale;
  if (drawerShape) drawerShape.textContent = `uShapeProfile: [${p.shapeProfile.map((v) => v.toFixed(2)).join(', ')}]`;
  if (drawerNoise) drawerNoise.textContent = `uNoiseAmount: ${p.noiseAmount.toFixed(3)}`;
  if (drawerCut) drawerCut.textContent = `uCutDepth: ${p.cutDepth.toFixed(3)}`;
  if (drawerSeed) drawerSeed.textContent = `uMorphSeed: ${p.morphSeed.toFixed(3)}`;
  drawerBackdrop.hidden = false;
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('stoneface-drawer-open');
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
    renderer.renderProfileToCanvas(drawerPreviewCanvas, drawerAnimEntry.profile, drawerAnimEntry.material, 0, drawerMouse);
    drawerAnimFrame = 0;
    return;
  }
  if (!drawerAnimStart) drawerAnimStart = ts;
  const tSec = (ts - drawerAnimStart) / 1000;
  renderer.renderProfileToCanvas(drawerPreviewCanvas, drawerAnimEntry.profile, drawerAnimEntry.material, tSec, drawerMouse);
  drawerAnimFrame = requestAnimationFrame(animateDrawerStone);
};

const startDrawerAnimation = (entry) => {
  drawerAnimEntry = entry;
  drawerAnimStart = 0;
  if (drawerAnimFrame) cancelAnimationFrame(drawerAnimFrame);
  if (disableDrawerMotion) {
    if (renderer && drawerPreviewCanvas) {
      renderer.renderProfileToCanvas(drawerPreviewCanvas, entry.profile, entry.material, 0, drawerMouse);
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
      renderer.renderProfileToCanvas(entry.shaderCanvas, entry.profile, entry.material, tSec + entry.seedTime, entry.mouse);
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
