uniform vec3 colorA;
uniform vec3 colorB;
uniform vec3 colorC;
uniform vec3 colorD;
uniform float time;
uniform float alpha;

varying vec3 vNor;
varying vec2 vUv;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
  return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main(void) {
  float x = fract(vUv.y - time * 0.035);
  float r1 = clamp(map(x, 0.0, 0.25, 0.0, 1.0), 0.0, 1.0);
  float r2 = clamp(map(x, 0.25, 0.5, 0.0, 1.0), 0.0, 1.0);
  float r3 = clamp(map(x, 0.5, 0.75, 0.0, 1.0), 0.0, 1.0);
  float r4 = clamp(map(x, 0.75, 1.0, 0.0, 1.0), 0.0, 1.0);

  vec3 dest = colorA;
  dest = mix(dest, colorB, r1);
  dest = mix(dest, colorC, r2);
  dest = mix(dest, colorD, r3);
  dest = mix(dest, colorA, r4);

  // dest.rgb += vNor.x * 0.5;
  dest.rgb += 0.2;
  gl_FragColor = vec4(dest, alpha);
}
