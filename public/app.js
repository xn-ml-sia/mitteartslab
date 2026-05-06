import { SHADER_SOURCES } from './shader-deck-shaders.js';

/** ESM build for chapter 2 particle vessel (vanilla port of EmptyParticles). */
const THREE_CDN_MODULE = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

/** Slow oscillation between two RGB triplets from CSS (`r, g, b` comma strings). */
const MODULE_DRIFT_SPEED = 0.0001;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const OUT_OF_VIEW_RESET_DELAY_MS = 500;

const RenderState = Object.freeze({
  REDUCED_MOTION: 'reduced_motion',
  FOCUSED: 'focused',
  VISIBLE_NOT_FOCUSED: 'visible_not_focused',
  OFFSCREEN: 'offscreen',
});

const RENDER_POLICY = Object.freeze({
  chapterFpsFocused: 11,
  chapterFpsVisibleNotFocused: 6,
  shaderFpsFocused: 23,
  shaderFpsVisibleNotFocused: 1,
  shaderFpsOffscreen: 0,
});

const RUNTIME_QUALITY_MEMORY = {
  shaderPerfLevel: 0,
};

const DEBUG_OVERLAY_ENABLED =
  new URLSearchParams(window.location.search).has('debugOverlay') ||
  window.localStorage.getItem('mal:debugOverlay') === '1';

const debugOverlay = (() => {
  if (!DEBUG_OVERLAY_ENABLED) return null;
  const state = {
    app: { phase: 'booting' },
    lifecycle: { visible: document.visibilityState === 'visible', focused: document.hasFocus(), active: document.visibilityState === 'visible' },
    modules: {},
  };
  const panel = document.createElement('aside');
  panel.setAttribute('aria-live', 'polite');
  panel.style.cssText = [
    'position:fixed',
    'right:12px',
    'bottom:12px',
    'z-index:99999',
    'max-width:320px',
    'min-width:250px',
    'padding:10px 12px',
    'background:rgba(0,0,0,0.78)',
    'color:#fff',
    'font:12px/1.4 "Courier Prime",monospace',
    'border:1px solid rgba(255,255,255,0.2)',
    'border-radius:8px',
    'backdrop-filter: blur(3px)',
    'pointer-events:none',
    'white-space:pre-wrap',
  ].join(';');
  let renderQueued = false;
  let lastRenderAt = 0;
  let lastText = '';
  const RENDER_MIN_MS = 220;
  const render = () => {
    renderQueued = false;
    lastRenderAt = Date.now();
    const lines = [];
    lines.push(`app: ${state.app.phase}`);
    lines.push(`page: ${state.lifecycle.active ? 'active' : 'paused'} | vis:${state.lifecycle.visible ? '1' : '0'} foc:${state.lifecycle.focused ? '1' : '0'}`);
    Object.entries(state.modules).forEach(([name, moduleState]) => {
      const ageMs = moduleState.lastFrameMs ? Math.max(0, Date.now() - moduleState.lastFrameMs) : null;
      const ageText = ageMs == null ? '-' : `${Math.round(ageMs)}ms`;
      lines.push(
        `${name}: ${moduleState.running ? 'run' : 'stop'} vis:${moduleState.visible ? '1' : '0'} state:${moduleState.renderState || '-'} frame:${ageText}`,
      );
    });
    const nextText = lines.join('\n');
    if (nextText === lastText) return;
    lastText = nextText;
    panel.textContent = nextText;
  };
  const ensureMounted = () => {
    if (!document.body.contains(panel)) document.body.appendChild(panel);
  };
  const schedule = () => {
    ensureMounted();
    if (renderQueued) return;
    const wait = Math.max(0, RENDER_MIN_MS - (Date.now() - lastRenderAt));
    renderQueued = true;
    if (wait === 0) {
      requestAnimationFrame(render);
      return;
    }
    window.setTimeout(() => requestAnimationFrame(render), wait);
  };
  const setApp = (patch) => {
    state.app = { ...state.app, ...patch };
    schedule();
  };
  const setLifecycle = (patch) => {
    state.lifecycle = { ...state.lifecycle, ...patch };
    schedule();
  };
  const setModule = (name, patch) => {
    state.modules[name] = { ...(state.modules[name] || {}), ...patch };
    schedule();
  };
  const frame = (name) => {
    setModule(name, { lastFrameMs: Date.now() });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
  return { setApp, setLifecycle, setModule, frame };
})();

const createDebugModuleProbe = (name) => {
  if (!debugOverlay) return null;
  return {
    set: (patch) => debugOverlay.setModule(name, patch),
    frame: () => debugOverlay.frame(name),
  };
};

const resolveVisibilityNode = (section, fallbackNode) => {
  if (!section) return fallbackNode || null;
  const display = window.getComputedStyle(section).display;
  if (display === 'contents') return fallbackNode || section;
  return section;
};

const pageLifecycle = (() => {
  let isDocVisible = document.visibilityState === 'visible';
  let isWinFocused = document.hasFocus();
  const subs = new Set();
  const computeIsActive = () => isDocVisible;

  const emit = () => {
    subs.forEach((fn) => fn({ isDocVisible, isWinFocused, isActive: computeIsActive() }));
    debugOverlay?.setLifecycle({ visible: isDocVisible, focused: isWinFocused, active: computeIsActive() });
  };

  const onVisibility = () => {
    isDocVisible = document.visibilityState === 'visible';
    emit();
  };
  const onFocus = () => {
    isWinFocused = true;
    emit();
  };
  const onBlur = () => {
    isWinFocused = false;
    emit();
  };
  const onPageShow = () => {
    // Recover correctly when returning via browser back/forward cache.
    isDocVisible = document.visibilityState === 'visible';
    isWinFocused = true;
    emit();
    requestAnimationFrame(() => {
      isWinFocused = document.hasFocus();
      emit();
    });
  };
  const onPageHide = () => {
    isWinFocused = false;
    emit();
  };

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('focus', onFocus, { passive: true });
  window.addEventListener('blur', onBlur, { passive: true });
  window.addEventListener('pageshow', onPageShow, { passive: true });
  window.addEventListener('pagehide', onPageHide, { passive: true });

  return {
    subscribe(fn) {
      subs.add(fn);
      fn({ isDocVisible, isWinFocused, isActive: computeIsActive() });
      return () => subs.delete(fn);
    },
    isActive() {
      return computeIsActive();
    },
    dispose() {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('pagehide', onPageHide);
      subs.clear();
    },
  };
})();

const resolveRenderState = ({ reducedMotion, sectionVisible, isFocusedSurface }) => {
  if (reducedMotion) return RenderState.REDUCED_MOTION;
  if (!sectionVisible || !pageLifecycle.isActive()) return RenderState.OFFSCREEN;
  if (isFocusedSurface) return RenderState.FOCUSED;
  return RenderState.VISIBLE_NOT_FOCUSED;
};

const computeVisibilityRatio = (node) => {
  if (!node) return 1;
  const rect = node.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return 0;
  const vw = window.innerWidth || document.documentElement.clientWidth || 0;
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  const xOverlap = Math.max(0, Math.min(rect.right, vw) - Math.max(rect.left, 0));
  const yOverlap = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
  const overlapArea = xOverlap * yOverlap;
  const area = rect.width * rect.height;
  if (area <= 0) return 0;
  return overlapArea / area;
};

const createSectionVisibilityTracker = (node, threshold = 0.2) => {
  if (!node) {
    return {
      isVisible: () => true,
      subscribe: (fn) => {
        if (typeof fn === 'function') fn(true);
        return () => {};
      },
      dispose: () => {},
    };
  }
  let ioVisible = false;
  let geomVisible = computeVisibilityRatio(node) >= threshold;
  let visible = ioVisible || geomVisible;
  let raf = 0;
  const subs = new Set();
  const emitIfChanged = (nextVisible) => {
    if (nextVisible === visible) return;
    visible = nextVisible;
    subs.forEach((fn) => fn(visible));
  };
  const refreshGeometry = () => {
    geomVisible = computeVisibilityRatio(node) >= threshold;
    emitIfChanged(ioVisible || geomVisible);
  };
  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry) {
        ioVisible = entry.isIntersecting && entry.intersectionRatio >= threshold * 0.6;
        refreshGeometry();
      }
    },
    { threshold },
  );
  io.observe(node);
  const tick = () => {
    raf = 0;
    refreshGeometry();
    if (pageLifecycle.isActive()) raf = requestAnimationFrame(tick);
  };
  const unsubscribeLifecycle = pageLifecycle.subscribe(({ isActive }) => {
    if (isActive) {
      refreshGeometry();
      if (!raf) raf = requestAnimationFrame(tick);
      return;
    }
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  const onWindow = () => refreshGeometry();
  window.addEventListener('resize', onWindow, { passive: true });
  window.addEventListener('scroll', onWindow, { passive: true });
  return {
    isVisible: () => {
      refreshGeometry();
      return visible;
    },
    subscribe(fn) {
      subs.add(fn);
      fn(visible);
      return () => subs.delete(fn);
    },
    dispose: () => {
      unsubscribeLifecycle();
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      window.removeEventListener('resize', onWindow);
      window.removeEventListener('scroll', onWindow);
      io.disconnect();
      subs.clear();
    },
  };
};

const parseRgbTriplet = (csv, fallback) => {
  const parts = csv.split(',').map((n) => parseInt(n.trim(), 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return fallback;
  return parts;
};

const smoothstep01 = (t) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

const driftRgbCsv = (a, b, ms, speed, phase = 0) => {
  const wave = (Math.sin(ms * speed + phase) + 1) * 0.5;
  const u = smoothstep01(wave);
  const r = Math.round(a[0] + (b[0] - a[0]) * u);
  const g = Math.round(a[1] + (b[1] - a[1]) * u);
  const bl = Math.round(a[2] + (b[2] - a[2]) * u);
  return `${r}, ${g}, ${bl}`;
};

const initCrumblingArtwork = (canvasId) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;
  const section = canvas.closest('.chapter-observe');
  const visibilityNode = resolveVisibilityNode(section, canvas);
  const sectionTracker = createSectionVisibilityTracker(visibilityNode, 0.2);
  const rootStyles = getComputedStyle(document.documentElement);
  const inkA = parseRgbTriplet(rootStyles.getPropertyValue('--module-ink-rgb').trim(), [56, 31, 32]);
  const inkB = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-ink-drift-rgb').trim() || rootStyles.getPropertyValue('--module-ink-rgb').trim(),
    inkA,
  );
  const accentA = parseRgbTriplet(rootStyles.getPropertyValue('--module-accent-rgb').trim(), [200, 72, 71]);
  const accentB = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-accent-drift-rgb').trim() || rootStyles.getPropertyValue('--module-accent-rgb').trim(),
    accentA,
  );
  let time = 0;
  let raf = 0;
  let lastTs = 0;
  let pageActive = pageLifecycle.isActive();
  const debug = createDebugModuleProbe(canvasId === 'chapter-3-canvas' ? 'chapter3' : canvasId);
  debug?.set({ running: false, visible: sectionTracker.isVisible(), renderState: 'init' });
  const quantizationStep = 3;
  const logicalSize = 550;

  // Keep a fixed logical canvas like chapter 2; CSS handles responsive display scaling.
  canvas.width = logicalSize;
  canvas.height = logicalSize;
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const render = (ts = 0) => {
    const sectionVisible = sectionTracker.isVisible();
    const state = resolveRenderState({
      reducedMotion: prefersReducedMotion,
      sectionVisible,
      isFocusedSurface: true,
    });
    debug?.set({ renderState: state, visible: sectionVisible, running: Boolean(raf) && pageActive });
    const fpsCap = state === RenderState.FOCUSED ? RENDER_POLICY.chapterFpsFocused : RENDER_POLICY.chapterFpsVisibleNotFocused;
    const frameDuration = 1000 / fpsCap;
    if (state === RenderState.OFFSCREEN) return;
    if (ts - lastTs < frameDuration) return;
    const deltaMs = lastTs > 0 ? ts - lastTs : frameDuration;
    lastTs = ts;
    // Use real elapsed time so motion stays lively at capped FPS.
    time += deltaMs * 0.0019;

    const width = logicalSize;
    const height = logicalSize;
    const drawSize = Math.min(width, height, 550);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = drawSize * 0.26;
    const numRings = 22;
    const ringSpacing = maxRadius / numRings;
    const crumbleFactor = (Math.sin(time * 0.24) + 1) / 2;

    // transparent bg
    ctx.clearRect(0, 0, width, height);

    const inkRgb = driftRgbCsv(inkA, inkB, ts, MODULE_DRIFT_SPEED, 0.15);
    const accentRgb = driftRgbCsv(accentA, accentB, ts, MODULE_DRIFT_SPEED, 1.25);

    const noise = (angle, radius, t) => {
      const n = Math.sin(angle * 3 + t) * Math.cos(radius * 0.02 - t * 0.5);
      return (n + 1) / 2;
    };

    for (let i = 1; i <= numRings; i += 1) {
      const baseRadius = i * ringSpacing;
      const driftedRadius = baseRadius * (1 + crumbleFactor * 0.2);
      const circumference = 2 * Math.PI * baseRadius;
      const steps = Math.max(10, Math.floor(circumference / 10));

      for (let j = 0; j < steps; j += 1) {
        const baseAngle = (j / steps) * Math.PI * 2;
        const noiseVal = noise(baseAngle, baseRadius, time);
        if (noiseVal <= 0.6) continue;

        const intensity = (noiseVal - 0.6) / 0.4;
        const orbitOffset = time * 0.1 * (1 + i * 0.03);
        const finalAngle = baseAngle + orbitOffset;
        const fallStrength = Math.pow(crumbleFactor, 3) * 72 * intensity;
        const jitterX = (Math.random() - 0.5) * 2;
        const jitterY = (Math.random() - 0.5) * 2;

        let px = centerX + Math.cos(finalAngle) * driftedRadius + jitterX;
        let py = centerY + Math.sin(finalAngle) * driftedRadius + jitterY;
        py += fallStrength;
        px += Math.sin(time + i) * fallStrength * 0.2;

        px = Math.round(px / quantizationStep) * quantizationStep;
        py = Math.round(py / quantizationStep) * quantizationStep;

        const dotSize = Math.round((1 + intensity * 2.5) * (1 - crumbleFactor * 0.4));
        if (dotSize < 1) continue;

        const palettePhase = (i + j) % 7;
        let rgb = inkRgb;
        if (palettePhase <= 2) rgb = accentRgb;

        ctx.beginPath();
        ctx.arc(px, py, dotSize, 0, Math.PI * 2);

        const styleThresh = crumbleFactor > 0.7 ? 3 : 6;
        const isOutline = (i + j) % styleThresh === 0;
        if (isOutline) {
          ctx.strokeStyle = `rgba(${rgb}, ${0.18 + intensity * 0.34})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${rgb}, ${0.12 + intensity * 0.42})`;
          ctx.fill();
        }
      }
    }

    debug?.frame();
  };

  const tick = (ts = 0) => {
    raf = 0;
    render(ts);
    if (!prefersReducedMotion && pageActive && sectionTracker.isVisible()) {
      raf = requestAnimationFrame(tick);
    }
  };
  const ensureLoop = () => {
    if (prefersReducedMotion || !pageActive || !sectionTracker.isVisible()) return;
    if (!raf) {
      raf = requestAnimationFrame(tick);
      debug?.set({ running: true });
    }
  };
  const stopLoop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      debug?.set({ running: false });
    }
  };
  const resetAnimationState = () => {
    time = 0;
    lastTs = 0;
    ctx.clearRect(0, 0, logicalSize, logicalSize);
  };
  let hiddenAtMs = 0;

  const unsubscribeLifecycle = pageLifecycle.subscribe(({ isActive }) => {
    pageActive = isActive;
    if (!pageActive) {
      stopLoop();
      return;
    }
    if (prefersReducedMotion) {
      render(performance.now());
      return;
    }
    ensureLoop();
  });
  const unsubscribeVisibility = sectionTracker.subscribe((isVisible) => {
    debug?.set({ visible: isVisible });
    if (!isVisible) {
      stopLoop();
      if (!hiddenAtMs) hiddenAtMs = performance.now();
      return;
    }
    const hiddenDurationMs = hiddenAtMs ? performance.now() - hiddenAtMs : 0;
    hiddenAtMs = 0;
    if (hiddenDurationMs >= OUT_OF_VIEW_RESET_DELAY_MS) resetAnimationState();
    if (prefersReducedMotion) {
      render(performance.now());
      return;
    }
    ensureLoop();
  });

  if (prefersReducedMotion) render(0);
  else ensureLoop();

  return () => {
    unsubscribeVisibility();
    unsubscribeLifecycle();
    stopLoop();
    sectionTracker.dispose();
    ctx.clearRect(0, 0, logicalSize, logicalSize);
    debug?.set({ running: false, renderState: 'disposed' });
  };
};

