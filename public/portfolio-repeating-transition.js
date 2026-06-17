import { getPortfolioCase } from './portfolio-data.js';
import { THUMB_SELECTOR } from './portfolio-hover-bg.js';
import {
  resetDetailTitle,
  runCompanyTitleOpen,
  setCompanyTitleText,
} from './portfolio-title.js';

const setPortfolioFlipCaterpillarEnabled = () => {};

const config = {
  clipPathDirection: 'top-bottom',
  autoAdjustHorizontalClipPath: true,
  steps: 6,
  stepDuration: 0.35,
  stepInterval: 0.05,
  moverPauseBeforeExit: 0.14,
  rotationRange: 0,
  wobbleStrength: 0,
  panelRevealEase: 'sine.inOut',
  gridItemEase: 'sine',
  moverEnterEase: 'sine.in',
  moverExitEase: 'sine',
  panelRevealDurationFactor: 2,
  clickedItemDurationFactor: 2,
  gridItemStaggerFactor: 0.3,
  moverBlendMode: false,
  pathMotion: 'linear',
  sineAmplitude: 50,
  sineFrequency: Math.PI,
};

const originalConfig = { ...config };

const lerp = (a, b, t) => a + (b - a) * t;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const parsePortfolioIdFromPath = (pathname = window.location.pathname) => {
  const match = pathname.match(/^\/portfolio\/([^/.]+)\/?$/);
  return match ? match[1] : null;
};

const imageUrl = (imgEl) => {
  const src = imgEl.currentSrc || imgEl.src;
  return `url("${src}")`;
};

const preloadSlideImages = (cases) => {
  const urls = cases.flatMap((item) => [
    item.thumbnail,
    item.hoverImage,
    ...(item.detailImages?.map((image) => image.src) || []),
    ...(item.phoneScreens?.map((screen) => screen.src) || []),
    ...item.slides.map((slide) => slide.src),
  ]);
  return Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        }),
    ),
  );
};

const getThumbImage = (card) => card?.querySelector(THUMB_SELECTOR) || null;

const DETAIL_IMAGE_COUNT = 4;

const getDetailImageCount = (portfolioCase) =>
  portfolioCase.detailImageCount ?? DETAIL_IMAGE_COUNT;

const getDetailThumbCount = (portfolioCase) =>
  Math.max(0, getDetailImageCount(portfolioCase) - 1);

const getDetailImageSources = (portfolioCase) => {
  const count = getDetailImageCount(portfolioCase);

  if (portfolioCase.detailImages?.length >= count) {
    return portfolioCase.detailImages.slice(0, count).map((image) => image.src);
  }

  const pool = [
    portfolioCase.thumbnail,
    portfolioCase.hoverImage,
    ...(portfolioCase.slides?.map((slide) => slide.src) || []),
  ].filter(Boolean);

  const sources = [];
  pool.forEach((src) => {
    if (sources.length >= DETAIL_IMAGE_COUNT) return;
    if (!sources.includes(src)) sources.push(src);
  });

  while (sources.length < DETAIL_IMAGE_COUNT) {
    sources.push(sources[sources.length - 1]);
  }

  return sources.slice(0, DETAIL_IMAGE_COUNT);
};

const getDetailImageAlts = (portfolioCase) => {
  const count = getDetailImageCount(portfolioCase);

  if (portfolioCase.detailImages?.length >= count) {
    return portfolioCase.detailImages
      .slice(0, count)
      .map((image) => image.alt || portfolioCase.title);
  }

  const alts = portfolioCase.slides?.map((slide) => slide.alt) || [];
  while (alts.length < DETAIL_IMAGE_COUNT) {
    alts.push(portfolioCase.title);
  }
  return alts.slice(0, DETAIL_IMAGE_COUNT);
};

