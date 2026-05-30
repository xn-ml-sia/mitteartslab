import { resolveTransform } from './type-lab-transform-registry.js';
import { applyDeformStack } from './type-lab-deforms.js';

export function createTypeLabPipeline({ engine, store }) {
  let lastMaskKey = '';

  function renderFrame({ width, height }) {
    const state = store.getState();
    const { params, runtime } = state;
    const font = `700 ${params.fontSize}px "IBM Plex Mono", monospace`;
    const text = (params.text || 'SKEWED').toUpperCase();
    const maskKey = `${text}|${font}|${width}|${height}|${runtime.textX.toFixed(2)}|${runtime.textY.toFixed(2)}`;
    if (maskKey !== lastMaskKey) {
      engine.setMask({
        text,
        font,
        fontSize: params.fontSize,
        width,
        height,
        textX: runtime.textX,
        textY: runtime.textY,
        padding: 28,
      });
      lastMaskKey = maskKey;
    }

    const model =
      runtime.bakedModel ||
      engine.createSliceModel({
        lineCount: params.lineCount,
        strokeMin: params.strokeMin,
        strokeMax: params.strokeMax,
        strokeThreshold: params.strokeThreshold,
        lineSizeVariance: params.lineSizeVariance,
        colorStart: '#d2ef36',
        colorEnd: '#76862a',
      });

    const pathOffset = Number.isFinite(runtime.livePathOffset) ? runtime.livePathOffset : params.pathOffset;
    const transform = resolveTransform(runtime.transformMode);
    const baseSegments = transform({
      engine,
      model,
      params: { ...params, pathOffset },
      pathPoints: runtime.pathPoints,
      width,
      height,
    });
    const segments = applyDeformStack({ segments: baseSegments, params });
    return {
      segments,
      svg: engine.toSvg(segments, { width, height }),
      bbox: engine.getBbox(),
    };
  }

  function invalidateMask() {
    lastMaskKey = '';
  }

  return {
    renderFrame,
    invalidateMask,
  };
}
