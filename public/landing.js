import { SHADER_SOURCES } from './shader-deck-shaders.js';

const viewport = document.querySelector('.infiniteCanvasViewport');
const container = document.querySelector('.infiniteCanvasContainer');
const template = document.getElementById('stone-card-template');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const STONEFACE_SET = [
  { emotion: 'accountability', punLevel: 1, mode: 'repair', lines: ['I carry this weight; no pebble gets outsourced.'] },
  { emotion: 'belonging', punLevel: 2, mode: 'inclusion', lines: ['You are in the circle, not kicked into gravel.'] },
  { emotion: 'grief', punLevel: 0, mode: 'witness', lines: ['I remember quietly; no dramatic landslide required.'] },
  { emotion: 'hope', punLevel: 1, mode: 'renewal', lines: ['Small light, slow weathering, still moving toward warmth.'] },
  { emotion: 'protection', punLevel: 1, mode: 'guard', lines: ['I hold this edge for you, rock steady.'] },
  { emotion: 'vulnerability', punLevel: 2, mode: 'open', lines: ['No granite armor today, just honest sediment.'] },
  { emotion: 'trust', punLevel: 1, mode: 'consistency', lines: ['Test me over time; I am built for pressure.'] },
  { emotion: 'reconciliation', punLevel: 2, mode: 'return', lines: ['Back at the fault line, choosing repair over rupture.'] },
  { emotion: 'devotion', punLevel: 1, mode: 'continuity', lines: ['I keep showing up, one stone-cold commitment at a time.'] },
  { emotion: 'distance', punLevel: 2, mode: 'reach', lines: ['A stone throw away, still reaching anyway.'] },
  { emotion: 'forgiveness', punLevel: 1, mode: 'mercy', lines: ['We can sand down edges without erasing history.'] },
  { emotion: 'new_beginning', punLevel: 2, mode: 'fresh-layer', lines: ['New chapter, same bedrock, better geology.'] },
];

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

const buildExpression = (entry, idx) => {
  const seed = `${entry.emotion}:${entry.mode}:${idx}`;
  const h = hashString(seed);
  const rng = makeRng(h);
  const a = rng();
  const b = rng();
  const c = rng();
  const d = rng();
  const profile = {
    shapeProfile: [a, b, c, d],
    noiseAmount: 0.05 + b * 0.14,
    cutDepth: 0.58 + c * 0.68,
    morphSeed: (h % 997) / 997,
  };
  const line = entry.lines[h % entry.lines.length];
  const meta = `${entry.emotion} / pun ${entry.punLevel} / ${entry.mode}`;
  return { emotion: entry.emotion, meta, line, profile };
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
  };

  const renderProfileToCanvas = (targetCanvas, profile, timeSec = 0) => {
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
    gl.uniform4f(u.iMouse, 0, 0, 0, 0);
    gl.uniform4f(u.uShapeProfile, ...profile.shapeProfile);
    gl.uniform1f(u.uNoiseAmount, profile.noiseAmount);
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
  throw new Error('landing gallery mount not found');
}

const expressions = STONEFACE_SET.map((entry, idx) => buildExpression(entry, idx));
const renderer = createStoneRenderer(SHADER_SOURCES.sec2_rock || '');
const cardEntries = expressions.map((expr, idx) => {
  const card = createCard(expr, idx);
  container.appendChild(card);
  const shaderCanvas = card.querySelector('.stoneShaderCanvas');
  const ok = renderer ? renderer.renderProfileToCanvas(shaderCanvas, expr.profile, idx * 0.29) : false;
  if (!ok) {
    card.classList.add('is-fallback');
    const line = card.querySelector('.stone-caption-line');
    if (line) line.textContent = `${expr.line} (fallback render)`;
  }
  return { card, shaderCanvas, profile: expr.profile, fallback: !ok };
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
    if (reduceMotion) card.classList.add('is-visible');
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
  e.preventDefault();
  const bounded = applyBounds(state.targetX - e.deltaX * 1.5, state.targetY - e.deltaY * 1.5);
  state.targetX = bounded.x;
  state.targetY = bounded.y;
  scheduleAnimation();
};

refresh();
viewport.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove, { passive: true });
window.addEventListener('pointerup', onPointerUp, { passive: true });
viewport.addEventListener('wheel', onWheel, { passive: false });
window.addEventListener('resize', refresh, { passive: true });

const isCardVisible = (card) => {
  const r = card.getBoundingClientRect();
  return r.right > -40 && r.bottom > -40 && r.left < window.innerWidth + 40 && r.top < window.innerHeight + 40;
};

let rafId = 0;
let lastFrame = 0;
const frameIntervalMs = reduceMotion ? 1000 : 1000 / 18;
const animateVisibleCards = (ts) => {
  if (!renderer) return;
  if (!lastFrame || ts - lastFrame >= frameIntervalMs) {
    lastFrame = ts;
    const tSec = ts / 1000;
    cardEntries.forEach((entry, idx) => {
      if (entry.fallback || !isCardVisible(entry.card)) return;
      renderer.renderProfileToCanvas(entry.shaderCanvas, entry.profile, tSec + idx * 0.17);
    });
  }
  rafId = requestAnimationFrame(animateVisibleCards);
};
rafId = requestAnimationFrame(animateVisibleCards);

window.addEventListener('beforeunload', () => {
  if (rafId) cancelAnimationFrame(rafId);
});
