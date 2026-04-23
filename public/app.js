const density = '.·•○●';
const asciiWidth = 80;
const asciiHeight = 44;

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

const getCharForIntensity = (intensity, isCenter = false) => {
  if (intensity < 0.1) return ' ';
  const index = Math.min(Math.floor(intensity * density.length), density.length - 1);
  return isCenter ? density[Math.max(index, 2)] : density[index];
};

const drawCirclePattern = (grid, centerX, centerY, f) => {
  const centerIntensity = (Math.sin(f * 0.025) + 1) / 2;
  grid[centerY][centerX] = getCharForIntensity(centerIntensity, true);

  for (let r = 0; r < 3; r += 1) {
    const radius = 2 + r * 2;
    const points = 8 + r * 4;
    for (let i = 0; i < points; i += 1) {
      const angle = (i / points) * Math.PI * 2;
      const breathingFactor = 0.2 * Math.sin(f * 0.025 + r + i * 0.1);
      const x = Math.round(centerX + Math.cos(angle) * (radius + breathingFactor));
      const y = Math.round(centerY + Math.sin(angle) * (radius + breathingFactor));
      if (x >= 0 && x < asciiWidth && y >= 0 && y < asciiHeight) {
        const intensityPhase = (Math.sin(f * 0.02 + r * 0.3 + i * 0.2) + 1) / 2;
        grid[y][x] = getCharForIntensity(intensityPhase, true);
      }
    }
  }
};

const drawMandala = (grid, f) => {
  const centerX = Math.floor(asciiWidth / 2);
  const centerY = Math.floor(asciiHeight / 2);

  for (let y = 1; y < asciiHeight - 1; y += 1) {
    const lineOpacity = 0.3 + Math.sin(f * 0.005 + y * 0.1) * 0.1;
    if (lineOpacity > 0.2) grid[y][centerX] = '|';
  }

  drawCirclePattern(grid, centerX, centerY, f);

  const numPatterns = 6;
  for (let i = 0; i < numPatterns; i += 1) {
    const radius = 5 + i * 3;
    const points = 6 + i * 2;
    for (let j = 0; j < points; j += 1) {
      const angle = (j / points) * Math.PI * 2;
      const breathingFactor = 0.2 * Math.sin(f * 0.025 + i * 0.5 + j * 0.2);
      const x = Math.round(centerX + Math.cos(angle) * (radius + breathingFactor * radius));
      const y = Math.round(centerY + Math.sin(angle) * (radius + breathingFactor * radius));
      if (x >= 0 && x < asciiWidth && y >= 0 && y < asciiHeight) {
        const intensityPhase = (Math.sin(f * 0.015 + i * 0.4 + j * 0.8) + 1) / 2;
        const char = getCharForIntensity(intensityPhase);
        grid[y][x] = char;
        const mirrorX = 2 * centerX - x;
        if (mirrorX >= 0 && mirrorX < asciiWidth) grid[y][mirrorX] = char;
      }

      if (i > 0 && j % 2 === 0) {
        const secondaryRadius = radius * 0.7;
        const x2 = Math.round(centerX + Math.cos(angle + 0.2) * secondaryRadius);
        const y2 = Math.round(centerY + Math.sin(angle + 0.2) * secondaryRadius);
        if (x2 >= 0 && x2 < asciiWidth && y2 >= 0 && y2 < asciiHeight) {
          const intensityPhase = (Math.sin(f * 0.025 + i * 0.3 + j) + 1) / 2;
          const char = getCharForIntensity(intensityPhase * 0.8);
          grid[y2][x2] = char;
          const mirrorX2 = 2 * centerX - x2;
          if (mirrorX2 >= 0 && mirrorX2 < asciiWidth) grid[y2][mirrorX2] = char;
        }
      }
    }
  }

  for (let i = 0; i < 40; i += 1) {
    const angle = (i / 40) * Math.PI;
    const radius = 10 + (i % 5) * 3;
    const x = Math.round(centerX + Math.cos(angle) * radius);
    const y = Math.round(centerY + Math.sin(angle) * radius);
    if (x >= 0 && x < asciiWidth && y >= 0 && y < asciiHeight && grid[y][x] === ' ') {
      const intensityPhase = (Math.sin(f * 0.02 + i * 0.2) + 1) / 3;
      const char = getCharForIntensity(intensityPhase);
      if (char !== ' ') {
        grid[y][x] = char;
        const mirrorX = 2 * centerX - x;
        if (mirrorX >= 0 && mirrorX < asciiWidth && grid[y][mirrorX] === ' ') {
          grid[y][mirrorX] = char;
        }
      }
    }
  }
};

