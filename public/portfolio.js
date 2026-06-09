import { PORTFOLIO_CASES } from './portfolio-data.js';
import { initMalLogos, setPageFavicon } from './mal-logo.js';
import { initPortfolioCardTextHover } from './portfolio-text-hover/init.js';
import { initPortfolioFlipCaterpillar } from './portfolio-flip-caterpillar.js';

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderFlipMedia = (item) => `
  <div class="portfolio-card__media portfolio-card__media--flip">
    <div class="portfolio-card__flip-container" data-portfolio-flip-container>
      ${item.slides
        .map(
          (slide) =>
            `<img src="${slide.src}" alt="${escapeHtml(slide.alt)}" loading="lazy" decoding="async" />`,
        )
        .join('')}
    </div>
  </div>
`;

const renderCard = (item) => `
  <article class="portfolio-card" id="portfolio-${item.id}" data-portfolio-flip>
    <header class="portfolio-card__head">
      <h2 class="portfolio-card__title">
        <span class="hover-effect hover-effect--bg-south">${escapeHtml(item.title)}</span>
      </h2>
      <p class="portfolio-card__subtitle">
        <span class="hover-effect hover-effect--bg-south">${escapeHtml(item.subtitle)}</span>
      </p>
    </header>
    ${renderFlipMedia(item)}
  </article>
`;

const renderPage = () => `
  <div class="portfolio-grid">
    ${PORTFOLIO_CASES.map(renderCard).join('')}
  </div>
`;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const boot = () => {
  const root = document.getElementById('portfolio-root');
  if (!root) return;

  root.innerHTML = renderPage();
  initMalLogos();
  setPageFavicon('bottom');

  const cleanups = [];

  if (!prefersReducedMotion()) {
    if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') {
      const flipCleanup = initPortfolioFlipCaterpillar(root);
      if (flipCleanup) cleanups.push(flipCleanup);
    }

    if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined') {
      const textHoverCleanup = initPortfolioCardTextHover(root);
      if (textHoverCleanup) cleanups.push(textHoverCleanup);
    }
  }

  window.addEventListener(
    'pagehide',
    () => {
      cleanups.forEach((cleanup) => cleanup());
    },
    { once: true },
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
