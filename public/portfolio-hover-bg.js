const THUMB_SELECTOR = '.portfolio-work__thumb img';
const THUMB_HOVER_SELECTOR = '.portfolio-work__thumb';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const initPortfolioHoverBg = (root) => {
  const layer = document.getElementById('portfolio-hover-bg');
  if (!layer || !root) return null;

  const cards = Array.from(root.querySelectorAll('.portfolio-work'));
  const thumbs = cards
    .map((card) => card.querySelector(THUMB_HOVER_SELECTOR))
    .filter(Boolean);
  const list = root.querySelector('.portfolio-work-list');
  if (!cards.length || !thumbs.length) return null;

  let enabled = true;
  let activeIndex = -1;

  const pictures = cards.map((card, index) => {
    const source = card.querySelector('.portfolio-work__hover-src');
    if (!source) return null;

    source.dataset.index = String(index);
    source.classList.add('portfolio-hover-bg__picture');
    layer.appendChild(source);
    return source;
  });

  const clearCardStates = () => {
    thumbs.forEach((thumb) => thumb.classList.remove('is-hovered'));
    cards.forEach((card) => card.classList.remove('is-dimmed'));
    list?.classList.remove('has-card-hover');
  };

  const setActive = (index) => {
    pictures.forEach((picture, i) => {
      if (!picture) return;
      picture.classList.toggle('is-active', i === index);
    });

    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('is-hovered', index >= 0 && i === index);
    });

    cards.forEach((card, i) => {
      card.classList.toggle('is-dimmed', index >= 0 && i !== index);
    });

    list?.classList.toggle('has-card-hover', index >= 0);
    activeIndex = index;
    document.body.classList.toggle('portfolio-page--work-hover', index >= 0);
  };

  const onEnter = (event) => {
    if (!enabled || !canHover()) return;
    const thumb = event.currentTarget;
    const card = thumb.closest('.portfolio-work');
    const index = cards.indexOf(card);
    if (index < 0) return;
    setActive(index);
  };

  const onLeave = (event) => {
    if (!enabled || activeIndex < 0) return;
    const related = event.relatedTarget;
    if (related instanceof Node && event.currentTarget.contains(related)) return;
    setActive(-1);
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener('mouseenter', onEnter);
    thumb.addEventListener('mouseleave', onLeave);
  });

  return {
    setEnabled(next) {
      enabled = next;
      if (!enabled) {
        setActive(-1);
        clearCardStates();
      }
    },
    destroy() {
      thumbs.forEach((thumb) => {
        thumb.removeEventListener('mouseenter', onEnter);
        thumb.removeEventListener('mouseleave', onLeave);
      });
      setActive(-1);
      clearCardStates();
      pictures.forEach((picture) => picture?.remove());
    },
  };
};

export { THUMB_SELECTOR, prefersReducedMotion, canHover };
