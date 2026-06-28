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
  taglineParallaxX: 14,
  taglineParallaxY: 10,
  taglineWordDuration: 0.75,
  taglineTrackStartYPercent: 95,
  taglineTrackShiftYPercent: 25,
  /** Seconds of silence at the start of each cycle before the first word */
  taglineHoldSec: 1,
  /** Word start offsets after the hold (first word = hold + 0) */
  taglineWordStarts: Object.freeze([0, 0.5, 3, 5, 5.5]),
});
