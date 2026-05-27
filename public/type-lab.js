import { createTypeLineFan } from './type-line-fan.js';
import { animatableKeysFromSchema, defaultsFromSchema } from './type-lab-schema.js';
import { createTypeLabStore } from './type-lab-store.js';
import { bindSchemaToDom } from './type-lab-ui-binder.js';
import { createTypeLabPipeline } from './type-lab-pipeline.js';
import { createTypeLabTimeline } from './type-lab-timeline.js';
import { captureFrame } from './type-lab-keyframes.js';
import { createPresetApi } from './type-lab-presets.js';
import { createExportApi } from './type-lab-export.js';
import { createTypeLabCommands } from './type-lab-commands.js';
import { createCommandPalette } from './type-lab-command-palette.js';
import { applyPathConstraints } from './type-lab-path-rig.js';
import { clamp } from './type-lab-utils.js';

const engine = createTypeLineFan();
const stage = document.getElementById('svg-stage');
const refs = {
  bakeButton: document.getElementById('bake-slices-button'),
  resetButton: document.getElementById('reset-from-text-button'),
  bakeStatus: document.getElementById('bake-status'),
  setStartKeyframeButton: document.getElementById('set-start-keyframe-button'),
  setEndKeyframeButton: document.getElementById('set-end-keyframe-button'),
  playKeyframeButton: document.getElementById('play-keyframe-button'),
  keyframeStatus: document.getElementById('keyframe-status'),
  pathClearButton: document.getElementById('path-clear-button'),
};

const store = createTypeLabStore({
  params: defaultsFromSchema(),
  runtime: {
    width: 1600,
    height: 900,
    transformMode: 'pivot',
    textX: 800,
    textY: 8,
    pathPoints: [],
    bakedModel: null,
    keyframes: { start: null, end: null },
    keyframePlaying: false,
    livePathOffset: 0,
  },
  ui: {
    expertMode: false,
  },
});

const animatableKeys = animatableKeysFromSchema();
const binder = bindSchemaToDom({ store });
const pipeline = createTypeLabPipeline({ engine, store });
const timeline = createTypeLabTimeline({ store, requestRender });
const presets = createPresetApi({ store });
const exporter = createExportApi({ store, engine });

const interaction = {
  draggingPivot: false,
  draggingType: false,
  draggingPathPoint: null,
  lastPointerX: 0,
  lastPointerY: 0,
};

const EXPERT_MODE_KEY = 'mal:typeLab:expertMode';
let lastSegments = [];

let renderQueued = false;

function requestRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    renderNow();
  });
}

function getSizeFromStage() {
  const rect = stage.getBoundingClientRect();
  return {
    width: Math.max(640, Math.round(rect.width)),
    height: Math.max(360, Math.round(rect.height || window.innerHeight - 24)),
  };
}

function ensureDefaultPath() {
  const state = store.getState();
  if (state.runtime.pathPoints.length >= 2) return;
  const points = [
    { x: state.runtime.width * 0.15, y: state.runtime.height * 0.2 },
    { x: state.runtime.width * 0.48, y: state.runtime.height * 0.52 },
    { x: state.runtime.width * 0.82, y: state.runtime.height * 0.78 },
  ];
  store.patchRuntime({ pathPoints: points });
}

function renderNow() {
  const state = store.getState();
  const frame = pipeline.renderFrame({ width: state.runtime.width, height: state.runtime.height });
  lastSegments = frame.segments;
  stage.innerHTML = frame.svg;
  mountOverlay(frame.bbox);
  const hasBoth = Boolean(state.runtime.keyframes.start && state.runtime.keyframes.end);
  refs.bakeStatus.textContent = state.runtime.bakedModel ? 'Mode: Baked slices (destructive)' : 'Mode: Live from text';
  refs.keyframeStatus.textContent = state.runtime.keyframePlaying ? 'Playing keyframes' : hasBoth ? 'Start and end set' : 'No keyframes yet';
  refs.playKeyframeButton.textContent = state.runtime.keyframePlaying ? 'Stop' : 'Play';
}

