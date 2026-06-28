import { getMorphState, getTaglineRevealIndex } from './home-morph-sync.js';
import { HOME_CONFIG } from './home-config.js';

export const initHomeTagline = ({
  root,
  getTSec,
  getParallax,
  reducedMotion = false,
} = {}) => {
  const clip = root?.querySelector('.home-tagline-clip');
  const track = root?.querySelector('.home-tagline__track');
  if (!clip || !track) return null;

  const words = Array.from(track.querySelectorAll('.home-tagline__word'));
  const gsap = typeof window !== 'undefined' ? window.gsap : undefined;
  const duration = HOME_CONFIG.taglineWordDuration;
  const trackStartY = HOME_CONFIG.taglineTrackStartYPercent ?? 95;
  const trackShiftY = HOME_CONFIG.taglineTrackShiftYPercent ?? 25;

  let lastRevealIndex = -1;
  let lastPhase = null;

  const resetTrack = () => {
    if (gsap) {
      gsap.set(track, { yPercent: trackStartY });
    } else {
      track.style.transform = '';
    }
  };

  if (gsap) {
    resetTrack();
    gsap.set(words, { opacity: 0, yPercent: 0, scale: 1, force3D: true });
  }

  const resetStack = () => {
    if (gsap) {
      gsap.killTweensOf([track, ...words]);
      resetTrack();
      gsap.set(words, { opacity: 0, yPercent: 0, scale: 1 });
    } else {
      resetTrack();
      words.forEach((word) => {
        word.style.opacity = '0';
        word.style.transform = '';
      });
    }
    words.forEach((word) => word.classList.remove('is-revealed'));
    clip.classList.add('is-idle');
    lastRevealIndex = -1;
  };

  const revealWord = (index) => {
    const word = words[index];
    if (!word) return;

    word.classList.add('is-revealed');

    if (!gsap) {
      word.style.opacity = '1';
      return;
    }

    const tl = gsap.timeline({ defaults: { duration, overwrite: 'auto' } });

    tl.set(word, { opacity: 1, force3D: true }).from(
      word,
      {
        yPercent: 120,
        scale: 0.6,
        ease: 'power3.out',
      },
      0,
    );

    if (index > 0) {
      tl.to(
        track,
        {
          yPercent: `-=${trackShiftY}`,
          ease: 'power2.out',
        },
        0,
      );
    }
  };

  if (reducedMotion) {
    clip.classList.add('is-reduced-static');
    words.forEach((word) => {
      word.classList.add('is-revealed');
      word.style.opacity = '1';
    });
    return { update() {}, reset() {} };
  }

  const update = () => {
    const tSec = getTSec();
    const state = getMorphState(tSec);
    const revealIndex = getTaglineRevealIndex(tSec);
    const parallax = getParallax?.() ?? { x: 0, y: 0 };

    clip.classList.toggle('is-idle', revealIndex < 0);

    if (lastPhase !== null && state.phase < lastPhase - 0.5) {
      resetStack();
    }
    lastPhase = state.phase;

    if (revealIndex > lastRevealIndex) {
      const nextIndex = lastRevealIndex + 1;
      revealWord(nextIndex);
      lastRevealIndex = nextIndex;
    }

    clip.style.setProperty('--tagline-parallax-x', `${parallax.x}px`);
    clip.style.setProperty('--tagline-parallax-y', `${parallax.y}px`);
  };

  return { update, reset: resetStack };
};
