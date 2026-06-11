import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

const PX_RATIO = window.devicePixelRatio || 1;

Math.map = (n, start, stop, start2, stop2) => ((n - start) / (stop - start)) * (stop2 - start2) + start2;

const VERTEX_SHADER = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;

void main() {
    vUv = uv;
    float time = uTime * 5.;
    vec3 transformed = position;

    transformed.x += sin(time + position.y) * .5;
    transformed.y += cos(time + position.z) * .15;
    transformed.z += sin(time + position.x);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const FRAGMENT_SHADER = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;

    float move = sin(time + mouse) * 0.01;
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;

class AsciiFilter {
  constructor(renderer, args = {}) {
    this.renderer = renderer;
    this.invert = args.invert || true;
    this.domElement = document.createElement('div');
    this.pre = document.createElement('pre');
    this.domElement.appendChild(this.pre);
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.domElement.appendChild(this.canvas);
    this.deg = 0;

    this.desktopFontSize = args.fontSize || 12;
    this.mobileFontSize = args.mobileFontSize || 14;
    this.fontSize = this.desktopFontSize;
    this.enableHue = args.enableHue ?? true;
    this.fontFamily = args.fontFamily || "'Courier New', Consolas, monospace";
    this.charset =
      args.charset ||
      " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

    this.setup();
    document.addEventListener('mousemove', this.onMouseMove, false);
  }

  setMobileMode(isMobile) {
    this.enableHue = !isMobile;
    const nextSize = isMobile ? this.mobileFontSize : this.desktopFontSize;
    if (nextSize === this.fontSize) return;
    this.fontSize = nextSize;
    if (this.width && this.height) this.reset();
  }

  onMouseMove = (event) => {
    if (!this.mouse) return;
    this.mouse.x = event.clientX * PX_RATIO;
    this.mouse.y = event.clientY * PX_RATIO;
  };

  setup() {
    this.domElement.style.position = 'absolute';
    this.domElement.style.left = '0';
    this.domElement.style.top = '0';
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.context.webkitImageSmoothingEnabled = false;
    this.context.mozImageSmoothingEnabled = false;
    this.context.msImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;
  }

  get charWidth() {
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    return this.context.measureText('A').width;
  }

  reset() {
    this.cols = ~~(this.width / (this.fontSize * (this.charWidth / this.fontSize)));
    this.rows = ~~(this.height / this.fontSize);
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
  }

  setSize(width = window.innerWidth, height = window.innerHeight) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();
    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: width / 2, y: height / 2 };
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    this.asciify(this.context, w, h);
    this.hue();
  }

  get dx() {
    return this.mouse.x - this.center.x;
  }

  get dy() {
    return this.mouse.y - this.center.y;
  }

  hue() {
    if (!this.enableHue) {
      this.domElement.style.filter = 'none';
      return;
    }
    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  asciify(ctx, w, h) {
    const imgData = ctx.getImageData(0, 0, w, h).data;
    let str = '';
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const i = x * 4 + y * 4 * w;
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const a = imgData[i + 3];
        if (a < 8) {
          str += ' ';
          continue;
        }
        let gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
        let char = ~~((1 - gray) * (this.charset.length - 1));
        if (this.invert) char = this.charset.length - char - 1;
        str += this.charset[char];
      }
      str += '\n';
    }
    this.pre.innerHTML = str;
  }

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove, false);
  }
}

class CanvasTxt {
  constructor(txt, args = {}) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.fontSize = args.fontSize || 170;
    this.lineHeight = this.fontSize * 0.96;
    this.fontFamily = args.fontFamily || 'Arial, Helvetica, sans-serif';
    this.fontWeight = args.fontWeight || 600;
    this.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    this.color = args.color || '#fdf9f3';
    this.txt = txt || 'Lorem Ipsum';
  }

  setFontSize(size) {
    this.fontSize = size;
    this.lineHeight = this.fontSize * 0.96;
    this.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
  }

  get lines() {
    return String(this.txt).split('\n');
  }

  get texture() {
    return this.canvas;
  }

  resize() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  get width() {
    this.context.font = this.font;
    return ~~Math.max(...this.lines.map((line) => this.context.measureText(line).width));
  }

  get metrics() {
    this.context.font = this.font;
    return this.context.measureText(this.lines[0] || '');
  }

  get height() {
    return ~~(this.lineHeight * this.lines.length + this.metrics.actualBoundingBoxDescent * 0.4);
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    this.context.textBaseline = 'top';
    this.lines.forEach((line, index) => {
      this.context.fillText(line, 0, index * this.lineHeight);
    });
  }
}

class HomeAscii {
  constructor(container, text = 'Hello_world') {
    this.container = container;
    this.textValue = text;
    this.running = false;
    this.rafId = null;
    this.mouse = { x: 1, y: 1 };
    this.rotationLimit = 0.48;
    this.baseMeshSize = { width: 40, height: 10 };
    this.isMobile = this.isMobileViewport();
    if (this.isMobile) this.rotationLimit = 0.24;

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.z = 42;
    this.scene = new THREE.Scene();

    this.setMesh();
    this.setRenderer();
    this.onWindowResize();

    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('touchmove', this.onMouseMove, false);
    window.addEventListener('resize', this.onWindowResize, false);
  }

  get width() {
    return window.innerWidth;
  }

  get height() {
    return window.innerHeight;
  }