function updateCanvasSize() {
  const size = getSizeFromStage();
  store.setState((prev) => {
    const prevWidth = prev.runtime.width;
    const prevHeight = prev.runtime.height;
    const nextRuntime = { ...prev.runtime, width: size.width, height: size.height };
    if (prevWidth > 0 && prevHeight > 0) {
      nextRuntime.textX = (prev.runtime.textX / prevWidth) * size.width;
      nextRuntime.textY = (prev.runtime.textY / prevHeight) * size.height;
      nextRuntime.pathPoints = prev.runtime.pathPoints.map((point) => ({
        x: (point.x / prevWidth) * size.width,
        y: (point.y / prevHeight) * size.height,
      }));
    }
    return { ...prev, runtime: nextRuntime };
  });
  pipeline.invalidateMask();
  renderNow();
}

function pointerToSvgXY(svg, clientX, clientY) {
  const rect = svg.getBoundingClientRect();
  return {
    x: clamp(((clientX - rect.left) / rect.width) * store.getState().runtime.width, -80000, 80000),
    y: clamp(((clientY - rect.top) / rect.height) * store.getState().runtime.height, -80000, 80000),
  };
}

function setPivotFromPointer(clientX, clientY) {
  const svg = stage.querySelector('svg');
  if (!svg) return;
  const rect = svg.getBoundingClientRect();
  const nx = clamp((clientX - rect.left) / rect.width, -0.5, 1.5);
  const ny = clamp((clientY - rect.top) / rect.height, -0.5, 1.5);
  store.patchParams({
    pivotX: Number((nx * 100).toFixed(1)),
    pivotY: Number((ny * 100).toFixed(1)),
  });
  renderNow();
}

function mountPathEditor(overlay, svg, pathPoints, editable) {
  const ns = 'http://www.w3.org/2000/svg';
  const sampler = engine.buildPathSampler(pathPoints, { smoothness: store.getState().params.pathSmoothness });
  if (sampler?.segments?.length) {
    const d = sampler.segments
      .map(
        (seg, i) =>
          `${i === 0 ? `M ${seg.p0.x.toFixed(2)} ${seg.p0.y.toFixed(2)}` : ''} C ${seg.p1.x.toFixed(2)} ${seg.p1.y.toFixed(2)}, ${seg.p2.x.toFixed(2)} ${seg.p2.y.toFixed(2)}, ${seg.p3.x.toFixed(2)} ${seg.p3.y.toFixed(2)}`,
      )
      .join(' ');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#9eff2f');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-dasharray', '5 4');
    path.setAttribute('opacity', '0.9');
    overlay.appendChild(path);
  }
  pathPoints.forEach((point, index) => {
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', `${point.x.toFixed(2)}`);
    circle.setAttribute('cy', `${point.y.toFixed(2)}`);
    circle.setAttribute('r', '7');
    circle.setAttribute('fill', '#9eff2f');
    circle.setAttribute('stroke', '#0a0a0a');
    circle.setAttribute('stroke-width', '2');
    circle.style.cursor = editable ? 'grab' : 'default';
    circle.dataset.pathPoint = String(index);
    circle.addEventListener('pointerdown', (event) => {
      if (!editable) return;
      event.preventDefault();
      interaction.draggingPathPoint = index;
      svg.setPointerCapture(event.pointerId);
    });
    overlay.appendChild(circle);
  });
}

