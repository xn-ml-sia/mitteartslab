import { skewTransform } from './type-lab-transforms/skew.js';

export function applyDeformStack({ segments, params }) {
  const stack = [
    (input) => skewTransform({ segments: input, params }),
  ];
  return stack.reduce((acc, operator) => operator(acc), segments);
}
