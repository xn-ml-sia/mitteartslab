export function pathTransform({ engine, model, params, pathPoints }) {
  return engine.transformSliceModelAlongPath(model, {
    pathPoints,
    pathSpan: params.pathSpan,
    pathOffset: params.pathOffset,
    pathStagger: params.pathStagger,
    pathEasing: params.pathEasing,
    followTangent: params.followTangent,
    tangentStrength: params.tangentStrength,
    pathSmoothness: params.pathSmoothness,
  });
}