function mountOverlay(textBbox) {
  const svg = stage.querySelector('svg');
  if (!svg) return;
  const ns = 'http://www.w3.org/2000/svg';
  const existing = svg.querySelector('#anchor-overlay');
  if (existing) existing.remove();
  const overlay = document.createElementNS(ns, 'g');
  overlay.setAttribute('id', 'anchor-overlay');
  const state = store.getState();

  if (textBbox && !state.runtime.bakedModel) {
    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('x', `${textBbox.x.toFixed(2)}`);
    rect.setAttribute('y', `${textBbox.y.toFixed(2)}`);
    rect.setAttribute('width', `${Math.max(1, textBbox.w).toFixed(2)}`);
    rect.setAttribute('height', `${Math.max(1, textBbox.h).toFixed(2)}`);
    rect.setAttribute('fill', 'transparent');
    rect.setAttribute('stroke', '#67745a');
    rect.setAttribute('stroke-width', '1');
    rect.setAttribute('stroke-dasharray', '4 4');
    rect.style.cursor = 'move';
    rect.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      interaction.draggingType = true;
      interaction.lastPointerX = event.clientX;
      interaction.lastPointerY = event.clientY;
      svg.setPointerCapture(event.pointerId);
    });
    overlay.appendChild(rect);
  }

  if (state.runtime.transformMode === 'pivot') {
    const px = (state.params.pivotX / 100) * state.runtime.width;
    const py = (state.params.pivotY / 100) * state.runtime.height;
    const baseAngle = (state.params.pivotRotation * Math.PI) / 180;
    const fanAngle = (state.params.fanAngle * Math.PI) / 180;
    const guideLength = Math.max(state.runtime.width, state.runtime.height) * 0.38;
    const lineA = document.createElementNS(ns, 'line');
    lineA.setAttribute('x1', `${px}`);
    lineA.setAttribute('y1', `${py}`);
    lineA.setAttribute('x2', `${px + Math.cos(baseAngle) * guideLength}`);
    lineA.setAttribute('y2', `${py + Math.sin(baseAngle) * guideLength}`);
    lineA.setAttribute('stroke', '#546148');
    lineA.setAttribute('stroke-width', '1.2');
    lineA.setAttribute('stroke-dasharray', '5 5');
    overlay.appendChild(lineA);
    const lineB = document.createElementNS(ns, 'line');
    lineB.setAttribute('x1', `${px}`);
    lineB.setAttribute('y1', `${py}`);
    lineB.setAttribute('x2', `${px + Math.cos(baseAngle + fanAngle) * guideLength}`);
    lineB.setAttribute('y2', `${py + Math.sin(baseAngle + fanAngle) * guideLength}`);
    lineB.setAttribute('stroke', '#9eff2f');
    lineB.setAttribute('stroke-width', '1.2');
    lineB.setAttribute('stroke-dasharray', '5 5');
    overlay.appendChild(lineB);
    const handle = document.createElementNS(ns, 'circle');
    handle.setAttribute('cx', `${px}`);
    handle.setAttribute('cy', `${py}`);
    handle.setAttribute('r', '9');
    handle.setAttribute('fill', '#9eff2f');
    handle.setAttribute('stroke', '#0a0a0a');
    handle.setAttribute('stroke-width', '2');
    handle.style.cursor = 'grab';
    handle.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      interaction.draggingPivot = true;
      svg.setPointerCapture(event.pointerId);
      setPivotFromPointer(event.clientX, event.clientY);
    });
    overlay.appendChild(handle);
  } else {
    ensureDefaultPath();
    mountPathEditor(overlay, svg, state.runtime.pathPoints, state.params.pathEdit);
  }

  svg.appendChild(overlay);

  svg.onpointermove = (event) => {
    if (interaction.draggingType && !store.getState().runtime.bakedModel) {
      const rect = svg.getBoundingClientRect();
      const dx = ((event.clientX - interaction.lastPointerX) / rect.width) * store.getState().runtime.width;
      const dy = ((event.clientY - interaction.lastPointerY) / rect.height) * store.getState().runtime.height;
      interaction.lastPointerX = event.clientX;
      interaction.lastPointerY = event.clientY;
      store.patchRuntime({
        textX: store.getState().runtime.textX + dx,
        textY: store.getState().runtime.textY + dy,
      });
      pipeline.invalidateMask();
      renderNow();
      return;
    }
    if (interaction.draggingPivot) {
      setPivotFromPointer(event.clientX, event.clientY);
      return;
    }
    if (interaction.draggingPathPoint !== null) {
      const point = pointerToSvgXY(svg, event.clientX, event.clientY);
      const next = [...store.getState().runtime.pathPoints];
      next[interaction.draggingPathPoint] = point;
      store.patchRuntime({ pathPoints: applyPathConstraints(next) });
      renderNow();
    }
  };
  svg.onpointerup = () => {
    interaction.draggingPivot = false;
    interaction.draggingType = false;
    interaction.draggingPathPoint = null;
  };
  svg.onpointerleave = () => {
    interaction.draggingPivot = false;
    interaction.draggingType = false;
    interaction.draggingPathPoint = null;
  };
  svg.onclick = (event) => {
    const current = store.getState();
    if (current.runtime.transformMode !== 'path' || !current.params.pathEdit || interaction.draggingPathPoint !== null) return;
    const target = event.target;
    if (target instanceof Element && target.closest('[data-path-point]')) return;
    const point = pointerToSvgXY(svg, event.clientX, event.clientY);
    store.patchRuntime({ pathPoints: applyPathConstraints([...current.runtime.pathPoints, point]) });
    renderNow();
  };
}

