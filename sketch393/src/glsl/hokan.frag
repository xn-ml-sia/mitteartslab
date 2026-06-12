uniform sampler2D t;

varying vec2 vUv;

void main(void) {
  vec4 dest = texture2D(t, vUv);
  float d = 0.002;
  if(vUv.x < 0.5 - d || vUv.x > 0.5 + d) {
    discard;
  }
  gl_FragColor = dest;
}
