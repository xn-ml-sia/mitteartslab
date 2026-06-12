import { AboutVisual } from './parts/aboutVisual';

const TEXTURE_SRC = '/public/assets/about/letter-pho.svg';

export const initAboutLetterPull = (root: ParentNode = document) => {
  const section = root.querySelector('.about-section--bio');
  const canvas = root.querySelector('#about-letter-canvas');
  if (!(section instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement)) {
    return null;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const visual = new AboutVisual({
    el: canvas,
    container: section,
    textureSrc: TEXTURE_SRC,
    reducedMotion,
  });

  return () => {
    visual.disposeAbout();
  };
};
