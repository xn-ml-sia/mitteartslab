import { PixelTooltip } from './portfolio-pixel-tooltip.js';

const MAX_SCREENS = 5;
const FLIP_DURATION_MS = 800;
const EFFECT_REVERSE_MS = 1400;
const EFFECT_HANDOFF_MS = 1400;
const EFFECT_EXPLODE_MS = 1400;
const TOOLTIP_OPEN_STAGGER = 0.12;

const tooltipWord = (text) => {
  const word = String(text || '').trim().split(/\s+/)[0];
  return word || 'screen';
};

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
  const labelsEl = panel.querySelector('[data-phone-labels]');
  const flatEl = panel.querySelector('[data-phone-flat]');

  if (!primaryHero || !heroFlip || !heroFlipInner || !heroFront || !phoneSection || !phoneRoot || !screensEl || !labelsEl) {
    return null;
  }

  const effectToggleEl = document.createElement('div');
  effectToggleEl.className = 'portfolio-phone__effect-toggle';
  effectToggleEl.hidden = true;
  effectToggleEl.setAttribute('data-phone-effect-toggle', '');
  effectToggleEl.innerHTML = `
    <div class="portfolio-phone__toggle-container">
      <input
        type="checkbox"
        class="portfolio-phone__toggle-input"
        aria-label="Switch explode view: off is effect 3, on is effect 1"
      >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 292 142" class="portfolio-phone__toggle" aria-hidden="true">
        <path d="M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0C110.212 0 119 30 146 30C173 30 182 0 221 0C260 0 292 31.7878 292 71C292 110.212 260.212 142 221 142C181.788 142 173 112 146 112C119 112 110.212 142 71 142Z" class="portfolio-phone__toggle-background"></path>
        <rect rx="6" height="64" width="12" y="39" x="64" class="portfolio-phone__toggle-icon portfolio-phone__toggle-icon--on"></rect>
        <path d="M221 91C232.046 91 241 82.0457 241 71C241 59.9543 232.046 51 221 51C209.954 51 201 59.9543 201 71C201 82.0457 209.954 91 221 91ZM221 103C238.673 103 253 88.6731 253 71C253 53.3269 238.673 39 221 39C203.327 39 189 53.3269 189 71C189 88.6731 203.327 103 221 103Z" fill-rule="evenodd" class="portfolio-phone__toggle-icon portfolio-phone__toggle-icon--off"></path>
        <g filter="url(#portfolio-phone-effect-goo)">
          <rect fill="#fff" rx="29" height="58" width="116" y="42" x="13" class="portfolio-phone__toggle-circle-center"></rect>
          <rect fill="#fff" rx="58" height="114" width="114" y="14" x="14" class="portfolio-phone__toggle-circle portfolio-phone__toggle-circle--left"></rect>
          <rect fill="#fff" rx="58" height="114" width="114" y="14" x="164" class="portfolio-phone__toggle-circle portfolio-phone__toggle-circle--right"></rect>
        </g>
        <filter id="portfolio-phone-effect-goo">
          <feGaussianBlur stdDeviation="10" result="blur" in="SourceGraphic"></feGaussianBlur>
          <feColorMatrix result="goo" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" mode="matrix" in="blur"></feColorMatrix>
        </filter>
      </svg>
    </div>
  `;

  const effectToggleInput = effectToggleEl.querySelector('.portfolio-phone__toggle-input');
  heroFlip.appendChild(effectToggleEl);

  let layersOpen = false;
  let isFlipped = false;
  let explodeEffect = 3;
  let hasPhoneScreens = false;
  let isEffectSwitching = false;
  let toggleTargetEffect = null;
  let flipTimer = null;
  let effectSwitchTimer = null;
  let closeTimer = null;
  let tooltipTimers = [];
  let tooltips = [];

  if (reducedMotion) {
    phoneRoot.classList.add('is-reduced-motion');
  }

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
    tooltipTimers.forEach((id) => window.clearTimeout(id));
    tooltipTimers = [];
  };

  const destroyTooltips = () => {
    tooltips.forEach((tooltip) => tooltip.destroy());
    tooltips = [];
    labelsEl.replaceChildren();
  };

  const applyExplodeEffect = (effect) => {
    phoneRoot.classList.toggle('is-effect-1', effect === 1);
    phoneRoot.classList.toggle('is-effect-3', effect === 3);
    updateEffectToggle();
  };

  const updateEffectToggle = () => {
    if (!effectToggleInput) return;

    const shownEffect = toggleTargetEffect ?? explodeEffect;
    effectToggleEl.hidden = !layersOpen || !hasPhoneScreens;
    effectToggleInput.checked = shownEffect === 1;
    effectToggleInput.disabled = isEffectSwitching;
  };

  const updatePrimaryAria = () => {
    if (!hasPhoneScreens) return;

    if (!isFlipped) {
      primaryHero.setAttribute('aria-label', 'Reveal mobile app screens');
      return;
    }

    primaryHero.setAttribute('aria-label', 'Return to project image');
  };

  const resetTooltipsInstant = () => {
    tooltipTimers.forEach((id) => window.clearTimeout(id));
    tooltipTimers = [];

    tooltips.forEach((tooltip) => {
      if (tooltip.tl) tooltip.tl.kill();
      tooltip.isOpen = false;
      tooltip.DOM.el.classList.remove('tooltip--show');
      gsap.set(tooltip.DOM.el, { zIndex: 0 });
      gsap.set(tooltip.DOM.cells, { opacity: 0, scale: 0 });
      gsap.set(tooltip.DOM.contentTitle, { opacity: 0 });
      tooltip.DOM.contentTitle.classList.remove('glitch');
    });
  };

  const setTooltipLayers = (open) => {
    tooltipTimers.forEach((id) => window.clearTimeout(id));
    tooltipTimers = [];

    if (reducedMotion) {
      tooltips.forEach((tooltip) => {
        tooltip.DOM.el.classList.toggle('tooltip--show', open);
        tooltip.DOM.el.style.opacity = open ? '1' : '0';
        tooltip.isOpen = open;
        if (open) {
          gsap.set(tooltip.DOM.cells, { opacity: 1, scale: 1 });
          gsap.set(tooltip.DOM.contentTitle, { opacity: 1 });
        }
      });
      return;
    }

    tooltips.forEach((tooltip, index) => {
      const delayMs = open ? index * TOOLTIP_OPEN_STAGGER * 1000 : (tooltips.length - 1 - index) * 50;
      const timerId = window.setTimeout(() => {
        if (open) tooltip.open('Effect2');
        else tooltip.close('Effect2');
      }, delayMs);
      tooltipTimers.push(timerId);
    });
  };

  const setLayersOpen = (open) => {
    layersOpen = open;
    phoneRoot.classList.toggle('is-layers-open', open);
    if (open) {
      applyExplodeEffect(explodeEffect);
    } else {
      phoneRoot.classList.remove('is-effect-1', 'is-effect-3');
    }
    labelsEl.setAttribute('aria-hidden', String(!open));
    if (flatEl) flatEl.hidden = !open || !reducedMotion;
    setTooltipLayers(open);
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

    resetTooltipsInstant();

    if (reducedMotion) {
      explodeEffect = effect;
      applyExplodeEffect(effect);
      updatePrimaryAria();
      setTooltipLayers(true);
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
        if (layersOpen && explodeEffect === effect) {
          setTooltipLayers(true);
        }

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

  const revealPhone = () => {
    if (!hasPhoneScreens || isFlipped) return;

    explodeEffect = 3;
    phoneSection.hidden = false;
    setFlipped(true);

    if (reducedMotion) {
      setLayersOpen(true);
      return;
    }

    flipTimer = window.setTimeout(() => {
      flipTimer = null;
      setLayersOpen(true);
    }, FLIP_DURATION_MS);
  };

  const concealPhone = () => {
    if (!isFlipped) return;

    setTooltipLayers(false);
    explodeEffect = 3;

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
    clearTimers();
    layersOpen = false;
    explodeEffect = 3;
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
    destroyTooltips();
    labelsEl.setAttribute('aria-hidden', 'true');
    if (flatEl) {
      flatEl.replaceChildren();
      flatEl.hidden = true;
    }
    phoneSection.hidden = true;
    hasPhoneScreens = false;
    setFlipped(false);
    primaryHero.classList.remove('is-phone-ready');
    primaryHero.removeAttribute('tabindex');
    primaryHero.removeAttribute('role');
    primaryHero.removeAttribute('aria-expanded');
    primaryHero.removeAttribute('aria-label');
    updateEffectToggle();
  };

  const createScreenTooltip = (screen, index) => {
    const tooltipEl = document.createElement('div');
    tooltipEl.className = `portfolio-phone__tooltip tooltip portfolio-phone__tooltip--${index + 1}`;
    tooltipEl.dataset.rows = '2';
    tooltipEl.dataset.cols = '4';
    tooltipEl.innerHTML = `
      <div class="tooltip__bg"></div>
      <div class="tooltip__content">
        <h3 class="tooltip__content-title"></h3>
        <p class="tooltip__content-desc"></p>
      </div>
    `;

    const title = tooltipWord(screen.label || screen.alt || `Screen ${index + 1}`);

    labelsEl.appendChild(tooltipEl);

    const tooltip = new PixelTooltip(tooltipEl);
    tooltip.setContent({ title });
    return tooltip;
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
      const screenBtn = document.createElement('button');
      screenBtn.type = 'button';
      screenBtn.className = `portfolio-phone__screen portfolio-phone__screen--${index + 1}`;

      const screenMedia = document.createElement('span');
      screenMedia.className = 'portfolio-phone__screen-media';
      screenMedia.style.backgroundImage = `url("${screen.src}")`;
      screenMedia.setAttribute('aria-hidden', 'true');
      screenBtn.appendChild(screenMedia);

      screenBtn.setAttribute('aria-label', screen.alt || screen.label || `Screen ${index + 1}`);
      screensEl.appendChild(screenBtn);

      tooltips.push(createScreenTooltip(screen, index));

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

  const onEffectToggleChange = () => {
    const effect = effectToggleInput.checked ? 1 : 3;
    if (isEffectSwitching || effect === explodeEffect) {
      updateEffectToggle();
      return;
    }

    switchExplodeEffect(effect);
  };

  const onPrimaryClick = (event) => {
    if (!hasPhoneScreens) return;
    if (event.target.closest('.portfolio-phone__screen, .portfolio-phone__flat-item, .portfolio-phone__effect-toggle')) {
      return;
    }
    event.stopPropagation();

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

    if (!isFlipped) {
      revealPhone();
      return;
    }

    if (isEffectSwitching) return;

    concealPhone();
  };

  primaryHero.addEventListener('click', onPrimaryClick);
  primaryHero.addEventListener('keydown', onPrimaryKeydown);
  effectToggleInput.addEventListener('change', onEffectToggleChange);

  return {
    renderPhoneShowcase,
    resetPhoneShowcase,
    destroy: () => {
      primaryHero.removeEventListener('click', onPrimaryClick);
      primaryHero.removeEventListener('keydown', onPrimaryKeydown);
      effectToggleInput.removeEventListener('change', onEffectToggleChange);
      primaryHero.removeAttribute('tabindex');
      primaryHero.removeAttribute('role');
      resetPhoneShowcase();
    },
  };
};