function setupProcessButtons() {
  refs.pathClearButton.addEventListener('click', () => {
    store.patchRuntime({ pathPoints: [] });
    ensureDefaultPath();
    renderNow();
  });
  refs.bakeButton.addEventListener('click', () => {
    const state = store.getState();
    const baked = engine.createSliceModel({
      lineCount: state.params.lineCount,
      strokeMin: state.params.strokeMin,
      strokeMax: state.params.strokeMax,
      strokeThreshold: state.params.strokeThreshold,
      lineSizeVariance: state.params.lineSizeVariance,
      colorStart: '#d2ef36',
      colorEnd: '#76862a',
    });
    store.patchRuntime({ bakedModel: baked });
    renderNow();
  });
  refs.resetButton.addEventListener('click', () => {
    timeline.stopAll();
    store.patchRuntime({ bakedModel: null, keyframePlaying: false });
    pipeline.invalidateMask();
    renderNow();
  });
  refs.setStartKeyframeButton.addEventListener('click', () => {
    const frame = captureFrame({ state: store.getState(), animatableKeys });
    store.patchRuntime({ keyframes: { ...store.getState().runtime.keyframes, start: frame } });
    renderNow();
  });
  refs.setEndKeyframeButton.addEventListener('click', () => {
    const frame = captureFrame({ state: store.getState(), animatableKeys });
    store.patchRuntime({ keyframes: { ...store.getState().runtime.keyframes, end: frame } });
    renderNow();
  });
  refs.playKeyframeButton.addEventListener('click', () => {
    const state = store.getState();
    if (state.runtime.keyframePlaying) {
      store.patchRuntime({ keyframePlaying: false });
      timeline.stopKeyframes();
      renderNow();
      return;
    }
    if (!state.runtime.keyframes.start || !state.runtime.keyframes.end) {
      refs.keyframeStatus.textContent = 'Set start and end keyframes first';
      return;
    }
    store.patchRuntime({ keyframePlaying: true });
    timeline.startKeyframes();
  });
}

function setupRuntimeWatchers() {
  const pathAnimateEl = document.getElementById('path-animate-input');
  const pathSpeedEl = document.getElementById('path-animate-speed-input');
  const pathPingEl = document.getElementById('path-animate-pingpong-input');
  const pathOffsetEl = document.getElementById('path-offset-input');
  [pathAnimateEl, pathSpeedEl, pathPingEl, pathOffsetEl].forEach((el) => {
    if (!el) return;
    const evt = el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(evt, () => {
      timeline.syncPathAnimation({ resetBase: el === pathOffsetEl || el === pathAnimateEl });
      requestRender();
    });
  });

  const textEl = document.getElementById('text-input');
  const fontEl = document.getElementById('font-size-input');
  const lineCountEl = document.getElementById('line-count-input');
  [textEl, fontEl, lineCountEl].forEach((el) => {
    if (!el) return;
    el.addEventListener('input', () => {
      if (store.getState().runtime.bakedModel) return;
      pipeline.invalidateMask();
      requestRender();
    });
  });
}

function initCommandPalette() {
  const commands = createTypeLabCommands({
    store,
    presets,
    exporter,
    timeline,
    rerender: renderNow,
    getCurrentSegments: () => lastSegments,
  });
  createCommandPalette({ commands });
}

function setupResize() {
  const observer = new ResizeObserver(() => updateCanvasSize());
  observer.observe(stage);
  window.addEventListener('resize', updateCanvasSize);
}

function init() {
  const storedExpert = localStorage.getItem(EXPERT_MODE_KEY);
  if (storedExpert === '1') {
    store.patch((prev) => ({ ...prev, ui: { ...prev.ui, expertMode: true } }));
  }
  binder.writeStateToDom(store.getState());
  setupProcessButtons();
  setupRuntimeWatchers();
  setupResize();
  initCommandPalette();
  updateCanvasSize();
  ensureDefaultPath();
  store.subscribe((state) => {
    binder.writeStateToDom(state);
    localStorage.setItem(EXPERT_MODE_KEY, state.ui.expertMode ? '1' : '0');
    requestRender();
  });
  renderNow();
}

init();
