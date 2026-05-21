const LOGO_VIEWS = ["top", "bottom", "left", "perspective"];

const LOGO_SIZE = 24;
const FAVICON_SIZE = 16;
const DEFAULT_ORBIT_SECONDS = 2.4;

const CONE = {
  rTop: 9.375,
  rBase: 5.25,
  depth: 7.5,
};

const ORBIT_CAP_BY_VIEW = {
  top: "top",
  bottom: "base",
  left: "top",
  perspective: "top",
};

const ORBIT_ELLIPSE_SCALE_BY_VIEW = {
  top: { x: 1.0, y: 0.55 },
  bottom: { x: 1.8, y: 0.55 },
  left: { x: 1.18, y: 0.58 },
  perspective: { x: 1.9, y: 0.6 },
};

const ORBIT_PHASE_OFFSET_BY_VIEW = {
  top: 20 * (Math.PI / 180),
  bottom: -20 * (Math.PI / 180),
  left: 90 * (Math.PI / 180),
  perspective: -1.1,
};

const ORBIT_CENTER_OFFSET_BY_VIEW = {
  top: { x: -0.8, y: 0 },
  bottom: { x: -0.8, y: 2.85 },
  left: { x: 1.35, y: -3.8 },
  perspective: { x: 0, y: -0.8 },
};

function clampView(view) {
  if (LOGO_VIEWS.includes(view)) {
    return view;
  }
  return "perspective";
}

function scaleForSize(size) {
  return size / LOGO_SIZE;
}

function scaleCaps(caps, size) {
  const scale = scaleForSize(size);
  return caps.map((cap) => ({
    ...cap,
    cx: cap.cx * scale,
    cy: cap.cy * scale,
    rx: cap.rx * scale,
    ry: cap.ry * scale,
  }));
}

function createPerspectiveProjector() {
  const camera = [-8, 7, -22];
  const lookAt = [0, 0, CONE.depth * 0.5];
  const worldUp = [0, 1, 0];
  const focalLength = 1;
  const viewScale = 11.8;

  const forward = normalize(subtract3(lookAt, camera));
  const right = normalize(cross3(forward, worldUp));
  const up = cross3(right, forward);

  return function project(point) {
    const viewPoint = subtract3(point, camera);
    const x = dot3(viewPoint, right);
    const y = dot3(viewPoint, up);
    const z = dot3(viewPoint, forward);
    const invZ = z <= 0.0001 ? 10000 : 1 / z;
    const perspective = focalLength * invZ;
    return {
      x: 12 + x * perspective * viewScale,
      y: 12 - y * perspective * viewScale,
    };
  };
}

function projectPerspectiveCap(center, radius, project) {
  const projectedCenter = project(center);
  const xRim = project([center[0] + radius, center[1], center[2]]);
  const yRim = project([center[0], center[1] + radius, center[2]]);

  return {
    cx: projectedCenter.x,
    cy: projectedCenter.y,
    rx: Math.max(0.5, Math.abs(xRim.x - projectedCenter.x)),
    ry: Math.max(0.5, Math.abs(yRim.y - projectedCenter.y)),
  };
}

function buildBaseCaps() {
  const perspectiveProject = createPerspectiveProjector();
  const topCapPerspective = projectPerspectiveCap([0, 0, 0], CONE.rTop, perspectiveProject);
  const baseCapPerspective = projectPerspectiveCap([0, 0, CONE.depth], CONE.rBase, perspectiveProject);
  const leftAngle = 35 * (Math.PI / 180);
  const leftCos = Math.cos(leftAngle);
  const leftSin = Math.sin(leftAngle);
  const leftTopDistance = 3.6;
  const leftBaseDistance = 3.6;

  return {
    top: [
      {
        id: "top",
        element: "circle",
        cx: 12,
        cy: 12,
        rx: CONE.rTop,
        ry: CONE.rTop,
      },
    ],
    bottom: [
      {
        id: "base",
        element: "circle",
        cx: 12,
        cy: 12,
        rx: CONE.rBase,
        ry: CONE.rBase,
      },
    ],
    left: [
      {
        id: "top",
        element: "circle",
        cx: 12 - leftTopDistance * leftCos,
        cy: 12 - leftTopDistance * leftSin,
        rx: CONE.rTop * 0.78,
        ry: CONE.rTop * 0.78,
      },
      {
        id: "base",
        element: "circle",
        cx: 12 + leftBaseDistance * leftCos,
        cy: 12 + leftBaseDistance * leftSin,
        rx: CONE.rBase * 0.78,
        ry: CONE.rBase * 0.78,
      },
    ],
    perspective: [
      {
        id: "top",
        element: "ellipse",
        cx: topCapPerspective.cx,
        cy: topCapPerspective.cy,
        rx: topCapPerspective.rx * 1.02,
        ry: topCapPerspective.ry * 1.62,
      },
      {
        id: "base",
        element: "ellipse",
        cx: baseCapPerspective.cx,
        cy: baseCapPerspective.cy,
        rx: baseCapPerspective.rx * 1.02,
        ry: baseCapPerspective.ry * 1.62,
      },
    ],
  };
}

const BASE_CAPS_BY_VIEW = buildBaseCaps();

function getOrbitCap(view, size = LOGO_SIZE) {
  const safeView = clampView(view);
  const caps = projectCaps(safeView, size);
  const orbitCapId = ORBIT_CAP_BY_VIEW[safeView];
  return caps.find((cap) => cap.id === orbitCapId) ?? caps[0];
}

function projectCaps(view, size = LOGO_SIZE) {
  const safeView = clampView(view);
  const baseCaps = BASE_CAPS_BY_VIEW[safeView];
  return scaleCaps(baseCaps, size);
}

function orbitPoint(view, theta, size = LOGO_SIZE) {
  const safeView = clampView(view);
  const cap = getOrbitCap(safeView, size);
  const orbitScale = ORBIT_ELLIPSE_SCALE_BY_VIEW[safeView] ?? { x: 1, y: 0.8 };
  const phaseOffset = ORBIT_PHASE_OFFSET_BY_VIEW[safeView] ?? 0;
  const centerOffset = ORBIT_CENTER_OFFSET_BY_VIEW[safeView] ?? { x: 0, y: 0 };
  const scale = scaleForSize(size);
  const orbitTheta = theta + phaseOffset;
  const cosTheta = Math.cos(orbitTheta);
  const sinTheta = Math.sin(orbitTheta);
  return {
    x: cap.cx + centerOffset.x * scale + cap.rx * orbitScale.x * cosTheta,
    y: cap.cy + centerOffset.y * scale + cap.ry * orbitScale.y * sinTheta,
  };
}

function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross3(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function subtract3(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v) {
  const magnitude = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / magnitude, v[1] / magnitude, v[2] / magnitude];
}

export {
  CONE,
  DEFAULT_ORBIT_SECONDS,
  FAVICON_SIZE,
  LOGO_SIZE,
  LOGO_VIEWS,
  projectCaps,
  orbitPoint,
};
