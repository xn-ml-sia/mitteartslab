const THREE_URL = 'https://esm.sh/three@0.170.0';
const FONT_LOADER_URL = 'https://esm.sh/three@0.170.0/examples/jsm/loaders/FontLoader.js';
const TEXT_GEOMETRY_URL = 'https://esm.sh/three@0.170.0/examples/jsm/geometries/TextGeometry.js';
const FONT_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/fonts/helvetiker_regular.typeface.json';
const TORUS_TEXT = 'MITTE ARTS LAB MITTE ARTS LAB ';

const FUNHOUSE_NORMAL_SIZE = 64;

/** Radial bulge + ripple normals — magnifies / warps sphere reflections like convex funhouse glass. */
const fillFunhouseNormalMap = (data, size, time) => {
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / (size - 1);
      const v = y / (size - 1);
      const px = (u - 0.5) * 2;
      const py = (v - 0.5) * 2;
      const r = Math.sqrt(px * px + py * py);
      const convex = 1 + 0.72 * Math.pow(Math.max(0, 1 - r * 1.05), 2.1);
      const ripple =
        Math.sin(r * 10.5 - time * 2.6) * 0.16 +
        Math.sin(px * 8 + time * 1.9) * 0.09 +
        Math.sin(py * 7 - time * 1.4) * 0.08;
      let nx = px * (convex + ripple);
      let ny = py * (convex + ripple);
      const len = Math.hypot(nx, ny, 1);
      nx /= len;
      ny /= len;
      const nz = 1 / len;
      const i = (y * size + x) * 4;
      data[i] = Math.floor((nx * 0.5 + 0.5) * 255);
      data[i + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      data[i + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
};

const disposeObjectTree = (root) => {
  root.traverse((node) => {
    if (!node.isMesh) return;
    node.geometry?.dispose?.();
    if (Array.isArray(node.material)) {
      node.material.forEach((material) => material?.dispose?.());
      return;
    }
    node.material?.dispose?.();
  });
};

export const initInterludeTwoTorusCard = () => {
  const mount = document.querySelector('[data-interlude2-torus]');
  if (!mount) return null;

  let disposed = false;
  let teardown = () => {};

  const load = async () => {
    try {
      const THREE = await import(THREE_URL);
      const { FontLoader } = await import(FONT_LOADER_URL);
      const { TextGeometry } = await import(TEXT_GEOMETRY_URL);
      if (disposed || !mount.isConnected) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
      camera.position.set(0, 0.35, 5.25);

      scene.add(new THREE.AmbientLight(0xffffff, 0.65));
      const keyLight = new THREE.DirectionalLight(0xd8e9ff, 1.35);
      keyLight.position.set(3.2, 2.4, 4.4);
      scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight(0xbfd3ff, 0.5);
      fillLight.position.set(-2.2, -1.2, -2.8);
      scene.add(fillLight);

      const funhouseNormalData = new Uint8Array(FUNHOUSE_NORMAL_SIZE * FUNHOUSE_NORMAL_SIZE * 4);
      fillFunhouseNormalMap(funhouseNormalData, FUNHOUSE_NORMAL_SIZE, 0);
      const funhouseNormalMap = new THREE.DataTexture(
        funhouseNormalData,
        FUNHOUSE_NORMAL_SIZE,
        FUNHOUSE_NORMAL_SIZE,
      );
      funhouseNormalMap.wrapS = THREE.RepeatWrapping;
      funhouseNormalMap.wrapT = THREE.RepeatWrapping;
      funhouseNormalMap.needsUpdate = true;

      const glassCube = new THREE.Mesh(
        new THREE.BoxGeometry(1.18, 1.18, 1.18),
        new THREE.MeshPhysicalMaterial({
          color: 0xd9e9ff,
          metalness: 0.04,
          roughness: 0.03,
          transmission: 1,
          ior: 1.28,
          thickness: 1.15,
          transparent: true,
          opacity: 0.94,
          envMap: null,
          envMapIntensity: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.18,
          normalMap: funhouseNormalMap,
          normalScale: new THREE.Vector2(1.15, 1.15),
          attenuationDistance: 1.1,
          attenuationColor: 0xdde8ff,
        }),
      );
      // Keep cube aligned with the existing text ring (do not move text).
      glassCube.position.y = 0.30;
      scene.add(glassCube);

      const textGroup = new THREE.Group();
      textGroup.rotation.x = 0.2;
      textGroup.position.y = 0.30;
      scene.add(textGroup);

      let fontLoaded = false;
      let running = true;
      let rafId = 0;

      const fontLoader = new FontLoader();
      fontLoader.load(
        FONT_URL,
        (font) => {
          const chars = TORUS_TEXT.split('');
          const angleStep = (Math.PI * 2) / chars.length;
          const radius = 1.05;
          chars.forEach((char, index) => {
            if (char === ' ') return;
            const geometry = new TextGeometry(char, {
              font,
              size: 0.2,
              depth: 0.035,
              curveSegments: 10,
              bevelEnabled: true,
              bevelThickness: 0.009,
              bevelSize: 0.006,
              bevelSegments: 3,
            });
            geometry.center();
            const letter = new THREE.Mesh(
              geometry,
              new THREE.MeshBasicMaterial({
                color: 0xffffff,
                toneMapped: false,
              }),
            );
            const angle = index * angleStep;
            letter.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.32, Math.sin(angle) * radius);
            letter.lookAt(0, letter.position.y * 0.18, 0);
            textGroup.add(letter);
          });
          fontLoaded = true;
        },
        undefined,
        () => {
          // Keep cube even if the font fails to load.
        },
      );

      const resize = () => {
        const width = Math.max(1, mount.clientWidth);
        const height = Math.max(1, mount.clientHeight);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      const updateVisibility = () => {
        running = document.visibilityState === 'visible' && mount.isConnected;
      };

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          running = Boolean(entry?.isIntersecting) && document.visibilityState === 'visible';
        },
        { threshold: 0.15 },
      );
      intersectionObserver.observe(mount);

      const tick = (time) => {
        if (running) {
          const t = time * 0.001;
          fillFunhouseNormalMap(funhouseNormalData, FUNHOUSE_NORMAL_SIZE, t);
          funhouseNormalMap.needsUpdate = true;
          glassCube.rotation.x = t * 0.58;
          glassCube.rotation.y = t * 0.91;
          glassCube.rotation.z = t * 0.37;
          if (fontLoaded) {
            const tiltUpDown = Math.sin(t * 0.44) * 0.28;
            textGroup.rotation.y = -t * 0.51;
            textGroup.rotation.x = 0.22 + tiltUpDown;
            textGroup.rotation.z = Math.sin(t * 0.37 + 1.35) * 0.05;
          }
          renderer.render(scene, camera);
        }
        rafId = window.requestAnimationFrame(tick);
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      document.addEventListener('visibilitychange', updateVisibility, { passive: true });

      resize();
      rafId = window.requestAnimationFrame(tick);

      teardown = () => {
        window.cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener('visibilitychange', updateVisibility);
        disposeObjectTree(scene);
        funhouseNormalMap.dispose();
        renderer.dispose();
        mount.replaceChildren();
      };

      if (disposed) teardown();
    } catch (error) {
      console.error('[interlude-2 torus] failed to load', error);
    }
  };

  load();

  return () => {
    disposed = true;
    teardown();
  };
};
