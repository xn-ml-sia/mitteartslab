const lerp = (a, b, n) => (1 - n) * a + n * b;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;

const calcWinsize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const DEFAULTS = {
  perspective: 120,
  totalTrailElements: 8,
  valuesFromTo: {
    x: [-72, 72],
    y: [-52, 52],
    rx: [-4, 4],
    ry: [-8, 8],
    rz: [0, 0],
  },
  cursorInfluence: 0.55,
  opacityChange: true,
  amt: (pos) => 0.018 * pos + 0.035,
  amtMain: 0.24,
};

class ImageTrailEffect {
  constructor(figure, imageUrl, altText, options = {}) {
    this.figure = figure;
    this.imageUrl = imageUrl;
    this.altText = altText;
    this.options = { ...DEFAULTS, ...options };
    this.options.valuesFromTo = {
      ...DEFAULTS.valuesFromTo,
      ...options.valuesFromTo,
    };

    this.trail = document.createElement('div');
    this.trail.className = 'about-photo-trail';
    this.trail.style.perspective = `${this.options.perspective}px`;

    this.imgTransforms = Array.from({ length: this.options.totalTrailElements }, () => ({
      x: 0,
      y: 0,
      rx: 0,
      ry: 0,
      rz: 0,
    }));

    this.trailElems = [];
    this.winsize = calcWinsize();
    this.cursor = { x: this.winsize.width / 2, y: this.winsize.height / 2 };
    this.rafId = 0;
    this.active = true;

    this.layout();
    this.figure.replaceChildren(this.trail);
    this.figure.classList.add('has-photo-trail');

    this.onMouseMove = (event) => {
      this.cursor = { x: event.clientX, y: event.clientY };
    };

    this.onResize = () => {
      this.winsize = calcWinsize();
    };

    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
    this.rafId = requestAnimationFrame(() => this.render());
  }

  layout() {
    const { totalTrailElements, opacityChange } = this.options;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < totalTrailElements; i += 1) {
      const img = document.createElement('img');
      img.className = 'about-photo-trail__img';
      img.src = this.imageUrl;
      img.decoding = 'async';
      img.draggable = false;
      img.style.zIndex = String(i + 1);

      const isTop = i === totalTrailElements - 1;
      if (isTop) {
        img.alt = this.altText;
      } else {
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
      }

      if (opacityChange) {
        const opacityVal =
          i === totalTrailElements - 1
            ? 1
            : 0.82 + (i / (totalTrailElements - 1)) * 0.14;
        img.style.opacity = String(opacityVal);
      }

      this.trailElems.push(img);
      fragment.appendChild(img);
    }

    this.trail.appendChild(fragment);
  }

  getTargets() {
    const rect = this.trail.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = this.cursor.x - cx;
    const dy = this.cursor.y - cy;
    const { valuesFromTo, cursorInfluence } = this.options;
    const { width, height } = this.winsize;

    return {
      x: clamp(dx * cursorInfluence, valuesFromTo.x[0], valuesFromTo.x[1]),
      y: clamp(dy * cursorInfluence, valuesFromTo.y[0], valuesFromTo.y[1]),
      rx: map(this.cursor.y, 0, height, valuesFromTo.rx[0], valuesFromTo.rx[1]),
      ry: map(this.cursor.x, 0, width, valuesFromTo.ry[0], valuesFromTo.ry[1]),
      rz: map(this.cursor.x, 0, width, valuesFromTo.rz[0], valuesFromTo.rz[1]),
    };
  }

  render() {
    if (!this.active) return;

    const { totalTrailElements, amt, amtMain } = this.options;
    const targets = this.getTargets();

    for (let i = 0; i < totalTrailElements; i += 1) {
      const amount =
        i < totalTrailElements - 1
          ? amt(i)
          : amtMain ?? amt(totalTrailElements - 1);

      const state = this.imgTransforms[i];
      state.x = lerp(state.x, targets.x, amount);
      state.y = lerp(state.y, targets.y, amount);
      state.rz = lerp(state.rz, targets.rz, amount);
      state.rx = lerp(state.rx, targets.rx, amount);
      state.ry = lerp(state.ry, targets.ry, amount);

      this.trailElems[i].style.transform =
        `translate3d(${state.x}px, ${state.y}px, 0) rotateX(${state.rx}deg) rotateY(${state.ry}deg) rotateZ(${state.rz}deg)`;
    }

    this.rafId = requestAnimationFrame(() => this.render());
  }

  destroy() {
    this.active = false;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
  }
}

export const initAboutImageTrail = (root = document) => {
  if (prefersReducedMotion() || !canHover()) return null;

  const figures = Array.from(root.querySelectorAll('.about-photo'));
  if (figures.length === 0) return null;

  const instances = figures
    .map((figure) => {
      const img = figure.querySelector(':scope > img');
      if (!img?.src) return null;
      return new ImageTrailEffect(figure, img.src, img.alt || '');
    })
    .filter(Boolean);

  if (instances.length === 0) return null;

  return () => {
    instances.forEach((instance) => instance.destroy());
  };
};