export const initPortfolioRepeatingTransition = ({
  root,
  cases,
  reducedMotion = prefersReducedMotion(),
  onDetailOpenChange,
  phoneShowcase,
} = {}) => {
  if (typeof gsap === 'undefined') return null;

  const grid = root?.querySelector('.portfolio-grid');
  const panel = document.getElementById('portfolio-detail');
  const panelGallery = panel?.querySelector('.portfolio-detail__gallery');
  const panelCells = Array.from(panel?.querySelectorAll('.portfolio-detail__img') || []);
  const panelImg = panel?.querySelector('.portfolio-detail__img.is-primary') || panelCells[0];
  if (!grid || !panel || !panelGallery || !panelImg || panelCells.length < DETAIL_IMAGE_COUNT) return null;

  const panelContent = panel.querySelector('.portfolio-detail__content');
  const panelTitle = panel.querySelector('.portfolio-detail__title');
  const panelSubtitle = panel.querySelector('.portfolio-detail__subtitle');
  const panelDescription = panel.querySelector('.portfolio-detail__description');
  const panelClose = panel.querySelector('.portfolio-detail__back');
  const page = document.body;

  let thumbRow = panel.querySelector('[data-detail-thumb-row]');
  if (!thumbRow) {
    thumbRow = document.createElement('div');
    thumbRow.className = 'portfolio-detail__thumb-row';
    thumbRow.setAttribute('data-detail-thumb-row', '');
    thumbRow.hidden = true;
    panelContent.insertAdjacentElement('afterend', thumbRow);
  }

  const secondaryCells = panelCells.filter((cell) => !cell.classList.contains('is-primary'));

  const syncThumbAspectRatio = (cell, src) => {
    cell.style.removeProperty('aspect-ratio');
    if (!src) return;

    const probe = new Image();
    probe.onload = () => {
      if (!cell.isConnected) return;
      const { naturalWidth, naturalHeight } = probe;
      if (naturalWidth > 0 && naturalHeight > 0) {
        cell.style.aspectRatio = `${naturalWidth} / ${naturalHeight}`;
      }
    };
    probe.src = src;
  };

  let isAnimating = false;
  let isPanelOpen = false;
  let currentCard = null;
  let currentImg = null;
  let historySilent = false;

  const getCards = () => Array.from(grid.querySelectorAll('.portfolio-card'));

  const restoreGridVisualState = () => {
    gsap.killTweensOf([...getCards(), ...root.querySelectorAll(THUMB_SELECTOR)]);
    getCards().forEach((card) => {
      gsap.set(card, { clearProps: 'opacity,scale,clipPath,transform,pointerEvents' });
    });
    root.querySelectorAll(THUMB_SELECTOR).forEach((img) => {
      gsap.set(img, { clearProps: 'opacity,scale,transform,pointerEvents,visibility' });
      img.style.removeProperty('pointer-events');
    });
  };

  const getElementCenter = (el) => {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const getClipPathsForDirection = (direction) => {
    switch (direction) {
      case 'bottom-top':
        return {
          from: 'inset(0% 0% 100% 0%)',
          reveal: 'inset(0% 0% 0% 0%)',
          hide: 'inset(100% 0% 0% 0%)',
        };
      case 'left-right':
        return {
          from: 'inset(0% 100% 0% 0%)',
          reveal: 'inset(0% 0% 0% 0%)',
          hide: 'inset(0% 0% 0% 100%)',
        };
      case 'right-left':
        return {
          from: 'inset(0% 0% 0% 100%)',
          reveal: 'inset(0% 0% 0% 0%)',
          hide: 'inset(0% 100% 0% 0%)',
        };
      case 'top-bottom':
      default:
        return {
          from: 'inset(100% 0% 0% 0%)',
          reveal: 'inset(0% 0% 0% 0%)',
          hide: 'inset(0% 0% 100% 0%)',
        };
    }
  };

  const setPageTitle = (portfolioCase) => {
    document.title = portfolioCase
      ? `mitte arts lab : ${portfolioCase.company}`
      : 'mitte arts lab : portfolio';
  };

  const pushPortfolioUrl = (id, { replace = false } = {}) => {
    historySilent = true;
    const state = { portfolioId: id || null };
    const url = id ? `/portfolio/${id}` : '/portfolio';
    if (id && !replace) {
      history.pushState(state, '', url);
      setPageTitle(getPortfolioCase(id));
    } else {
      history.replaceState(state, '', url);
      setPageTitle(id ? getPortfolioCase(id) : null);
    }
    window.requestAnimationFrame(() => {
      historySilent = false;
    });
  };

  const positionPanelBasedOnClick = (clickedEl) => {
    const centerX = getElementCenter(clickedEl).x;
    const isLeftSide = centerX < window.innerWidth / 2;

    panel.classList.toggle('portfolio-detail--right', isLeftSide);

    if (config.autoAdjustHorizontalClipPath) {
      if (
        config.clipPathDirection === 'left-right' ||
        config.clipPathDirection === 'right-left'
      ) {
        config.clipPathDirection = isLeftSide ? 'left-right' : 'right-left';
      }
    }
  };

  const setPanelContent = (portfolioCase, imgEl) => {
    const sources = getDetailImageSources(portfolioCase);
    const alts = getDetailImageAlts(portfolioCase);
    const heroFront = panel.querySelector('.portfolio-detail__hero-face--front');

    setCompanyTitleText(panelTitle, portfolioCase.company);
    panelSubtitle.textContent = portfolioCase.subtitle;
    panelDescription.textContent = portfolioCase.description || portfolioCase.subtitle;
    resetDetailTitle(panelTitle);
    gsap.set(panelTitle, { opacity: 0 });
    phoneShowcase?.renderPhoneShowcase(portfolioCase);

    panel.classList.add('is-gallery-three');
    panelGallery.classList.add('is-gallery-three');

    const thumbCount = getDetailThumbCount(portfolioCase);

    panelCells.forEach((cell, index) => {
      const isPrimary = cell.classList.contains('is-primary');
      const hasImage = index < sources.length;
      const isExtraThumb = !isPrimary && index >= 1 + thumbCount;

      cell.hidden = !hasImage || isExtraThumb;
      if (!hasImage) {
        if (!isPrimary) {
          cell.style.backgroundImage = '';
          cell.style.removeProperty('aspect-ratio');
          cell.removeAttribute('aria-label');
        }
        return;
      }

      const target = isPrimary && heroFront ? heroFront : cell;
      target.style.backgroundImage = `url("${sources[index]}")`;
      if (!isPrimary) {
        cell.setAttribute('aria-label', alts[index] || portfolioCase.title);
        syncThumbAspectRatio(cell, sources[index]);
      } else if (heroFront) {
        heroFront.setAttribute('aria-label', alts[index] || portfolioCase.title);
      }
    });

    secondaryCells.forEach((cell) => panelGallery.appendChild(cell));

    thumbRow.replaceChildren();
    secondaryCells.slice(0, thumbCount).forEach((cell) => {
      if (!cell.hidden) thumbRow.appendChild(cell);
    });
    thumbRow.hidden = thumbRow.childElementCount === 0;
    thumbRow.classList.toggle('is-single', thumbCount === 1);
  };

  const runDetailTitleTransition = () => {
    const cardTitle = currentCard?.querySelector('.portfolio-work__title');
    runCompanyTitleOpen({
      sourceEl: cardTitle,
      targetEl: panelTitle,
      reducedMotion,
    });
  };

  const computeStaggerDelays = (clickedItem, items) => {
    const baseCenter = getElementCenter(clickedItem);
    const distances = items.map((el) => {
      const center = getElementCenter(el);
      return Math.hypot(center.x - baseCenter.x, center.y - baseCenter.y);
    });
    const max = Math.max(...distances, 1);
    return distances.map((d) => (d / max) * config.gridItemStaggerFactor);
  };

  const animateGridItems = (items, clickedItem, delays) => {
    const clipPaths = getClipPathsForDirection(config.clipPathDirection);

    gsap.to(items, {
      opacity: 0,
      scale: (_i, el) => (el === clickedItem ? 1 : 0.8),
      duration: (_i, el) =>
        el === clickedItem
          ? config.stepDuration * config.clickedItemDurationFactor
          : 0.3,
      ease: config.gridItemEase,
      clipPath: (_i, el) => (el === clickedItem ? clipPaths.from : 'none'),
      delay: (i) => delays[i],
    });
  };

  const createMoverStyle = (step, index, bg) => {
    const style = {
      backgroundImage: bg,
      left: step.left,
      top: step.top,
      width: step.width,
      height: step.height,
      clipPath: getClipPathsForDirection(config.clipPathDirection).from,
      zIndex: index,
      backgroundPosition: '50% 50%',
      rotation: gsap.utils.random(-config.rotationRange, config.rotationRange),
    };
    if (config.moverBlendMode) style.mixBlendMode = config.moverBlendMode;
    return style;
  };

  const measureDetailImageRect = () => {
    panel.offsetHeight;
    return panelImg.getBoundingClientRect();
  };

  const waitForLayout = () =>
    new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

  const generateMotionPath = (startRect, endRect, steps) => {
    const path = [];
    const fullSteps = steps + 2;
    const startCenter = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2,
    };
    const endCenter = {
      x: endRect.left + endRect.width / 2,
      y: endRect.top + endRect.height / 2,
    };

    for (let i = 0; i < fullSteps; i++) {
      const t = i / (fullSteps - 1);
      const width = lerp(startRect.width, endRect.width, t);
      const height = lerp(startRect.height, endRect.height, t);
      const centerX = lerp(startCenter.x, endCenter.x, t);
      const centerY = lerp(startCenter.y, endCenter.y, t);
      const sineOffset =
        config.pathMotion === 'sine'
          ? Math.sin(t * config.sineFrequency) * config.sineAmplitude
          : 0;
      const wobbleX = (Math.random() - 0.5) * config.wobbleStrength;
      const wobbleY = (Math.random() - 0.5) * config.wobbleStrength;

      path.push({
        left: centerX - width / 2 + wobbleX,
        top: centerY - height / 2 + sineOffset + wobbleY,
        width,
        height,
      });
    }

    return path.slice(1, -1);
  };

  const scheduleCleanup = (movers) => {
    const cleanupDelay =
      config.steps * config.stepInterval +
      config.stepDuration * 2 +
      config.moverPauseBeforeExit;
    gsap.delayedCall(cleanupDelay, () => movers.forEach((m) => m.remove()));
  };

  const revealPanel = (primaryCell, onComplete) => {
    const clipPaths = getClipPathsForDirection(config.clipPathDirection);
    const secondaryCells = panelCells.filter(
      (cell) => cell !== primaryCell && !cell.hidden,
    );

    gsap.set(panelContent, { opacity: 0 });
    gsap.set(panelCells, { clipPath: clipPaths.hide, opacity: 0 });
    gsap.set(panel, { opacity: 1, pointerEvents: 'auto' });

    gsap
      .timeline({
        defaults: {
          duration: config.stepDuration * config.panelRevealDurationFactor,
          ease: config.panelRevealEase,
        },
      })
      .fromTo(
        primaryCell,
        { clipPath: clipPaths.hide, opacity: 0 },
        {
          clipPath: clipPaths.reveal,
          opacity: 1,
          delay: config.steps * config.stepInterval,
        },
      )
      .fromTo(
        secondaryCells,
        { clipPath: clipPaths.hide, opacity: 0 },
        {
          clipPath: clipPaths.reveal,
          opacity: 1,
          duration: config.stepDuration * 1.2,
          stagger: 0.07,
          ease: config.panelRevealEase,
        },
        '-=0.35',
      )
      .fromTo(
        panelContent,
        { y: 25 },
        {
          duration: 1,
          ease: 'expo',
          opacity: 1,
          y: 0,
          onComplete: () => {
            onComplete?.();
          },
        },
        '<-=.15',
      );
  };

  let moverLayer = null;

  const getMoverLayer = () => {
    if (!moverLayer) {
      moverLayer = document.createElement('div');
      moverLayer.className = 'portfolio-detail-mover-layer';
      moverLayer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(moverLayer);
    }
    return moverLayer;
  };

  const clearMoverLayer = () => {
    if (moverLayer) {
      moverLayer.replaceChildren();
    }
  };

  const animateTransition = (startRect, endRect, bg, endEl, startEl, onComplete) => {
    gsap.set(startEl, { opacity: 0, pointerEvents: 'none' });
    runDetailTitleTransition();

    const path = generateMotionPath(startRect, endRect, config.steps);
    const layer = getMoverLayer();
    const movers = [];
    const clipPaths = getClipPathsForDirection(config.clipPathDirection);

    path.forEach((step, index) => {
      const mover = document.createElement('div');
      mover.className = 'portfolio-detail-mover';
      gsap.set(mover, createMoverStyle(step, index, bg));
      layer.appendChild(mover);
      movers.push(mover);

      const delay = index * config.stepInterval;
      gsap
        .timeline({ delay })
        .fromTo(
          mover,
          { opacity: 0.4, clipPath: clipPaths.hide },
          {
            opacity: 1,
            clipPath: clipPaths.reveal,
            duration: config.stepDuration,
            ease: config.moverEnterEase,
          },
        )
        .to(
          mover,
          {
            clipPath: clipPaths.from,
            duration: config.stepDuration,
            ease: config.moverExitEase,
          },
          `+=${config.moverPauseBeforeExit}`,
        );
    });

    scheduleCleanup(movers);
    revealPanel(endEl, onComplete);
  };

  const setDetailOpenState = (open) => {
    isPanelOpen = open;
    page.classList.toggle('portfolio-detail-open', open);
    grid.setAttribute('aria-hidden', open ? 'true' : 'false');
    panel.hidden = !open;
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    panel.classList.toggle('is-open', open);
    setPortfolioFlipCaterpillarEnabled(!open);
    onDetailOpenChange?.(open);

    if (open) {
      getCards().forEach((card) => card.classList.add('is-revealed'));
    }
  };

  const showDetailInstant = (portfolioCase, imgEl, card) => {
    Object.assign(config, originalConfig);
    positionPanelBasedOnClick(imgEl);
    setPanelContent(portfolioCase, imgEl);
    setDetailOpenState(true);

    const clipPaths = getClipPathsForDirection(config.clipPathDirection);
    gsap.set(getCards().filter((c) => c !== card), { opacity: 0, scale: 0.8 });
    gsap.set(card, { opacity: 0, clipPath: clipPaths.from });
    gsap.set(panel, { opacity: 1, pointerEvents: 'auto' });
    gsap.set(panelCells, { clipPath: clipPaths.reveal, opacity: 1 });
    gsap.set(panelContent, { opacity: 1, y: 0 });
    runDetailTitleTransition();

    currentCard = card;
    currentImg = imgEl;
  };

  const openDetail = (caseId, imgEl, { animate = true, updateHistory = true } = {}) => {
    if (isAnimating || isPanelOpen) return;

    const portfolioCase = getPortfolioCase(caseId);
    if (!portfolioCase || !imgEl) return;

    const card = imgEl.closest('.portfolio-card');
    if (!card) return;

    isAnimating = true;
    currentCard = card;
    currentImg = imgEl;
    Object.assign(config, originalConfig);

    positionPanelBasedOnClick(imgEl);
    setPanelContent(portfolioCase, imgEl);
    setDetailOpenState(true);

    const finishOpen = () => {
      isAnimating = false;
      if (updateHistory && parsePortfolioIdFromPath() !== caseId) {
        pushPortfolioUrl(caseId);
      }
    };

    if (!animate || reducedMotion) {
      showDetailInstant(portfolioCase, imgEl, card);
      finishOpen();
      return;
    }

    const runAnimatedOpen = async () => {
      try {
        await waitForLayout();
        const endRect = measureDetailImageRect();
        if (endRect.width < 1 || endRect.height < 1) {
          showDetailInstant(portfolioCase, imgEl, card);
          finishOpen();
          return;
        }

        const startRect = imgEl.getBoundingClientRect();
        const items = getCards();
        const delays = computeStaggerDelays(card, items);
        animateGridItems(items, card, delays);
        animateTransition(startRect, endRect, imageUrl(imgEl), panelImg, imgEl, finishOpen);
      } catch {
        showDetailInstant(portfolioCase, imgEl, card);
        finishOpen();
      }
    };

    runAnimatedOpen();
  };

  const resetView = ({ animate = true, updateHistory = true } = {}) => {
    if (isAnimating || !isPanelOpen) return;
    isAnimating = true;

    const finishClose = () => {
      clearMoverLayer();
      gsap.killTweensOf([panel, ...panelCells, panelContent, ...getCards()]);
      const cardTitle = currentCard?.querySelector('.portfolio-work__title');
      if (cardTitle) gsap.set(cardTitle, { clearProps: 'opacity' });
      panel.classList.remove('portfolio-detail--right', 'is-title-active');
      resetDetailTitle(panelTitle);
      phoneShowcase?.resetPhoneShowcase();
      gsap.set(panelCells, { clipPath: 'inset(0% 0% 100% 0%)', clearProps: 'opacity' });
      gsap.set(panelContent, { clearProps: 'opacity,transform' });
      gsap.set(panel, { opacity: 0, pointerEvents: 'none' });
      restoreGridVisualState();
      setDetailOpenState(false);
      currentCard = null;
      currentImg = null;
      isAnimating = false;
      Object.assign(config, originalConfig);
      if (updateHistory) pushPortfolioUrl(null);
    };

    if (!animate || reducedMotion || !currentCard) {
      gsap.set(panel, { opacity: 0, pointerEvents: 'none' });
      gsap.set(panelCells, { clipPath: 'inset(0% 0% 100% 0%)', clearProps: 'opacity' });
      gsap.set(panelContent, { opacity: 0, y: 25 });
      finishClose();
      return;
    }

    const items = getCards();
    const delays = computeStaggerDelays(currentCard, items);

    gsap
      .timeline({
        defaults: { duration: config.stepDuration, ease: 'expo' },
        onComplete: finishClose,
      })
      .to(panel, { opacity: 0 })
      .set(panel, { opacity: 0, pointerEvents: 'none' })
      .set(panelCells, { clipPath: 'inset(0% 0% 100% 0%)' })
      .set(items, { clipPath: 'none', opacity: 0, scale: 0.8 }, 0)
      .to(
        items,
        {
          opacity: 1,
          scale: 1,
          delay: (i) => delays[i],
        },
        '>',
      );
  };

  const resolveThumbImage = (target) => {
    if (!(target instanceof Element)) return null;
    const img = target.closest(THUMB_SELECTOR);
    if (!img || !root.contains(img)) return null;
    if (img.offsetParent === null && getComputedStyle(img).display === 'none') return null;
    return img;
  };

  const onImageActivate = (imgEl) => {
    if (isAnimating || isPanelOpen) return;
    const card = imgEl.closest('.portfolio-card');
    const caseId = card?.dataset.portfolioId;
    if (!caseId) return;
    openDetail(caseId, imgEl);
  };

  const onRootClick = (event) => {
    if (event.defaultPrevented) return;
    const img = resolveThumbImage(event.target);
    if (!img) return;
    onImageActivate(img);
  };

  const onRootKeydown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const img = resolveThumbImage(event.target);
    if (!img) return;
    event.preventDefault();
    onImageActivate(img);
  };

  const onPopState = () => {
    if (historySilent) return;

    const id = parsePortfolioIdFromPath();
    if (id && getPortfolioCase(id)) {
      if (isPanelOpen) return;
      const card = document.getElementById(`portfolio-${id}`);
      const img = getThumbImage(card);
      if (img) openDetail(id, img, { animate: false, updateHistory: false });
      setPageTitle(getPortfolioCase(id));
      return;
    }

    if (isPanelOpen) {
      resetView({ animate: !reducedMotion, updateHistory: false });
    } else {
      setPageTitle(null);
    }
  };

  const bootFromUrl = () => {
    const id = parsePortfolioIdFromPath();
    if (!id) return;

    const portfolioCase = getPortfolioCase(id);
    if (!portfolioCase) {
      history.replaceState({ portfolioId: null }, '', '/portfolio');
      return;
    }

    const card = document.getElementById(`portfolio-${id}`);
    const img = getThumbImage(card);
    if (!img) return;

    openDetail(id, img, { animate: false, updateHistory: false });
    pushPortfolioUrl(id, { replace: true });
  };

  const requestClose = () => {
    resetView({ animate: !reducedMotion, updateHistory: true });
  };

  const onCloseClick = (event) => {
    event.preventDefault();
    requestClose();
  };

  const onDocumentKeydown = (event) => {
    if (event.key === 'Escape' && isPanelOpen && !isAnimating) {
      requestClose();
    }
  };

  panelClose?.addEventListener('click', onCloseClick);
  window.addEventListener('popstate', onPopState);
  document.addEventListener('keydown', onDocumentKeydown);

  root.addEventListener('click', onRootClick);
  root.addEventListener('keydown', onRootKeydown);

  preloadSlideImages(cases).then(() => {
    bootFromUrl();
  });

  return () => {
    panelClose?.removeEventListener('click', onCloseClick);
    window.removeEventListener('popstate', onPopState);
    document.removeEventListener('keydown', onDocumentKeydown);
    root.removeEventListener('click', onRootClick);
    root.removeEventListener('keydown', onRootKeydown);
    restoreGridVisualState();
    clearMoverLayer();
    moverLayer?.remove();
    moverLayer = null;
    setPortfolioFlipCaterpillarEnabled(true);
    page.classList.remove('portfolio-detail-open');
    onDetailOpenChange?.(false);
  };
};
