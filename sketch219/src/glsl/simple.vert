varying vec3 vNor;
varying vec2 vUv;

void main(){
  vUv = uv;
  vNor = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