const initChapterOneArtwork = () => {
  const canvas = document.getElementById('ascii-canvas');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;
  const section = canvas.closest('.chapter-observe');
  const visibilityNode = resolveVisibilityNode(section, canvas);
  const sectionTracker = createSectionVisibilityTracker(visibilityNode, 0.2);
  let pageActive = pageLifecycle.isActive();
  const debug = createDebugModuleProbe('chapter1');
  debug?.set({ running: false, visible: sectionTracker.isVisible(), renderState: 'init' });
  const rootStyles = getComputedStyle(document.documentElement);
  const waterDeep = parseRgbTriplet(rootStyles.getPropertyValue('--rum-800').trim(), [83, 42, 64]);
  const waterMid = parseRgbTriplet(rootStyles.getPropertyValue('--rubin-riso').trim(), [94, 126, 223]);
  const waterLight = parseRgbTriplet(rootStyles.getPropertyValue('--rum-500').trim(), [109, 95, 112]);

  const width = (canvas.width = 550);
  const height = (canvas.height = 550);
  const resolution = 5;
  const rows = Math.floor(height / resolution);
  const cols = Math.floor(width / resolution);
  const centerX = width / 2;
  const centerY = height / 2;
  /** Circular mask: full field inside ~inner, smooth falloff to 0 at outer radius. */
  const discOuter = Math.min(width, height) * 0.48;
  const discInner = discOuter * 0.72;
  const field = new Float32Array(rows * cols);
  const buffer = document.createElement('canvas');
  buffer.width = width;
  buffer.height = height;
  const bctx = buffer.getContext('2d', { alpha: true });
  if (!bctx) return null;

  // Match wave_interference_flowing.html: center driver + ring of sources.
  const sources = [{ x: width / 2, y: height / 2, wl: 60, phase: 0, amp: 1.5 }];
  const n = 6;
  const ringRadius = 150;
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2;
    sources.push({
      x: width / 2 + Math.cos(a) * ringRadius,
      y: height / 2 + Math.sin(a) * ringRadius,
      wl: 50,
      phase: a,
      amp: 0.8,
    });
  }

  let raf = 0;
  let time = 0;
  let lastTs = 0;

  const animate = (ts = 0) => {
    const sectionVisible = sectionTracker.isVisible();
    const state = resolveRenderState({
      reducedMotion: prefersReducedMotion,
      sectionVisible,
      isFocusedSurface: sectionVisible,
    });
    debug?.set({ renderState: state, visible: sectionVisible, running: Boolean(raf) && pageActive });
    if (state === RenderState.OFFSCREEN) return;
    const fpsCap = state === RenderState.FOCUSED ? RENDER_POLICY.chapterFpsFocused : RENDER_POLICY.chapterFpsVisibleNotFocused;
    const frameDuration = 1000 / fpsCap;
    if (ts - lastTs < frameDuration) return;
    const rawDeltaMs = lastTs > 0 ? ts - lastTs : frameDuration;
    const deltaMs = Math.min(120, Math.max(8, rawDeltaMs));
    lastTs = ts;

    bctx.clearRect(0, 0, width, height);

    const sourceFalloffDist = 400;

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        const x = j * resolution;
        const y = i * resolution;
        let amp = 0;
        for (let k = 0; k < sources.length; k += 1) {
          const s = sources[k];
          const dx = x - s.x;
          const dy = y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const falloff = Math.max(0, 1 - dist / sourceFalloffDist);
          amp += s.amp * falloff * Math.sin((dist / s.wl - time) * Math.PI * 2 + s.phase);
        }
        const dxC = x - centerX;
        const dyC = y - centerY;
        const radial = Math.sqrt(dxC * dxC + dyC * dyC);
        const u = Math.min(1, Math.max(0, (radial - discInner) / (discOuter - discInner || 1)));
        const discEnvelope = 1 - u * u * (3 - 2 * u);
        field[i * cols + j] = amp * discEnvelope;
      }
    }

    // Static water blend (no temporal color drift).
    const blend = 0.35;
    const strokeR = Math.round(waterDeep[0] + (waterMid[0] - waterDeep[0]) * blend);
    const strokeG = Math.round(waterDeep[1] + (waterMid[1] - waterDeep[1]) * blend);
    const strokeB = Math.round(waterDeep[2] + (waterMid[2] - waterDeep[2]) * blend);
    const strokeAltA = 0.78;
    bctx.strokeStyle = `rgba(${strokeR}, ${strokeG}, ${strokeB}, ${strokeAltA})`;
    bctx.lineWidth = 1;
    bctx.beginPath();

    for (let i = 0; i < rows - 1; i += 1) {
      for (let j = 0; j < cols - 1; j += 1) {
        const idx = i * cols + j;
        const x = j * resolution;
        const y = i * resolution;
        const v00 = field[idx] > 0;
        const v10 = field[idx + 1] > 0;
        const v11 = field[idx + cols + 1] > 0;
        const v01 = field[idx + cols] > 0;
        if (v00 !== v10) {
          bctx.moveTo(x + resolution / 2, y);
          bctx.lineTo(x + resolution, y + resolution / 2);
        }
        if (v10 !== v11) {
          bctx.moveTo(x + resolution, y + resolution / 2);
          bctx.lineTo(x + resolution / 2, y + resolution);
        }
        if (v11 !== v01) {
          bctx.moveTo(x + resolution / 2, y + resolution);
          bctx.lineTo(x, y + resolution / 2);
        }
        if (v01 !== v00) {
          bctx.moveTo(x, y + resolution / 2);
          bctx.lineTo(x + resolution / 2, y);
        }
      }
    }

    bctx.stroke();
    bctx.strokeStyle = `rgba(${waterLight[0]}, ${waterLight[1]}, ${waterLight[2]}, 0.36)`;
    bctx.lineWidth = 0.95;
    bctx.stroke();

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(buffer, 0, 0);
    // ~0.012 per frame at 60fps (wave_interference_flowing.html); scale by real elapsed ms.
    time += deltaMs * 0.00072;
    debug?.frame();
  };

  const tick = (ts = 0) => {
    raf = 0;
    animate(ts);
    if (!prefersReducedMotion && pageActive && sectionTracker.isVisible()) raf = requestAnimationFrame(tick);
  };
  const ensureLoop = () => {
    if (prefersReducedMotion || !pageActive || !sectionTracker.isVisible()) return;
    if (!raf) {
      raf = requestAnimationFrame(tick);
      debug?.set({ running: true });
    }
  };
  const stopLoop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      debug?.set({ running: false });
    }
  };
  const resetAnimationState = () => {
    time = 0;
    lastTs = 0;
    bctx.clearRect(0, 0, width, height);
    ctx.clearRect(0, 0, width, height);
  };
  let hiddenAtMs = 0;

  const unsubscribeLifecycle = pageLifecycle.subscribe(({ isActive }) => {
    pageActive = isActive;
    if (!pageActive) {
      stopLoop();
      return;
    }
    if (prefersReducedMotion) {
      animate(performance.now());
      return;
    }
    ensureLoop();
  });
  const unsubscribeVisibility = sectionTracker.subscribe((isVisible) => {
    debug?.set({ visible: isVisible });
    if (!isVisible) {
      stopLoop();
      if (!hiddenAtMs) hiddenAtMs = performance.now();
      return;
    }
    const hiddenDurationMs = hiddenAtMs ? performance.now() - hiddenAtMs : 0;
    hiddenAtMs = 0;
    if (hiddenDurationMs >= OUT_OF_VIEW_RESET_DELAY_MS) resetAnimationState();
    if (prefersReducedMotion) {
      animate(performance.now());
      return;
    }
    ensureLoop();
  });

  if (prefersReducedMotion) animate(performance.now());
  else ensureLoop();

  return () => {
    unsubscribeVisibility();
    unsubscribeLifecycle();
    stopLoop();
    sectionTracker.dispose();
    bctx.clearRect(0, 0, width, height);
    ctx.clearRect(0, 0, width, height);
    debug?.set({ running: false, renderState: 'disposed' });
  };
};

