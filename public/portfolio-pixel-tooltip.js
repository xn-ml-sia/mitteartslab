/**
 * Adapted from Codrops PixelGooeyTooltip (tooltip.js).
 * https://github.com/codrops/PixelGooeyTooltip
 */
export class PixelTooltip {
  DOM = {
    el: null,
    bg: null,
    content: null,
    contentTitle: null,
    contentDescription: null,
    cells: null,
  };

  rows;
  cols;
  isOpen = false;
  tl;

  constructor(DOM_el) {
    this.DOM.el = DOM_el;
    this.DOM.bg = this.DOM.el.querySelector('.tooltip__bg');
    this.DOM.content = this.DOM.el.querySelector('.tooltip__content');
    this.DOM.contentTitle = this.DOM.content.querySelector('.tooltip__content-title');
    this.DOM.contentDescription = this.DOM.content.querySelector('.tooltip__content-desc');

    this.rows = parseInt(this.DOM.el.dataset.rows, 10) || 3;
    this.cols = parseInt(this.DOM.el.dataset.cols, 10) || 4;

    this.#layout();
  }

  setContent({ title = '', description = '' } = {}) {
    this.DOM.contentTitle.textContent = title;
    this.DOM.contentDescription.textContent = description;
    this.DOM.contentDescription.hidden = true;
  }

  #fitGrid() {
    const CELL = 8;
    const content = this.DOM.content;
    const title = this.DOM.contentTitle;
    const styles = getComputedStyle(content);
    const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const padY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const textWidth = title.scrollWidth || title.offsetWidth;
    const textHeight = title.offsetHeight || parseFloat(styles.fontSize) || 12;
    const w = textWidth + padX;
    const h = textHeight + padY;

    this.cols = Math.max(4, Math.ceil(w / CELL));
    this.rows = Math.max(2, Math.ceil(h / CELL));
    this.#layout();
  }

  open(effectType = 'Effect2') {
    if (this.isOpen) return;
    this.#fitGrid();
    this.isOpen = true;
    this.#animateCells(effectType);
  }

  close(effectType = 'Effect2') {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.#animateCells(effectType);
  }

  destroy() {
    if (this.tl) this.tl.kill();
    this.isOpen = false;
    this.DOM.el.classList.remove('tooltip--show');
  }

  #layout() {
    let strHTML = '';
    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.cols; col += 1) {
        strHTML += '<div></div>';
      }
    }

    this.DOM.bg.innerHTML = strHTML;
    this.DOM.el.style.setProperty('--tt-columns', this.cols);
    this.DOM.el.style.setProperty('--tt-rows', this.rows);
    this.DOM.cells = [...this.DOM.bg.querySelectorAll('div')];
  }

  #animateCells(effectType) {
    const methodName = `animate${effectType.charAt(0).toUpperCase()}${effectType.slice(1)}`;
    if (typeof this[methodName] === 'function') {
      this[methodName]();
      return;
    }
    console.warn(`Animation effect '${effectType}' is not defined.`);
  }

  createDefaultTimeline({ duration = 0.1, ease = 'expo' } = {}) {
    if (this.tl) this.tl.kill();

    return gsap.timeline({
      defaults: { duration, ease },
      onStart: () => {
        if (this.isOpen) {
          gsap.set(this.DOM.el, { zIndex: 6 });
          this.DOM.el.classList.add('tooltip--show');
        } else {
          gsap.set(this.DOM.el, { zIndex: 0 });
        }
      },
      onComplete: () => {
        if (!this.isOpen) {
          this.DOM.el.classList.remove('tooltip--show');
        }
      },
    });
  }

  animateTooltipContent() {
    this.tl.fromTo(
      this.DOM.contentTitle,
      { opacity: this.isOpen ? 0 : 1 },
      {
        duration: 0.2,
        opacity: this.isOpen ? 1 : 0,
      },
      this.isOpen ? 0.25 : 0,
    ).add(
      () => {
        this.DOM.contentTitle.classList[this.isOpen ? 'add' : 'remove']('glitch');
      },
      this.isOpen ? 0.45 : 0,
    );
  }

  animateEffect2() {
    this.tl = this.createDefaultTimeline();

    if (this.isOpen) {
      this.tl.fromTo(
        this.DOM.cells,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          stagger: { each: 0.02, from: 'start' },
        },
        0,
      );
    } else {
      this.tl.to(
        this.DOM.cells,
        {
          opacity: 0,
          scale: 0,
          stagger: { each: 0.02, from: 'end' },
        },
        0,
      );
    }

    this.animateTooltipContent();
  }
}
