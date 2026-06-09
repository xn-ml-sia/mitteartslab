import { TextAnimator } from './js/effect-4/text-animator.js';

export const initPortfolioCardTextHover = (root = document) => {
  const cards = [...root.querySelectorAll('.portfolio-card')];
  if (cards.length === 0) return null;

  const disposers = cards.map((item) => {
    const cols = [...item.querySelectorAll('.hover-effect')];
    const animators = cols.map((col) => new TextAnimator(col));

    const onEnter = () => {
      animators.forEach((animator) => animator.animate());
    };

    const onLeave = () => {
      animators.forEach((animator) => animator.animateBack());
    };

    item.addEventListener('mouseenter', onEnter);
    item.addEventListener('mouseleave', onLeave);

    return () => {
      item.removeEventListener('mouseenter', onEnter);
      item.removeEventListener('mouseleave', onLeave);
      animators.forEach((animator) => animator.reset());
    };
  });

  return () => {
    disposers.forEach((dispose) => dispose());
  };
};
