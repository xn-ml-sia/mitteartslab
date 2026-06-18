import { renderPage } from './services-sections.js';
import { initEffects } from './services-effects.js';
import { initMalLogos, setPageFavicon } from './mal-logo.js';

const boot = () => {
  const main = document.getElementById('page_content');
  if (!main) return;

  main.innerHTML = renderPage();
  initMalLogos(main);
  setPageFavicon('bottom');

  const effects = initEffects(main);
  window.addEventListener('pagehide', () => effects.dispose(), { once: true });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