/** Port of EmptyParticles / ParticleVessel: shader points in a vessel formation. */
const createChapterTwoParticleVessel = (THREE, container, options) => {
  const {
    count,
    sectionTracker,
    prefersReducedMotion,
    debug,
    visibilityNode,
  } = options;

  const width = Math.max(1, container.clientWidth);
  const height = Math.max(1, container.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    alpha: true,
    stencil: false,
    depth: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  camera.position.z = 5;
  scene.background = null;

  const vertexShader = `
    uniform float time;
    attribute float size;
    attribute vec3 customColor;
    varying vec3 vColor;

    void main() {
      vColor = customColor;
      vec3 pos = position;

      float radius = length(pos.xz);
      float angle = atan(pos.z, pos.x);
      float height = pos.y;

      float vessel = smoothstep(0.3, 0.7, radius) * smoothstep(1.0, 0.7, radius);

      angle += time * 0.08;

      float space = sin(time * 0.3 + radius * 3.0) * 0.1;

      float newRadius = (radius + space) * vessel;

      vec3 newPos;
      newPos.x = cos(angle) * newRadius;
      newPos.z = sin(angle) * newRadius;
      newPos.y = height * vessel - 1.2;

      newPos *= 2.75;

      vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
      gl_PointSize = size * (128.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform float opacity;
    varying vec3 vColor;
    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = dot(center, center);

      if (dist > 0.25) discard;

      float alpha = (1.0 - smoothstep(0.2025, 0.25, dist)) * opacity;
      gl_FragColor = vec4(vColor, alpha);
    }
  `;

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      opacity: { value: 0.4 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
    vertexColors: true,
  });

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  let i3 = 0;
  for (let i = 0; i < count; i += 1) {
    const t = i / count;
    const radius = Math.pow(t, 0.5);
    const angle = t * Math.PI * 40;
    const vesselHeight = Math.sin(t * Math.PI) * 1.8;
    const randRadius = radius + (Math.random() - 0.5) * 0.05;
    const randAngle = angle + (Math.random() - 0.5) * 0.1;

    positions[i3] = Math.cos(randAngle) * randRadius;
    positions[i3 + 1] = vesselHeight;
    positions[i3 + 2] = Math.sin(randAngle) * randRadius;

    const shade = 0.1 + Math.sqrt(radius) * 0.1 + Math.random() * 0.02;
    colors[i3] = shade;
    colors[i3 + 1] = shade;
    colors[i3 + 2] = shade;

    sizes[i] = (1.0 - Math.abs(vesselHeight * 0.5)) * 0.2 + 0.1;

    i3 += 3;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  const points = new THREE.Points(geometry, particleMaterial);
  scene.add(points);

  const clock = new THREE.Clock();
  let raf = 0;
  let lastTs = 0;
  const targetInterval = 1000 / 60;
  let pageActive = pageLifecycle.isActive();
  let hiddenAtMs = 0;

  const isActuallyVisible = () => {
    const node = visibilityNode || container;
    const rect = node.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };
  const isSectionVisible = () => sectionTracker.isVisible() || isActuallyVisible();

  const renderFrame = (ts = performance.now()) => {
    const sectionVisible = isSectionVisible();
    const state = resolveRenderState({
      reducedMotion: prefersReducedMotion,
      sectionVisible,
      isFocusedSurface: sectionVisible,
    });
    debug?.set({ renderState: state, visible: sectionVisible, running: Boolean(raf) && pageActive });
    if (state === RenderState.OFFSCREEN) return;

    if (!prefersReducedMotion) {
      const deltaTime = ts - lastTs;
      if (deltaTime < targetInterval) return;
      lastTs = ts - (deltaTime % targetInterval);
    }

    const time = prefersReducedMotion ? 0 : clock.getElapsedTime();
    particleMaterial.uniforms.time.value = time;
    renderer.render(scene, camera);
    debug?.frame();
  };

  const tick = (ts) => {
    raf = 0;
    renderFrame(ts);
    if (!prefersReducedMotion && pageActive && isSectionVisible()) {
      raf = requestAnimationFrame(tick);
    }
  };

  const ensureLoop = () => {
    if (!pageActive) return;
    if (prefersReducedMotion || !isSectionVisible()) {
      renderFrame(performance.now());
      return;
    }
    if (!raf) {
      raf = requestAnimationFrame(tick);
      debug?.set({ running: true });
    }
  };

  const stopLoop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      debug?.set({ running: false });
    }
  };

  const resetMotion = () => {
    clock.stop();
    clock.start();
    lastTs = 0;
  };

  let resizeTimeout = null;
  const handleResize = () => {
    if (!container.isConnected) return;
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderFrame(performance.now());
  };

  const onWindowResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  };
  window.addEventListener('resize', onWindowResize, { passive: true });

  let observerTimeout = null;
  const resizeObserver = new ResizeObserver(() => {
    if (observerTimeout) clearTimeout(observerTimeout);
    observerTimeout = setTimeout(handleResize, 100);
  });
  resizeObserver.observe(container);

  const unsubscribeLifecycle = pageLifecycle.subscribe(({ isActive }) => {
    pageActive = isActive;
    if (!pageActive) {
      stopLoop();
      return;
    }
    ensureLoop();
  });

  const unsubscribeVisibility = sectionTracker.subscribe((isVisible) => {
    debug?.set({ visible: isVisible });
    if (!isVisible) {
      stopLoop();
      if (!hiddenAtMs) hiddenAtMs = performance.now();
      return;
    }
    const hiddenDurationMs = hiddenAtMs ? performance.now() - hiddenAtMs : 0;
    hiddenAtMs = 0;
    if (hiddenDurationMs >= OUT_OF_VIEW_RESET_DELAY_MS) resetMotion();
    ensureLoop();
  });

  if (prefersReducedMotion) renderFrame(performance.now());
  else ensureLoop();

  return () => {
    stopLoop();
    unsubscribeVisibility();
    unsubscribeLifecycle();
    window.removeEventListener('resize', onWindowResize);
    if (resizeTimeout) clearTimeout(resizeTimeout);
    if (observerTimeout) clearTimeout(observerTimeout);
    resizeObserver.disconnect();
    scene.remove(points);
    geometry.dispose();
    particleMaterial.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
    renderer.forceContextLoss();
    debug?.set({ running: false, renderState: 'disposed' });
  };
};

const initChapterTwoArtwork = () => {
  const mount = document.getElementById('chapter-2-particles');
  if (!mount) return null;
  const section = mount.closest('.chapter-observe');
  const visibilityNode = resolveVisibilityNode(section, mount);
  const sectionTracker = createSectionVisibilityTracker(visibilityNode, 0.2);
  const debug = createDebugModuleProbe('chapter2');
  debug?.set({ running: false, visible: sectionTracker.isVisible(), renderState: 'init' });

  const count = prefersReducedMotion
    ? 8000
    : window.matchMedia('(max-width: 640px)').matches
      ? 14000
      : 45000;

  let cancelled = false;
  let disposeVessel = null;

  import(THREE_CDN_MODULE)
    .then((THREE) => {
      if (cancelled) return;
      disposeVessel = createChapterTwoParticleVessel(THREE, mount, {
        count,
        sectionTracker,
        prefersReducedMotion,
        debug,
        visibilityNode,
      });
    })
    .catch((err) => {
      console.warn('Chapter 2 artwork: Three.js failed to load', err);
    });

  return () => {
    cancelled = true;
    disposeVessel?.();
    disposeVessel = null;
    sectionTracker.dispose();
    debug?.set({ running: false, renderState: 'disposed' });
  };
};

const initChapterThreeArtwork = () => initCrumblingArtwork('chapter-3-canvas');

/** L-systems from tiny_swaying_tree.html; coordinates in 300×300 reference space. */
const CH4_AXIOM = 'X';
const CH4_RULES = { X: 'F-[[X]+X]+F[+FX]-X', F: 'FF' };
const CH4_FINAL_RULES = { X: 'F-[[X]+X]+F[+FX]-X+[F+X][-X]', F: 'FF' };
const CH4_REF_W = 300;
const CH4_REF_H = 300;
// Counter-clockwise tilt so chapter-4 tree reads as sideways growth.
const CH4_BASE_ROTATION = -0.72;

const ch4Generate = (start, iters, rules = CH4_RULES) => {
  let s = start;
  for (let i = 0; i < iters; i += 1) {
    let n = '';
    for (const c of s) n += rules[c] || c;
    s = n;
  }
  return s;
};

const CH4_SYSTEMS = [
  { system: ch4Generate(CH4_AXIOM, 2), angleDelta: Math.PI / 7, length: 6.1 },
  { system: ch4Generate(CH4_AXIOM, 3), angleDelta: Math.PI / 7, length: 5.0 },
  { system: ch4Generate(CH4_AXIOM, 4), angleDelta: Math.PI / 7, length: 4.0 },
  // Depth-5 expansion on base rules: much denser branching.
  { system: ch4Generate(CH4_AXIOM, 5), angleDelta: Math.PI / 7, length: 3.35 },
  // Extra canopy: same depth, wider angles + slightly longer strokes (can read past the square).
  { system: ch4Generate(CH4_AXIOM, 5, CH4_FINAL_RULES), angleDelta: Math.PI / 6.2, length: 3.12 },
  { system: ch4Generate(CH4_AXIOM, 5, CH4_FINAL_RULES), angleDelta: Math.PI / 8, length: 3.0 },
];

// Grow to peak and reduce back, excluding duplicate endpoints in the reverse.
const CH4_STAGE_SEQUENCE = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1];
const CH4_STAGE_HOLD_MS = [900, 1100, 1350, 1600, 2100, 5200];
const CH4_SEQUENCE_TRANSITION_RATE = [1.3, 1.2, 1.12, 1.05, 1.0, 1.02, 1.05, 1.12, 1.22, 1.3];

const ch4UpdateBounds = (sysData, time, acc) => {
  const { system, angleDelta, length } = sysData;
  let x = CH4_REF_W / 2;
  let y = CH4_REF_H * 0.92;
  let angle = -Math.PI / 2 + CH4_BASE_ROTATION + Math.sin(time * 0.18) * 0.25;
  const stack = [];
  const addPt = (px, py) => {
    acc.minX = Math.min(acc.minX, px);
    acc.maxX = Math.max(acc.maxX, px);
    acc.minY = Math.min(acc.minY, py);
    acc.maxY = Math.max(acc.maxY, py);
  };
  addPt(x, y);
  for (let i = 0; i < system.length; i += 1) {
    const cmd = system[i];
    if (cmd === 'F') {
      const x2 = x + length * Math.cos(angle);
      const y2 = y + length * Math.sin(angle);
      addPt(x2, y2);
      x = x2;
      y = y2;
    } else if (cmd === '+') {
      angle += angleDelta + Math.sin(time * 0.18 + i * 0.01) * 0.03;
    } else if (cmd === '-') {
      angle -= angleDelta + Math.sin(time * 0.18 + i * 0.01) * 0.03;
    } else if (cmd === '[') {
      stack.push({ x, y, angle });
    } else if (cmd === ']') {
      const st = stack.pop();
      if (st) {
        x = st.x;
        y = st.y;
        angle = st.angle;
      }
    }
  }
};

const ch4EmptyBounds = () => ({
  minX: Infinity,
  minY: Infinity,
  maxX: -Infinity,
  maxY: -Infinity,
});

const ch4UnionBounds = (a, b) => ({
  minX: Math.min(a.minX, b.minX),
  minY: Math.min(a.minY, b.minY),
  maxX: Math.max(a.maxX, b.maxX),
  maxY: Math.max(a.maxY, b.maxY),
});

const ch4NormalizeBounds = (b) => {
  if (!Number.isFinite(b.minX) || b.maxX <= b.minX || b.maxY <= b.minY) {
    return { minX: 0, minY: 0, maxX: CH4_REF_W, maxY: CH4_REF_H };
  }
  return b;
};

const ch4CalcGlobalBounds = () => {
  // Fixed framing: use final stage envelope across a few sway moments.
  const samples = [0.0, 0.6, 1.2, 1.8, 2.4, 3.0, 3.6, 4.2];
  let bounds = ch4EmptyBounds();
  samples.forEach((t) => {
    const b = ch4EmptyBounds();
    ch4UpdateBounds(CH4_SYSTEMS[CH4_SYSTEMS.length - 1], t, b);
    bounds = ch4UnionBounds(bounds, b);
  });
  const wide = CH4_SYSTEMS[CH4_SYSTEMS.length - 2];
  if (wide) {
    samples.forEach((t) => {
      const b = ch4EmptyBounds();
      ch4UpdateBounds(wide, t, b);
      bounds = ch4UnionBounds(bounds, b);
    });
  }
  return ch4NormalizeBounds(bounds);
};
const CH4_GLOBAL_BOUNDS = ch4CalcGlobalBounds();

