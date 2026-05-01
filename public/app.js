import { SHADER_SOURCES } from './shader-deck-shaders.js';

/** Slow oscillation between two RGB triplets from CSS (`r, g, b` comma strings). */
const MODULE_DRIFT_SPEED = 0.0001;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      return;
    }
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
  const edgeStart = width * 0.26;
  const edgeEnd = width * 0.37;
  const field = new Float32Array(rows * cols);
  const buffer = document.createElement('canvas');
  buffer.width = width;
  buffer.height = height;
  const bctx = buffer.getContext('2d', { alpha: true });
  if (!bctx) return null;

  const sources = [{ x: width / 2, y: height / 2, wl: 60, phase: 0, amp: 1.15 }];
  const n = 6;
  const radius = 95;
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2;
    sources.push({
      x: width / 2 + Math.cos(a) * radius,
      y: height / 2 + Math.sin(a) * radius,
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
    const deltaMs = lastTs > 0 ? ts - lastTs : frameDuration;
    lastTs = ts;

    bctx.clearRect(0, 0, width, height);

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
          const falloff = Math.max(0, 1 - dist / 260);
          amp += s.amp * falloff * Math.sin((dist / s.wl - time) * Math.PI * 2 + s.phase);
        }
        // Edgeless approach: taper field energy near boundaries.
        const dxCenter = x - centerX;
        const dyCenter = y - centerY;
        const radial = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
        const t = Math.min(1, Math.max(0, (radial - edgeStart) / (edgeEnd - edgeStart)));
        const envelope = 1 - t * t * (3 - 2 * t);
        field[i * cols + j] = amp * envelope;
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
    time += 0.000625;
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
      return;
    }
    if (prefersReducedMotion) {
      animate(performance.now());
      return;
    }
    ensureLoop();
  });

  if (prefersReducedMotion) animate();
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

const initChapterTwoArtwork = () => {
  const canvas = document.getElementById('metamorphosis-canvas');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const section = canvas.closest('.chapter-observe');
  const visibilityNode = resolveVisibilityNode(section, canvas);
  const sectionTracker = createSectionVisibilityTracker(visibilityNode, 0.2);
  let pageActive = pageLifecycle.isActive();
  const debug = createDebugModuleProbe('chapter2');
  debug?.set({ running: false, visible: sectionTracker.isVisible(), renderState: 'init' });
  const rootStyles = getComputedStyle(document.documentElement);
  const strokeRgb = parseRgbTriplet(rootStyles.getPropertyValue('--mono-800').trim(), [26, 26, 26]);
  const midRgb = parseRgbTriplet(rootStyles.getPropertyValue('--mono-600').trim(), [64, 64, 64]);
  const lightRgb = parseRgbTriplet(rootStyles.getPropertyValue('--mono-400').trim(), [140, 140, 140]);

  canvas.width = 550;
  canvas.height = 550;

  const width = canvas.width;
  const height = canvas.height;
  const phi = (1 + Math.sqrt(5)) / 2;
  let raf = 0;
  let time = 0;
  let lastTs = 0;
  const isActuallyVisible = () => {
    const node = visibilityNode || canvas;
    const rect = node.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };
  const isSectionVisible = () => sectionTracker.isVisible() || isActuallyVisible();

  const animate = (ts = 0) => {
    const sectionVisible = isSectionVisible();
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
    const deltaMs = lastTs > 0 ? ts - lastTs : frameDuration;
    lastTs = ts;

    const now = performance.now();
    // Start blank, then quickly build up visible spiral boxes.
    const maxRectangles = Math.max(0, Math.min(60, Math.floor(time * 0.035 - 2.0)));

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);

    let rectWidth = 300;
    let rectHeight = rectWidth / phi;
    let scale = 1;
    const angle = time * 0.00025;

    for (let i = 0; i < maxRectangles; i += 1) {
      ctx.save();

      const spiralAngle = i * 0.174533;
      const radius = scale * 100;
      const x = Math.cos(spiralAngle) * radius;
      const y = Math.sin(spiralAngle) * radius;

      ctx.translate(x, y);
      ctx.rotate(spiralAngle + angle);

      const alpha = Math.max(0, 0.5 - i * 0.01);
      const paletteWave = (Math.sin(now * MODULE_DRIFT_SPEED + i * 0.13) + 1) * 0.5;
      let rgb = strokeRgb;
      if (paletteWave > 0.66) rgb = midRgb;
      else if (paletteWave > 0.33) rgb = lightRgb;
      ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);

      if (i % 3 === 0) {
        ctx.beginPath();
        ctx.moveTo(-rectWidth / 2, -rectHeight / 2);
        ctx.lineTo(rectWidth / 2, rectHeight / 2);
        ctx.moveTo(rectWidth / 2, -rectHeight / 2);
        ctx.lineTo(-rectWidth / 2, rectHeight / 2);
        ctx.strokeStyle = `rgba(${lightRgb[0]}, ${lightRgb[1]}, ${lightRgb[2]}, ${alpha * 0.28})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      ctx.restore();

      rectWidth *= 0.95;
      rectHeight *= 0.95;
      scale *= 0.98;
    }

    ctx.beginPath();
    for (let i = 0; i <= maxRectangles; i += 1) {
      const spiralAngle = i * 0.174533;
      const radius = Math.pow(0.98, i) * 100;
      const x = Math.cos(spiralAngle) * radius;
      const y = Math.sin(spiralAngle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${midRgb[0]}, ${midRgb[1]}, ${midRgb[2]}, 0.28)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

    // Very slow stop-motion-like chapter-2 progression.
    time += deltaMs * 0.035;
    debug?.frame();
  };

  const tick = (ts = 0) => {
    raf = 0;
    animate(ts);
    if (!prefersReducedMotion && pageActive && isSectionVisible()) raf = requestAnimationFrame(tick);
  };
  const ensureLoop = () => {
    if (prefersReducedMotion || !pageActive || !isSectionVisible()) return;
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
      animate(performance.now());
      return;
    }
    ensureLoop();
  });
  const unsubscribeVisibility = sectionTracker.subscribe((isVisible) => {
    debug?.set({ visible: isVisible });
    if (!isVisible) {
      stopLoop();
      return;
    }
    if (prefersReducedMotion) {
      animate(performance.now());
      return;
    }
    ensureLoop();
  });

  if (prefersReducedMotion) animate();
  else ensureLoop();

  return () => {
    unsubscribeVisibility();
    unsubscribeLifecycle();
    stopLoop();
    sectionTracker.dispose();
    ctx.clearRect(0, 0, width, height);
    debug?.set({ running: false, renderState: 'disposed' });
  };
};

const initChapterThreeArtwork = () => initCrumblingArtwork('chapter-3-canvas');

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
    const p = card.getAttribute('data-pos');
    if (p === '1' || p === '2') return 0.6;
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
  const tStart = performance.now();
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
  const shouldAnimateAllVisible = () => !isShaderDeckMobile();

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
      markAllPreviewsDirty();
      ensureLoop();
      return;
    }
    stopLoop();
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
