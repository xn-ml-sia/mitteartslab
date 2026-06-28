import { HOME_CONFIG } from './home-config.js';

/** Morph phase math — keep SPIN_CYCLE + SEGMENT_BREAKS in sync with home-rock-shader.js */

export const SPIN_CYCLE = 1 / (HOME_CONFIG.morphCycleSec * HOME_CONFIG.autoRotationSpeed);
export const SEGMENT_BREAKS = Object.freeze([0, 0.42, 0.65, 1]);
export const BLEND_START = 0.68;

const smoothstep = (edge0, edge1, t) => {
  if (t <= edge0) return 0;
  if (t >= edge1) return 1;
  const x = (t - edge0) / (edge1 - edge0);
  return x * x * (3 - 2 * x);
};

export const getSpinPhase = (tSec) => {
  const phase = tSec * SPIN_CYCLE;
  return phase - Math.floor(phase);
};

export const getSegmentLocal = (phase) => {
  const [b0, b1, b2, b3] = SEGMENT_BREAKS;
  if (phase < b1) {
    return { segment: 0, local: phase / (b1 - b0) };
  }
  if (phase < b2) {
    return { segment: 1, local: (phase - b1) / (b2 - b1) };
  }
  return { segment: 2, local: (phase - b2) / (b3 - b2) };
};

export const getMorphWeights = (segment, local) => {
  let voxelMix = 0;
  let fractalMix = 0;

  if (segment === 0) {
    voxelMix = 1 - smoothstep(BLEND_START, 1, local);
  } else if (segment === 1) {
    fractalMix = smoothstep(BLEND_START, 1, local);
  } else {
    fractalMix = 1 - smoothstep(BLEND_START, 1, local);
    voxelMix = smoothstep(BLEND_START, 1, local);
  }

  return { voxelMix, fractalMix };
};

export const getMorphState = (tSec) => {
  const phase = getSpinPhase(tSec);
  const { segment, local } = getSegmentLocal(phase);
  const { voxelMix, fractalMix } = getMorphWeights(segment, local);

  let dominant = 'stone';
  if (voxelMix > fractalMix && voxelMix > 0.01) dominant = 'voxel';
  else if (fractalMix > 0.01) dominant = 'smooth';

  const smoothMorphLocal =
    segment === 1 && local >= BLEND_START
      ? (local - BLEND_START) / (1 - BLEND_START)
      : 0;

  return {
    phase,
    segment,
    local,
    voxelMix,
    fractalMix,
    dominant,
    smoothMorphLocal,
  };
};

export const getTaglineWordStartTimes = () => {
  const hold = HOME_CONFIG.taglineHoldSec ?? 0;
  return HOME_CONFIG.taglineWordStarts.map((start) => start + hold);
};

export const getTaglineCycleTimeSec = (tSec) => getSpinPhase(tSec) * HOME_CONFIG.morphCycleSec;

export const getTaglineRevealIndex = (tSec) => {
  const cycleT = getTaglineCycleTimeSec(tSec);
  const starts = getTaglineWordStartTimes();
  if (cycleT + 1e-3 < starts[0]) return -1;
  for (let i = starts.length - 1; i >= 0; i -= 1) {
    if (cycleT + 1e-3 >= starts[i]) return i;
  }
  return -1;
};
