import { lerp } from '../type-lab-utils.js';

export function skewTransform({ segments, params }) {
  const skewX = params.skewX || 0;
  const skewY = params.skewY || 0;
  if (!skewX && !skewY) return segments;

  const minY = segments.reduce((acc, line) => Math.min(acc, line.y1, line.y2), Number.POSITIVE_INFINITY);
  const maxY = segments.reduce((acc, line) => Math.max(acc, line.y1, line.y2), Number.NEGATIVE_INFINITY);
  const span = Math.max(1e-6, maxY - minY);

  return segments.map((line) => {
    const t1 = (line.y1 - minY) / span;
    const t2 = (line.y2 - minY) / span;
    const factor1 = lerp(-0.5, 0.5, t1);
    const factor2 = lerp(-0.5, 0.5, t2);
    return {
      ...line,
      x1: line.x1 + skewX * factor1 + skewY * (line.y1 - minY) * 0.01,
      x2: line.x2 + skewX * factor2 + skewY * (line.y2 - minY) * 0.01,
      y1: line.y1 + skewY * factor1,
      y2: line.y2 + skewY * factor2,
    };
  });
}
