import { createTypeLineFan } from './type-line-fan.js';

const engine = createTypeLineFan();

const refs = {
  stage: document.getElementById('svg-stage'),
  text: document.getElementById('text-input'),
  fontSize: document.getElementById('font-size-input'),
  lineCount: document.getElementById('line-count-input'),
  bakeButton: document.getElementById('bake-slices-button'),
  resetButton: document.getElementById('reset-from-text-button'),
  bakeStatus: document.getElementById('bake-status'),
  setStartKeyframeButton: document.getElementById('set-start-keyframe-button'),
  setEndKeyframeButton: document.getElementById('set-end-keyframe-button'),
  playKeyframeButton: document.getElementById('play-keyframe-button'),
  keyframeDuration: document.getElementById('keyframe-duration-input'),
  keyframeLoop: document.getElementById('keyframe-loop-input'),
  keyframePingPong: document.getElementById('keyframe-pingpong-input'),
  keyframeEasing: document.getElementById('keyframe-easing-select'),
  keyframeStatus: document.getElementById('keyframe-status'),
  pivotX: document.getElementById('pivot-x-input'),
  pivotY: document.getElementById('pivot-y-input'),
  pivotRotation: document.getElementById('pivot-rotation-input'),
  fanAngle: document.getElementById('fan-angle-input'),
  collapseZero: document.getElementById('collapse-zero-input'),
  collapseThickness: document.getElementById('collapse-thickness-input'),
  fanCurve: document.getElementById('fan-curve-input'),
  radiusGain: document.getElementById('radius-gain-input'),
  strokeMin: document.getElementById('stroke-min-input'),
  strokeMax: document.getElementById('stroke-max-input'),
  strokeThreshold: document.getElementById('stroke-threshold-input'),
  lineSizeVariance: document.getElementById('line-size-variance-input'),
};

const state = {
  width: 1600,
  height: 900,
  lastMaskKey: '',
  svgMarkup: '',
  draggingAnchor: null,
  draggingType: false,
  lastPointerX: 0,
  lastPointerY: 0,
  textX: 800,
  textY: 8,
  bakedModel: null,
  keyframes: { start: null, end: null },
  keyframeAnimating: false,
  keyframeRaf: 0,
  keyframeStartMs: 0,
};

function numberValue(input, fallback) {
  const value = Number(input?.value);
  return Number.isFinite(value) ? value : fallback;
}

function getSizeFromStage() {
  const rect = refs.stage.getBoundingClientRect();
  const width = Math.max(640, Math.round(rect.width));
  const height = Math.max(360, Math.round(rect.height || window.innerHeight - 24));
  return { width, height };
}

function buildRenderParams() {
  return {
    text: (refs.text.value || 'JAZZ').toUpperCase(),
    fontSize: numberValue(refs.fontSize, 380),
    textX: state.textX,
    textY: state.textY,
    lineCount: numberValue(refs.lineCount, 120),
    pivotX: numberValue(refs.pivotX, 10),
    pivotY: numberValue(refs.pivotY, 6),
    pivotRotation: numberValue(refs.pivotRotation, 0),
    fanAngle: numberValue(refs.fanAngle, 180),
    collapseZero: numberValue(refs.collapseZero, 0),
    collapseThickness: numberValue(refs.collapseThickness, 6),
    fanCurve: numberValue(refs.fanCurve, 1.8),
    radiusGain: numberValue(refs.radiusGain, 1.4),
    strokeMin: numberValue(refs.strokeMin, 0.8),
    strokeMax: numberValue(refs.strokeMax, 5.2),
    strokeThreshold: numberValue(refs.strokeThreshold, 0),
    lineSizeVariance: numberValue(refs.lineSizeVariance, 0.3),
  };
}

function currentFrameFromState() {
  return {
    textX: state.textX,
    textY: state.textY,
    pivotX: numberValue(refs.pivotX, 10),
    pivotY: numberValue(refs.pivotY, 6),
    pivotRotation: numberValue(refs.pivotRotation, 0),
    fanAngle: numberValue(refs.fanAngle, 180),
    collapseZero: numberValue(refs.collapseZero, 0),
    collapseThickness: numberValue(refs.collapseThickness, 6),
    fanCurve: numberValue(refs.fanCurve, 1.8),
    radiusGain: numberValue(refs.radiusGain, 1.4),
  };
}

function applyFrameToState(frame) {
  state.textX = frame.textX;
  state.textY = frame.textY;
  refs.pivotX.value = frame.pivotX.toFixed(1);
  refs.pivotY.value = frame.pivotY.toFixed(1);
  refs.pivotRotation.value = frame.pivotRotation.toFixed(1);
  refs.fanAngle.value = frame.fanAngle.toFixed(1);
  refs.collapseZero.value = frame.collapseZero.toFixed(1);
  refs.collapseThickness.value = frame.collapseThickness.toFixed(1);
  refs.fanCurve.value = frame.fanCurve.toFixed(2);
  refs.radiusGain.value = frame.radiusGain.toFixed(2);
  state.lastMaskKey = '';
}

