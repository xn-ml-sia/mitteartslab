uniform sampler2D t;
uniform vec2 mask;

varying vec2 vUv;

void main(void) {
  vec4 dest = texture2D(t, vUv);
  if(vUv.x < mask.x || vUv.x > mask.y) {
    dest.a = 0.0;
  }
  gl_FragColor = dest;
}
