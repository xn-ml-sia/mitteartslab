const lerp = (a, b, n) => (1 - n) * a + n * b;

const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;

const calcWinsize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const DEFAULTS = {
  perspective: 85,
  totalTrailElements: 10,
  valuesFromTo: {
    x: [-90, 90],
    y: [-60, 60],
    rx: [-5, 5],
    ry: [-12, 12],
    rz: [-2, 2],
  },
  opacityChange: true,
  amt: (pos) => 0.012 * pos + 0.025,
  amtMain: 0.22,
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
            : (1 / totalTrailElements) * i + 1 / totalTrailElements;
        img.style.opacity = String(opacityVal);
      }

      this.trailElems.push(img);
      fragment.appendChild(img);
    }

    this.trail.appendChild(fragment);
  }

  render() {
    if (!this.active) return;

    const { totalTrailElements, valuesFromTo, amt, amtMain } = this.options;
    const { width, height } = this.winsize;

    for (let i = 0; i < totalTrailElements; i += 1) {
      const amount =
        i < totalTrailElements - 1
          ? amt(i)
          : amtMain ?? amt(totalTrailElements - 1);

      const state = this.imgTransforms[i];
      state.x = lerp(state.x, map(this.cursor.x, 0, width, valuesFromTo.x[0], valuesFromTo.x[1]), amount);
      state.y = lerp(state.y, map(this.cursor.y, 0, height, valuesFromTo.y[0], valuesFromTo.y[1]), amount);
      state.rz = lerp(state.rz, map(this.cursor.x, 0, width, valuesFromTo.rz[0], valuesFromTo.rz[1]), amount);
      state.rx = lerp(
        state.rx,
        map(this.cursor.y, 0, height, valuesFromTo.rx[0], valuesFromTo.rx[1]),
        amount,
      );
      state.ry = lerp(
        state.ry,
        map(this.cursor.x, 0, width, valuesFromTo.ry[0], valuesFromTo.ry[1]),
        amount,
      );

      this.trailElems[i].style.transform = `translateX(${state.x}px) translateY(${state.y}px) rotateX(${state.rx}deg) rotateY(${state.ry}deg) rotateZ(${state.rz}deg)`;
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