const ch4Hash11 = (n) => {
  const s = Math.sin(n * 127.1) * 43758.5453123;
  return s - Math.floor(s);
};

const ch4DrawTree = (ctx, sysData, alpha, time, options = {}) => {
  const { system, angleDelta, length } = sysData;
  const {
    startCommand = 0,
    maxCommands = system.length,
    revealEnd = system.length,
    drawStride = 1,
    offsetX = 0,
    offsetY = 0,
    alphaScale = 1,
    fallProgress = 0,
    fallDistance = 0,
    fallDrift = 0,
    swayIntensity = 1,
    sproutDensity = 0,
    windChaos = 1,
    windGust = 0,
  } = options;
  let x = CH4_REF_W / 2 + offsetX;
  let y = CH4_REF_H * 0.92 + offsetY;
  let angle = -Math.PI / 2 + CH4_BASE_ROTATION + Math.sin(time * 0.18) * 0.25;
  const stack = [];
  let depth = 0;
  const cmdLimit = Math.max(0, Math.min(system.length, maxCommands));
  const cmdStart = Math.max(0, Math.min(system.length, startCommand));
  const stride = Math.max(1, drawStride);
  const reveal = Math.max(0, Math.min(system.length, revealEnd));
  const revealFloor = Math.floor(reveal);
  const revealFrac = reveal - revealFloor;
  for (let i = 0; i < cmdLimit; i += 1) {
    const cmd = system[i];
    if (cmd === 'F') {
      const x2 = x + length * Math.cos(angle);
      const y2 = y + length * Math.sin(angle);
      if (i >= cmdStart && i % stride === 0) {
        let revealWeight = 1;
        if (i > revealFloor) revealWeight = 0;
        else if (i === revealFloor) revealWeight = revealFrac;
        if (revealWeight > 0) {
          const op = (0.22 - (i / system.length) * 0.09) * alpha * alphaScale * revealWeight;
          const t = Math.max(0, Math.min(1, fallProgress));
          const seed = ch4Hash11(i * 1.913 + depth * 7.371);
          const driftX = (seed - 0.5) * fallDrift * t + Math.sin(time * 0.9 + seed * 6.283) * t * 1.6;
          const driftY = fallDistance * t * (0.35 + seed * 0.9);
          const sx = x + driftX;
          const sy = y + driftY;
          const ex = x + (x2 - x) * revealWeight + driftX;
          const ey = y + (y2 - y) * revealWeight + driftY;
          // Detached branch tumble during shrink transitions.
          const tumble = (seed - 0.5) * t * 1.15;
          const mx = (sx + ex) * 0.5;
          const my = (sy + ey) * 0.5;
          const dx = ex - sx;
          const dy = ey - sy;
          const cosA = Math.cos(tumble);
          const sinA = Math.sin(tumble);
          const rdx = dx * cosA - dy * sinA;
          const rdy = dx * sinA + dy * cosA;
          const rsx = mx - rdx * 0.5;
          const rsy = my - rdy * 0.5;
          const rex = mx + rdx * 0.5;
          const rey = my + rdy * 0.5;
          ctx.strokeStyle = `rgba(51,51,51,${Math.max(0, op)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(rsx, rsy);
          ctx.lineTo(rex, rey);
          ctx.stroke();
        }
      }
      if (sproutDensity > 0 && i >= cmdStart && i % stride === 0) {
        const seed = ch4Hash11(i * 2.17 + depth * 9.13);
        if (seed < sproutDensity) {
          const sproutLen = length * (0.22 + seed * 0.26);
          const sproutAng = angle + (seed - 0.5) * 1.05 + Math.sin(time * 0.62 + seed * 5.2) * 0.18;
          const mx = (x + x2) * 0.5;
          const my = (y + y2) * 0.5;
          const ex = mx + Math.cos(sproutAng) * sproutLen;
          const ey = my + Math.sin(sproutAng) * sproutLen;
          const op = (0.12 + seed * 0.06) * alpha * alphaScale;
          ctx.strokeStyle = `rgba(51,51,51,${Math.max(0, op)})`;
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
      }
      x = x2;
      y = y2;
    } else if (cmd === '+') {
      const depthNorm = Math.min(1, depth / 10);
      const gust = Math.sin(time * 1.15 + i * 0.02 + depth * 0.41) * windGust;
      const windPrimary = Math.sin(time * (0.27 * windChaos) + i * 0.011 + depth * 0.63);
      const windSecondary = Math.sin(time * (0.19 * windChaos) + i * 0.007 + depth * 0.37);
      const windTertiary = Math.sin(time * 0.41 + i * 0.019 + depth * 0.88);
      const wind =
        (windPrimary * 0.020 + windSecondary * 0.012 + windTertiary * 0.010 * (windChaos - 1) * 0.35 + gust) *
        (0.28 + depthNorm * 1.35) *
        swayIntensity;
      angle += angleDelta + wind;
    } else if (cmd === '-') {
      const depthNorm = Math.min(1, depth / 10);
      const gust = Math.sin(time * 1.15 + i * 0.02 + depth * 0.41) * windGust;
      const windPrimary = Math.sin(time * (0.27 * windChaos) + i * 0.011 + depth * 0.63);
      const windSecondary = Math.sin(time * (0.19 * windChaos) + i * 0.007 + depth * 0.37);
      const windTertiary = Math.sin(time * 0.41 + i * 0.019 + depth * 0.88);
      const wind =
        (windPrimary * 0.020 + windSecondary * 0.012 + windTertiary * 0.010 * (windChaos - 1) * 0.35 + gust) *
        (0.28 + depthNorm * 1.35) *
        swayIntensity;
      angle -= angleDelta + wind;
    } else if (cmd === '[') {
      stack.push({ x, y, angle });
      depth += 1;
    } else if (cmd === ']') {
      const st = stack.pop();
      depth = Math.max(0, depth - 1);
      if (st) {
        x = st.x;
        y = st.y;
        angle = st.angle;
      }
    }
  }
};

const initChapterFourTreeArtwork = () => {
  const canvas = document.getElementById('chapter-4-tree-canvas');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;
  const section = canvas.closest('.chapter-observe');
  const visibilityNode = resolveVisibilityNode(section, canvas);
  const sectionTracker = createSectionVisibilityTracker(visibilityNode, 0.2);
  const debug = createDebugModuleProbe('chapter4');
  debug?.set({ running: false, visible: sectionTracker.isVisible(), renderState: 'init' });

  let logicalW = 1;
  let logicalH = 1;
  let dpr = 1;

  const syncCanvasSize = () => {
    // Anchor rendering to the chapter-4 artwork box, not viewport center.
    const rect = canvas.getBoundingClientRect();
    const boxW = Math.max(1, Math.floor(rect.width));
    const boxH = Math.max(1, Math.floor(rect.height));
    const vw = Math.max(1, window.innerWidth);
    const vh = Math.max(1, window.innerHeight - 60);
    logicalW = boxW > 1 ? boxW : vw;
    logicalH = boxH > 1 ? boxH : vh;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pxW = Math.max(1, Math.floor(logicalW * dpr));
    const pxH = Math.max(1, Math.floor(logicalH * dpr));
    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW;
      canvas.height = pxH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  syncCanvasSize();

  let treeTime = 0;
  let stagePos = 0;
  let transitionFactor = 0;
  let isTransitioning = false;
  let stageMs = 0;
  let raf = 0;
  let lastTs = 0;
  let pageActive = pageLifecycle.isActive();
  // Faster growth/decay motion.
  const STAGE_MS = 1500;
  // Longer hold only at full growth stage.
  const FULL_STAGE_HOLD_MS = 5200;
  // Baseline transition speed multiplied by per-sequence profile.
  const TRANSITION_SPEED_BASE = 0.015 * (60 / 1000);

  let hiddenAtMs = 0;

  const resetGrowth = () => {
    treeTime = 0;
    stagePos = 0;
    transitionFactor = 0;
    isTransitioning = false;
    stageMs = 0;
    lastTs = 0;
  };

  const ch4StageWind = (stageIdx) => {
    const isFinal = stageIdx === CH4_SYSTEMS.length - 1;
    const isWide = stageIdx === CH4_SYSTEMS.length - 2;
    if (isFinal) return { sway: 1.55, chaos: 1.55, gust: 0.045, sprout: 0.42 };
    if (isWide) return { sway: 1.18, chaos: 1.18, gust: 0.022, sprout: 0.28 };
    return { sway: 1, chaos: 1, gust: 0, sprout: 0 };
  };

  const render = (ts = 0) => {
    const sectionVisible = sectionTracker.isVisible();
    const state = resolveRenderState({
      reducedMotion: prefersReducedMotion,
      sectionVisible,
      isFocusedSurface: true,
    });
    debug?.set({ renderState: state, visible: sectionVisible, running: Boolean(raf) && pageActive });
    const fpsCap = state === RenderState.FOCUSED ? RENDER_POLICY.chapterFpsFocused : RENDER_POLICY.chapterFpsVisibleNotFocused;
    const frameDuration = 1000 / fpsCap;
    if (state === RenderState.OFFSCREEN) return;
    if (ts - lastTs < frameDuration) return;
    const deltaMs = lastTs > 0 ? ts - lastTs : frameDuration;
    lastTs = ts;

    if (!prefersReducedMotion) {
      treeTime += deltaMs * 0.00048;
      if (isTransitioning) {
        const transitionRate = CH4_SEQUENCE_TRANSITION_RATE[stagePos] || CH4_SEQUENCE_TRANSITION_RATE[0];
        transitionFactor += deltaMs * TRANSITION_SPEED_BASE * transitionRate;
        if (transitionFactor >= 1) {
          isTransitioning = false;
          transitionFactor = 0;
          stagePos = (stagePos + 1) % CH4_STAGE_SEQUENCE.length;
          stageMs = 0;
        }
      } else {
        stageMs += deltaMs;
        const stageIndexForHold = CH4_STAGE_SEQUENCE[stagePos];
        const holdMs = stageIndexForHold === CH4_SYSTEMS.length - 1
          ? FULL_STAGE_HOLD_MS
          : (CH4_STAGE_HOLD_MS[stageIndexForHold] || STAGE_MS);
        if (stageMs > holdMs) isTransitioning = true;
      }
    }

    const drawTime = prefersReducedMotion ? 1.25 : treeTime;
    const baseIdx = CH4_STAGE_SEQUENCE[stagePos];
    const nextIdx = CH4_STAGE_SEQUENCE[(stagePos + 1) % CH4_STAGE_SEQUENCE.length];

    syncCanvasSize();

    const pad = 18;
    const cw = logicalW;
    const ch = logicalH;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    const b = CH4_GLOBAL_BOUNDS;
    const bw = Math.max(b.maxX - b.minX, 1e-6);
    const bh = Math.max(b.maxY - b.minY, 1e-6);
    const baseScale = Math.min((cw - 2 * pad) / bw, (ch - 2 * pad) / bh);
    const breathing = prefersReducedMotion || isTransitioning ? 1 : (1 + Math.sin(drawTime * 0.35) * 0.012);
    const scale = baseScale * breathing;
    const tx = pad + (cw - 2 * pad - bw * scale) / 2 - b.minX * scale;
    const ty = pad + (ch - 2 * pad - bh * scale) / 2 - b.minY * scale;
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, tx * dpr, ty * dpr);

    if (prefersReducedMotion) {
      const w = ch4StageWind(CH4_SYSTEMS.length - 1);
      ch4DrawTree(ctx, CH4_SYSTEMS[CH4_SYSTEMS.length - 1], 1, drawTime, {
        swayIntensity: w.sway,
        windChaos: w.chaos,
        windGust: w.gust,
        sproutDensity: w.sprout,
      });
    } else if (isTransitioning) {
      const ease = 1 - (1 - transitionFactor) ** 3;
      const baseSystem = CH4_SYSTEMS[baseIdx];
      const nextSystem = CH4_SYSTEMS[nextIdx];
      const isShrinking = nextIdx < baseIdx;
      const wBase = ch4StageWind(baseIdx);
      const wNext = ch4StageWind(nextIdx);
      if (isShrinking) {
        // Shrink pass: persistent target + smoothly collapsing source + detached falling twigs.
        const eased = ease * ease * (3 - 2 * ease);
        const keepCut = Math.max(10, Math.floor(baseSystem.system.length * (1 - eased * 0.94)));
        const dropStart = Math.min(baseSystem.system.length, keepCut);
        const stayAlpha = 1 - eased * 0.66;

        ch4DrawTree(ctx, nextSystem, 1, drawTime, {
          swayIntensity: 0.92 * wNext.sway,
          windChaos: wNext.chaos,
          windGust: wNext.gust,
          sproutDensity: wNext.sprout,
        });
        ch4DrawTree(ctx, baseSystem, stayAlpha, drawTime, {
          maxCommands: keepCut,
          revealEnd: keepCut + eased,
          swayIntensity: 0.78 * wBase.sway,
          windChaos: wBase.chaos,
          windGust: wBase.gust * 0.55,
          sproutDensity: wBase.sprout * 0.55,
          alphaScale: 0.9,
        });
        ch4DrawTree(ctx, baseSystem, 1, drawTime, {
          startCommand: dropStart,
          maxCommands: baseSystem.system.length,
          drawStride: 3,
          alphaScale: 1 - eased * 0.8,
          fallProgress: eased,
          fallDistance: 78,
          fallDrift: 22,
          swayIntensity: 0.5 * wBase.sway,
          windChaos: wBase.chaos,
          windGust: wBase.gust * 0.85,
          sproutDensity: 0,
        });
      } else {
        const eased = ease * ease * (3 - 2 * ease);
        const reveal = Math.max(8, nextSystem.system.length * eased);
        ch4DrawTree(ctx, baseSystem, 1 - eased * 0.22, drawTime, {
          swayIntensity: 0.88 * wBase.sway,
          windChaos: wBase.chaos,
          windGust: wBase.gust,
          sproutDensity: wBase.sprout,
        });
        ch4DrawTree(ctx, nextSystem, 1, drawTime, {
          revealEnd: reveal,
          swayIntensity: 0.98 * wNext.sway,
          windChaos: wNext.chaos,
          windGust: wNext.gust,
          sproutDensity: wNext.sprout * eased,
          alphaScale: 0.92 + eased * 0.08,
        });
      }
    } else {
      const w = ch4StageWind(baseIdx);
      ch4DrawTree(ctx, CH4_SYSTEMS[baseIdx], 1, drawTime, {
        swayIntensity: w.sway,
        windChaos: w.chaos,
        windGust: w.gust,
        sproutDensity: w.sprout,
      });
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    debug?.frame();
  };

  const tick = (ts = 0) => {
    raf = 0;
    render(ts);
    if (!prefersReducedMotion && pageActive && sectionTracker.isVisible()) {
      raf = requestAnimationFrame(tick);
    }
  };
  const ensureLoop = () => {
    if (prefersReducedMotion || !pageActive || !sectionTracker.isVisible()) return;
    if (!raf) {
      raf = requestAnimationFrame(tick);
      debug?.set({ running: true });
    }
  };
  const stopLoop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      debug?.set({ running: false });
    }
  };

  const unsubscribeLifecycle = pageLifecycle.subscribe(({ isActive }) => {
    pageActive = isActive;
    if (!pageActive) {
      stopLoop();
      return;
    }
    if (prefersReducedMotion) {
      render(performance.now());
      return;
    }
    ensureLoop();
  });
  const unsubscribeVisibility = sectionTracker.subscribe((isVisible) => {
    debug?.set({ visible: isVisible });
    if (!isVisible) {
      stopLoop();
      if (!hiddenAtMs) hiddenAtMs = performance.now();
      return;
    }
    const hiddenDurationMs = hiddenAtMs ? performance.now() - hiddenAtMs : 0;
    hiddenAtMs = 0;
    if (hiddenDurationMs >= OUT_OF_VIEW_RESET_DELAY_MS) resetGrowth();
    if (prefersReducedMotion) {
      render(performance.now());
      return;
    }
    ensureLoop();
  });

  if (prefersReducedMotion) render(performance.now());
  else ensureLoop();

  const onResize = () => {
    syncCanvasSize();
    render(performance.now());
  };
  window.addEventListener('resize', onResize, { passive: true });

  return () => {
    unsubscribeVisibility();
    unsubscribeLifecycle();
    stopLoop();
    sectionTracker.dispose();
    window.removeEventListener('resize', onResize);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    debug?.set({ running: false, renderState: 'disposed' });
  };
};

const SHADERTOY_PRELUDE = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform int iFrame;
uniform vec4 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
out vec4 fragColor;
`;

const SHADERTOY_EPILOGUE = `
void main() {
  vec4 c = vec4(0.0);
  mainImage(c, gl_FragCoord.xy);
  fragColor = c;
}
`;

const GOO_SPHERE_SHADER = `
const float det = .001;
vec3 ldir = vec3(2., .5, -.5);
float objid, objcol, coast;
const vec3 water_color = vec3(0., .4, .8);
const vec3 land_color1 = vec3(.6, 1., .5);
const vec3 land_color2 = vec3(.6, .2, .0);
const vec3 atmo_color = vec3(.4, .65, .9);
const vec3 cloud_color = vec3(1.3);

mat2 rot(float a) {
	float s = sin(a), c = cos(a);
    return mat2(c, s, -s, c);
}

float hash1(vec3 p){
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float kset(int it, vec3 p, vec3 q, float sc, float c) {
    p.xz *= rot(iTime * .2);
    p += q;
    p *= sc;
    float l = 0., l2 = 0.;
    for (int i = 0; i < it; i++) {
    	p = abs(p) / dot(p, p) - c;
		l += exp(-1. * abs(length(p) - l2));
	    l2 = length(p);
    }
    return l * .08;    
}

float clouds(vec3 p2, vec3 dir) {
		p2 -= .1 * dir;
    	p2.y *= 3.;
    	float cl1 = 0., cl2 = 0.;
        for (int i = 0; i < 15; i++) {
			p2 -= .05 * dir;
            cl1 += kset(20, p2, vec3(1.7, 3., .54), .3, .95);
            cl2 += kset(18, p2, vec3(1.2, 1.7, 1.4), .2, .85);
        }    
        cl1 = pow(cl1 * .045, 10.);
        cl2 = pow(cl2 * .055, 15.);
		return cl1 - cl2;
}

float de(vec3 p) {
    float surf1 = kset(6, p, vec3(.523, 1.547, .754), .2, .9);
    float surf2 = kset(8, p, vec3(.723, 1.247, .354), .2, .8) * .7;
    float surf3 = kset(10, p, vec3(1.723, .347, .754), .3, .6) * .5;
    objcol = pow(surf1 + surf2 + surf3, 5.);
	float land = length(p) - 3. - surf1 * .8 - surf2 * .1;
    float water = length(p) - 3.31;
    float d = min(land, water);
	objid = step(water, d) + step(land, d) * 2.;
	coast = max(0., .03 - abs(land - water)) / .03;
    // Half-dome clip: keep upper hemisphere, cut lower half with a plane.
    float planeY = 0.02;
    float domeClip = -(p.y + planeY);
    d = max(d, domeClip);
    return d * .8;
}

float de_clouds(vec3 p, vec3 dir) {
    return length(p)-clouds(p, dir)*.05;
}

vec3 normal(vec3 p) {
    vec3 eps = vec3(0., det, 0.);
	return normalize(vec3(de(p + eps.yxx), de(p + eps.xyx), de(p + eps.xxy)) - de(p));
}

vec3 normal_clouds(vec3 p, vec3 dir) {
    vec3 eps = vec3(0., .05, 0.);
	vec3 n = normalize(vec3(de_clouds(p + eps.yxx, dir), de_clouds(p + eps.xyx, dir), de_clouds(p + eps.xxy, dir)) - de_clouds(p, dir));
	return n;
}

float shadow(vec3 desde) {
    ldir=normalize(ldir);
    float td=.1,sh=1.,d;
    for (int i=0; i<10; i++) {
		vec3 p=desde+ldir*td;
        d=de(p);
        td+=d;
		sh=min(sh,20.*d/td);
		if (sh<.001) break;
    }
    return clamp(sh,0.,1.);
}

vec3 color(float id, vec3 p) {
	vec3 c = vec3(0.);
    float k = smoothstep(.0, .7, kset(9, p, vec3(.63, .7, .54), .1, .8));
    vec3 land = mix(land_color1, land_color2, k); 
    vec3 water = water_color * (objcol + .5) + coast * .7; 
	float polar = pow(min(1.,abs(p.y * .4 + k * .3 - .1)),10.);
    land = mix(land, vec3(1.), polar);
	water = mix(water, vec3(1.5), polar);
    c += water * step(abs(id - 1.), .1);
    c += land * step(abs(id - 2.), .1) * objcol * 3.;
    return c;
}

vec3 shade(vec3 p, vec3 dir, vec3 n, vec3 col, float id) {
	ldir = normalize(ldir);
    float amb = .05;
    float sh = shadow(p);
    float dif = max(0., dot(ldir, n)) * .7 * sh;
    vec3 ref = reflect(ldir, n) * sh;
    float spe = pow(max(0., dot(ref, dir)), 10.) * .5 * (.3+step(abs(id - 1.), .1));
    return (amb + dif) * col + spe;
}

vec3 march(vec3 from, vec3 dir) {
	float td=0., d, g = 0.;
    vec3 c = vec3(0.), p;
    for (int i = 0; i < 60; i++) {
    	p = from + dir * td;
        d = de(p);
        td += d;
        if (td > 50. || d < det) break;
		g += smoothstep(-4.,1.,p.x);
    }
    if (d < det) {
    	p -= det * dir * 2.;
        vec3 col = color(objid, p);
        vec3 n = normal(p);
        c = shade(p, dir, n, col, objid);
        float cl1 = clouds(p, dir);
		vec3 nc = normal_clouds(p, dir);
        c = mix(c, .1 + cloud_color * max(0., dot(normalize(ldir), nc)), clamp(cl1,0.,1.));
    }
    else
    {
      // Replace starfield fallback with crater field shading.
      float tGround = (-from.y) / max(-0.0001, dir.y);
      vec3 gp = from + dir * max(0.0, tGround);
      // Recenter/rescale crater to current camera framing.
      float r = length((gp.xz - vec2(0.0, 0.0)) * 0.23);
      float rim = smoothstep(6.4, 5.2, r) * (1.0 - smoothstep(5.2, 3.8, r));
      float bowl = smoothstep(4.2, 1.2, r);
      float rings = 0.5 + 0.5 * sin(r * 4.3 + iTime * 0.2);
      vec3 craterBase = vec3(0.16, 0.16, 0.16);
      vec3 craterRim = vec3(0.34, 0.34, 0.34) * rim;
      vec3 craterBowl = vec3(0.08, 0.08, 0.08) * bowl;
      vec3 craterStrata = vec3(0.06, 0.06, 0.06) * rings * smoothstep(7.2, 2.0, r);
      c += craterBase + craterRim + craterBowl + craterStrata;
    }
    g /= 60.;
    return c + (pow(g, 1.3) + pow(g,1.7) * .5) * atmo_color * .5;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - iResolution.xy * .5) / iResolution.y;
    // Move the dome a bit more down in frame.
    uv.y += 0.26;
    vec3 from = vec3(0., 0., -10.);
	vec3 dir = normalize(vec3(uv, 1.1));
    vec3 col = march(from, dir);
    col += 0.002 * (hash1(vec3(uv, 0.001*iTime)) - 0.5);
    fragColor = vec4(col*.85,1.0);
}
`;

const CRATER_DOME_SHADER = `
#define getNormal getNormalHex
#define raymarch enchancedRayMarcher
#define FAR 570.
#define INFINITY 1e32
#define FOG 1.
#define PI 3.14159265

float vol = 0.;
float noise = 0.;

float hash12(vec2 p) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}

float noise_3(in vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);	
	vec3 u = f*f*(3.0-2.0*f);
    vec2 ii = i.xy + i.z * vec2(5.0);
    float a = hash12( ii + vec2(0.0,0.0) );
	float b = hash12( ii + vec2(1.0,0.0) );    
    float c = hash12( ii + vec2(0.0,1.0) );
	float d = hash12( ii + vec2(1.0,1.0) ); 
    float v1 = mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
    ii += vec2(5.0);
    a = hash12( ii + vec2(0.0,0.0) );
	b = hash12( ii + vec2(1.0,0.0) );    
    c = hash12( ii + vec2(0.0,1.0) );
	d = hash12( ii + vec2(1.0,1.0) );
    float v2 = mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
    return max(mix(v1,v2,u.z),0.0);
}

float fbm(vec3 x){
    float r = 0.0;
    float w = 1.0, s = 1.0;
    for (int i=0; i<7; i++) {
        w *= 0.5;
        s *= 2.0;
        r += w * noise_3(s * x);
    }
    return r;
}

vec3 fromRGB(int r, int g, int b) { return vec3(float(r), float(g), float(b)) / 255.; }
vec3 light = vec3(0.0), lightDir = vec3(0.);
vec3 lightColour = normalize(vec3(1.8, 1.0, 0.3)); 
float saturate(float a) { return clamp(a, 0.0, 1.0); }

float smin( float a, float b, float k ){
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k ;
}

struct geometry {
    float dist;
    float materialIndex;
    float specular;
    float diffuse;
    vec3 space;
    vec3 color;
};

float fSphere(vec3 p, float r) { return length(p) - r; }

geometry scene(vec3 p) {
    geometry g;
    float localNoise = fbm(p / 10.) * 0.6;
    vec3 q = p;
    q.y -= localNoise * .08;
    float crater = q.y + 0.38;
    q.y *= 1.45;
    // Smaller crater field so the full form fits in the card view.
    crater = smin(crater, length(q) - 5.8, .2 + localNoise * .06);
    crater = max(crater, -length(q) + 7.6 + localNoise * .22);

    // Half-dome placed above crater floor and enlarged for readability.
    vec3 d = p - vec3(0.0, 1.95, 0.0);
    float dome = fSphere(d, 2.2);
    dome = max(dome, -(d.y + 0.04)); // lower hemisphere clipped

    if (dome < crater) {
      g.dist = dome * 0.8;
      g.materialIndex = 7.;
      g.space = d;
      g.color = vec3(0.96);
      g.diffuse = 0.02;
      g.specular = 14.0;
    } else {
      g.dist = crater * 0.8;
      g.materialIndex = 4.;
      g.space = q;
      g.color = vec3(0.22, 0.22, 0.22);
      g.diffuse = 0.;
      g.specular = 22.1;
    }
    return g;
}

const int MAX_ITERATIONS = 90;
geometry enchancedRayMarcher(vec3 o, vec3 d, int maxI) {
    geometry mp;
    float t_min = 0.001;
    // Start from camera; prior clamp could skip the dome volume.
    float tb = (-6.0-o.y)/d.y;
    if (tb > 0.0) t_min = tb;
    float omega = 1.3;
    float t = t_min;
    float candidate_error = INFINITY;
    float candidate_t = t_min;
    float previousRadius = 0.;
    float stepLength = 0.;
    float pixelRadius = 1. /350.;
    float functionSign = scene(o).dist < 0. ? -1. : +1.;
    for (int i = 0; i < MAX_ITERATIONS; ++i) {
        if (maxI > 0 && i > maxI) break; 
        mp = scene(d * t + o);
        float signedRadius = functionSign * mp.dist;
        float radius = abs(signedRadius);
        bool sorFail = omega > 1. && (radius + previousRadius) < stepLength;
        if (sorFail) { stepLength -= omega * stepLength; omega = 1.; }
        else { stepLength = signedRadius * omega * .8; }
        previousRadius = radius;
        float error = radius / t;
        if (!sorFail && error < candidate_error) { candidate_t = t; candidate_error = error; }
        if ((!sorFail && error < pixelRadius) || t > FAR) break;
        t += stepLength;
   	}
    mp.dist = candidate_t;
    if ((t > FAR || candidate_error > pixelRadius)) mp.dist = INFINITY;
    return mp;
}

float softShadow(vec3 ro, vec3 lp, float k) {
    const int maxIterationsShad = 125;
    vec3 rd = (lp - ro);
    float shade = 1.;
    float dist = 1.0;
    float end = max(length(rd), 0.01);
    float stepDist = end / float(maxIterationsShad);
    float tb = (8.0-ro.y)/normalize(rd).y; 
    if( tb>0.0 ) end = min( end, tb );
    rd /= end;
    for (int i = 0; i < maxIterationsShad; i++) {
        float h = scene(ro + rd * dist).dist;
        shade = min(shade, smoothstep(0.0, 1.0, k * h / dist)); 
        dist += min(h, stepDist * 2.); 
        if (h < 0.001 || dist > end) break;
    }
    return min(max(shade, 0.3), 1.0);
}

#define EPSILON .001
vec3 getNormalHex(vec3 pos) {
	float d0=scene(pos).dist;
	return normalize(vec3(scene(pos+vec3(EPSILON,0,0)).dist-d0, scene(pos+vec3(0,EPSILON,0)).dist-d0, scene(pos+vec3(0,0,EPSILON)).dist-d0));
}

float getAO(vec3 hitp, vec3 normal, float dist){
    vec3 spos = hitp + normal * dist;
    float sdist = scene(spos).dist;
    return clamp(sdist / dist, 0.4, 1.0);
}

vec3 Sky(in vec3 rd, vec3 ldir){
    float sunAmount = max(dot(rd, ldir), .1);
    float v = pow(1.2 - max(rd.y, .5), 1.1);
    vec3 sky = mix(fromRGB(255,200,100), vec3(1.1, 1.2, 1.3) / 10., v);
    sky += lightColour * sunAmount * sunAmount + lightColour * min(pow(sunAmount, 1e4),1233.);
    return clamp(sky, 0.0, 1.0);
}

vec3 doColor(vec3 sp, vec3 rd, vec3 sn, vec3 lp, geometry obj) {
    lp = sp + lp;
    vec3 ld = lp - sp;
    float lDist = max(length(ld / 2.), 0.001);
    ld /= lDist;
	float diff = max(dot(sn, ld), obj.diffuse);
    float spec = max(dot(reflect(-ld, sn), -rd), obj.specular / 2.);
	vec3 c = (obj.color * (diff + .15) * spec * 0.1);
    if (obj.materialIndex > 6.5) {
      c = max(c, vec3(0.72));
    }
    // Debug: red line at bottom cut of the half-dome.
    if (obj.materialIndex > 6.5) {
      float cutY = abs(obj.space.y + 0.04);
      float ringR = abs(length(obj.space.xz) - 2.6);
      float cutLine = 1.0 - smoothstep(0.0, 0.04, cutY);
      float rimLine = 1.0 - smoothstep(0.0, 0.08, ringR);
      float debugLine = cutLine * rimLine;
      c = mix(c, vec3(1.0, 0.0, 0.0), debugLine);
    }
	return c;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy - .5;
    uv.y *= 0.9;
    light = vec3(0., 9., 40.);
    lightDir = normalize(light);
    vec3 vuv = vec3(0., 1., 0.);
    // Pull camera in and down so crater + half-dome both fit.
    vec3 ro = vec3(12., 8.5, 22.);
    vec3 vrp = vec3(0., 1.4, 0.);
    vec3 vpn = normalize(vrp - ro);
    vec3 u = normalize(cross(vuv, vpn));
    vec3 v = cross(vpn, u);
    vec3 vcv = (ro + vpn);
    vec3 scrCoord = (vcv + uv.x * u * iResolution.x/iResolution.y + uv.y * v);
    vec3 rd = normalize(scrCoord - ro);
    geometry tr = raymarch(ro, rd, 0);    
    vec3 sceneColor;
    if (tr.dist < FAR) { 
      vec3 hit = ro + rd * tr.dist;
      vec3 sn = getNormal(hit);
      float sh = softShadow(hit, hit + light, 8.2);
      float ao = getAO(hit, sn, 10.2);
      sceneColor = doColor(hit, rd, sn, light, tr) * ao * sh;
      // Hard debug overlay: red line at dome cut rim (bypasses light attenuation).
      if (tr.materialIndex > 6.5) {
        vec3 domeLocal = hit - vec3(0.0, 1.65, 0.0);
        float cutY = abs(domeLocal.y + 0.04);
        float ringR = abs(length(domeLocal.xz) - 2.6);
        float cutLine = 1.0 - smoothstep(0.0, 0.06, cutY);
        float rimLine = 1.0 - smoothstep(0.0, 0.12, ringR);
        float debugLine = cutLine * rimLine;
        sceneColor = mix(sceneColor, vec3(1.0, 0.0, 0.0), debugLine);
      }
      sceneColor = mix(sceneColor, Sky(rd, lightDir), saturate(tr.dist * 3.0 / FAR));
    } else {
      // Crater background layer (replaces plain sky).
      // Project ray to a ground plane and draw a bowl/rim profile.
      float tGround = (-ro.y) / max(-0.0001, rd.y);
      vec3 gp = ro + rd * max(0.0, tGround);
      // Recenter/rescale crater to current camera framing.
      float r = length((gp.xz - vec2(0.0, 0.0)) * 0.9);
      float rim = smoothstep(2.4, 1.8, r) * (1.0 - smoothstep(1.8, 1.2, r));
      float bowl = smoothstep(1.45, 0.45, r);
      float rings = 0.5 + 0.5 * sin(r * 4.3 + iTime * 0.2);
      vec3 craterBase = vec3(0.16, 0.16, 0.16);
      vec3 craterRim = vec3(0.34, 0.34, 0.34) * rim;
      vec3 craterBowl = vec3(0.08, 0.08, 0.08) * bowl;
      vec3 craterStrata = vec3(0.06, 0.06, 0.06) * rings * smoothstep(2.1, 0.55, r);
      sceneColor = craterBase + craterRim + craterBowl + craterStrata;
      sceneColor = mix(sceneColor, Sky(rd, lightDir), 0.22);
    }
    fragColor = vec4(clamp(sceneColor * 1.28 * (1. - length(uv) / 4.0), 0.0, 1.0), 1.0);
    fragColor = pow(fragColor, 1./vec4(1.2));
}
`;

const compileGlShader = (gl, type, source) => {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
};

const createShaderToyRunner = (canvas, shaderSpec) => {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    premultipliedAlpha: false,
    powerPreference: 'default',
  });
  if (!gl) {
    console.warn('WebGL2 is not available; shader interlude will be empty.');
    return null;
  }

  const vsSrc = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;
  const vs = compileGlShader(gl, gl.VERTEX_SHADER, vsSrc);
  if (!vs) return null;

  const buildProgram = (body) => {
    const fsSrc = `${SHADERTOY_PRELUDE}\n${body}\n${SHADERTOY_EPILOGUE}`;
    const fs = compileGlShader(gl, gl.FRAGMENT_SHADER, fsSrc);
    if (!fs) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, 'aPos');
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(fs);
      return null;
    }
    return {
      program,
      fs,
      uResolution: gl.getUniformLocation(program, 'iResolution'),
      uTime: gl.getUniformLocation(program, 'iTime'),
      uTimeDelta: gl.getUniformLocation(program, 'iTimeDelta'),
      uFrame: gl.getUniformLocation(program, 'iFrame'),
      uMouse: gl.getUniformLocation(program, 'iMouse'),
      uChan0: gl.getUniformLocation(program, 'iChannel0'),
      uChan1: gl.getUniformLocation(program, 'iChannel1'),
      uChan2: gl.getUniformLocation(program, 'iChannel2'),
      uChan3: gl.getUniformLocation(program, 'iChannel3'),
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
  };

  const isMultipass = typeof shaderSpec === 'object' && shaderSpec !== null;
  const passA = buildProgram(isMultipass ? shaderSpec.bufferA : shaderSpec);
  if (!passA) {
    gl.deleteShader(vs);
    return null;
  }
  const passB = isMultipass ? buildProgram(shaderSpec.bufferB) : null;
  const passImage = isMultipass ? buildProgram(shaderSpec.image) : null;
  if (isMultipass && (!passB || !passImage)) {
    if (passB) { gl.deleteProgram(passB.program); gl.deleteShader(passB.fs); }
    if (passImage) { gl.deleteProgram(passImage.program); gl.deleteShader(passImage.fs); }
    gl.deleteProgram(passA.program);
    gl.deleteShader(passA.fs);
    gl.deleteShader(vs);
    return null;
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  // Fallback channel textures for ShaderToy shaders that sample iChannel*
  // (fur ball uses iChannel0 and iChannel1).
  const buildTexture = (data, w, h) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    return tex;
  };

  const makeFurNoiseTexture = (size = 256) => {
    const data = new Uint8Array(size * size * 4);
    const cell = 8;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        // Coarse deterministic value noise (big cells) for chunkier strands.
        const cx = Math.floor(x / cell);
        const cy = Math.floor(y / cell);
        const n = Math.sin((cx * 12.9898 + cy * 78.233) * 0.125) * 43758.5453;
        const r = n - Math.floor(n);
        // X drives strand density; Y drives strand length.
        const density = Math.floor(Math.max(0, Math.min(1, r * 0.86 + 0.18)) * 255);
        const lenWave = 0.5 + 0.5 * Math.sin((cx * 0.8) + (cy * 0.55));
        const length = Math.floor(Math.max(0, Math.min(1, 0.42 + lenWave * 0.48)) * 255);
        data[idx + 0] = density;
        data[idx + 1] = length;
        data[idx + 2] = density;
        data[idx + 3] = 255;
      }
    }
    return { data, size };
  };

  const makeFurColorTexture = (size = 256) => {
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        const u = x / (size - 1);
        const v = y / (size - 1);
        const grain = 0.92 + 0.08 * Math.sin((x * 0.09) + (y * 0.13));
        // Neutral fur palette (works with your grayscale deck treatment too).
        const base = 70 + 140 * (0.35 * u + 0.65 * v);
        const c = Math.floor(Math.max(0, Math.min(255, base * grain)));
        data[idx + 0] = c;
        data[idx + 1] = c;
        data[idx + 2] = c;
        data[idx + 3] = 255;
      }
    }
    return { data, size };
  };

  const makeSolidTexture = (r, g, b, a = 255) => {
    const data = new Uint8Array([r, g, b, a, r, g, b, a, r, g, b, a, r, g, b, a]);
    return { data, size: 2 };
  };

  const furNoise = makeFurNoiseTexture(256);
  const furColor = makeFurColorTexture(256);
  const solidWhite = makeSolidTexture(255, 255, 255, 255);

  const tex0 = buildTexture(furNoise.data, furNoise.size, furNoise.size);
  const tex1 = buildTexture(furColor.data, furColor.size, furColor.size);
  const tex2 = buildTexture(solidWhite.data, solidWhite.size, solidWhite.size);
  const tex3 = buildTexture(solidWhite.data, solidWhite.size, solidWhite.size);

  const createTarget = () => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const fbo = gl.createFramebuffer();
    return { tex, fbo };
  };
  const rtA = isMultipass ? createTarget() : null;
  const rtB = isMultipass ? createTarget() : null;

  let lastKey = '';

  const resize = (opts = {}) => {
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(1, Math.floor(rect.width));
    const cssH = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const posScale = typeof opts.posScale === 'number' ? opts.posScale : 1;
    const quality = typeof opts.quality === 'number' ? opts.quality : 1;
    const rw = Math.max(1, Math.floor(cssW * dpr * posScale * quality));
    const rh = Math.max(1, Math.floor(cssH * dpr * posScale * quality));
    const k = `${rw}x${rh}`;
    if (k === lastKey) return;
    lastKey = k;
    canvas.width = rw;
    canvas.height = rh;
    gl.viewport(0, 0, rw, rh);
    if (isMultipass) {
      const alloc = (rt) => {
        gl.bindTexture(gl.TEXTURE_2D, rt.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rw, rh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, rt.fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rt.tex, 0);
      };
      alloc(rtA);
      alloc(rtB);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  };

  const bindAndUniform = (pass, tSec, dtSec, frame, mouse, chan0Override = null) => {
    gl.useProgram(pass.program);
    gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, chan0Override || tex0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tex1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, tex2);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, tex3);
    if (pass.uResolution) gl.uniform3f(pass.uResolution, canvas.width, canvas.height, 1.0);
    if (pass.uTime) gl.uniform1f(pass.uTime, tSec);
    if (pass.uTimeDelta) gl.uniform1f(pass.uTimeDelta, dtSec);
    if (pass.uFrame) gl.uniform1i(pass.uFrame, frame);
    if (pass.uChan0) gl.uniform1i(pass.uChan0, 0);
    if (pass.uChan1) gl.uniform1i(pass.uChan1, 1);
    if (pass.uChan2) gl.uniform1i(pass.uChan2, 2);
    if (pass.uChan3) gl.uniform1i(pass.uChan3, 3);
    if (pass.uShapeProfile) gl.uniform4f(pass.uShapeProfile, 0.5, 0.5, 0.5, 0.5);
    if (pass.uNoiseAmount) gl.uniform1f(pass.uNoiseAmount, 0.1);
    if (pass.uCutDepth) gl.uniform1f(pass.uCutDepth, 0.8);
    if (pass.uMorphSeed) gl.uniform1f(pass.uMorphSeed, 0.3);
    if (pass.uStoneTint) gl.uniform3f(pass.uStoneTint, 1.0, 1.0, 1.0);
    if (pass.uStoneType) gl.uniform1f(pass.uStoneType, 0.2);
    if (pass.uGrainScale) gl.uniform1f(pass.uGrainScale, 6.0);
    if (pass.uGrainContrast) gl.uniform1f(pass.uGrainContrast, 0.2);
    if (pass.uVeinAmount) gl.uniform1f(pass.uVeinAmount, 0.08);
    if (pass.uFractureAmount) gl.uniform1f(pass.uFractureAmount, 0.2);
    if (pass.uGlossiness) gl.uniform1f(pass.uGlossiness, 0.4);
    if (pass.uScatter) gl.uniform1f(pass.uScatter, 0.1);
    if (pass.uMouse) {
      const mx = mouse[0];
      const my = mouse[1];
      const mz = mouse[2];
      const mw = mouse[3];
      gl.uniform4f(pass.uMouse, mx, my, mz, mw);
    }
  };

  const render = (tSec, dtSec, frame, mouse) => {
    if (!isMultipass) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      bindAndUniform(passA, tSec, dtSec, frame, mouse);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, rtA.fbo);
    bindAndUniform(passA, tSec, dtSec, frame, mouse);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, rtB.fbo);
    bindAndUniform(passB, tSec, dtSec, frame, mouse, rtA.tex);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    bindAndUniform(passImage, tSec, dtSec, frame, mouse, rtB.tex);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const dispose = () => {
    gl.deleteBuffer(buf);
    gl.deleteVertexArray(vao);
    gl.deleteTexture(tex0);
    gl.deleteTexture(tex1);
    gl.deleteTexture(tex2);
    gl.deleteTexture(tex3);
    if (isMultipass) {
      gl.deleteFramebuffer(rtA.fbo);
      gl.deleteTexture(rtA.tex);
      gl.deleteFramebuffer(rtB.fbo);
      gl.deleteTexture(rtB.tex);
      gl.deleteProgram(passB.program);
      gl.deleteShader(passB.fs);
      gl.deleteProgram(passImage.program);
      gl.deleteShader(passImage.fs);
    }
    gl.deleteProgram(passA.program);
    gl.deleteShader(passA.fs);
    gl.deleteShader(vs);
  };

  return { gl, resize, render, dispose };
};