const charToOpacity = (char) => {
  switch (char) {
    case '●': return 0.9;
    case '○': return 0.7;
    case '•': return 0.6;
    case '·': return 0.5;
    case '.': return 0.4;
    case '|': return 0.3;
    default: return 0;
  }
};

const initAsciiMandala = () => {
  const canvas = document.getElementById('ascii-canvas');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d', { alpha: true });
  const rootStyles = getComputedStyle(document.documentElement);
  const inkA = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-ink-rgb').trim(),
    [56, 31, 32],
  );
  const inkB = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-ink-drift-rgb').trim() || rootStyles.getPropertyValue('--module-ink-rgb').trim(),
    inkA,
  );
  const accentA = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-accent-rgb').trim(),
    [200, 72, 71],
  );
  const accentB = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-accent-drift-rgb').trim() || rootStyles.getPropertyValue('--module-accent-rgb').trim(),
    accentA,
  );
  const altA = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-alt-rgb').trim(),
    [21, 114, 74],
  );
  const altB = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-alt-drift-rgb').trim() || rootStyles.getPropertyValue('--module-alt-rgb').trim(),
    altA,
  );
  let frame = 0;
  let raf = 0;
  let lastTs = 0;
  const targetFrameMs = 1000 / 30;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
  };

  const render = (ts = 0) => {
    if (ts - lastTs < targetFrameMs) {
      raf = requestAnimationFrame(render);
      return;
    }
    lastTs = ts;

    const grid = Array.from({ length: asciiHeight }, () => Array(asciiWidth).fill(' '));
    drawMandala(grid, frame);

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const charW = w / asciiWidth;
    const charH = h / asciiHeight;
    const fontPx = Math.max(8, Math.floor(charH * 0.82));
    ctx.font = `${fontPx}px "Courier Prime", "IBM Plex Mono", monospace`;

    const inkRgb = driftRgbCsv(inkA, inkB, ts, MODULE_DRIFT_SPEED, 0);
    const accentRgb = driftRgbCsv(accentA, accentB, ts, MODULE_DRIFT_SPEED, 1.15);
    const altRgb = driftRgbCsv(altA, altB, ts, MODULE_DRIFT_SPEED, 2.05);

    for (let y = 0; y < asciiHeight; y += 1) {
      for (let x = 0; x < asciiWidth; x += 1) {
        const char = grid[y][x];
        const alpha = charToOpacity(char);
        if (alpha <= 0) continue;
        let rgb = inkRgb;
        if (char === '●' || char === '○') {
          rgb = accentRgb;
        } else if (char === '|') {
          rgb = altRgb;
        }
        ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx.fillText(char, x * charW, y * charH);
      }
    }

    frame += 1;
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
  const inkSoftA = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-ink-soft-rgb').trim(),
    [96, 53, 83],
  );
  const inkSoftB = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-ink-soft-drift-rgb').trim() || rootStyles.getPropertyValue('--module-ink-soft-rgb').trim(),
    inkSoftA,
  );
  const accentA = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-accent-rgb').trim(),
    [200, 72, 71],
  );
  const accentB = parseRgbTriplet(
    rootStyles.getPropertyValue('--module-accent-drift-rgb').trim() || rootStyles.getPropertyValue('--module-accent-rgb').trim(),
    accentA,
  );
  let raf = 0;

  const width = canvas.width;
  const height = canvas.height;
  const numLines = 120;
  const lineSegments = 180;
  const lineAlpha = 0.5;
  const lineWidth = 0.6;
  const rotateSpeed = 0.00025;
  let time = 2000;

  const forms = [
    (u, v) => {
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      let r = 120 + 30 * Math.sin(phi * 4 + theta * 2);
      r += 20 * Math.sin(phi * 6) * Math.cos(theta * 3);
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi) + 20 * Math.sin(theta * 5 + phi * 3),
      };
    },
    (u, v) => {
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      let r = 150 + 20 * Math.cos(phi * 8);
      r *= 0.8 + 0.2 * Math.abs(Math.cos(theta * 2));
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi) * (0.8 + 0.3 * Math.sin(theta * 4)),
      };
    },
    (u, v) => {
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      let r = 120;
      r += 50 * Math.sin(phi * 3) * Math.sin(theta * 2.5);
      r += 30 * Math.cos(phi * 5 + theta);
      const hollow = Math.max(0, Math.sin(phi * 2 + theta * 3) - 0.7);
      r *= 1 - hollow * 0.8;
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
      };
    },
  ];

  const interpolateForms = (a, b, u, v, blend) => {
    const pa = a(u, v);
    const pb = b(u, v);
    return {
      x: pa.x * (1 - blend) + pb.x * blend,
      y: pa.y * (1 - blend) + pb.y * blend,
      z: pa.z * (1 - blend) + pb.z * blend,
    };
  };

  const getCurrentForm = (u, v, t) => {
    const total = forms.length;
    const cycleTime = 600;
    const position = (t % (cycleTime * total)) / cycleTime;
    const idx = Math.floor(position);
    const next = (idx + 1) % total;
    const rawBlend = position - idx;
    const blend = rawBlend < 0.5
      ? 4 * rawBlend * rawBlend * rawBlend
      : 1 - Math.pow(-2 * rawBlend + 2, 3) / 2;
    return interpolateForms(forms[idx], forms[next], u, v, blend);
  };

  const drawSet = (uMode, strokeRgb) => {
    const lines = uMode ? numLines * 0.3 : numLines;
    const segments = uMode ? lineSegments * 0.5 : lineSegments;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${strokeRgb}, ${uMode ? lineAlpha * 0.75 : lineAlpha})`;
    ctx.lineWidth = uMode ? lineWidth * 0.7 : lineWidth;

    for (let i = 0; i < lines; i += 1) {
      const fixed = i / (lines - 1);
      let lastVisible = false;
      for (let j = 0; j <= segments; j += 1) {
        const moving = j / segments;
        const u = uMode ? fixed : moving;
        const v = uMode ? moving : fixed;
        const point = getCurrentForm(u, v, time);

        const rotateZ = time * rotateSpeed * 0.1;
        const rotatedX = point.x * Math.cos(rotateZ) - point.y * Math.sin(rotateZ);
        const rotatedY = point.x * Math.sin(rotateZ) + point.y * Math.cos(rotateZ);
        const rotatedZ = point.z;

        const scale = 1.35 + rotatedZ * 0.001;
        const x = width / 2 + rotatedX * scale;
        const y = height / 2 + 18 + rotatedY * scale;
        const visible = rotatedZ > -50;

        if (j === 0) {
          if (visible) ctx.moveTo(x, y);
        } else if (visible && lastVisible) {
          ctx.lineTo(x, y);
        } else if (visible && !lastVisible) {
          ctx.moveTo(x, y);
        }
        lastVisible = visible;
      }
    }
    ctx.stroke();
  };

  const animate = (now = performance.now()) => {
    ctx.clearRect(0, 0, width, height);
    const primaryRgb = driftRgbCsv(inkSoftA, inkSoftB, now, MODULE_DRIFT_SPEED, 0.4);
    const accentRgb = driftRgbCsv(accentA, accentB, now, MODULE_DRIFT_SPEED, 1.6);
    drawSet(false, primaryRgb);
    drawSet(true, accentRgb);
    time += 0.5;
    raf = requestAnimationFrame(animate);
  };

  raf = requestAnimationFrame(animate);
  return () => {
    if (raf) cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, width, height);
  };
};

const initChapterFlow = () => {
  const container = document.querySelector('.chapter78-main');
  const sections = Array.from(document.querySelectorAll('.chapter-observe'));
  const links = Array.from(document.querySelectorAll('.chapter-link'));
  if (!container || sections.length === 0) return null;

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.dataset.target === id;
      link.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clickHandlers = links.map((link) => {
    const fn = () => scrollToSection(link.dataset.target);
    link.addEventListener('click', fn);
    return { link, fn };
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          setActive(entry.target.id);
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
    scrollToSection(sections[next].id);
    window.setTimeout(() => { wheelLocked = false; }, 520);
  };
  container.addEventListener('wheel', onWheel, { passive: false });

  const getCurrentIndex = () => {
    const activeId = links.find((l) => l.getAttribute('aria-current') === 'true')?.dataset.target;
    const byActive = sections.findIndex((s) => s.id === activeId);
    if (byActive >= 0) return byActive;
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
    scrollToSection(sections[next].id);
  };

  window.addEventListener('keydown', onKey);

  return () => {
    clickHandlers.forEach(({ link, fn }) => link.removeEventListener('click', fn));
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
