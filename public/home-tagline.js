import { getTaglineWordStartTimes } from './home-morph-sync.js';
import { HOME_CONFIG } from './home-config.js';

const measureLineHeight = (words) => {
  const sample = words[0];
  if (!sample) return 0;
  return sample.getBoundingClientRect().height;
};

export const initHomeTagline = ({
  root,
  morphCycleSec = HOME_CONFIG.morphCycleSec,
  taglineConfig = HOME_CONFIG.tagline,
  getParallax,
  reducedMotion = false,
} = {}) => {
  const clip = root?.querySelector('.home-tagline-clip');
  const track = root?.querySelector('.home-tagline__track');
  if (!clip || !track) return null;

  const words = Array.from(track.querySelectorAll('.home-tagline__word'));
  const gsap = typeof window !== 'undefined' ? window.gsap : undefined;
  const { duration, enter, track: trackAnim } = taglineConfig.animation;

  let lineHeight = 0;
  let cycleTimeline = null;

  const measureLayout = () => {
    lineHeight = measureLineHeight(words);
  };

  const resetVisuals = () => {
    if (gsap) {
      gsap.killTweensOf([track, ...words]);
      gsap.set(track, { y: 0 });
      gsap.set(words, { opacity: 0, yPercent: 0, scale: 1, force3D: true });
    } else {
      track.style.transform = '';
      words.forEach((word) => {
        word.style.opacity = '0';
        word.style.transform = '';
      });
    }
    words.forEach((word) => word.classList.remove('is-revealed'));
    clip.classList.add('is-idle');
  };

  const revealWord = (index) => {
    const word = words[index];
    if (!word || !gsap) return;

    word.classList.add('is-revealed');

    const tl = gsap.timeline({ defaults: { duration, overwrite: 'auto' } });

    tl.set(word, { opacity: 1, force3D: true }).from(
      word,
      {
        yPercent: enter.yPercent,
        scale: enter.scale,
        ease: enter.ease,
      },
      0,
    );

    if (index > 0 && lineHeight > 0) {
      tl.to(
        track,
        {
          y: -index * lineHeight,
          ease: trackAnim.ease,
        },
        0,
      );
    }
  };

  const buildCycleTimeline = () => {
    const starts = getTaglineWordStartTimes(taglineConfig);
    const tl = gsap.timeline({
      repeat: -1,
      onRepeat: resetVisuals,
    });

    tl.call(() => clip.classList.remove('is-idle'), null, taglineConfig.holdSec);

    starts.forEach((at, index) => {
      tl.call(() => revealWord(index), null, at);
    });

    const pad = morphCycleSec - tl.duration();
    if (pad > 0) {
      tl.to({}, { duration: pad });
    }

    return tl;
  };

  const startCycle = () => {
    if (!gsap) return;
    cycleTimeline?.kill();
    resetVisuals();
    measureLayout();
    cycleTimeline = buildCycleTimeline();
    cycleTimeline.play(0);
  };

  measureLayout();
  if (document.fonts?.ready) {
    document.fonts.ready.then(measureLayout);
  }
  window.addEventListener('resize', () => {
    measureLayout();
    if (cycleTimeline) startCycle();
  }, { passive: true });

  if (reducedMotion) {
    clip.classList.add('is-reduced-static');
    words.forEach((word) => {
      word.classList.add('is-revealed');
      word.style.opacity = '1';
    });
    return { update() {}, reset() {} };
  }

  const update = () => {
    const parallax = getParallax?.() ?? { x: 0, y: 0 };
    clip.style.setProperty('--tagline-parallax-x', `${parallax.x}px`);
    clip.style.setProperty('--tagline-parallax-y', `${parallax.y}px`);
  };

  const reset = () => {
    startCycle();
  };

  return { update, reset };
};
