import { PORTFOLIO_CASES } from './portfolio-data.js';
import { initMalLogos, setPageFavicon } from './mal-logo.js';
import { initPortfolioCardReveal } from './portfolio-card-reveal.js';
import { initPortfolioFlipCaterpillar } from './portfolio-flip-caterpillar.js';

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderCarousel = (item) => `
  <div class="portfolio-card__carousel">
    ${item.slides
      .map(
        (slide) =>
          `<img src="${slide.src}" alt="${escapeHtml(slide.alt)}" loading="lazy" decoding="async" />`,
      )
      .join('')}
  </div>
`;

const renderCard = (item) => `
  <article class="portfolio-card" id="portfolio-${item.id}">
    <header class="portfolio-card__head">
      <h2 class="portfolio-card__title">${escapeHtml(item.title)}</h2>
      <p class="portfolio-card__subtitle">${escapeHtml(item.subtitle)}</p>
    </header>
    ${renderCarousel(item)}
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

  if (prefersReducedMotion()) {
    root.querySelectorAll('.portfolio-card').forEach((card) => {
      card.classList.add('is-revealed');
    });
    return;
  }

  const revealCleanup = initPortfolioCardReveal(root);
  if (revealCleanup) cleanups.push(revealCleanup);

  if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') {
    const flipCleanup = initPortfolioFlipCaterpillar(root);
    if (flipCleanup) cleanups.push(flipCleanup);
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
