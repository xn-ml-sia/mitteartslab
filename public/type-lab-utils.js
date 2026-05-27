export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function easingValue(mode, t) {
  const x = clamp(t, 0, 1);
  if (mode === 'easeInOutSine') return 0.5 - 0.5 * Math.cos(Math.PI * x);
  if (mode === 'easeInOutCubic') return x < 0.5 ? 4 * x * x * x : 1 - ((-2 * x + 2) ** 3) / 2;
  if (mode === 'easeOutExpo') return x === 1 ? 1 : 1 - 2 ** (-10 * x);
  return x;
}

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
