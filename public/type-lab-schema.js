export const TYPE_LAB_SCHEMA_VERSION = 1;

export const TYPE_LAB_GROUPS = [
  { id: 'source', title: 'Source', tier: 'basic' },
  { id: 'slices', title: 'Slices', tier: 'basic' },
  { id: 'transformMode', title: 'Transform mode', tier: 'basic' },
  { id: 'process', title: 'Process', tier: 'expert' },
  { id: 'keyframes', title: 'Keyframes', tier: 'standard' },
  { id: 'fanPivot', title: 'Fan Pivot', tier: 'standard', when: { transformMode: 'pivot' } },
  { id: 'pathMode', title: 'Path Mode', tier: 'standard', when: { transformMode: 'path' } },
  { id: 'stroke', title: 'Stroke', tier: 'standard' },
];

export const TYPE_LAB_PARAMS = [
  { key: 'text', id: 'text-input', type: 'text', default: 'JAZZ', group: 'source', tier: 'basic', animatable: false },
  { key: 'fontSize', id: 'font-size-input', type: 'number', default: 380, group: 'source', tier: 'basic', animatable: false },
  { key: 'lineCount', id: 'line-count-input', type: 'number', default: 120, group: 'slices', tier: 'basic', animatable: false },
  { key: 'transformMode', id: null, type: 'enum', default: 'pivot', group: 'transformMode', tier: 'basic', animatable: false },
  { key: 'pivotX', id: 'pivot-x-input', type: 'number', default: 10, group: 'fanPivot', tier: 'standard', animatable: true },
  { key: 'pivotY', id: 'pivot-y-input', type: 'number', default: 6, group: 'fanPivot', tier: 'standard', animatable: true },
  { key: 'pivotRotation', id: 'pivot-rotation-input', type: 'number', default: 0, group: 'fanPivot', tier: 'standard', animatable: true },
  { key: 'fanAngle', id: 'fan-angle-input', type: 'number', default: 180, group: 'fanPivot', tier: 'standard', animatable: true },
  { key: 'collapseZero', id: 'collapse-zero-input', type: 'number', default: 0, group: 'fanPivot', tier: 'expert', animatable: true },
  { key: 'collapseThickness', id: 'collapse-thickness-input', type: 'number', default: 6, group: 'fanPivot', tier: 'standard', animatable: true },
  { key: 'fanCurve', id: 'fan-curve-input', type: 'number', default: 1.8, group: 'fanPivot', tier: 'expert', animatable: true },
  { key: 'radiusGain', id: 'radius-gain-input', type: 'number', default: 1.4, group: 'fanPivot', tier: 'standard', animatable: true },
  { key: 'pathEdit', id: 'path-edit-input', type: 'boolean', default: false, group: 'pathMode', tier: 'standard', animatable: false },
  { key: 'pathAnimate', id: 'path-animate-input', type: 'boolean', default: false, group: 'pathMode', tier: 'standard', animatable: false },
  { key: 'pathAnimateSpeed', id: 'path-animate-speed-input', type: 'number', default: 0.15, group: 'pathMode', tier: 'standard', animatable: true },
  { key: 'pathAnimatePingPong', id: 'path-animate-pingpong-input', type: 'boolean', default: true, group: 'pathMode', tier: 'standard', animatable: false },
  { key: 'pathSpan', id: 'path-span-input', type: 'number', default: 1, group: 'pathMode', tier: 'standard', animatable: true },
  { key: 'pathOffset', id: 'path-offset-input', type: 'number', default: 0, group: 'pathMode', tier: 'standard', animatable: true },
  { key: 'pathStagger', id: 'path-stagger-input', type: 'number', default: 0.08, group: 'pathMode', tier: 'standard', animatable: true },
  { key: 'pathEasing', id: 'path-easing-select', type: 'enum', default: 'easeInOutSine', group: 'pathMode', tier: 'standard', animatable: false },
  { key: 'pathSmoothness', id: 'path-smoothness-input', type: 'number', default: 1, group: 'pathMode', tier: 'expert', animatable: true },
  { key: 'followTangent', id: 'follow-tangent-input', type: 'boolean', default: true, group: 'pathMode', tier: 'standard', animatable: true },
  { key: 'tangentStrength', id: 'tangent-strength-input', type: 'number', default: 1, group: 'pathMode', tier: 'standard', animatable: true },
  { key: 'skewX', id: 'skew-x-input', type: 'number', default: 0, group: 'pathMode', tier: 'expert', animatable: true },
  { key: 'skewY', id: 'skew-y-input', type: 'number', default: 0, group: 'pathMode', tier: 'expert', animatable: true },
  { key: 'strokeMin', id: 'stroke-min-input', type: 'number', default: 0.8, group: 'stroke', tier: 'standard', animatable: false },
  { key: 'strokeMax', id: 'stroke-max-input', type: 'number', default: 5.2, group: 'stroke', tier: 'standard', animatable: false },
  { key: 'strokeThreshold', id: 'stroke-threshold-input', type: 'number', default: 0, group: 'stroke', tier: 'standard', animatable: false },
  { key: 'lineSizeVariance', id: 'line-size-variance-input', type: 'number', default: 0.3, group: 'stroke', tier: 'standard', animatable: false },
  { key: 'keyframeDuration', id: 'keyframe-duration-input', type: 'number', default: 3.5, group: 'keyframes', tier: 'standard', animatable: false },
  { key: 'keyframeLoop', id: 'keyframe-loop-input', type: 'boolean', default: true, group: 'keyframes', tier: 'standard', animatable: false },
  { key: 'keyframePingPong', id: 'keyframe-pingpong-input', type: 'boolean', default: true, group: 'keyframes', tier: 'standard', animatable: false },
  { key: 'keyframeEasing', id: 'keyframe-easing-select', type: 'enum', default: 'easeInOutSine', group: 'keyframes', tier: 'standard', animatable: false },
];

export function defaultsFromSchema() {
  const params = {};
  TYPE_LAB_PARAMS.forEach((item) => {
    params[item.key] = item.default;
  });
  return params;
}

export function animatableKeysFromSchema() {
  return TYPE_LAB_PARAMS.filter((item) => item.animatable).map((item) => item.key);
}
