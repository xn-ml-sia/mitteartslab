import { createShaderToyRunner } from './shader-runner.js';
import { HOME_ROCK_SHADER } from './home-rock-shader.js';

const SCROLL_ROT_SCALE = 0.004;
const SCROLL_EDGE_BUFFER = 72;
const SCROLL_LOOP_PADDING = 48;
const ROTATION_TRIGGER_MULTIPLIER = 4;
const EFFECT_DURATION_MS = 2000;
const FULL_ROTATION = Math.PI * 2;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('home-mode-root');

const canvas = document.getElementById('home-rock-canvas');
if (canvas) {
  const runner = createShaderToyRunner(canvas, HOME_ROCK_SHADER);
  if (runner) {
    let frame = 0;
    let lastMs = 0;
    let scrollRot = window.scrollY * SCROLL_ROT_SCALE;
    let lastScrollY = window.scrollY;
    const mouse = [0, 0, 0, 0];
    let isVisible = !document.hidden;
    let renderQueued = false;
    let isScrollLooping = false;
    let effectUntilMs = 0;
    let effectStartMs = 0;
    let lastTriggerIndex = 0;

    const getTriggerIndex = () =>
      Math.floor(Math.abs(scrollRot) / (FULL_ROTATION * ROTATION_TRIGGER_MULTIPLIER));

    const queueRender = () => {
      if (renderQueued) return;
      renderQueued = true;
      window.requestAnimationFrame(renderOnce);
    };

    const syncScroll = () => {
      if (isScrollLooping) return;
      const nextY = window.scrollY;
      const deltaY = nextY - lastScrollY;
      lastScrollY = nextY;
      scrollRot += deltaY * SCROLL_ROT_SCALE;
    };

    const maybeTriggerEffect = () => {
      if (prefersReducedMotion) return;
      if (performance.now() < effectUntilMs) return;
      const triggerIndex = getTriggerIndex();
      if (triggerIndex <= 0 || triggerIndex === lastTriggerIndex) return;
      lastTriggerIndex = triggerIndex;
      effectStartMs = performance.now();
      effectUntilMs = effectStartMs + EFFECT_DURATION_MS;
      queueRender();
    };

    const loopScrollIfNeeded = () => {
      if (isScrollLooping) return;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (maxScroll <= SCROLL_EDGE_BUFFER * 2) return;
      const y = window.scrollY;
      let targetY = null;
      if (y >= maxScroll - SCROLL_EDGE_BUFFER) {
        const overflow = y - (maxScroll - SCROLL_EDGE_BUFFER);
        targetY = SCROLL_LOOP_PADDING + overflow;
      }
      if (y <= 0) {
        const underflow = -y;
        targetY = maxScroll - SCROLL_EDGE_BUFFER - SCROLL_LOOP_PADDING - underflow;
      }
      if (targetY === null) return;
      targetY = Math.max(SCROLL_LOOP_PADDING, Math.min(maxScroll - SCROLL_LOOP_PADDING, targetY));
      isScrollLooping = true;
      window.scrollTo(0, targetY);
      lastScrollY = targetY;
      window.requestAnimationFrame(() => {
        isScrollLooping = false;
      });
    };

    const renderOnce = (nowMs) => {
      renderQueued = false;
      if (!isVisible) return;

      const dtSec = Math.min(0.1, Math.max(0, (nowMs - lastMs) / 1000));
      lastMs = nowMs;
      const tSec = prefersReducedMotion ? 0 : scrollRot;
      const effectActive = !prefersReducedMotion && nowMs < effectUntilMs;
      const effectElapsedSec = effectActive ? (nowMs - effectStartMs) / 1000 : 0;
      mouse[3] = effectActive ? 1 + effectElapsedSec : 0;
      runner.render(tSec, dtSec, frame, mouse);
      frame += 1;

      if (effectActive) {
        renderQueued = true;
        window.requestAnimationFrame(renderOnce);
      }
    };

    const onResize = (event) => {
      if (event) syncScroll();
      runner.resize();
      queueRender();
    };

    const onScroll = () => {
      syncScroll();
      loopScrollIfNeeded();
      maybeTriggerEffect();
      queueRender();
    };

    const onVisibility = () => {
      isVisible = !document.hidden;
      if (!isVisible) {
        renderQueued = false;
        return;
      }
      queueRender();
    };

    const restartShader = () => {
      lastScrollY = window.scrollY;
      scrollRot = 0;
      effectUntilMs = 0;
      effectStartMs = 0;
      lastTriggerIndex = 0;
      frame = 0;
      runner.resize();
      lastMs = performance.now();
      queueRender();
    };

    lastScrollY = window.scrollY;
    runner.resize();
    lastMs = performance.now();
    queueRender();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('load', restartShader);
    window.addEventListener('pageshow', restartShader);
  }
}

const menus = Array.from(document.querySelectorAll('[data-menu]'));

const closeMenus = () => {
  menus.forEach((menu) => {
    menu.classList.remove('is-open');
    const trigger = menu.querySelector('[data-menu-trigger]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
};

menus.forEach((menu) => {
  const trigger = menu.querySelector('[data-menu-trigger]');
  if (!trigger) return;
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    const isOpen = menu.classList.contains('is-open');
    closeMenus();
    if (!isOpen) {
      menu.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest('[data-menu]')) return;
  closeMenus();
});