  isMobileViewport() {
    return window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
  }

  onMouseMove = (event) => {
    const point = event.touches ? event.touches[0] : event;
    this.mouse = {
      x: point.clientX,
      y: point.clientY,
    };
  };

  onWindowResize = () => {
    const nextMobile = this.isMobileViewport();
    if (nextMobile !== this.isMobile) {
      this.isMobile = nextMobile;
      this.rotationLimit = this.isMobile ? 0.24 : 0.48;
      this.filter.setMobileMode(this.isMobile);
    }
    this.center = {
      x: this.width / 2,
      y: this.height / 2,
    };
    this.text.setFontSize(this.isMobile ? 200 : 300);
    this.text.resize();
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.filter.setSize(this.width, this.height);
    this.fitMeshToViewport();
  };

  fitMeshToViewport() {
    if (!(this.mesh instanceof THREE.Mesh)) return;
    const textAspect = Math.max(1, this.text.width / Math.max(1, this.text.height));
    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.position.z;
    const visibleWidth = visibleHeight * this.camera.aspect;
    const baselineFontSize = 170;
    const sizeFactor = THREE.MathUtils.clamp(this.text.fontSize / baselineFontSize, 0.3, 2.4);

    // Keep the animated plane comfortably inside frame, but let font-size influence target footprint.
    const nominalWidth = visibleWidth * (this.isMobile ? 0.72 : 0.78) * sizeFactor;
    const nominalHeight = visibleHeight * (this.isMobile ? 0.28 : 0.34) * sizeFactor;
    const maxWidth = Math.min(visibleWidth * 0.9, nominalWidth);
    const maxHeight = Math.min(visibleHeight * 0.5, nominalHeight);

    let targetWidth = maxWidth;
    let targetHeight = targetWidth / textAspect;
    if (targetHeight > maxHeight) {
      targetHeight = maxHeight;
      targetWidth = targetHeight * textAspect;
    }

    if (this.isMobile) {
      // Mobile art-direction: keep the computed width, but stretch to 9:16.
      const stretchedHeight = targetWidth * (16 / 9);
      targetHeight = Math.min(stretchedHeight, visibleHeight * 0.92);
    }

    this.mesh.scale.set(
      targetWidth / this.baseMeshSize.width,
      targetHeight / this.baseMeshSize.height,
      1,
    );
  }

  get material() {
    return new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: 1.0 },
        uTexture: { value: this.texture },
      },
    });
  }

  setMesh() {
    this.text = new CanvasTxt(this.textValue, {
      fontSize: this.isMobile ? 200 : 300,
    });
    this.texture = new THREE.CanvasTexture(this.text.texture);
    this.texture.minFilter = THREE.NearestFilter;
    this.geometry = new THREE.PlaneGeometry(
      this.baseMeshSize.width,
      this.baseMeshSize.height,
      24,
      24,
    );
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.fitMeshToViewport();
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(1);
    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: 'IBM Plex Mono',
      blendMode: 'hue',
      fontSize: 12,
      mobileFontSize: 14,
      enableHue: !this.isMobile,
      color: true,
    });
    this.filter.setMobileMode(this.isMobile);
    this.container.appendChild(this.filter.domElement);
  }

  updateRotation() {
    const x = Math.map(this.mouse.y, 0, this.height, this.rotationLimit, -this.rotationLimit);
    const y = Math.map(this.mouse.x, 0, this.width, -this.rotationLimit, this.rotationLimit);
    this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;
  }

  render() {
    const time = new Date().getTime() * 0.001;
    this.text.render(time);
    this.texture.needsUpdate = true;
    this.mesh.material.uniforms.mouse.value = 1.0;
    this.mesh.material.uniforms.uTime.value = Math.sin(time);
    this.updateRotation();
    this.camera.lookAt(this.scene.position);
    this.filter.render(this.scene, this.camera);
  }

  animate = () => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.animate);
    this.render();
  };

  start() {
    if (this.running) return;
    this.running = true;
    this.animate();
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.onWindowResize, false);
    document.removeEventListener('mousemove', this.onMouseMove, false);
    document.removeEventListener('touchmove', this.onMouseMove, false);
    this.filter.dispose();
    this.geometry.dispose();
    this.mesh.material.dispose();
    this.texture.dispose();
    this.renderer.dispose();
  }
}

export const initHomeAscii = () => {
  const layer = document.querySelector('[data-home-ascii]');
  if (!(layer instanceof HTMLElement)) return;

  const homeAscii = new HomeAscii(layer, 'hello\nworld');
  let toolsMenuActive = false;

  const syncVisibility = () => {
    layer.classList.toggle('is-active', toolsMenuActive);
    if (toolsMenuActive) {
      homeAscii.onWindowResize();
      homeAscii.start();
      return;
    }
    homeAscii.stop();
  };

  const onMenuOpen = () => {
    toolsMenuActive = false;
    syncVisibility();
  };

  const onMenuState = (event) => {
    const isOpen = Boolean(event?.detail?.isOpen);
    if (!isOpen) toolsMenuActive = false;
    syncVisibility();
  };

  document.addEventListener('home-menu:open', onMenuOpen);
  document.addEventListener('home-menu:state', onMenuState);
  syncVisibility();

  return () => {
    document.removeEventListener('home-menu:open', onMenuOpen);
    document.removeEventListener('home-menu:state', onMenuState);
    homeAscii.dispose();
  };
};
