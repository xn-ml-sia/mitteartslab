const MAX_SCREENS = 5;
const DEFAULT_EXPLODE_EFFECT = 1;
const FLIP_DURATION_MS = 800;
const EFFECT_REVERSE_MS = 1400;
const EFFECT_HANDOFF_MS = 1400;
const EFFECT_EXPLODE_MS = 1400;
const AUTO_FLIP_DELAY_MS = 3500;
const AUTO_EFFECT_SWITCH_DELAY_MS = 5000;

export const initPortfolioPhoneShowcase = ({
  panel = document.getElementById('portfolio-detail'),
  reducedMotion = false,
} = {}) => {
  if (!panel) return null;

  const primaryHero = panel.querySelector('.portfolio-detail__img.is-primary');
  const heroFlip = panel.querySelector('.portfolio-detail__hero-flip');
  const heroFlipInner = panel.querySelector('.portfolio-detail__hero-flip-inner');
  const heroFront = panel.querySelector('.portfolio-detail__hero-face--front');
  const phoneSection = panel.querySelector('.portfolio-detail__phone');
  const phoneRoot = panel.querySelector('[data-phone-root]');
  const screensEl = panel.querySelector('[data-phone-screens]');
  const flatEl = panel.querySelector('[data-phone-flat]');

  if (!primaryHero || !heroFlip || !heroFlipInner || !heroFront || !phoneSection || !phoneRoot || !screensEl) {
    return null;
  }

  const effectToggleEl = document.createElement('div');
  effectToggleEl.className = 'portfolio-phone__effect-toggle';
  effectToggleEl.hidden = true;
  effectToggleEl.setAttribute('data-phone-effect-toggle', '');
  effectToggleEl.innerHTML = `
    <button
      type="button"
      class="portfolio-phone__effect-btn"
      aria-label="Switch explode view to effect 1"
      aria-pressed="false"
    >
      <img
        class="portfolio-phone__effect-btn-icon"
        src="/public/assets/dot-icon/cube-solid.png"
        alt=""
        width="48"
        height="48"
        decoding="async"
      >
    </button>
  `;

  const effectToggleBtn = effectToggleEl.querySelector('.portfolio-phone__effect-btn');
  heroFlip.appendChild(effectToggleEl);

  let layersOpen = false;
  let isFlipped = false;
  let explodeEffect = DEFAULT_EXPLODE_EFFECT;
  let hasPhoneScreens = false;
  let isEffectSwitching = false;
  let toggleTargetEffect = null;
  let flipTimer = null;
  let effectSwitchTimer = null;
  let closeTimer = null;
  let autoFlipTimer = null;
  let autoEffectTimer = null;
  let autoDemoGeneration = 0;

  if (reducedMotion) {
    phoneRoot.classList.add('is-reduced-motion');
  }

  const clearAutoDemoTimers = () => {
    if (autoFlipTimer) {
      window.clearTimeout(autoFlipTimer);
      autoFlipTimer = null;
    }
    if (autoEffectTimer) {
      window.clearTimeout(autoEffectTimer);
      autoEffectTimer = null;
    }
  };

  const cancelAutoDemo = () => {
    autoDemoGeneration += 1;
    clearAutoDemoTimers();
  };

  const startAutoDemo = () => {
    cancelAutoDemo();
    if (reducedMotion || !hasPhoneScreens) return;

    const generation = autoDemoGeneration;

    autoFlipTimer = window.setTimeout(() => {
      autoFlipTimer = null;
      if (generation !== autoDemoGeneration || isFlipped || !hasPhoneScreens) return;

      revealPhone();

      autoEffectTimer = window.setTimeout(() => {
        autoEffectTimer = null;
        if (generation !== autoDemoGeneration || !isFlipped || !layersOpen || isEffectSwitching) return;
        if (explodeEffect === 3) return;
        switchExplodeEffect(3);
      }, AUTO_EFFECT_SWITCH_DELAY_MS);
    }, AUTO_FLIP_DELAY_MS);
  };

  const clearTimers = () => {
    if (flipTimer) {
      window.clearTimeout(flipTimer);
      flipTimer = null;
    }
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (effectSwitchTimer) {
      window.clearTimeout(effectSwitchTimer);
      effectSwitchTimer = null;
    }
  };

  const applyExplodeEffect = (effect) => {
    phoneRoot.classList.toggle('is-effect-1', effect === 1);
    phoneRoot.classList.toggle('is-effect-3', effect === 3);
    updateEffectToggle();
  };

  const updateEffectToggle = () => {
    if (!effectToggleBtn) return;

    const shownEffect = toggleTargetEffect ?? explodeEffect;
    effectToggleEl.hidden = !layersOpen || !hasPhoneScreens;
    effectToggleEl.classList.toggle('is-switching', isEffectSwitching);
    effectToggleBtn.disabled = isEffectSwitching;
    effectToggleBtn.setAttribute('aria-pressed', String(shownEffect === 1));
    effectToggleBtn.setAttribute(
      'aria-label',
      shownEffect === 1 ? 'Switch explode view to effect 3' : 'Switch explode view to effect 1',
    );
  };

  const updatePrimaryAria = () => {
    if (!hasPhoneScreens) return;

    if (!isFlipped) {
      primaryHero.setAttribute('aria-label', 'Reveal mobile app screens');
      return;
    }

    primaryHero.setAttribute('aria-label', 'Return to project image');
  };

  const setLayersOpen = (open) => {
    layersOpen = open;
    phoneRoot.classList.toggle('is-layers-open', open);
    if (open) {
      applyExplodeEffect(explodeEffect);
    } else {
      phoneRoot.classList.remove('is-effect-1', 'is-effect-3');
    }
    if (flatEl) flatEl.hidden = !open || !reducedMotion;
    updateEffectToggle();
  };

  const setFlipped = (flipped) => {
    isFlipped = flipped;
    primaryHero.classList.toggle('is-flipped', flipped);
    primaryHero.setAttribute('aria-expanded', String(flipped));
    updatePrimaryAria();
  };

  const switchExplodeEffect = (effect) => {
    if (!isFlipped || !layersOpen || effect === explodeEffect || isEffectSwitching) return;

    if (flipTimer) {
      window.clearTimeout(flipTimer);
      flipTimer = null;
    }
    if (effectSwitchTimer) {
      window.clearTimeout(effectSwitchTimer);
      effectSwitchTimer = null;
    }

    if (reducedMotion) {
      explodeEffect = effect;
      applyExplodeEffect(effect);
      updatePrimaryAria();
      return;
    }

    isEffectSwitching = true;
    toggleTargetEffect = effect;
    updateEffectToggle();
    phoneRoot.classList.add('is-screens-collapsing');

    flipTimer = window.setTimeout(() => {
      flipTimer = null;
      phoneRoot.classList.remove('is-screens-collapsing');
      explodeEffect = effect;
      applyExplodeEffect(effect);
      updatePrimaryAria();
      phoneRoot.classList.add('is-screens-collapsed');

      effectSwitchTimer = window.setTimeout(() => {
        effectSwitchTimer = null;
        phoneRoot.classList.remove('is-screens-collapsed');
        phoneRoot.classList.add('is-screens-exploding');

        flipTimer = window.setTimeout(() => {
          flipTimer = null;
          phoneRoot.classList.remove('is-screens-exploding');
          isEffectSwitching = false;
          toggleTargetEffect = null;
          updateEffectToggle();
        }, EFFECT_EXPLODE_MS);
      }, EFFECT_HANDOFF_MS);
    }, EFFECT_REVERSE_MS);
  };

  const runExplodeHandoff = () => {
    phoneRoot.classList.remove('is-screens-collapsed');
    phoneRoot.classList.add('is-screens-exploding');

    flipTimer = window.setTimeout(() => {
      flipTimer = null;
      phoneRoot.classList.remove('is-screens-exploding');
    }, EFFECT_EXPLODE_MS);
  };

  const revealPhone = () => {
    if (!hasPhoneScreens || isFlipped) return;

    explodeEffect = DEFAULT_EXPLODE_EFFECT;
    phoneSection.hidden = false;
    phoneRoot.classList.add('is-screens-collapsed');
    setLayersOpen(true);
    setFlipped(true);

    if (reducedMotion) {
      primaryHero.classList.add('is-flip-settled');
      phoneRoot.classList.remove('is-screens-collapsed');
      return;
    }

    flipTimer = window.setTimeout(() => {
      flipTimer = null;
      primaryHero.classList.add('is-flip-settled');
      runExplodeHandoff();
    }, FLIP_DURATION_MS);
  };

  const concealPhone = () => {
    if (!isFlipped) return;

    explodeEffect = DEFAULT_EXPLODE_EFFECT;
    primaryHero.classList.remove('is-flip-settled');
    phoneRoot.classList.remove('is-screens-collapsed', 'is-screens-exploding', 'is-screens-collapsing');

    if (reducedMotion) {
      setFlipped(false);
      setLayersOpen(false);
      phoneSection.hidden = true;
      return;
    }

    setFlipped(false);

    closeTimer = window.setTimeout(() => {
      closeTimer = null;
      setLayersOpen(false);
      phoneSection.hidden = true;
    }, FLIP_DURATION_MS);
  };

  const resetPhoneShowcase = () => {
    cancelAutoDemo();
    clearTimers();
    layersOpen = false;
    explodeEffect = DEFAULT_EXPLODE_EFFECT;
    isEffectSwitching = false;
    toggleTargetEffect = null;
    phoneRoot.classList.remove(
      'is-layers-open',
      'is-effect-1',
      'is-effect-3',
      'is-screens-collapsing',
      'is-screens-collapsed',
      'is-screens-exploding',
    );
    screensEl.replaceChildren();
    if (flatEl) {
      flatEl.replaceChildren();
      flatEl.hidden = true;
    }
    phoneSection.hidden = true;
    hasPhoneScreens = false;
    setFlipped(false);
    primaryHero.classList.remove('is-flip-settled');
    primaryHero.classList.remove('is-phone-ready');
    primaryHero.removeAttribute('tabindex');
    primaryHero.removeAttribute('role');
    primaryHero.removeAttribute('aria-expanded');
    primaryHero.removeAttribute('aria-label');
    updateEffectToggle();
  };

  const renderPhoneShowcase = (portfolioCase) => {
    resetPhoneShowcase();

    const screens = (portfolioCase?.phoneScreens || []).slice(0, MAX_SCREENS);
    if (!screens.length) return;

    hasPhoneScreens = true;
    primaryHero.classList.add('is-phone-ready');
    primaryHero.setAttribute('tabindex', '0');
    primaryHero.setAttribute('role', 'button');
    primaryHero.setAttribute('aria-expanded', 'false');
    primaryHero.setAttribute('aria-label', 'Reveal mobile app screens');

    screens.forEach((screen, index) => {
      const screenLayer = document.createElement('div');
      screenLayer.className = `portfolio-phone__screen portfolio-phone__screen--${index + 1}`;

      const screenMedia = document.createElement('span');
      screenMedia.className = 'portfolio-phone__screen-media';
      screenMedia.style.backgroundImage = `url("${screen.src}")`;
      screenMedia.setAttribute('aria-hidden', 'true');
      screenLayer.appendChild(screenMedia);

      screensEl.appendChild(screenLayer);

      if (reducedMotion && flatEl) {
        const flatItem = document.createElement('button');
        flatItem.type = 'button';
        flatItem.className = 'portfolio-phone__flat-item';

        const thumb = document.createElement('span');
        thumb.className = 'portfolio-phone__flat-thumb';
        thumb.style.backgroundImage = `url("${screen.src}")`;
        thumb.setAttribute('aria-hidden', 'true');

        const flatLabel = document.createElement('span');
        flatLabel.className = 'portfolio-phone__flat-label';
        flatLabel.textContent = screen.label || screen.alt || `Screen ${index + 1}`;

        flatItem.append(thumb, flatLabel);
        flatEl.appendChild(flatItem);
      }
    });
  };

  const onEffectToggleClick = (event) => {
    event.stopPropagation();
    cancelAutoDemo();
    const shownEffect = toggleTargetEffect ?? explodeEffect;
    const effect = shownEffect === 1 ? 3 : 1;
    if (isEffectSwitching || effect === explodeEffect) {
      updateEffectToggle();
      return;
    }

    switchExplodeEffect(effect);
  };

  const onPrimaryClick = (event) => {
    if (!hasPhoneScreens) return;
    if (event.target.closest('.portfolio-phone__flat-item, .portfolio-phone__effect-toggle')) {
      return;
    }
    event.stopPropagation();
    cancelAutoDemo();

    if (!isFlipped) {
      revealPhone();
      return;
    }

    if (isEffectSwitching) return;

    concealPhone();
  };

  const onPrimaryKeydown = (event) => {
    if (!hasPhoneScreens) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    cancelAutoDemo();

    if (!isFlipped) {
      revealPhone();
      return;
    }

    if (isEffectSwitching) return;

    concealPhone();
  };

  primaryHero.addEventListener('click', onPrimaryClick);
  primaryHero.addEventListener('keydown', onPrimaryKeydown);
  effectToggleBtn.addEventListener('click', onEffectToggleClick);

  return {
    renderPhoneShowcase,
    resetPhoneShowcase,
    startAutoDemo,
    cancelAutoDemo,
    destroy: () => {
      primaryHero.removeEventListener('click', onPrimaryClick);
      primaryHero.removeEventListener('keydown', onPrimaryKeydown);
      effectToggleBtn.removeEventListener('click', onEffectToggleClick);
      primaryHero.removeAttribute('tabindex');
      primaryHero.removeAttribute('role');
      resetPhoneShowcase();
    },
  };
};
