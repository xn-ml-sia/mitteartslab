uniform sampler2D t;
uniform vec2 mask;
uniform float maskVertical;

varying vec2 vUv;

void main(void) {
  vec4 dest = texture2D(t, vUv);
  float coord = maskVertical > 0.5 ? vUv.y : vUv.x;
  if(coord < mask.x || coord > mask.y) {
    dest.a = 0.0;
  }
  gl_FragColor = dest;
}
