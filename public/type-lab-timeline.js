import { evaluateKeyframePlayback } from './type-lab-keyframes.js';

export function createTypeLabTimeline({ store, requestRender }) {
  const runtime = {
    raf: 0,
    keyframeStartMs: 0,
    keyframePlaying: false,
    pathStartMs: 0,
    pathBaseOffset: 0,
  };

  function stop() {
    runtime.keyframePlaying = false;
    store.patchRuntime({ keyframePlaying: false });
    if (runtime.raf) cancelAnimationFrame(runtime.raf);
    runtime.raf = 0;
  }

  function applyFrame(frame) {
    const nextParams = {};
    Object.keys(frame).forEach((key) => {
      if (key === 'textX' || key === 'textY') return;
      nextParams[key] = frame[key];
    });
    store.patchParams(nextParams);
    store.patchRuntime({
      textX: frame.textX ?? store.getState().runtime.textX,
      textY: frame.textY ?? store.getState().runtime.textY,
    });
  }

  function currentAnimatedPathOffset(now, state) {
    if (!state.params.pathAnimate || state.runtime.transformMode !== 'path' || runtime.keyframePlaying) {
      return state.params.pathOffset;
    }
    const elapsedSec = Math.max(0, (now - runtime.pathStartMs) / 1000);
    const speed = state.params.pathAnimateSpeed;
    const phase = elapsedSec * speed;
    if (!state.params.pathAnimatePingPong) return runtime.pathBaseOffset + phase;
    const cycle = ((phase % 2) + 2) % 2;
    const t = cycle <= 1 ? cycle : 2 - cycle;
    return runtime.pathBaseOffset + t;
  }

  function tick(now) {
    const state = store.getState();
    let changed = false;

    if (runtime.keyframePlaying) {
      const keyEval = evaluateKeyframePlayback({
        now,
        keyframes: state.runtime.keyframes,
        options: {
          duration: state.params.keyframeDuration,
          loop: state.params.keyframeLoop,
          pingPong: state.params.keyframePingPong,
          easing: state.params.keyframeEasing,
          startMs: runtime.keyframeStartMs,
        },
      });
      if (keyEval?.frame) {
        applyFrame(keyEval.frame);
        changed = true;
        if (keyEval.done) {
          runtime.keyframePlaying = false;
          store.patchRuntime({ keyframePlaying: false });
        }
      }
    }

    const animatedOffset = currentAnimatedPathOffset(now, store.getState());
    if (animatedOffset !== store.getState().runtime.livePathOffset) {
      store.patchRuntime({ livePathOffset: animatedOffset });
      changed = true;
    }

    if (changed) requestRender();
    const shouldRun = runtime.keyframePlaying || store.getState().params.pathAnimate;
    if (shouldRun) runtime.raf = requestAnimationFrame(tick);
    else runtime.raf = 0;
  }

  function ensureRunning() {
    if (runtime.raf) return;
    runtime.raf = requestAnimationFrame(tick);
  }

  return {
    startKeyframes() {
      runtime.keyframeStartMs = performance.now();
      runtime.keyframePlaying = true;
      store.patchRuntime({ keyframePlaying: true });
      ensureRunning();
    },
    stopKeyframes() {
      runtime.keyframePlaying = false;
       store.patchRuntime({ keyframePlaying: false });
      if (!store.getState().params.pathAnimate) stop();
    },
    syncPathAnimation({ resetBase }) {
      if (resetBase) runtime.pathBaseOffset = store.getState().params.pathOffset;
      if (runtime.pathStartMs === 0 || resetBase) runtime.pathStartMs = performance.now();
      if (store.getState().params.pathAnimate) ensureRunning();
      else if (!runtime.keyframePlaying) stop();
    },
    isKeyframePlaying() {
      return runtime.keyframePlaying;
    },
    stopAll: stop,
  };
}
