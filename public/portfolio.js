import { PORTFOLIO_CASES } from './portfolio-data.js';
import { initMalLogos, setPageFavicon } from './mal-logo.js';
import { initPortfolioHoverBg, prefersReducedMotion } from './portfolio-hover-bg.js';
import { initPortfolioRepeatingTransition } from './portfolio-repeating-transition.js';

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const getColumnCount = () => {
  if (window.matchMedia('(min-width: 1024px)').matches) return 5;
  if (window.matchMedia('(min-width: 640px)').matches) return 3;
  return 2;
};

const distributeCases = (cases, columnCount) => {
  const columns = Array.from({ length: columnCount }, () => []);
  cases.forEach((item, index) => {
    columns[index % columnCount].push({ item, index });
  });
  return columns;
};

const renderKeywords = (keywords) =>
  keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join('');

const renderCard = ({ item, index }) => `
  <article
    class="portfolio-work portfolio-card"
    id="portfolio-${escapeHtml(item.id)}"
    data-portfolio-id="${escapeHtml(item.id)}"
    data-index="${index}"
  >
    <picture class="portfolio-work__hover-src">
      <img src="${escapeHtml(item.hoverImage)}" alt="" loading="lazy" decoding="async" />
    </picture>
    <div class="portfolio-work__inner">
      <h2 class="portfolio-work__title portfolio-company-title" data-text="${escapeHtml(item.company)}">${escapeHtml(item.company)}</h2>
      <p class="portfolio-work__keywords">${renderKeywords(item.keywords)}</p>
      <div class="portfolio-work__thumb">
        <img
          src="${escapeHtml(item.thumbnail)}"
          alt="${escapeHtml(item.company)}"
          loading="lazy"
          decoding="async"
          role="button"
          tabindex="0"
        />
        <div class="portfolio-work__detail" aria-hidden="true">
          <span class="portfolio-work__detail-label">detail</span>
        </div>
      </div>
    </div>
  </article>
`;

const renderColumns = (cases) => {
  const columnCount = getColumnCount();
  const columns = distributeCases(cases, columnCount);

  return `
    <div class="portfolio-grid portfolio-work-list" data-columns="${columnCount}">
      ${columns
        .map(
          (column) => `
        <div class="portfolio-work-list__col">
          ${column.map(renderCard).join('')}
        </div>
      `,
        )
        .join('')}
    </div>
  `;
};

const boot = () => {
  const root = document.getElementById('portfolio-root');
  if (!root) return;

  let cleanups = [];

  const mount = () => {
    cleanups.forEach((cleanup) => cleanup());
    cleanups = [];

    root.innerHTML = renderColumns(PORTFOLIO_CASES);
    initMalLogos();
    setPageFavicon('bottom');

    const hover = initPortfolioHoverBg(root);
    if (hover) cleanups.push(() => hover.destroy());

    const transitionCleanup = initPortfolioRepeatingTransition({
      root,
      cases: PORTFOLIO_CASES,
      reducedMotion: prefersReducedMotion(),
      onDetailOpenChange: (open) => hover?.setEnabled(!open),
    });
    if (transitionCleanup) cleanups.push(transitionCleanup);
  };

  mount();

  let resizeTimer;
  window.addEventListener('resize', () => {
    const nextCount = getColumnCount();
    const currentCount = Number(root.querySelector('.portfolio-grid')?.dataset.columns || 0);
    if (nextCount === currentCount) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(mount, 150);
  });

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
