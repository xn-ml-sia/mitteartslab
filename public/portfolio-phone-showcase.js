import { PixelTooltip } from './portfolio-pixel-tooltip.js';

const MAX_SCREENS = 5;
const FLIP_DURATION_MS = 800;
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
  const heroFlipInner = panel.querySelector('.portfolio-detail__hero-flip-inner');
  const heroFront = panel.querySelector('.portfolio-detail__hero-face--front');
  const phoneSection = panel.querySelector('.portfolio-detail__phone');
  const phoneRoot = panel.querySelector('[data-phone-root]');
  const screensEl = panel.querySelector('[data-phone-screens]');
  const labelsEl = panel.querySelector('[data-phone-labels]');
  const flatEl = panel.querySelector('[data-phone-flat]');

  if (!primaryHero || !heroFlipInner || !heroFront || !phoneSection || !phoneRoot || !screensEl || !labelsEl) {
    return null;
  }

  let layersOpen = false;
  let isFlipped = false;
  let explodeEffect = 3;
  let hasPhoneScreens = false;
  let flipTimer = null;
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
  };

  const updatePrimaryAria = () => {
    if (!hasPhoneScreens) return;

    if (!isFlipped) {
      primaryHero.setAttribute('aria-label', 'Reveal mobile app screens');
      return;
    }

    if (explodeEffect === 3) {
      primaryHero.setAttribute('aria-label', 'Switch to alternate exploded view');
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
  };

  const setFlipped = (flipped) => {
    isFlipped = flipped;
    primaryHero.classList.toggle('is-flipped', flipped);
    primaryHero.setAttribute('aria-expanded', String(flipped));
    updatePrimaryAria();
  };

  const switchExplodeEffect = (effect) => {
    if (!isFlipped || !layersOpen || effect === explodeEffect) return;

    if (flipTimer) {
      window.clearTimeout(flipTimer);
      flipTimer = null;
    }

    resetTooltipsInstant();
    explodeEffect = effect;
    applyExplodeEffect(effect);
    updatePrimaryAria();
    setTooltipLayers(true);
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
    phoneRoot.classList.remove('is-layers-open', 'is-effect-1', 'is-effect-3');
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
      screenBtn.style.backgroundImage = `url("${screen.src}")`;
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

  const onPrimaryClick = (event) => {
    if (!hasPhoneScreens) return;
    if (event.target.closest('.portfolio-phone__screen, .portfolio-phone__flat-item')) return;
    event.stopPropagation();

    if (!isFlipped) {
      revealPhone();
      return;
    }

    if (reducedMotion || explodeEffect === 1) {
      concealPhone();
      return;
    }

    switchExplodeEffect(1);
  };

  const onPrimaryKeydown = (event) => {
    if (!hasPhoneScreens) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();

    if (!isFlipped) {
      revealPhone();
      return;
    }

    if (reducedMotion || explodeEffect === 1) {
      concealPhone();
      return;
    }

    switchExplodeEffect(1);
  };

  primaryHero.addEventListener('click', onPrimaryClick);
  primaryHero.addEventListener('keydown', onPrimaryKeydown);

  return {
    renderPhoneShowcase,
    resetPhoneShowcase,
    destroy: () => {
      primaryHero.removeEventListener('click', onPrimaryClick);
      primaryHero.removeEventListener('keydown', onPrimaryKeydown);
      primaryHero.removeAttribute('tabindex');
      primaryHero.removeAttribute('role');
      resetPhoneShowcase();
    },
  };
};