const isShaderDeckMobile = () => window.matchMedia('(max-width: 1024px)').matches;

const initSingleShaderDeck = (section) => {
  if (!section) return null;
  if (!section.classList.contains('shader-deck-section')) return null;
  const cards = Array.from(section.querySelectorAll('.shader-card'));
  const entries = cards
    .map((card) => {
      const canvas = card.querySelector('.shader-canvas');
      const key = card.getAttribute('data-shader');
      let body = key ? SHADER_SOURCES[key] : null;
      if (key === 'ldyXRw') body = CRATER_DOME_SHADER;
      if (!canvas || !body) return null;
      const runner = createShaderToyRunner(canvas, body);
      if (!runner) return null;
      return { card, canvas, key, runner, lastDrawMs: 0 };
    })
    .filter(Boolean);
  if (entries.length === 0) return null;

  // Unify monochrome family with per-shader value balancing.
  const monochromeFilterByShader = {
    // Section 2 deck
    sec2_goo: 'grayscale(1) contrast(1.12) brightness(0.90)',
    sec2_rock: 'grayscale(1) contrast(1.08) brightness(0.94)',
    ftcyzn: 'grayscale(1) contrast(1.10) brightness(0.92)',
    ldSSzV: 'grayscale(1) contrast(1.06) brightness(0.96)',
    ldyXRw: 'grayscale(1) contrast(1.06) brightness(0.96)',
    // Section 4 deck
    s4a: 'grayscale(1) contrast(1.16) brightness(0.90)',
    s4b: 'grayscale(1) contrast(1.14) brightness(0.92)',
    // Keep shader A/B in color for Section 4.
    s4c: 'none',
    s4f: 'none',
  };

  entries.forEach((entry) => {
    entry.canvas.style.filter =
      monochromeFilterByShader[entry.key] || 'grayscale(1) contrast(1.08) brightness(0.94)';
  });

  const order = cards.map((_, i) => i);
  const applyOrder = () => {
    order.forEach((ci, pos) => {
      cards[ci].setAttribute('data-pos', String(pos));
    });
  };
  applyOrder();

  const perf = { quality: 1, fpsCap: RENDER_POLICY.shaderFpsFocused, sampleMs: [] };

  const getPosScale = (card) => {
    if (!isShaderDeckMobile()) return 1;
    // Mobile now stacks cards; keep full resolution for every visible shader.
    return 1;
  };

  const resizeAll = () => {
    entries.forEach((e) => {
      e.runner.resize({ posScale: getPosScale(e.card), quality: perf.quality });
    });
  };

  const iMouse = [0, 0, 0, 0];
  const updateMouseFromEvent = (clientX, clientY, isDown) => {
    const byZ = [...entries].sort(
      (a, b) => (parseInt(getComputedStyle(b.card).zIndex, 10) || 0) - (parseInt(getComputedStyle(a.card).zIndex, 10) || 0),
    );
    for (const e of byZ) {
      const r = e.canvas.getBoundingClientRect();
      if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) continue;
      iMouse[0] = clientX - r.left;
      iMouse[1] = r.height - (clientY - r.top);
      iMouse[2] = isDown ? 1 : 0;
      return;
    }
  };
  const onDown = (ev) => updateMouseFromEvent(ev.clientX, ev.clientY, true);
  const onUp = (ev) => { updateMouseFromEvent(ev.clientX, ev.clientY, false); iMouse[2] = 0; iMouse[3] = 0; };
  const onMove = (ev) => {
    if (ev.buttons) updateMouseFromEvent(ev.clientX, ev.clientY, true);
  };
  section.addEventListener('pointerdown', onDown, { passive: true });
  section.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  section.addEventListener('pointermove', onMove, { passive: true });

  const markAllPreviewsDirty = () => {
    entries.forEach((e) => {
      e.previewDirty = true;
    });
  };
  markAllPreviewsDirty();

  const sectionTracker = createSectionVisibilityTracker(section, 0.15);
  let visible = sectionTracker.isVisible();
  let pageActive = pageLifecycle.isActive();
  const sectionLabel = section.id ? `shaderDeck:${section.id}` : 'shaderDeck:unknown';
  const debug = createDebugModuleProbe(sectionLabel);
  debug?.set({ running: false, visible, renderState: 'init' });

  const ro = new ResizeObserver(resizeAll);
  cards.forEach((c) => ro.observe(c));
  const onWin = () => {
    resizeAll();
    markAllPreviewsDirty();
  };
  window.addEventListener('resize', onWin, { passive: true });

  let raf = 0;
  let tStart = performance.now();
  let lastT = tStart;
  let iFrame = 0;
  let lastFocusedDrawMs = 0;
  let lastFrameSec = 0;
  let perfLevel = Math.max(0, Math.min(3, RUNTIME_QUALITY_MEMORY.shaderPerfLevel || 0));

  const perfLevels = [
    { quality: 1, fps: RENDER_POLICY.shaderFpsFocused },
    { quality: 0.9, fps: 18 },
    { quality: 0.78, fps: 12 },
    { quality: 0.55, fps: 8 },
  ];

  const applyPerfLevel = () => {
    const level = perfLevels[perfLevel] || perfLevels[0];
    const prevQuality = perf.quality;
    perf.quality = level.quality;
    perf.fpsCap = level.fps;
    if (prevQuality !== perf.quality) resizeAll();
  };
  applyPerfLevel();

  const getTopCard = () => cards[order[0]];
  const getTopEntry = () => {
    const topCard = getTopCard();
    return entries.find((e) => e.card === topCard) || null;
  };
  // Mobile now uses a vertical stack, so animate all visible cards like desktop.
  const shouldAnimateAllVisible = () => true;

  const setActiveRenderCardClass = () => {
    if (!isShaderDeckMobile()) {
      cards.forEach((card) => card.classList.remove('is-active-render'));
      return;
    }
    const topCard = getTopCard();
    cards.forEach((card) => {
      if (card === topCard) card.classList.add('is-active-render');
      else card.classList.remove('is-active-render');
    });
  };
  setActiveRenderCardClass();

  const drawEntry = (entry, tSec, dtSec) => {
    entry.runner.render(tSec, dtSec, iFrame, iMouse);
    iFrame += 1;
  };

  const maybeRetunePerformance = (fpsCap) => {
    if (perf.sampleMs.length < 40) return;
    const avg = perf.sampleMs.reduce((a, b) => a + b, 0) / perf.sampleMs.length;
    const budgetMs = 1000 / Math.max(1, fpsCap);
    const droppedFrameRatio = perf.sampleMs.filter((n) => n > budgetMs * 0.95).length / perf.sampleMs.length;
    perf.sampleMs.length = 0;
    if ((avg > budgetMs * 0.78 || droppedFrameRatio > 0.42) && perfLevel < perfLevels.length - 1) {
      perfLevel += 1;
      RUNTIME_QUALITY_MEMORY.shaderPerfLevel = perfLevel;
      applyPerfLevel();
      markAllPreviewsDirty();
      return;
    }
    if (avg < budgetMs * 0.42 && droppedFrameRatio < 0.12 && perfLevel > 0) {
      perfLevel -= 1;
      RUNTIME_QUALITY_MEMORY.shaderPerfLevel = perfLevel;
      applyPerfLevel();
      markAllPreviewsDirty();
    }
  };

  const getSectionRenderState = () =>
    resolveRenderState({
      reducedMotion: prefersReducedMotion,
      sectionVisible: visible,
      isFocusedSurface: true,
    });

  const stopLoop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      debug?.set({ running: false });
    }
  };
  const ensureLoop = () => {
    if (prefersReducedMotion || !visible || !pageActive) return;
    if (!raf) {
      raf = requestAnimationFrame(tick);
      debug?.set({ running: true });
    }
  };
  const resetTimelineState = () => {
    tStart = performance.now();
    lastT = tStart;
    iFrame = 0;
    lastFocusedDrawMs = 0;
    lastFrameSec = 0;
    perf.sampleMs.length = 0;
    entries.forEach((e) => {
      e.lastDrawMs = 0;
      e.previewDirty = true;
    });
  };
  let hiddenAtMs = 0;

  const tick = (now) => {
    raf = 0;
    if (prefersReducedMotion || !visible || !pageActive) return;
    raf = requestAnimationFrame(tick);

    const state = getSectionRenderState();
    debug?.set({ renderState: state, visible, running: true });
    if (state === RenderState.OFFSCREEN) return;

    const tSec = (now - tStart) * 0.001;
    const dtSec = Math.max(0, (now - lastT) * 0.001);
    lastT = now;
    const focusedFps = perf.fpsCap || RENDER_POLICY.shaderFpsFocused;
    const focusedFrameDuration = 1000 / focusedFps;

    const t0 = performance.now();
    let drewFocused = false;
    const animateAll = shouldAnimateAllVisible();
    const topEntry = animateAll ? null : getTopEntry();
    const primaryCard = getTopCard();
    const topState = resolveRenderState({
      reducedMotion: prefersReducedMotion,
      sectionVisible: visible,
      isFocusedSurface: true,
    });
    if (topState !== RenderState.OFFSCREEN && now - lastFocusedDrawMs >= focusedFrameDuration) {
      if (animateAll) {
        let desktopDrawCount = 0;
        entries.forEach((e) => {
          const isPrimary = e.card === primaryCard;
          // Desktop: keep all cards animated, but render non-primary cards a bit slower.
          const targetFps = isPrimary ? focusedFps : Math.max(1, focusedFps * 0.78);
          const frameDuration = 1000 / targetFps;
          if (now - e.lastDrawMs < frameDuration) return;
          drawEntry(e, tSec, dtSec);
          e.lastDrawMs = now;
          e.previewDirty = false;
          desktopDrawCount += 1;
        });
        drewFocused = desktopDrawCount > 0;
      } else if (topEntry) {
        drawEntry(topEntry, tSec, dtSec);
        topEntry.lastDrawMs = now;
        topEntry.previewDirty = false;
        drewFocused = true;
      }
      lastFocusedDrawMs = now;
      lastFrameSec = tSec;
    }

    if (!animateAll) {
      entries.forEach((e) => {
        if (e === topEntry) return;
        const cardState = resolveRenderState({
          reducedMotion: prefersReducedMotion,
          sectionVisible: visible,
          isFocusedSurface: false,
        });
        if (cardState === RenderState.OFFSCREEN || !e.previewDirty) return;
        drawEntry(e, lastFrameSec || tSec, 0);
        e.previewDirty = false;
      });
    }

    const blockMs = performance.now() - t0;
    if (drewFocused) {
      perf.sampleMs.push(blockMs);
      if (perf.sampleMs.length > 50) perf.sampleMs.shift();
      maybeRetunePerformance(perf.fpsCap || RENDER_POLICY.shaderFpsFocused);
    }
    debug?.frame();
  };

  const unsubscribeSectionVisibility = sectionTracker.subscribe((isVisible) => {
    visible = isVisible;
    debug?.set({ visible });
    if (visible) {
      const hiddenDurationMs = hiddenAtMs ? performance.now() - hiddenAtMs : 0;
      hiddenAtMs = 0;
      if (hiddenDurationMs >= OUT_OF_VIEW_RESET_DELAY_MS) resetTimelineState();
      markAllPreviewsDirty();
      ensureLoop();
      return;
    }
    stopLoop();
    if (!hiddenAtMs) hiddenAtMs = performance.now();
  });

  const drawStaticPreviewSet = () => {
    const t = 2;
    entries.forEach((e) => {
      drawEntry(e, t, 0);
      e.previewDirty = false;
    });
  };

  if (prefersReducedMotion) {
    resizeAll();
    drawStaticPreviewSet();
  } else {
    resizeAll();
    ensureLoop();
  }

  const cycle = () => {
    if (!isShaderDeckMobile()) return;
    const topI = order[0];
    const top = cards[topI];
    if (prefersReducedMotion) {
      order.push(order.shift());
      applyOrder();
      setActiveRenderCardClass();
      resizeAll();
      markAllPreviewsDirty();
      drawStaticPreviewSet();
      return;
    }
    top.classList.add('is-leaving');
    window.setTimeout(() => {
      top.classList.remove('is-leaving');
      order.push(order.shift());
      applyOrder();
      setActiveRenderCardClass();
      resizeAll();
      markAllPreviewsDirty();
      ensureLoop();
    }, 360);
  };

  const onCardClick = (ev) => {
    if (!isShaderDeckMobile()) return;
    const idx = cards.indexOf(ev.currentTarget);
    if (order[0] === idx) cycle();
  };
  cards.forEach((c) => c.addEventListener('click', onCardClick));

  const onCardKey = (ev) => {
    if (!isShaderDeckMobile() || (ev.key !== 'Enter' && ev.key !== ' ')) return;
    const idx = cards.indexOf(ev.currentTarget);
    if (order[0] === idx) {
      ev.preventDefault();
      cycle();
    }
  };
  cards.forEach((c) => c.addEventListener('keydown', onCardKey));

  const unsubscribeLifecycle = pageLifecycle.subscribe(({ isActive }) => {
    pageActive = isActive;
    if (!pageActive) {
      stopLoop();
      return;
    }
    markAllPreviewsDirty();
    if (prefersReducedMotion) {
      drawStaticPreviewSet();
      return;
    }
    ensureLoop();
  });

  return () => {
    unsubscribeSectionVisibility();
    sectionTracker.dispose();
    unsubscribeLifecycle();
    stopLoop();
    ro.disconnect();
    window.removeEventListener('resize', onWin);
    window.removeEventListener('pointerup', onUp);
    section.removeEventListener('pointerdown', onDown);
    section.removeEventListener('pointerup', onUp);
    section.removeEventListener('pointermove', onMove);
    cards.forEach((c) => {
      c.removeEventListener('click', onCardClick);
      c.removeEventListener('keydown', onCardKey);
    });
    entries.forEach((e) => e.runner.dispose());
    debug?.set({ running: false, renderState: 'disposed' });
  };
};

