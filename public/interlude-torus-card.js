const THREE_URL = 'https://esm.sh/three@0.170.0';
const FONT_LOADER_URL = 'https://esm.sh/three@0.170.0/examples/jsm/loaders/FontLoader.js';
const TEXT_GEOMETRY_URL = 'https://esm.sh/three@0.170.0/examples/jsm/geometries/TextGeometry.js';
const FONT_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/fonts/helvetiker_regular.typeface.json';
const TORUS_TEXT = ' MEET MAL  MEET MAL  MEET MAL ';

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

      const torus = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 64, 64),
        new THREE.MeshPhysicalMaterial({
          color: 0xd9e9ff,
          metalness: 0.02,
          roughness: 0.06,
          transmission: 1,
          ior: 1.2,
          thickness: 1.1,
          transparent: true,
          opacity: 0.94,
          envMapIntensity: 1.2,
          clearcoat: 1,
          clearcoatRoughness: 0.06,
          attenuationDistance: 1.1,
          attenuationColor: 0xdde8ff,
        }),
      );
      // Keep torus aligned with the existing text ring (do not move text).
      torus.position.y = 0.30;
      scene.add(torus);

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
              new THREE.MeshStandardMaterial({
                color: 0xf4f7ff,
                metalness: 0.14,
                roughness: 0.28,
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
          // Keep torus even if the font fails to load.
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
          if (fontLoaded) {
            textGroup.rotation.y = -t * 0.51;
            textGroup.rotation.z = Math.sin(t * 0.37 + 1.35) * 0.06;
            textGroup.rotation.x = 0.2 + Math.sin(t * 0.29 + 0.4) * 0.022;
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
