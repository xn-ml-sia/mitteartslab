import { HOME_ROCK_SHADER } from './home-rock-shader.js';
import { HOME_CONFIG } from './home-config.js';
import { HomeState } from './home-state.js';
import { HomeRenderer } from './home-renderer.js';
import { initHomeMenus } from './home-menu.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('home-mode-root');

const PORTFOLIO_PASSWORD = 'AX';

const initPasswordGate = (selector, options = {}) => {
  const { allowHashHref = true } = options;
  const link = document.querySelector(selector);
  if (!(link instanceof HTMLAnchorElement)) return;

  link.addEventListener('click', (event) => {
    event.preventDefault();
    const value = window.prompt('Enter portfolio password');
    if (value === null) return;
    if (value !== PORTFOLIO_PASSWORD) {
      window.alert('Unverified access');
      return;
    }

    const href = link.getAttribute('href');
    if (!href) return;
    if (!allowHashHref && href === '#') return;
    window.location.assign(href);
  });
};

const initPortfolioGate = () => {
  initPasswordGate('[data-portfolio-link]');
};

const initBaseSystemGate = () => {
  initPasswordGate('[data-base-system-link]', { allowHashHref: false });
};

initHomeMenus();
initPortfolioGate();
initBaseSystemGate();

const canvas = document.getElementById('home-rock-canvas');
if (canvas) {
  const state = new HomeState(HOME_CONFIG);
  const renderer = new HomeRenderer(canvas, HOME_ROCK_SHADER, (nowMs) => {
    const effectActive = state.isEffectActive(nowMs, prefersReducedMotion);
    const effectElapsedSec = state.getEffectElapsedSec(nowMs, prefersReducedMotion);
    return {
      tSec: state.getRenderTimeSec(nowMs, prefersReducedMotion),
      mouse: [0, 0, 0, effectActive ? 1 + effectElapsedSec : 0],
      continuous: !prefersReducedMotion || effectActive,
    };
  });

  if (renderer.isReady()) {
    const onResize = () => {
      state.syncScroll();
      renderer.resize();
      renderer.requestFrame();
    };

    const onScroll = () => {
      state.syncScroll();
      state.loopScrollIfNeeded();
      state.maybeTriggerEffect(performance.now(), prefersReducedMotion);
      renderer.requestFrame();
    };

    const onVisibility = () => {
      const visible = !document.hidden;
      renderer.setVisible(visible);
      if (visible) renderer.requestFrame();
    };

    const restartShader = () => {
      state.restart();
      renderer.restart();
    };

    renderer.restart();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('load', restartShader);
    window.addEventListener('pageshow', restartShader);
  }
}