const initShaderDeck = () => {
  const sections = Array.from(document.querySelectorAll('.shader-deck-section'));
  if (sections.length === 0) return null;
  const cleanups = sections.map((section) => initSingleShaderDeck(section)).filter(Boolean);
  if (cleanups.length === 0) return null;
  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
};

const initChapterFlow = () => {
  if (window.matchMedia('(max-width: 1024px)').matches) return null;
  const container = document.querySelector('.chapter-main');
  const sections = Array.from(document.querySelectorAll('.chapter-observe'));
  if (!container || sections.length === 0) return null;

  const applyInitialVisibility = () => {
    let anyVisible = false;
    sections.forEach((section) => {
      if (computeVisibilityRatio(section) >= 0.12) {
        section.classList.add('in-view');
        anyVisible = true;
      }
    });
    if (!anyVisible && sections[0]) sections[0].classList.add('in-view');
  };
  applyInitialVisibility();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    {
      threshold: 0.55,
    },
  );

  sections.forEach((section) => observer.observe(section));
  const initialVisibilityTick = requestAnimationFrame(applyInitialVisibility);

  // Match the smoother original behavior: let native scrolling + CSS snap
  // handle wheel/trackpad momentum. Keep JS only for keyboard step navigation.
  const jumpTo = (next) => {
    if (next < 0 || next >= sections.length) return;
    sections[next].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getCurrentIndex = () => {
    const top = container.getBoundingClientRect().top;
    let best = 0;
    let bestDist = Infinity;
    sections.forEach((s, i) => {
      const d = Math.abs(s.getBoundingClientRect().top - top);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };

  const onKey = (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const current = getCurrentIndex();
    const delta = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
    const next = Math.max(0, Math.min(sections.length - 1, current + delta));
    if (next === current) return;
    jumpTo(next);
  };

  window.addEventListener('keydown', onKey);

  return () => {
    cancelAnimationFrame(initialVisibilityTick);
    observer.disconnect();
    window.removeEventListener('keydown', onKey);
  };
};

const createAppRuntimeController = () => {
  let cleanups = [];
  let started = false;
  let destroyed = false;

  const wake = () => {
    // Kick geometry/observer-driven loops after restores and tab refocus.
    window.dispatchEvent(new Event('resize'));
  };

  const start = () => {
    if (started || destroyed) return;
    debugOverlay?.setApp({ phase: 'starting' });
    cleanups = [
      initChapterOneArtwork(),
      initChapterTwoArtwork(),
      initChapterThreeArtwork(),
      initChapterFourTreeArtwork(),
      initShaderDeck(),
      initChapterFlow(),
    ].filter(Boolean);
    started = true;
    debugOverlay?.setApp({ phase: 'running' });
    wake();
  };

  const pause = () => {
    if (!started || destroyed) return;
    // Module-level lifecycle subscribers already handle pause/resume.
    debugOverlay?.setApp({ phase: 'paused' });
  };

  const resume = () => {
    if (destroyed) return;
    if (!started) {
      start();
      return;
    }
    debugOverlay?.setApp({ phase: 'running' });
    wake();
  };

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    debugOverlay?.setApp({ phase: 'destroyed' });
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pageshow', onPageShow);
    window.removeEventListener('pagehide', onPageHide);
    cleanups.forEach((cleanup) => cleanup());
    cleanups = [];
    pageLifecycle.dispose();
    delete window.__malAppRuntime;
  };

  const onVisibility = () => {
    if (document.visibilityState === 'visible') resume();
    else pause();
  };

  const onPageShow = () => resume();
  const onPageHide = (event) => {
    // Keep controller alive for bfcache history restores.
    if (event.persisted) return;
    destroy();
  };

  document.addEventListener('visibilitychange', onVisibility, { passive: true });
  window.addEventListener('pageshow', onPageShow, { passive: true });
  window.addEventListener('pagehide', onPageHide, { passive: true });

  return { start, pause, resume, destroy };
};

if (window.__malAppRuntime && typeof window.__malAppRuntime.resume === 'function') {
  window.__malAppRuntime.resume();
} else {
  window.__malAppRuntime = createAppRuntimeController();
  window.__malAppRuntime.start();
}
