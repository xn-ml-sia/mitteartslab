export const HOME_CONFIG = Object.freeze({
  scrollRotationScale: 0.01,
  autoRotationSpeed: 0.9,
  morphCycleSec: 10,
  scrollEdgeBuffer: 72,
  scrollLoopPadding: 48,
  rotationTriggerMultiplier: 1.15,
  effectDurationMs: 2000,
  fullRotation: Math.PI * 2,
  mouseLerp: 0.09,
  parallax: Object.freeze({
    taglineX: 14,
    taglineY: 10,
  }),
  tagline: Object.freeze({
    /** Seconds of silence at cycle start before the first word */
    holdSec: 1,
    /** Word start offsets after the hold (first word = hold + 0) */
    wordStarts: Object.freeze([0, 0.5, 3, 5, 5.5]),
    animation: Object.freeze({
      duration: 0.75,
      enter: Object.freeze({
        yPercent: 120,
        scale: 0.6,
        ease: 'power3.out',
      }),
      track: Object.freeze({
        ease: 'power2.out',
      }),
    }),
  }),
});
