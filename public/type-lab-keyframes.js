import { easingValue, lerp } from './type-lab-utils.js';

export function captureFrame({ state, animatableKeys }) {
  const frame = {};
  animatableKeys.forEach((key) => {
    frame[key] = state.params[key];
  });
  frame.textX = state.runtime.textX;
  frame.textY = state.runtime.textY;
  return frame;
}

export function lerpFrame(start, end, t) {
  const out = {};
  Object.keys(start).forEach((key) => {
    const a = start[key];
    const b = end[key];
    if (typeof a === 'number' && typeof b === 'number') out[key] = lerp(a, b, t);
    else out[key] = t < 0.5 ? a : b;
  });
  return out;
}

export function evaluateKeyframePlayback({ now, keyframes, options }) {
  if (!keyframes.start || !keyframes.end) return null;
  const durationMs = Math.max(200, options.duration * 1000);
  const elapsed = now - options.startMs;
  const raw = elapsed / durationMs;
  const loop = Boolean(options.loop);
  const pingPong = Boolean(options.pingPong);

  let forwardT = raw;
  let done = false;
  if (pingPong) {
    if (loop) {
      const cycle = raw % 2;
      forwardT = cycle <= 1 ? cycle : 2 - cycle;
    } else if (raw >= 2) {
      forwardT = 0;
      done = true;
    } else {
      forwardT = raw <= 1 ? raw : 2 - raw;
    }
  } else if (loop) {
    forwardT = raw % 1;
  } else if (raw >= 1) {
    forwardT = 1;
    done = true;
  }
  const eased = easingValue(options.easing, Math.max(0, Math.min(1, forwardT)));
  return {
    frame: lerpFrame(keyframes.start, keyframes.end, eased),
    done,
  };
}
