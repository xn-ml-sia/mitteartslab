const viewport = document.querySelector('.infiniteCanvasViewport');
const container = document.querySelector('.infiniteCanvasContainer');
const title = document.getElementById('gallery-title');
const mediaItems = Array.from(document.querySelectorAll('.mediaItem'));

if (viewport && container && title && mediaItems.length > 0) {
  const IMG_SIZE_DESKTOP = 400;
  const IMG_SIZE_MOBILE = 400;
  const wheelSpeed = 1.5;
  const captionHeight = 28;
  const minGap = 76;
  const jitter = 34;
  const maxPlacementAttempts = 1400;

  const state = {
    isMobile: window.innerWidth < 768,
    zoom: window.innerWidth < 768 ? 0.42 : 0.76,
    itemWidth: window.innerWidth < 768 ? IMG_SIZE_MOBILE : IMG_SIZE_DESKTOP,
    itemHeight: window.innerWidth < 768 ? IMG_SIZE_MOBILE : IMG_SIZE_DESKTOP,
    canvasWidth: 0,
    canvasHeight: 0,
    cameraX: 0,
    cameraY: 0,
    targetX: 0,
    targetY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    dragDistance: 0,
    downX: 0,
    downY: 0,
    raf: 0,
    hasAnimatedIn: false,
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
      return ((s >>> 0) / 4294967296);
    };
  };

  const ease = (t) => 1 - Math.pow(1 - t, 3);

  const applyBounds = (x, y) => {
    const maxX = 0;
    const maxY = 0;
    const minX = Math.min(window.innerWidth - state.canvasWidth * state.zoom, 0);
    const minY = Math.min(window.innerHeight - state.canvasHeight * state.zoom, 0);
    return {
      x: Math.min(maxX, Math.max(minX, x)),
      y: Math.min(maxY, Math.max(minY, y)),
    };
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
    const dist = Math.hypot(dx, dy);
    if (dist < 0.4) {
      setCamera(state.targetX, state.targetY);
      return;
    }
    const alpha = ease(0.2);
    const nextX = state.cameraX + dx * alpha;
    const nextY = state.cameraY + dy * alpha;
    const bounded = applyBounds(nextX, nextY);
    setCamera(bounded.x, bounded.y);
    state.raf = requestAnimationFrame(animate);
  };

  const scheduleAnimation = () => {
    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(animate);
  };

  const intersects = (a, b, gap = 0) => !(
    a.x + a.w + gap <= b.x ||
    b.x + b.w + gap <= a.x ||
    a.y + a.h + gap <= b.y ||
    b.y + b.h + gap <= a.y
  );

  const computeWorldViewport = () => {
    const vw = window.innerWidth / state.zoom;
    const vh = window.innerHeight / state.zoom;
    return {
      left: state.canvasWidth * 0.5 - vw * 0.5,
      top: state.canvasHeight * 0.5 - vh * 0.5,
      right: state.canvasWidth * 0.5 + vw * 0.5,
      bottom: state.canvasHeight * 0.5 + vh * 0.5,
      vw,
      vh,
    };
  };

  const createSizeProfile = (i) => {
    const variants = [0.9, 0.95, 1, 1.05, 1.1, 0.92, 1.08];
    const s = variants[i % variants.length];
    const w = Math.round(state.itemWidth * s);
    const h = Math.round(state.itemHeight * s);
    return { w, h, fullH: h + captionHeight };
  };

  const placeByRules = () => {
    const rng = makeRng(hashString('gallery-seed-v4'));
    const viewportWorld = computeWorldViewport();
    const pad = 120;
    const bounds = {
      left: pad,
      top: pad,
      right: state.canvasWidth - pad,
      bottom: state.canvasHeight - pad,
    };
    const centerX = state.canvasWidth * 0.5;
    const centerY = state.canvasHeight * 0.5;
    const placed = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.399963

    for (let i = 0; i < mediaItems.length; i += 1) {
      const size = createSizeProfile(i);
      let accepted = null;

      // Golden-ratio spiral around title center.
      const theta = i * goldenAngle + (rng() - 0.5) * 0.18;
      const radialStep = Math.min(viewportWorld.vw, viewportWorld.vh) * 0.092;
      const baseRadius = Math.sqrt(i + 1) * radialStep;
      const seedX = centerX + Math.cos(theta) * baseRadius + (rng() - 0.5) * jitter * 0.9;
      const seedY = centerY + Math.sin(theta) * baseRadius + (rng() - 0.5) * jitter * 0.9;

      // Resolve collisions by pushing outward along same spiral direction.
      for (let attempt = 0; attempt < maxPlacementAttempts; attempt += 1) {
        const push = attempt * (minGap * 0.36);
        const x = seedX + Math.cos(theta) * push;
        const y = seedY + Math.sin(theta) * push;

        const candidate = { x, y, w: size.w, h: size.fullH };
        const inBounds =
          candidate.x >= bounds.left &&
          candidate.y >= bounds.top &&
          candidate.x + candidate.w <= bounds.right &&
          candidate.y + candidate.h <= bounds.bottom;
        if (!inBounds) continue;
        // Allow overlap with title area per art direction.
        if (placed.some((p) => intersects(candidate, p, minGap))) continue;
        accepted = candidate;
        break;
      }

      if (!accepted) {
        // Hard fallback: random search anywhere in bounds, still no-overlap.
        for (let fallback = 0; fallback < 800; fallback += 1) {
          const x = bounds.left + rng() * (bounds.right - bounds.left - size.w);
          const y = bounds.top + rng() * (bounds.bottom - bounds.top - size.fullH);
          const candidate = { x, y, w: size.w, h: size.fullH };
          if (placed.some((p) => intersects(candidate, p, minGap))) continue;
          accepted = candidate;
          break;
        }
      }

      if (!accepted) continue;

      placed.push(accepted);
    }

    // Keep one subtle edge crop on each side only; avoid overlap-prone right stack.
    if (placed[0]) placed[0].x = viewportWorld.left - placed[0].w * 0.18;
    if (placed[4]) placed[4].x = viewportWorld.right - placed[4].w * 0.2;

    // Final deterministic collision pass (catches edge-case overlaps).
    for (let i = 0; i < placed.length; i += 1) {
      for (let j = i + 1; j < placed.length; j += 1) {
        let guard = 0;
        while (intersects(placed[i], placed[j], minGap) && guard < 120) {
          const centerX = state.canvasWidth * 0.5;
          const centerY = state.canvasHeight * 0.5;
          const dx = placed[j].x + placed[j].w * 0.5 - centerX;
          const dy = placed[j].y + placed[j].h * 0.5 - centerY;
          const len = Math.hypot(dx, dy) || 1;
          const step = minGap * 0.35;
          placed[j].x += (dx / len) * step;
          placed[j].y += (dy / len) * step;
          guard += 1;
        }
      }
    }

    return placed;
  };

  const centerTitleAndItems = () => {
    state.canvasWidth = state.itemWidth * 18;
    state.canvasHeight = state.itemHeight * 18;

    const cx = state.canvasWidth * 0.5;
    const cy = state.canvasHeight * 0.5;

    const placements = placeByRules();
    if (placements.length === 0) return;

    // Fit canvas tightly to placed cards (plus padding).
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    placements.forEach((p) => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x + p.w);
      maxY = Math.max(maxY, p.y + p.h);
    });

    const fitPad = 220;
    const shiftX = -minX + fitPad;
    const shiftY = -minY + fitPad;
    state.canvasWidth = Math.ceil(maxX - minX + fitPad * 2);
    state.canvasHeight = Math.ceil(maxY - minY + fitPad * 2);
    container.style.width = `${state.canvasWidth}px`;
    container.style.height = `${state.canvasHeight}px`;

    const titleX = Math.round(cx + shiftX);
    const titleY = Math.round(cy + shiftY);
    title.style.left = `${titleX}px`;
    title.style.top = `${titleY}px`;

    mediaItems.forEach((item, i) => {
      const place = placements[i];
      if (!place) {
        item.style.display = 'none';
        return;
      }
      item.style.display = '';
      item.style.left = `${Math.round(place.x + shiftX)}px`;
      item.style.top = `${Math.round(place.y + shiftY)}px`;
      item.style.width = `${place.w}px`;
      item.style.height = `${place.h}px`;
      item.style.setProperty('--stagger-delay', `${Math.min(i * 70, 1100)}ms`);
      const cap = item.querySelector('.attribution');
      if (cap && !cap.textContent.trim()) cap.textContent = 'anonymous';
    });

    if (!state.hasAnimatedIn) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        mediaItems.forEach((item) => item.classList.add('is-visible'));
      } else {
        requestAnimationFrame(() => {
          mediaItems.forEach((item) => item.classList.add('is-visible'));
        });
      }
      state.hasAnimatedIn = true;
    }
  };

  const recenterCamera = () => {
    const cx = parseFloat(title.style.left || '0') || state.canvasWidth * 0.5;
    const cy = parseFloat(title.style.top || '0') || state.canvasHeight * 0.5;
    // Art direction: start with the title near the top-left quadrant.
    const targetScreenX = window.innerWidth * (state.isMobile ? 0.3 : 0.22);
    const targetScreenY = window.innerHeight * (state.isMobile ? 0.24 : 0.2);
    const startX = targetScreenX - cx * state.zoom;
    const startY = targetScreenY - cy * state.zoom;
    const bounded = applyBounds(startX, startY);
    state.targetX = bounded.x;
    state.targetY = bounded.y;
    setCamera(bounded.x, bounded.y);
  };

  const refreshForViewport = () => {
    state.isMobile = window.innerWidth < 768;
    state.zoom = state.isMobile ? 0.42 : 0.76;
    state.itemWidth = state.isMobile ? IMG_SIZE_MOBILE : IMG_SIZE_DESKTOP;
    state.itemHeight = state.isMobile ? IMG_SIZE_MOBILE : IMG_SIZE_DESKTOP;
    centerTitleAndItems();
    recenterCamera();
  };

  const onPointerDown = (e) => {
    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = 0;
    state.isDragging = true;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    state.downX = e.clientX;
    state.downY = e.clientY;
    state.dragDistance = 0;
    viewport.style.cursor = 'grabbing';
  };

  const onPointerMove = (e) => {
    if (!state.isDragging) return;
    const dx = e.clientX - state.lastX;
    const dy = e.clientY - state.lastY;
    state.dragDistance = Math.hypot(e.clientX - state.downX, e.clientY - state.downY);
    const bounded = applyBounds(state.targetX + dx, state.targetY + dy);
    state.targetX = bounded.x;
    state.targetY = bounded.y;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    scheduleAnimation();
  };

  const onPointerUp = () => {
    state.isDragging = false;
    viewport.style.cursor = 'grab';
  };

  const onWheel = (e) => {
    e.preventDefault();
    const bounded = applyBounds(
      state.targetX - e.deltaX * wheelSpeed,
      state.targetY - e.deltaY * wheelSpeed,
    );
    state.targetX = bounded.x;
    state.targetY = bounded.y;
    scheduleAnimation();
  };

  refreshForViewport();
  viewport.style.cursor = 'grab';

  viewport.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  viewport.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('resize', refreshForViewport, { passive: true });

  window.addEventListener('beforeunload', () => {
    viewport.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    viewport.removeEventListener('wheel', onWheel);
    window.removeEventListener('resize', refreshForViewport);
    if (state.raf) cancelAnimationFrame(state.raf);
  });
}

