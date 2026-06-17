import { MouseMgr } from '../core/mouseMgr';

let tick = -1;
let active = false;

export const isHeroHoverActive = (): boolean => {
  const frame = performance.now() | 0;
  if (frame === tick) return active;
  tick = frame;

  const hero = document.querySelector('.portfolio-sketch501');
  if (!hero || document.body.classList.contains('portfolio-detail-open')) {
    active = false;
    return active;
  }

  const rect = hero.getBoundingClientRect();
  if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
    active = false;
    return active;
  }

  const mx = MouseMgr.instance.x;
  const my = MouseMgr.instance.y;
  active =
    mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;
  return active;
};
