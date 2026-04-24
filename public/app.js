/** Slow oscillation between two RGB triplets from CSS (`r, g, b` comma strings). */
const MODULE_DRIFT_SPEED = 0.0001;

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

const initAsciiMandala = () => {
  const canvas = document.getElementById('ascii-canvas');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d', { alpha: true });
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
  const fps = 10;
  const frameDuration = 1000 / fps;
  const quantizationStep = 3;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const render = (ts = 0) => {
    if (ts - lastTs < frameDuration) {
      raf = requestAnimationFrame(render);
      return;
    }
    lastTs = ts;
    time += 0.05;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = width * 0.35;
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
        const fallStrength = Math.pow(crumbleFactor, 3) * 98 * intensity;
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

    raf = requestAnimationFrame(render);
  };

  resize();
  raf = requestAnimationFrame(render);
  window.addEventListener('resize', resize);
  return () => {
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
};

const initMetamorphosis = () => {
  const canvas = document.getElementById('metamorphosis-canvas');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const rootStyles = getComputedStyle(document.documentElement);
  const strokeRgb = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-ink-soft-rgb').trim(),
    [83, 81, 70],
  );
  const accentRgb = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-accent-rgb').trim(),
    [200, 72, 71],
  );
  const altRgb = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-alt-rgb').trim(),
    [21, 114, 74],
  );
  const clayRgb = parseRgbTriplet(
    rootStyles.getPropertyValue('--rubin-clay').trim(),
    [201, 125, 85],
  );
  const cyanRgb = parseRgbTriplet(
    rootStyles.getPropertyValue('--rubin-cyan').trim(),
    [68, 166, 228],
  );
  const risoRgb = parseRgbTriplet(
    rootStyles.getPropertyValue('--rubin-riso').trim(),
    [94, 126, 223],
  );

  canvas.width = 550;
  canvas.height = 550;

  const width = canvas.width;
  const height = canvas.height;
  const phi = (1 + Math.sqrt(5)) / 2;
  let raf = 0;
  let time = 0;

  const animate = () => {
    const now = performance.now();
    const maxRectangles = Math.min(60, Math.floor((time * 0.02) % 80));

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
      if (paletteWave > 0.8) rgb = accentRgb;
      else if (paletteWave > 0.6) rgb = clayRgb;
      else if (paletteWave > 0.4) rgb = altRgb;
      else if (paletteWave > 0.2) rgb = cyanRgb;
      else rgb = risoRgb;
      ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);

      if (i % 3 === 0) {
        ctx.beginPath();
        ctx.moveTo(-rectWidth / 2, -rectHeight / 2);
        ctx.lineTo(rectWidth / 2, rectHeight / 2);
        ctx.moveTo(rectWidth / 2, -rectHeight / 2);
        ctx.lineTo(-rectWidth / 2, rectHeight / 2);
        ctx.strokeStyle = `rgba(${altRgb[0]}, ${altRgb[1]}, ${altRgb[2]}, ${alpha * 0.28})`;
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
    ctx.strokeStyle = `rgba(${risoRgb[0]}, ${risoRgb[1]}, ${risoRgb[2]}, 0.28)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

    time += 0.75;
    raf = requestAnimationFrame(animate);
  };

  raf = requestAnimationFrame(animate);
  return () => {
    if (raf) cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, width, height);
  };
};

const initChapterFlow = () => {
  if (window.matchMedia('(max-width: 1024px)').matches) return null;
  const container = document.querySelector('.chapter78-main');
  const sections = Array.from(document.querySelectorAll('.chapter-observe'));
  if (!container || sections.length === 0) return null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    },
    {
      root: container,
      threshold: 0.55,
    },
  );

  sections.forEach((section) => observer.observe(section));

  // Inertial wheel snap: convert wheel intent into eased chapter jumps.
  let wheelLocked = false;
  let wheelAccum = 0;
  let wheelTimer = 0;
  const wheelThreshold = 70;
  const onWheel = (e) => {
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    if (wheelLocked) {
      e.preventDefault();
      return;
    }
    wheelAccum += e.deltaY;
    clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => { wheelAccum = 0; }, 140);
    if (Math.abs(wheelAccum) < wheelThreshold) return;
    e.preventDefault();
    const current = getCurrentIndex();
    const delta = wheelAccum > 0 ? 1 : -1;
    const next = Math.max(0, Math.min(sections.length - 1, current + delta));
    wheelAccum = 0;
    wheelLocked = true;
    sections[next].scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => { wheelLocked = false; }, 520);
  };
  container.addEventListener('wheel', onWheel, { passive: false });

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
    sections[next].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.addEventListener('keydown', onKey);

  return () => {
    observer.disconnect();
    window.removeEventListener('keydown', onKey);
    container.removeEventListener('wheel', onWheel);
    clearTimeout(wheelTimer);
  };
};

const cleanups = [initAsciiMandala(), initMetamorphosis(), initChapterFlow()].filter(Boolean);
window.addEventListener('beforeunload', () => {
  cleanups.forEach((cleanup) => cleanup());
});
