import { initMalLogos, setPageFavicon } from './mal-logo.js';
import { initAboutTreeArtwork } from './app.js';

initMalLogos();
setPageFavicon('bottom');

const computeVisibilityRatio = (node) => {
  if (!node) return 1;
  const rect = node.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return 0;
  const vw = window.innerWidth || document.documentElement.clientWidth || 0;
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  const xOverlap = Math.max(0, Math.min(rect.right, vw) - Math.max(rect.left, 0));
  const yOverlap = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
  const overlapArea = xOverlap * yOverlap;
  const area = rect.width * rect.height;
  if (area <= 0) return 0;
  return overlapArea / area;
};

const initAboutFlow = () => {
  const sections = Array.from(document.querySelectorAll('[data-about-section]'));
  if (sections.length === 0) return null;

  const isMobile = window.matchMedia('(max-width: 1024px)').matches;

  const applyInitialVisibility = () => {
    let anyVisible = false;
    sections.forEach((section) => {
      if (computeVisibilityRatio(section) >= 0.12) {
        section.classList.add('is-visible');
        anyVisible = true;
      }
    });
    if (!anyVisible && sections[0]) sections[0].classList.add('is-visible');
  };

  applyInitialVisibility();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    },
    { threshold: isMobile ? 0.2 : 0.55 },
  );

  sections.forEach((section) => observer.observe(section));
  const initialVisibilityTick = requestAnimationFrame(applyInitialVisibility);

  const jumpTo = (index) => {
    if (index < 0 || index >= sections.length) return;
    sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getCurrentIndex = () => {
    let best = 0;
    let bestDist = Infinity;
    sections.forEach((section, index) => {
      const dist = Math.abs(section.getBoundingClientRect().top);
      if (dist < bestDist) {
        bestDist = dist;
        best = index;
      }
    });
    return best;
  };

  const onKey = (event) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const current = getCurrentIndex();
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const next = Math.max(0, Math.min(sections.length - 1, current + delta));
    if (next !== current) jumpTo(next);
  };

  window.addEventListener('keydown', onKey);

  return () => {
    cancelAnimationFrame(initialVisibilityTick);
    observer.disconnect();
    window.removeEventListener('keydown', onKey);
  };
};

const cleanups = [initAboutFlow(), initAboutTreeArtwork()].filter(Boolean);

const loadAboutLetterPull = async () => {
  try {
    const { initAboutLetterPull } = await import('./about-sketch393/about-sketch393.js');
    const cleanup = initAboutLetterPull();
    if (cleanup) cleanups.push(cleanup);
  } catch (error) {
    console.warn('About letter pull failed to load:', error);
  }
};

loadAboutLetterPull();

window.addEventListener('pagehide', (event) => {
  if (event.persisted) return;
  cleanups.forEach((cleanup) => cleanup());
});