function lerpFrame(a, b, t) {
  return {
    textX: lerp(a.textX, b.textX, t),
    textY: lerp(a.textY, b.textY, t),
    pivotX: lerp(a.pivotX, b.pivotX, t),
    pivotY: lerp(a.pivotY, b.pivotY, t),
    pivotRotation: lerp(a.pivotRotation, b.pivotRotation, t),
    fanAngle: lerp(a.fanAngle, b.fanAngle, t),
    collapseZero: lerp(a.collapseZero, b.collapseZero, t),
    collapseThickness: lerp(a.collapseThickness, b.collapseThickness, t),
    fanCurve: lerp(a.fanCurve, b.fanCurve, t),
    radiusGain: lerp(a.radiusGain, b.radiusGain, t),
  };
}

function easingValue(mode, t) {
  const x = clamp(t, 0, 1);
  if (mode === 'easeInOutSine') return -(Math.cos(Math.PI * x) - 1) * 0.5;
  if (mode === 'easeInOutCubic') return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  if (mode === 'easeOutExpo') return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  return x;
}

function renderNow() {
  const params = buildRenderParams();
  const { width, height } = state;
  const font = `700 ${params.fontSize}px "IBM Plex Mono", monospace`;
  const maskKey = `${params.text}|${font}|${width}|${height}|${params.textX.toFixed(2)}|${params.textY.toFixed(2)}`;

  if (maskKey !== state.lastMaskKey) {
    engine.setMask({
      text: params.text,
      font,
      fontSize: params.fontSize,
      width,
      height,
      textX: params.textX,
      textY: params.textY,
      padding: 28,
    });
    state.lastMaskKey = maskKey;
  }

  const transformParams = {
    pivot: { x: (params.pivotX / 100) * width, y: (params.pivotY / 100) * height },
    pivotRotationDeg: params.pivotRotation,
    fanAngleDeg: params.fanAngle,
    collapseZeroDeg: params.collapseZero,
    collapseThickness: params.collapseThickness,
    fanCurve: params.fanCurve,
    radiusGain: params.radiusGain,
  };

  const liveModel =
    state.bakedModel ||
    engine.createSliceModel({
      lineCount: params.lineCount,
      strokeMin: params.strokeMin,
      strokeMax: params.strokeMax,
      strokeThreshold: params.strokeThreshold,
      lineSizeVariance: params.lineSizeVariance,
      colorStart: '#d2ef36',
      colorEnd: '#76862a',
    });

  const segments = engine.transformSliceModel(liveModel, transformParams);

  state.svgMarkup = engine.toSvg(segments, {
    width,
    height,
  });

  refs.stage.innerHTML = state.svgMarkup;
  mountAnchorHandles();
  refs.bakeStatus.textContent = state.bakedModel ? 'Mode: Baked slices (destructive)' : 'Mode: Live from text';
  const hasBoth = Boolean(state.keyframes.start && state.keyframes.end);
  if (state.keyframeAnimating) {
    refs.keyframeStatus.textContent = 'Playing keyframes';
    refs.playKeyframeButton.textContent = 'Stop';
  } else {
    refs.keyframeStatus.textContent = hasBoth ? 'Start and end set' : 'No keyframes yet';
    refs.playKeyframeButton.textContent = 'Play';
  }
}

function triggerRender() {
  renderNow();
}

function updateCanvasSize() {
  const size = getSizeFromStage();
  const prevWidth = state.width;
  const prevHeight = state.height;
  state.width = size.width;
  state.height = size.height;
  if (!Number.isFinite(state.textX) || !Number.isFinite(state.textY)) {
    state.textX = state.width * 0.5;
    state.textY = 8;
  } else if (prevWidth > 0 && prevHeight > 0) {
    state.textX = (state.textX / prevWidth) * state.width;
    state.textY = (state.textY / prevHeight) * state.height;
  }
  state.lastMaskKey = '';
  triggerRender();
}

function setupInputs() {
  const generationInputs = [
    refs.text,
    refs.fontSize,
    refs.lineCount,
    refs.strokeMin,
    refs.strokeMax,
    refs.strokeThreshold,
    refs.lineSizeVariance,
  ];
  const inputs = [
    refs.pivotX,
    refs.pivotY,
    refs.pivotRotation,
    refs.fanAngle,
    refs.collapseZero,
    refs.collapseThickness,
    refs.fanCurve,
    refs.radiusGain,
    refs.keyframeDuration,
    refs.keyframeLoop,
    refs.keyframePingPong,
    refs.keyframeEasing,
  ];

  generationInputs.forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      if (state.bakedModel) return;
      if (input === refs.text || input === refs.fontSize || input === refs.lineCount) state.lastMaskKey = '';
      triggerRender();
    });
  });

  inputs.forEach((input) => {
    if (!input) return;
    const evt = input.type === 'checkbox' ? 'change' : 'input';
    input.addEventListener(evt, () => {
      if (state.keyframeAnimating) return;
      triggerRender();
    });
  });
}

