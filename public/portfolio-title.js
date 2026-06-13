import { scrambleCompanyTitleSketch494, stopSketch494Scramble } from './portfolio-sketch494-scramble.js';

const SCRAMBLE_DURATION = 1;

const MOTION = {
  steps: 8,
  stepDuration: 0.12,
  pathMotion: 'sine',
  sineAmplitude: 50,
  sineFrequency: Math.PI,
  ease: 'expo.inOut',
};

let activeTitleTween = null;
let activeFlyer = null;

const lerp = (a, b, t) => a + (b - a) * t;

const waitForLayout = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

export const setCompanyTitleText = (el, company) => {
  if (!el) return;
  el.textContent = company;
  el.dataset.text = company;
};

export const clearCompanyTitleMover = () => {
  if (activeTitleTween) {
    activeTitleTween.kill();
    activeTitleTween = null;
  }
  if (activeFlyer) {
    if (typeof gsap !== 'undefined') gsap.killTweensOf(activeFlyer);
    activeFlyer.remove();
    activeFlyer = null;
  }
};

export const resetDetailTitle = (titleEl) => {
  clearCompanyTitleMover();
  stopSketch494Scramble();
  if (!titleEl || typeof gsap === 'undefined') return;
  gsap.killTweensOf(titleEl);
  gsap.set(titleEl, { clearProps: 'opacity,filter,transform' });
};

const parsePx = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const generateTitleMotionPath = (startRect, endRect, startStyle, endStyle, steps) => {
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
  const startFontSize = parsePx(startStyle.fontSize);
  const endFontSize = parsePx(endStyle.fontSize);

  for (let i = 0; i < fullSteps; i += 1) {
    const t = i / (fullSteps - 1);
    const width = lerp(startRect.width, endRect.width, t);
    const height = lerp(startRect.height, endRect.height, t);
    const centerX = lerp(startCenter.x, endCenter.x, t);
    const centerY = lerp(startCenter.y, endCenter.y, t);
    const sineOffset =
      MOTION.pathMotion === 'sine'
        ? Math.sin(t * MOTION.sineFrequency) * MOTION.sineAmplitude
        : 0;

    path.push({
      left: centerX - width / 2,
      top: centerY - height / 2 + sineOffset,
      width,
      height,
      fontSize: lerp(startFontSize, endFontSize, t),
      opacity: lerp(0.6, 1, t),
      blur: Math.sin(t * Math.PI) * 2.2,
    });
  }

  return path;
};

const createTitleFlyer = (sourceEl, sourceRect, sourceStyle) => {
  const flyer = document.createElement('h2');
  flyer.className = 'portfolio-company-title portfolio-company-title-mover';
  flyer.textContent = sourceEl.dataset.text || sourceEl.textContent;
  flyer.setAttribute('aria-hidden', 'true');

  Object.assign(flyer.style, {
    position: 'fixed',
    margin: 0,
    padding: 0,
    zIndex: '3100',
    pointerEvents: 'none',
    left: `${sourceRect.left}px`,
    top: `${sourceRect.top}px`,
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
    fontFamily: sourceStyle.fontFamily,
    fontSize: sourceStyle.fontSize,
    fontWeight: sourceStyle.fontWeight,
    lineHeight: sourceStyle.lineHeight,
    letterSpacing: sourceStyle.letterSpacing,
    color: sourceStyle.color,
    textTransform: sourceStyle.textTransform,
    whiteSpace: 'nowrap',
    opacity: '0.6',
    filter: 'blur(0px)',
  });

  document.body.appendChild(flyer);
  activeFlyer = flyer;
  return flyer;
};

export const moveCompanyTitle = async ({
  sourceEl,
  targetEl,
  reducedMotion = false,
} = {}) => {
  if (!sourceEl || !targetEl) return;

  clearCompanyTitleMover();

  const text = sourceEl.dataset.text || sourceEl.textContent;
  setCompanyTitleText(targetEl, text);

  if (reducedMotion || typeof gsap === 'undefined') {
    gsap?.set(sourceEl, { opacity: 0 });
    gsap?.set(targetEl, { opacity: 1 });
    return;
  }

  await waitForLayout();

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();
  const sourceStyle = getComputedStyle(sourceEl);
  const targetStyle = getComputedStyle(targetEl);

  if (sourceRect.width < 1 || targetRect.width < 1) {
    gsap.set(sourceEl, { opacity: 0 });
    gsap.set(targetEl, { opacity: 1 });
    return;
  }

  const path = generateTitleMotionPath(
    sourceRect,
    targetRect,
    sourceStyle,
    targetStyle,
    MOTION.steps,
  );
  const flyer = createTitleFlyer(sourceEl, sourceRect, sourceStyle);

  gsap.set(sourceEl, { opacity: 0 });
  gsap.set(targetEl, { opacity: 0 });

  await new Promise((resolve) => {
    const timeline = gsap.timeline({
      onComplete: () => {
        clearCompanyTitleMover();
        gsap.set(targetEl, { opacity: 1, filter: 'blur(0px)' });
        resolve();
      },
    });

    gsap.set(flyer, {
      left: path[0].left,
      top: path[0].top,
      width: path[0].width,
      height: path[0].height,
      fontSize: path[0].fontSize,
      opacity: path[0].opacity,
      filter: `blur(${path[0].blur}px)`,
    });

    path.slice(1).forEach((point) => {
      timeline.to(flyer, {
        left: point.left,
        top: point.top,
        width: point.width,
        height: point.height,
        fontSize: point.fontSize,
        opacity: point.opacity,
        filter: `blur(${point.blur}px)`,
        duration: MOTION.stepDuration,
        ease: MOTION.ease,
      });
    });

    activeTitleTween = timeline;
  });
};

export const scrambleCompanyTitle = (
  el,
  { reducedMotion = false, duration = SCRAMBLE_DURATION } = {},
) => {
  scrambleCompanyTitleSketch494(el, { reducedMotion, duration });
};

export const runCompanyTitleOpen = async ({
  sourceEl,
  targetEl,
  reducedMotion = false,
} = {}) => {
  await moveCompanyTitle({ sourceEl, targetEl, reducedMotion });
  scrambleCompanyTitle(targetEl, { reducedMotion });
};
