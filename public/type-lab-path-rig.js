export function normalizePathPoints(pathPoints, width, height) {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  return pathPoints.map((point) => ({
    x: point.x / safeWidth,
    y: point.y / safeHeight,
  }));
}

export function denormalizePathPoints(points, width, height) {
  return points.map((point) => ({
    x: point.x * width,
    y: point.y * height,
  }));
}

export function applyPathConstraints(points) {
  if (!Array.isArray(points) || points.length < 2) return points || [];
  return points.map((point) => ({ x: point.x, y: point.y }));
}
