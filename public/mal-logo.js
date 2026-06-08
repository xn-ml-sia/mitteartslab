import {
  DEFAULT_ORBIT_SECONDS,
  FAVICON_SIZE,
  LOGO_SIZE,
  LOGO_VIEWS,
  orbitPoint,
  projectCaps,
} from "./mal-logo-geometry.js";

const ACTIVE_LOGOS = new WeakMap();
const TWO_PI = Math.PI * 2;

function getSafeView(view) {
  return LOGO_VIEWS.includes(view) ? view : "perspective";
}

function serializeCap(cap) {
  if (cap.element === "ellipse") {
    return `<ellipse class="mal-logo-cap mal-logo-cap-${cap.id}" cx="${formatNum(cap.cx)}" cy="${formatNum(cap.cy)}" rx="${formatNum(cap.rx)}" ry="${formatNum(cap.ry)}"></ellipse>`;
  }

  return `<circle class="mal-logo-cap mal-logo-cap-${cap.id}" cx="${formatNum(cap.cx)}" cy="${formatNum(cap.cy)}" r="${formatNum(cap.rx)}"></circle>`;
}

function buildLogoSvg(view) {
  const safeView = getSafeView(view);
  const caps = projectCaps(safeView, LOGO_SIZE);
  const dot = orbitPoint(safeView, 0, LOGO_SIZE);
  const capMarkup = caps.map(serializeCap).join("");
  const dotRadius = 1.7;

  return `<svg class="mal-logo-svg" viewBox="0 0 ${LOGO_SIZE} ${LOGO_SIZE}" role="presentation" focusable="false" aria-hidden="true">${capMarkup}<circle class="mal-logo-dot" cx="${formatNum(dot.x)}" cy="${formatNum(dot.y)}" r="${formatNum(dotRadius)}"></circle></svg>`;
}

function buildFaviconSvg(view) {
  const safeView = getSafeView(view);
  const caps = projectCaps(safeView, FAVICON_SIZE);
  const capMarkup = caps
    .map((cap) => {
      if (cap.element === "ellipse") {
        return `<ellipse cx="${formatNum(cap.cx)}" cy="${formatNum(cap.cy)}" rx="${formatNum(cap.rx)}" ry="${formatNum(cap.ry)}" fill="none" stroke="#603553" stroke-width="1"></ellipse>`;
      }
      return `<circle cx="${formatNum(cap.cx)}" cy="${formatNum(cap.cy)}" r="${formatNum(cap.rx)}" fill="none" stroke="#603553" stroke-width="1"></circle>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FAVICON_SIZE} ${FAVICON_SIZE}"><rect width="${FAVICON_SIZE}" height="${FAVICON_SIZE}" fill="none"></rect>${capMarkup}</svg>`;
}

function faviconDataUri(view) {
  const encoded = encodeURIComponent(buildFaviconSvg(view));
  return `data:image/svg+xml,${encoded}`;
}

function updateDot(svg, view, theta) {
  const dot = svg.querySelector(".mal-logo-dot");
  if (!dot) {
    return;
  }
  const point = orbitPoint(view, theta, LOGO_SIZE);
  dot.setAttribute("cx", formatNum(point.x));
  dot.setAttribute("cy", formatNum(point.y));
}

function stopLogoAnimation(el) {
  const active = ACTIVE_LOGOS.get(el);
  if (active && typeof active.stop === "function") {
    active.stop();
  }
  ACTIVE_LOGOS.delete(el);
}

function mountMalLogo(el) {
  if (!el) {
    return;
  }

  stopLogoAnimation(el);

  const safeView = getSafeView(el.dataset.malLogo || el.dataset.malLogoView || "perspective");
  el.innerHTML = buildLogoSvg(safeView);
  el.classList.add(`mal-logo--${safeView}`);

  const svg = el.querySelector("svg");
  if (!svg) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    updateDot(svg, safeView, 0);
    return;
  }

  const periodMs = DEFAULT_ORBIT_SECONDS * 1000;
  let rafId = 0;
  let lastTime = performance.now();
  let theta = 0;
  let isStopped = false;

  const step = (now) => {
    if (isStopped) {
      return;
    }
    const dt = now - lastTime;
    lastTime = now;
    theta = (theta - (dt / periodMs) * TWO_PI + TWO_PI) % TWO_PI;
    updateDot(svg, safeView, theta);
    rafId = window.requestAnimationFrame(step);
  };

  rafId = window.requestAnimationFrame(step);
  ACTIVE_LOGOS.set(el, {
    stop() {
      isStopped = true;
      window.cancelAnimationFrame(rafId);
    },
  });
}

function initMalLogos(root = document) {
  root.querySelectorAll(".mal-logo[data-mal-logo], .mal-logo[data-mal-logo-view]").forEach((el) => {
    mountMalLogo(el);
  });
}

function setPageFavicon(view) {
  const safeView = getSafeView(view);
  const head = document.head || document.querySelector("head");
  if (!head) {
    return;
  }

  let faviconEl = head.querySelector("link[rel='icon']");
  if (!faviconEl) {
    faviconEl = document.createElement("link");
    faviconEl.setAttribute("rel", "icon");
    head.appendChild(faviconEl);
  }

  faviconEl.setAttribute("href", faviconDataUri(safeView));
}

function formatNum(value) {
  return Number(value.toFixed(3)).toString();
}

export {
  LOGO_VIEWS,
  buildLogoSvg,
  faviconDataUri,
  initMalLogos,
  mountMalLogo,
  setPageFavicon,
};