function stopKeyframePlayback() {
  state.keyframeAnimating = false;
  if (state.keyframeRaf) cancelAnimationFrame(state.keyframeRaf);
  state.keyframeRaf = 0;
}

function tickKeyframes(now) {
  if (!state.keyframeAnimating || !state.keyframes.start || !state.keyframes.end) {
    stopKeyframePlayback();
    triggerRender();
    return;
  }
  const durationMs = Math.max(200, numberValue(refs.keyframeDuration, 3.5) * 1000);
  const elapsed = now - state.keyframeStartMs;
  const pingpong = refs.keyframePingPong.checked;
  const loop = refs.keyframeLoop.checked;
  const easing = refs.keyframeEasing.value || 'linear';

  const rawT = elapsed / durationMs;
  let forwardT = rawT;

  if (pingpong) {
    if (loop) {
      const cycle = rawT % 2;
      forwardT = cycle <= 1 ? cycle : 2 - cycle;
    } else if (rawT >= 2) {
      applyFrameToState(state.keyframes.start);
      stopKeyframePlayback();
      triggerRender();
      return;
    } else {
      forwardT = rawT <= 1 ? rawT : 2 - rawT;
    }
  } else {
    if (loop) {
      forwardT = rawT % 1;
    } else if (rawT >= 1) {
      applyFrameToState(state.keyframes.end);
      stopKeyframePlayback();
      triggerRender();
      return;
    }
  }

  const easedT = easingValue(easing, clamp(forwardT, 0, 1));
  applyFrameToState(lerpFrame(state.keyframes.start, state.keyframes.end, easedT));
  renderNow();
  state.keyframeRaf = requestAnimationFrame(tickKeyframes);
}

function setupProcessButtons() {
  refs.bakeButton.addEventListener('click', () => {
    const params = buildRenderParams();
    state.bakedModel = engine.createSliceModel({
      lineCount: params.lineCount,
      strokeMin: params.strokeMin,
      strokeMax: params.strokeMax,
      strokeThreshold: params.strokeThreshold,
      lineSizeVariance: params.lineSizeVariance,
      colorStart: '#d2ef36',
      colorEnd: '#76862a',
    });
    triggerRender();
  });

  refs.resetButton.addEventListener('click', () => {
    stopKeyframePlayback();
    state.bakedModel = null;
    state.lastMaskKey = '';
    triggerRender();
  });

  refs.setStartKeyframeButton.addEventListener('click', () => {
    stopKeyframePlayback();
    state.keyframes.start = currentFrameFromState();
    triggerRender();
  });

  refs.setEndKeyframeButton.addEventListener('click', () => {
    stopKeyframePlayback();
    state.keyframes.end = currentFrameFromState();
    triggerRender();
  });

  refs.playKeyframeButton.addEventListener('click', () => {
    if (state.keyframeAnimating) {
      stopKeyframePlayback();
      triggerRender();
      return;
    }
    if (!state.keyframes.start) state.keyframes.start = currentFrameFromState();
    if (!state.keyframes.end) {
      refs.keyframeStatus.textContent = 'Set end keyframe first';
      return;
    }
    state.keyframeAnimating = true;
    state.keyframeStartMs = performance.now();
    state.keyframeRaf = requestAnimationFrame(tickKeyframes);
  });
}

