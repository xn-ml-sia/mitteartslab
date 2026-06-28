import { HOME_ROCK_SHADER } from './home-rock-shader.js';
import { HOME_CONFIG } from './home-config.js';
import { HomeState } from './home-state.js';
import { HomeRenderer } from './home-renderer.js';
import { HeroOrchestrator } from './home-orchestrator.js';
import { initHomeMenus } from './home-menu.js';
import { initHomeAscii } from './home-ascii.js';
import { initHomeSmaugTooltip } from './home-smaug-tooltip.js';
import { initHomeTagline } from './home-tagline.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canParallax = !prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
document.documentElement.classList.add('home-mode-root');

const initPasswordGate = (selector, options = {}) => {
  const { allowHashHref = true } = options;
  const link = document.querySelector(selector);
  if (!(link instanceof HTMLAnchorElement)) return;

  link.addEventListener('click', (event) => {
    event.preventDefault();
    const value = window.prompt('Enter password');
    if (value === null) return;
    if (value !== 'AX') {
      window.alert('Unverified access');
      return;
    }

    const href = link.getAttribute('href');
    if (!href) return;
    if (!allowHashHref && href === '#') return;
    window.location.assign(href);
  });
};

const initBaseSystemGate = () => {
  initPasswordGate('[data-base-system-link]', { allowHashHref: false });
};

initHomeMenus();
initHomeAscii();
initHomeSmaugTooltip();
initBaseSystemGate();

const hero = document.querySelector('.home-hero');
const canvas = document.getElementById('home-rock-canvas');

const pointer = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
};

if (canParallax && hero) {
  hero.addEventListener(
    'pointermove',
    (event) => {
      pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true },
  );
}

const tagline = initHomeTagline({
  root: document,
  morphCycleSec: HOME_CONFIG.morphCycleSec,
  taglineConfig: HOME_CONFIG.tagline,
  getParallax: () => ({
    x: pointer.x * HOME_CONFIG.parallax.taglineX,
    y: pointer.y * HOME_CONFIG.parallax.taglineY,
  }),
  reducedMotion: prefersReducedMotion,
});

const isParallaxEnabled = () =>
  canParallax && !document.body.classList.contains('home-menu-open');

const smoothPointer = () => {
  if (!isParallaxEnabled()) {
    pointer.x = 0;
    pointer.y = 0;
    pointer.targetX = 0;
    pointer.targetY = 0;
    return;
  }
  const lerp = HOME_CONFIG.mouseLerp;
  pointer.x += (pointer.targetX - pointer.x) * lerp;
  pointer.y += (pointer.targetY - pointer.y) * lerp;
};

if (canvas) {
  const state = new HomeState(HOME_CONFIG);
  const renderer = new HomeRenderer(canvas, HOME_ROCK_SHADER, (nowMs) => {
    smoothPointer();
    tagline?.update();

    return {
      tSec: state.getRenderTimeSec(nowMs, prefersReducedMotion),
      morphPhase: state.getMorphPhase(nowMs, prefersReducedMotion),
      mouse: [pointer.x, pointer.y, isParallaxEnabled() ? 1 : 0, 0],
      continuous: !prefersReducedMotion || state.isEffectActive(nowMs, prefersReducedMotion),
    };
  });

  if (renderer.isReady()) {
    const orchestrator = new HeroOrchestrator({ state, renderer, tagline });

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

    orchestrator.restart();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('load', () => orchestrator.restart());
    window.addEventListener('pageshow', () => orchestrator.restart());
  }
}
