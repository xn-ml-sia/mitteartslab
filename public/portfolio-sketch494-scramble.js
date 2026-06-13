const ALL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const mapRange = (num, toMin, toMax, fromMin, fromMax) => {
  if (num <= fromMin) return toMin;
  if (num >= fromMax) return toMax;
  const p = (toMax - toMin) / (fromMax - fromMin);
  return (num - fromMin) * p + toMin;
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const scrambleHue = (index, num) => {
  const hue = mapRange(index, 0, 1, 0, Math.max(num - 1, 1));
  return `hsl(${Math.round(hue * 360)}, 100%, 50%)`;
};

let activeScramble = null;

class Sketch494Scramble {
  constructor(el, text, { duration = 1 } = {}) {
    this.el = el;
    this.text = text;
    this.total = text.length;
    this.duration = duration;
    this.showRateA = 0;
    this.showRateB = 0;
    this.isShowed = false;
    this.rafId = 0;
    this.inner = document.createElement('span');
    this.inner.className = 'portfolio-company-title__scramble-inner';
    this.el.textContent = '';
    this.el.appendChild(this.inner);
  }

  tick() {
    if (this.isShowed) return;
    this.render();
    this.rafId = requestAnimationFrame(() => this.tick());
  }

  render() {
    if (this.showRateA <= 0 || this.isShowed) return;

    const etc = mapRange(this.showRateB, 0, this.total, 0, 1);
    const num = mapRange(this.showRateA, 0, this.total, 0, 1);
    let html = '';

    for (let i = 0; i < num; i += 1) {
      const isNoise = i > etc;
      const bg = scrambleHue(i, num);

      if (isNoise) {
        const ch = ALL_CHARS.charAt(randomInt(0, ALL_CHARS.length - 1));
        html += `<span class="portfolio-company-title__scramble-char portfolio-company-title__scramble-char--noise" style="color:#000;background-color:${bg}">${ch}</span>`;
        continue;
      }

      const ch = this.text.charAt(i) === ' ' ? '\u00a0' : this.text.charAt(i);
      if (i === 0) {
        html += `<span class="portfolio-company-title__scramble-char portfolio-company-title__scramble-char--lead" style="color:#fff;background-color:${bg}">${ch}</span>`;
      } else {
        html += `<span class="portfolio-company-title__scramble-char">${ch}</span>`;
      }
    }

    this.inner.innerHTML = html;
  }

  finish() {
    this.el.textContent = this.text;
    this.el.dataset.text = this.text;
  }

  play() {
    if (typeof gsap === 'undefined') {
      this.finish();
      return;
    }

    gsap.killTweensOf(this);
    this.isShowed = false;
    this.showRateA = 0;
    this.showRateB = 0;
    this.inner.innerHTML = '';
    this.tick();

    gsap.to(this, {
      showRateA: 1,
      duration: this.duration,
      ease: 'expo.out',
    });

    gsap.to(this, {
      showRateB: 1,
      duration: this.duration,
      delay: this.duration * 0.75,
      ease: 'expo.inOut',
      onComplete: () => {
        this.isShowed = true;
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.finish();
      },
    });
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (typeof gsap !== 'undefined') gsap.killTweensOf(this);
    this.isShowed = true;
  }
}

export const stopSketch494Scramble = () => {
  if (!activeScramble) return;
  activeScramble.destroy();
  activeScramble = null;
};

export const scrambleCompanyTitleSketch494 = (
  el,
  { reducedMotion = false, duration = 1 } = {},
) => {
  if (!el) return;

  stopSketch494Scramble();

  const text = el.dataset.text || el.textContent || '';
  el.dataset.text = text;

  if (reducedMotion || !text.length) {
    el.textContent = text;
    return;
  }

  activeScramble = new Sketch494Scramble(el, text, { duration });
  activeScramble.play();
};