function setupResize() {
  const observer = new ResizeObserver(() => updateCanvasSize());
  observer.observe(refs.stage);
  window.addEventListener('resize', updateCanvasSize);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function setPivotFromPointer(clientX, clientY) {
  const svg = refs.stage.querySelector('svg');
  if (!svg) return;
  const rect = svg.getBoundingClientRect();
  const nx = clamp((clientX - rect.left) / rect.width, -0.5, 1.5);
  const ny = clamp((clientY - rect.top) / rect.height, -0.5, 1.5);
  refs.pivotX.value = (nx * 100).toFixed(1);
  refs.pivotY.value = (ny * 100).toFixed(1);
  triggerRender();
}

function mountAnchorHandles() {
  const svg = refs.stage.querySelector('svg');
  if (!svg) return;

  const existing = svg.querySelector('#anchor-overlay');
  if (existing) existing.remove();

  const ns = 'http://www.w3.org/2000/svg';
  const overlay = document.createElementNS(ns, 'g');
  overlay.setAttribute('id', 'anchor-overlay');

  const width = state.width;
  const height = state.height;
  const px = (numberValue(refs.pivotX, 10) / 100) * width;
  const py = (numberValue(refs.pivotY, 6) / 100) * height;
  const baseAngle = (numberValue(refs.pivotRotation, 0) * Math.PI) / 180;
  const fanAngle = (numberValue(refs.fanAngle, 180) * Math.PI) / 180;
  const guideLength = Math.max(width, height) * 0.38;
  const textBbox = engine.getBbox();

  if (textBbox && !state.bakedModel) {
    const typeRect = document.createElementNS(ns, 'rect');
    typeRect.setAttribute('x', `${textBbox.x.toFixed(2)}`);
    typeRect.setAttribute('y', `${textBbox.y.toFixed(2)}`);
    typeRect.setAttribute('width', `${Math.max(1, textBbox.w).toFixed(2)}`);
    typeRect.setAttribute('height', `${Math.max(1, textBbox.h).toFixed(2)}`);
    typeRect.setAttribute('fill', 'transparent');
    typeRect.setAttribute('stroke', '#67745a');
    typeRect.setAttribute('stroke-width', '1');
    typeRect.setAttribute('stroke-dasharray', '4 4');
    typeRect.style.cursor = 'move';
    typeRect.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      state.draggingType = true;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
      svg.setPointerCapture(event.pointerId);
    });
    overlay.appendChild(typeRect);
  }

  const guideA = document.createElementNS(ns, 'line');
  guideA.setAttribute('x1', `${px}`);
  guideA.setAttribute('y1', `${py}`);
  guideA.setAttribute('x2', `${px + Math.cos(baseAngle) * guideLength}`);
  guideA.setAttribute('y2', `${py + Math.sin(baseAngle) * guideLength}`);
  guideA.setAttribute('stroke', '#546148');
  guideA.setAttribute('stroke-width', '1.2');
  guideA.setAttribute('stroke-dasharray', '5 5');
  guideA.setAttribute('opacity', '0.75');
  overlay.appendChild(guideA);

  const guideB = document.createElementNS(ns, 'line');
  guideB.setAttribute('x1', `${px}`);
  guideB.setAttribute('y1', `${py}`);
  guideB.setAttribute('x2', `${px + Math.cos(baseAngle + fanAngle) * guideLength}`);
  guideB.setAttribute('y2', `${py + Math.sin(baseAngle + fanAngle) * guideLength}`);
  guideB.setAttribute('stroke', '#9eff2f');
  guideB.setAttribute('stroke-width', '1.2');
  guideB.setAttribute('stroke-dasharray', '5 5');
  guideB.setAttribute('opacity', '0.85');
  overlay.appendChild(guideB);

  const makeHandle = (x, y, label, fill) => {
    const group = document.createElementNS(ns, 'g');
    group.setAttribute('class', 'anchorHandle');

    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', `${x}`);
    circle.setAttribute('cy', `${y}`);
    circle.setAttribute('r', '9');
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', '#0a0a0a');
    circle.setAttribute('stroke-width', '2');
    circle.style.cursor = 'grab';
    group.appendChild(circle);

    const text = document.createElementNS(ns, 'text');
    text.setAttribute('x', `${x + 13}`);
    text.setAttribute('y', `${y - 11}`);
    text.setAttribute('fill', '#9fb286');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-family', '"IBM Plex Mono", monospace');
    text.textContent = label;
    group.appendChild(text);

    group.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      state.draggingAnchor = 'pivot';
      svg.setPointerCapture(event.pointerId);
      setPivotFromPointer(event.clientX, event.clientY);
    });

    return group;
  };

  overlay.appendChild(makeHandle(px, py, 'Pivot', '#9eff2f'));
  svg.appendChild(overlay);

  svg.onpointermove = (event) => {
    if (state.keyframeAnimating) return;
    if (state.draggingType && !state.bakedModel) {
      const rect = svg.getBoundingClientRect();
      const dx = ((event.clientX - state.lastPointerX) / rect.width) * state.width;
      const dy = ((event.clientY - state.lastPointerY) / rect.height) * state.height;
      state.textX += dx;
      state.textY += dy;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
      state.lastMaskKey = '';
      triggerRender();
      return;
    }
    if (!state.draggingAnchor) return;
    setPivotFromPointer(event.clientX, event.clientY);
  };
  svg.onpointerup = () => {
    state.draggingAnchor = null;
    state.draggingType = false;
  };
  svg.onpointerleave = () => {
    state.draggingAnchor = null;
    state.draggingType = false;
  };
}

function init() {
  state.textX = state.width * 0.5;
  state.textY = 8;
  setupInputs();
  setupProcessButtons();
  setupResize();
  updateCanvasSize();
  triggerRender();
}

init();
