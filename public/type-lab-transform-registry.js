import { pivotTransform } from './type-lab-transforms/pivot.js';
import { pathTransform } from './type-lab-transforms/path.js';

export const TYPE_LAB_TRANSFORMS = {
  pivot: pivotTransform,
  path: pathTransform,
};

export function resolveTransform(mode) {
  return TYPE_LAB_TRANSFORMS[mode] || TYPE_LAB_TRANSFORMS.pivot;
}
