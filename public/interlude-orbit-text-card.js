const THREE_URL = 'https://esm.sh/three@0.170.0';
const FONT_LOADER_URL = 'https://esm.sh/three@0.170.0/examples/jsm/loaders/FontLoader.js';
const TEXT_GEOMETRY_URL = 'https://esm.sh/three@0.170.0/examples/jsm/geometries/TextGeometry.js';
const FONT_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/fonts/helvetiker_regular.typeface.json';
const ORBIT_TEXT = ' MITTE ARTS LAB MITTE ARTS LAB ';

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

export const initInterludeOrbitTextCard = () => {
  const mount = document.querySelector('[data-interlude-orbit-text]');
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
      camera.position.set(0, 0.2, 4.9);

      scene.add(new THREE.AmbientLight(0xffffff, 0.72));
      const rimLight = new THREE.DirectionalLight(0xdfeaff, 0.8);
      rimLight.position.set(2.6, 1.8, 3.2);
      scene.add(rimLight);

      const textGroup = new THREE.Group();
      textGroup.rotation.x = 0.22;
      textGroup.position.y = 0.12;
      scene.add(textGroup);

      let running = true;
      let fontLoaded = false;
      let rafId = 0;

      const fontLoader = new FontLoader();
      fontLoader.load(
        FONT_URL,
        (font) => {
          const chars = ORBIT_TEXT.split('');
          const angleStep = (Math.PI * 2) / chars.length;
          const radius = 1.03;
          chars.forEach((char, index) => {
            if (char === ' ') return;
            const geometryMain = new TextGeometry(char, {
              font,
              size: 0.19,
              depth: 0.03,
              curveSegments: 10,
              bevelEnabled: true,
              bevelThickness: 0.008,
              bevelSize: 0.005,
              bevelSegments: 3,
            });
            geometryMain.center();
            const letter = new THREE.Mesh(
              geometryMain,
              new THREE.MeshStandardMaterial({
                color: 0xf3f7ff,
                metalness: 0.1,
                roughness: 0.3,
              }),
            );
            const angle = index * angleStep;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * 0.32;
            const z = Math.sin(angle) * radius;
            letter.position.set(x, y, z);
            letter.lookAt(0, letter.position.y * 0.18, 0);
            textGroup.add(letter);
          });
          fontLoaded = true;
        },
        undefined,
        () => {
          // Keep card stable if font fetch fails.
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
        if (running && fontLoaded) {
          const t = time * 0.001;
          textGroup.rotation.y = -t * 0.36;
          textGroup.rotation.z = Math.sin(t * 0.62 + 0.8) * 0.095;
          textGroup.rotation.x = 0.22 + Math.sin(t * 0.33) * 0.03;
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
      console.error('[interlude orbit text] failed to load', error);
    }
  };

  load();

  return () => {
    disposed = true;
    teardown();
  };
};
