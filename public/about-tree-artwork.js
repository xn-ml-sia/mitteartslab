/** About page L-system tree canvas — extracted from app.js for smaller About payload. */

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
    'font:12px/1.4 "IBM Plex Mono",monospace',
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

const initAboutTreeArtwork = () => {
  const canvas = document.getElementById('about-tree-canvas');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;
  const section = canvas.closest('[data-about-section]');
  const visibilityNode = resolveVisibilityNode(section, canvas);
  const sectionTracker = createSectionVisibilityTracker(visibilityNode, 0.2);
  const debug = createDebugModuleProbe('aboutTree');
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
    const bottomAlign = window.matchMedia('(max-width: 1024px)').matches;
    const mobilePad = bottomAlign ? 8 : pad;
    const baseScale = bottomAlign
      ? (cw - 2 * mobilePad) / bw
      : Math.min((cw - 2 * pad) / bw, (ch - 2 * pad) / bh);
    const breathing = prefersReducedMotion || isTransitioning ? 1 : (1 + Math.sin(drawTime * 0.35) * 0.012);
    const scale = baseScale * breathing;
    const tx = bottomAlign
      ? cw - mobilePad - (CH4_REF_W / 2) * scale
      : pad + (cw - 2 * pad - bw * scale) / 2 - b.minX * scale;
    const ty = bottomAlign
      ? ch - mobilePad - CH4_REF_H * 0.92 * scale
      : pad + (ch - 2 * pad - bh * scale) / 2 - b.minY * scale;
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

export { initAboutTreeArtwork };
