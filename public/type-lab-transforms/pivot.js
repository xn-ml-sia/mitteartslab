export function pivotTransform({ engine, model, params, width, height }) {
  return engine.transformSliceModel(model, {
    pivot: { x: (params.pivotX / 100) * width, y: (params.pivotY / 100) * height },
    pivotRotationDeg: params.pivotRotation,
    fanAngleDeg: params.fanAngle,
    collapseZeroDeg: params.collapseZero,
    collapseThickness: params.collapseThickness,
    fanCurve: params.fanCurve,
    radiusGain: params.radiusGain,
  });
}
