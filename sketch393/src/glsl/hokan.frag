uniform sampler2D t;
uniform float connectorVertical;

varying vec2 vUv;

void main(void) {
  vec4 dest = texture2D(t, vUv);
  float d = 0.002;
  if(connectorVertical > 0.5) {
    if(vUv.y < 0.5 - d || vUv.y > 0.5 + d) {
      discard;
    }
  } else if(vUv.x < 0.5 - d || vUv.x > 0.5 + d) {
    discard;
  }
  gl_FragColor = dest;
}
