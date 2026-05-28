import { mountMalLogo } from './mal-logo.js';

const viewport = document.querySelector('.infiniteCanvasViewport');
const container = document.querySelector('.infiniteCanvasContainer');
const title = document.getElementById('gallery-title');
const mediaItems = Array.from(document.querySelectorAll('.mediaItem'));

if (viewport && container && title && mediaItems.length > 0) {
  const IMG_SIZE_DESKTOP = 400;
  /** Base tile size (px) before per-card variant scale; mobile = 1.5× desktop footprint. */
  const IMG_SIZE_MOBILE = 600;
  const wheelSpeed = 1.5;

  const minCardHeight = 420;
  const maxCardHeight = 630;
  const minGap = 16;
  const jitter = 22;
  const maxPlacementAttempts = 1400;

  const state = {
    isMobile: window.innerWidth < 768,
    zoom: window.innerWidth < 768 ? 0.56 : 0.76,
    itemWidth: window.innerWidth < 768 ? IMG_SIZE_MOBILE : IMG_SIZE_DESKTOP,
    itemHeight: window.innerWidth < 768 ? IMG_SIZE_MOBILE : IMG_SIZE_DESKTOP,
    canvasWidth: 0,
    canvasHeight: 0,
    cameraX: 0,
    cameraY: 0,
    targetX: 0,
    targetY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    dragDistance: 0,
    downX: 0,
    downY: 0,
    raf: 0,
    hasAnimatedIn: false,
    focusX: 0,
    focusY: 0,
  };

  const GROUP_ORDER = ['zalando', 'blockfi', 'csign', 'experiments'];
  const ABOVE_ROW_GROUP_ORDER = ['blockfi', 'csign'];
  const SURROUND_LAYOUT = {
    experiments: 'right',
  };
  const GROUP_LOGO_VIEW = {
    zalando: 'top',
    blockfi: 'left',
    csign: 'bottom',
    experiments: 'perspective',
  };

  const NAV_LABEL_FONT_PX = 12;
  const NAV_LABEL_LINE_HEIGHT = 1.4;

  const getLabelFontSize = () => NAV_LABEL_FONT_PX / state.zoom;
  const getLabelLineHeightPx = () => getLabelFontSize() * NAV_LABEL_LINE_HEIGHT;

  const getFloatLogoSize = () => (state.isMobile ? 38 : 46);
  const getLogoReserve = () => getFloatLogoSize() + (state.isMobile ? 6 : 8);
  const getGroupCopy = (group) => {
    const heroIndex = group.indices.find((index) => mediaItems[index].dataset.hero === 'true');
    const sourceIndex = heroIndex ?? group.indices[0];
    const item = mediaItems[sourceIndex];
    const title = item?.querySelector('.gallery-caption-title')?.textContent?.trim() || group.id;
    const desc = item?.querySelector('.gallery-caption-desc')?.textContent?.trim() || '';
    return { title, desc };
  };

  const measureLabelSlot = (copy, labelWidth, gap) => {
    const lineHeight = getLabelLineHeightPx();
    const charWidth = getLabelFontSize() * 0.6;
    if (!copy.desc) return lineHeight + gap;
    const charsPerLine = Math.max(18, Math.floor(labelWidth / charWidth));
    const descLines = Math.min(6, Math.ceil(copy.desc.length / charsPerLine));
    return lineHeight + 4 + descLines * lineHeight + gap;
  };

  const getCaptionHeightForItem = () => 0;

  const buildGroups = () => {
    const map = new Map();
    mediaItems.forEach((item, index) => {
      const id = item.dataset.group || 'experiments';
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(index);
    });
    return GROUP_ORDER.filter((id) => map.has(id)).map((id) => ({
      id,
      indices: map.get(id),
    }));
  };

  const layoutCluster = (sizes, innerGap) => {
    if (sizes.length === 0) return { positions: [], width: 0, height: 0 };
    const cols = sizes.length <= 2 ? sizes.length : sizes.length <= 5 ? 2 : 3;
    const colHeights = Array.from({ length: cols }, () => 0);
    const colWidths = Array.from({ length: cols }, () => 0);
    const positions = [];

    sizes.forEach((size) => {
      const { w, fullH } = size;
      let targetCol = 0;
      for (let c = 1; c < cols; c += 1) {
        if (colHeights[c] < colHeights[targetCol]) targetCol = c;
      }
      let x = 0;
      for (let c = 0; c < targetCol; c += 1) {
        x += colWidths[c] + innerGap;
      }
      const y = colHeights[targetCol];
      positions.push({ x, y, w, h: fullH });
      colHeights[targetCol] += fullH + innerGap;
      colWidths[targetCol] = Math.max(colWidths[targetCol], w);
    });

    const width = colWidths.reduce((sum, w, index) => sum + w + (index > 0 ? innerGap : 0), 0);
    const height = Math.max(0, Math.max(...colHeights) - innerGap);
    return { positions, width, height };
  };

  const hashString = (str) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  const makeRng = (seed) => {
    let s = seed >>> 0;
    return () => {
      s ^= s << 13;
      s ^= s >>> 17;
      s ^= s << 5;
      return ((s >>> 0) / 4294967296);
    };
  };

  const ease = (t) => 1 - Math.pow(1 - t, 3);

  const getViewSize = () => ({
    w: viewport.clientWidth || window.innerWidth,
    h: viewport.clientHeight || window.innerHeight,
  });

  const applyBounds = (x, y) => {
    const { w: viewW, h: viewH } = getViewSize();
    const maxX = 0;
    const maxY = 0;
    const minX = Math.min(viewW - state.canvasWidth * state.zoom, 0);
    const minY = Math.min(viewH - state.canvasHeight * state.zoom, 0);
    return {
      x: Math.min(maxX, Math.max(minX, x)),
      y: Math.min(maxY, Math.max(minY, y)),
    };
  };

  const setCamera = (x, y) => {
    state.cameraX = x;
    state.cameraY = y;
    container.style.transform = `translate(${x}px, ${y}px) scale(${state.zoom})`;
    container.style.transformOrigin = '0 0';
  };

  const animate = () => {
    state.raf = 0;
    const dx = state.targetX - state.cameraX;
    const dy = state.targetY - state.cameraY;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.4) {
      setCamera(state.targetX, state.targetY);
      return;
    }
    const alpha = ease(0.2);
    const nextX = state.cameraX + dx * alpha;
    const nextY = state.cameraY + dy * alpha;
    const bounded = applyBounds(nextX, nextY);
    setCamera(bounded.x, bounded.y);
    state.raf = requestAnimationFrame(animate);
  };

  const scheduleAnimation = () => {
    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(animate);
  };

  const intersects = (a, b, gap = 0) => !(
    a.x + a.w + gap <= b.x ||
    b.x + b.w + gap <= a.x ||
    a.y + a.h + gap <= b.y ||
    b.y + b.h + gap <= a.y
  );

  const computeWorldViewport = () => {
    const { w: viewW, h: viewH } = getViewSize();
    const vw = viewW / state.zoom;
    const vh = viewH / state.zoom;
    return {
      left: state.canvasWidth * 0.5 - vw * 0.5,
      top: state.canvasHeight * 0.5 - vh * 0.5,
      right: state.canvasWidth * 0.5 + vw * 0.5,
      bottom: state.canvasHeight * 0.5 + vh * 0.5,
      vw,
      vh,
    };
  };

  const parseMediaRatio = (raw) => {
    if (!raw) return 1;
    const parts = raw.split('/').map((part) => Number.parseFloat(part.trim()));
    if (parts.length === 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1]) && parts[1] > 0) {
      return parts[0] / parts[1];
    }
    const single = Number.parseFloat(raw);
    return Number.isFinite(single) && single > 0 ? single : 1;
  };

  const createSizeProfile = (i) => {
    const ratioRaw = mediaItems[i]?.querySelector('.mediaBlock')?.style.getPropertyValue('--media-ratio');
    const aspectRatio = parseMediaRatio(ratioRaw);
    const variants = state.isMobile
      ? [0.97, 0.99, 1, 1.01, 1.02, 0.98, 1.03]
      : [0.96, 0.98, 1, 1.02, 1.04, 0.97, 1.03];
    const s = variants[i % variants.length];
    let w = Math.round(state.itemWidth * s);
    let h = Math.round(w / aspectRatio);

    if (h < minCardHeight) {
      h = minCardHeight;
      w = Math.round(h * aspectRatio);
    } else if (h > maxCardHeight) {
      h = maxCardHeight;
      w = Math.round(h * aspectRatio);
    }
    const capH = getCaptionHeightForItem(mediaItems[i]);
    return { w, h, fullH: h + capH };
  };

  const placeByRules = () => {
    const rng = makeRng(hashString('gallery-seed-v10'));
    const { vw: vwW, vh: vhW } = computeWorldViewport();
    const isPortrait = state.isMobile && vhW > vwW * 1.02;
    const ar = isPortrait ? Math.min(Math.max(vhW / vwW, 1.15), 2.25) : 1;
    const spreadY = isPortrait ? Math.sqrt(ar) : 1;
    const spreadX = isPortrait ? 1 / spreadY : 1;
    const pad = state.isMobile ? 14 : 36;
    const bounds = {
      left: pad,
      top: pad,
      right: state.canvasWidth - pad,
      bottom: state.canvasHeight - pad,
    };
    const centerX = state.canvasWidth * 0.5;
    const centerY = state.canvasHeight * 0.5;
    const placements = new Array(mediaItems.length).fill(null);
    const clusterBoxes = [];
    const clusterLabels = [];
    const groups = buildGroups();
    const labelGap = state.isMobile ? 4 : 6;
    const logoReserve = getLogoReserve();
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const placementGap = state.isMobile ? 8 : 12;
    const radialScale = state.isMobile ? 0.12 : 0.48;
    const jitterScale = state.isMobile ? 0.06 : 0.32;
    const angleJitter = state.isMobile ? 0.03 : 0.08;
    const pushStep = state.isMobile ? 0.14 : 0.22;
    const innerGap = state.isMobile ? 2 : 4;
    const surroundGap = state.isMobile ? 8 : 12;
    const aboveRowOffsetUp = state.isMobile ? 40 : 72;
    const aboveRowOffsetRight = state.isMobile ? 96 : 200;

    const prepareGroupLayout = (group) => {
      const indices = [...group.indices].sort((a, b) => {
        const aHero = mediaItems[a].dataset.hero === 'true' ? 0 : 1;
        const bHero = mediaItems[b].dataset.hero === 'true' ? 0 : 1;
        return aHero - bHero || a - b;
      });
      const sizes = indices.map((index) => createSizeProfile(index));
      const layout = layoutCluster(sizes, innerGap);
      const groupCopy = getGroupCopy(group);
      const labelSlot = groupCopy.title ? measureLabelSlot(groupCopy, layout.width, labelGap) : 0;
      const clusterH = labelSlot + layout.height;
      const clusterW = layout.width + (groupCopy.title ? logoReserve : 0);
      return {
        group,
        indices,
        sizes,
        layout,
        groupCopy,
        labelSlot,
        clusterW,
        clusterH,
      };
    };

    const commitGroupAtAnchor = (anchor, prepared) => {
      const { group, indices, sizes, layout, groupCopy, labelSlot } = prepared;
      if (groupCopy.title) {
        clusterLabels.push({
          id: group.id,
          title: groupCopy.title,
          desc: groupCopy.desc,
          labelSlot,
          x: anchor.x + logoReserve,
          y: anchor.y,
          w: layout.width,
          logoX: anchor.x,
          logoY: anchor.y,
        });
      }
      indices.forEach((itemIndex, ki) => {
        const local = layout.positions[ki];
        placements[itemIndex] = {
          x: anchor.x + logoReserve + local.x,
          y: anchor.y + labelSlot + local.y,
          w: sizes[ki].w,
          h: sizes[ki].fullH,
        };
      });
      return {
        itemIndices: indices,
        labelIds: groupCopy.title ? [group.id] : [],
      };
    };

    const tryPlaceCluster = (clusterW, clusterH, gi) => {
      const theta = gi * goldenAngle + (rng() - 0.5) * angleJitter;
      const radialCoeff = state.isMobile ? 0.03 : 0.045;
      const radialBasis = state.isMobile ? Math.sqrt(vwW * vhW) : Math.min(vwW, vhW);
      const portraitRing = isPortrait ? 0.94 : 1;
      const radialStep = radialBasis * radialCoeff * radialScale * portraitRing;
      const baseRadius = Math.sqrt(gi + 1) * radialStep;
      const jitterPx = state.isMobile ? 10 : jitter * 0.55;
      const dirX = Math.cos(theta) * spreadX;
      const dirY = Math.sin(theta) * spreadY;
      const seedX = centerX + dirX * baseRadius + (rng() - 0.5) * jitterPx * jitterScale;
      const seedY = centerY + dirY * baseRadius + (rng() - 0.5) * jitterPx * jitterScale;

      for (let attempt = 0; attempt < maxPlacementAttempts; attempt += 1) {
        const push = attempt * (placementGap * pushStep);
        const x = seedX + Math.cos(theta) * push * spreadX - clusterW * 0.5;
        const y = seedY + Math.sin(theta) * push * spreadY - clusterH * 0.35;
        const candidate = { x, y, w: clusterW, h: clusterH };
        const inBounds =
          candidate.x >= bounds.left &&
          candidate.y >= bounds.top &&
          candidate.x + candidate.w <= bounds.right &&
          candidate.y + candidate.h <= bounds.bottom;
        if (!inBounds) continue;
        if (clusterBoxes.some((p) => intersects(candidate, p, placementGap))) continue;
        return candidate;
      }

      for (let fallback = 0; fallback < 600; fallback += 1) {
        const x = bounds.left + rng() * (bounds.right - bounds.left - clusterW);
        const y = bounds.top + rng() * (bounds.bottom - bounds.top - clusterH);
        const candidate = { x, y, w: clusterW, h: clusterH };
        if (clusterBoxes.some((p) => intersects(candidate, p, placementGap))) continue;
        return candidate;
      }

      return null;
    };

    const fallbackClusterAnchor = (clusterW, clusterH, gi) => {
      let anchor = {
        x: bounds.left + placementGap,
        y: bounds.top + placementGap,
        w: clusterW,
        h: clusterH,
      };
      for (let i = 0; i < gi; i += 1) {
        anchor.y += clusterBoxes[i].h + placementGap;
      }
      let guard = 0;
      while (clusterBoxes.some((box) => intersects(anchor, box, placementGap * 0.5)) && guard < 160) {
        anchor.y += placementGap + 16;
        guard += 1;
      }
      return anchor;
    };

    const shiftClusterBox = (boxIndex, shiftX, shiftY) => {
      const box = clusterBoxes[boxIndex];
      box.x += shiftX;
      box.y += shiftY;
      box.itemIndices.forEach((itemIndex) => {
        if (!placements[itemIndex]) return;
        placements[itemIndex].x += shiftX;
        placements[itemIndex].y += shiftY;
      });
      box.labelIds.forEach((labelId) => {
        const label = clusterLabels.find((entry) => entry?.id === labelId);
        if (!label) return;
        label.x += shiftX;
        label.y += shiftY;
        label.logoX += shiftX;
        label.logoY += shiftY;
      });
    };

    const shiftAllClusters = (shiftX, shiftY) => {
      clusterBoxes.forEach((_, index) => shiftClusterBox(index, shiftX, shiftY));
    };

    const getConstellationBounds = () => {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      clusterBoxes.forEach((box) => {
        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.w);
        maxY = Math.max(maxY, box.y + box.h);
      });
      return { minX, minY, maxX, maxY };
    };

    const centerConstellation = () => {
      const { minX, minY, maxX, maxY } = getConstellationBounds();
      shiftAllClusters(
        centerX - (minX + maxX) * 0.5,
        centerY - (minY + maxY) * 0.5,
      );
    };

    const clampConstellationToBounds = () => {
      const { minX, minY, maxX, maxY } = getConstellationBounds();
      let dx = 0;
      let dy = 0;
      if (minX < bounds.left) dx = bounds.left - minX;
      if (maxX > bounds.right) dx = bounds.right - maxX;
      if (minY < bounds.top) dy = bounds.top - minY;
      if (maxY > bounds.bottom) dy = bounds.bottom - maxY;
      if (dx || dy) shiftAllClusters(dx, dy);
    };

    const anchorAtSurround = (zalandoBox, prepared, position) => {
      const { clusterW, clusterH } = prepared;
      const gap = surroundGap;
      if (position === 'above') {
        return {
          x: zalandoBox.x + (zalandoBox.w - clusterW) * 0.5,
          y: zalandoBox.y - clusterH - gap,
          w: clusterW,
          h: clusterH,
        };
      }
      if (position === 'left') {
        return {
          x: zalandoBox.x - clusterW - gap,
          y: zalandoBox.y + (zalandoBox.h - clusterH) * 0.5,
          w: clusterW,
          h: clusterH,
        };
      }
      return {
        x: zalandoBox.x + zalandoBox.w + gap,
        y: zalandoBox.y,
        w: clusterW,
        h: clusterH,
      };
    };

    const alignZalandoTopWithExperiments = () => {
      const zalandoIndex = clusterBoxes.findIndex((box) => box.labelIds?.includes('zalando'));
      const experimentsIndex = clusterBoxes.findIndex((box) => box.labelIds?.includes('experiments'));
      if (zalandoIndex < 0 || experimentsIndex < 0) return;

      const zalandoLabel = clusterLabels.find((label) => label.id === 'zalando');
      const experimentsLabel = clusterLabels.find((label) => label.id === 'experiments');
      const zalandoMediaTop = clusterBoxes[zalandoIndex].y + (zalandoLabel?.labelSlot ?? 0);
      const experimentsMediaTop = clusterBoxes[experimentsIndex].y + (experimentsLabel?.labelSlot ?? 0);
      const deltaY = experimentsMediaTop - zalandoMediaTop;
      if (Math.abs(deltaY) > 0.5) shiftClusterBox(zalandoIndex, 0, deltaY);
    };

    let placementIndex = 0;
    const zalandoGroup = groups.find((group) => group.id === 'zalando');
    const satelliteGroups = GROUP_ORDER
      .map((id) => groups.find((group) => group.id === id))
      .filter(
        (group) => group && (SURROUND_LAYOUT[group.id] || ABOVE_ROW_GROUP_ORDER.includes(group.id)),
      );
    const aboveRowGroups = ABOVE_ROW_GROUP_ORDER
      .map((id) => groups.find((group) => group.id === id))
      .filter(Boolean);
    const sideGroups = satelliteGroups.filter((group) => SURROUND_LAYOUT[group.id]);

    if (zalandoGroup) {
      const prepared = prepareGroupLayout(zalandoGroup);
      const anchor = {
        x: centerX - prepared.clusterW * 0.5,
        y: centerY - prepared.clusterH * 0.5,
        w: prepared.clusterW,
        h: prepared.clusterH,
      };
      const meta = commitGroupAtAnchor(anchor, prepared);
      const zalandoBox = {
        x: anchor.x,
        y: anchor.y,
        w: prepared.clusterW,
        h: prepared.clusterH,
      };
      clusterBoxes.push({
        ...zalandoBox,
        itemIndices: meta.itemIndices,
        labelIds: meta.labelIds,
      });

      sideGroups.forEach((group) => {
        const satellite = prepareGroupLayout(group);
        const satAnchor = anchorAtSurround(zalandoBox, satellite, SURROUND_LAYOUT[group.id]);
        const satMeta = commitGroupAtAnchor(satAnchor, satellite);
        clusterBoxes.push({
          x: satAnchor.x,
          y: satAnchor.y,
          w: satellite.clusterW,
          h: satellite.clusterH,
          itemIndices: satMeta.itemIndices,
          labelIds: satMeta.labelIds,
        });
      });

      if (aboveRowGroups.length > 0) {
        const aboveParts = aboveRowGroups.map((group) => prepareGroupLayout(group));
        const rowH = Math.max(...aboveParts.map((part) => part.clusterH));
        const rowY = zalandoBox.y - rowH - surroundGap - aboveRowOffsetUp;
        const experimentsBox = clusterBoxes.find((box) => box.labelIds?.includes('experiments'));
        const csignPart = aboveParts.find((part) => part.group.id === 'csign');
        const blockfiPart = aboveParts.find((part) => part.group.id === 'blockfi');
        const csignX = experimentsBox && csignPart
          ? experimentsBox.x
          : null;

        aboveParts.forEach((prepared) => {
          let satX;
          if (prepared.group.id === 'csign' && csignX != null) {
            satX = csignX;
          } else if (prepared.group.id === 'blockfi') {
            satX = zalandoBox.x;
          } else {
            const rowW = aboveParts.reduce(
              (sum, part, index) => sum + part.clusterW + (index > 0 ? surroundGap : 0),
              0,
            );
            satX = zalandoBox.x + (zalandoBox.w - rowW) * 0.5 + aboveRowOffsetRight;
            if (prepared.group.id === 'csign') {
              satX += blockfiPart ? blockfiPart.clusterW + surroundGap : 0;
            }
          }
          const satAnchor = {
            x: satX,
            y: rowY + (rowH - prepared.clusterH) * 0.5,
            w: prepared.clusterW,
            h: prepared.clusterH,
          };
          const satMeta = commitGroupAtAnchor(satAnchor, prepared);
          clusterBoxes.push({
            x: satAnchor.x,
            y: satAnchor.y,
            w: prepared.clusterW,
            h: prepared.clusterH,
            itemIndices: satMeta.itemIndices,
            labelIds: satMeta.labelIds,
          });
        });
      }

      alignZalandoTopWithExperiments();
      centerConstellation();
      clampConstellationToBounds();
      placementIndex += 1;
    } else {
      satelliteGroups.forEach((group) => {
        const prepared = prepareGroupLayout(group);
        const anchor = tryPlaceCluster(prepared.clusterW, prepared.clusterH, placementIndex)
          ?? fallbackClusterAnchor(prepared.clusterW, prepared.clusterH, placementIndex);
        const meta = commitGroupAtAnchor(anchor, prepared);
        clusterBoxes.push({
          x: anchor.x,
          y: anchor.y,
          w: prepared.clusterW,
          h: prepared.clusterH,
          itemIndices: meta.itemIndices,
          labelIds: meta.labelIds,
        });
        placementIndex += 1;
      });
    }

    groups
      .filter(
        (group) =>
          group.id !== 'zalando'
          && !SURROUND_LAYOUT[group.id]
          && !ABOVE_ROW_GROUP_ORDER.includes(group.id),
      )
      .forEach((group) => {
        const prepared = prepareGroupLayout(group);
        const anchor = tryPlaceCluster(prepared.clusterW, prepared.clusterH, placementIndex)
          ?? fallbackClusterAnchor(prepared.clusterW, prepared.clusterH, placementIndex);
        const meta = commitGroupAtAnchor(anchor, prepared);
        clusterBoxes.push({
          x: anchor.x,
          y: anchor.y,
          w: prepared.clusterW,
          h: prepared.clusterH,
          itemIndices: meta.itemIndices,
          labelIds: meta.labelIds,
        });
        placementIndex += 1;
      });

    return {
      placements,
      labels: clusterLabels.filter(Boolean),
    };
  };

  const syncFloatLogos = (labels, shiftX, shiftY) => {
    const layer = container.querySelector('.gallery-float-logos');
    if (!layer) return;
    const size = getFloatLogoSize();
    const titleBand = getLabelLineHeightPx();
    const labelIds = new Set(labels.map((label) => label.id));

    labels.forEach((label) => {
      let el = layer.querySelector(`[data-float-group="${label.id}"]`);
      if (!el) {
        el = document.createElement('span');
        el.className = 'mal-logo gallery-float-logo';
        el.dataset.floatGroup = label.id;
        el.setAttribute('aria-hidden', 'true');
        layer.appendChild(el);
      }
      const view = GROUP_LOGO_VIEW[label.id] || 'top';
      if (el.dataset.malLogo !== view) {
        el.dataset.malLogo = view;
        mountMalLogo(el);
      } else if (!el.querySelector('svg')) {
        mountMalLogo(el);
      }
      el.style.display = '';
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${Math.round(shiftX + label.logoX)}px`;
      el.style.top = `${Math.round(shiftY + label.logoY + (titleBand - size) * 0.5)}px`;
    });

    layer.querySelectorAll('.gallery-float-logo').forEach((el) => {
      if (!labelIds.has(el.dataset.floatGroup)) el.style.display = 'none';
    });
  };

  const syncClusterLabels = (labels, shiftX, shiftY) => {
    let layer = container.querySelector('.gallery-cluster-labels');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'gallery-cluster-labels';
      layer.setAttribute('aria-hidden', 'true');
      container.insertBefore(layer, title);
    }
    layer.style.setProperty('--gallery-label-font-size', `${getLabelFontSize()}px`);
    layer.style.setProperty('--gallery-label-line-height', String(NAV_LABEL_LINE_HEIGHT));
    layer.replaceChildren();
    labels.forEach((label) => {
      const el = document.createElement('div');
      el.className = 'gallery-cluster-label';
      el.dataset.group = label.id;
      el.style.left = `${Math.round(label.x + shiftX)}px`;
      el.style.top = `${Math.round(label.y + shiftY)}px`;
      el.style.width = `${Math.round(label.w)}px`;
      const titleEl = document.createElement('span');
      titleEl.className = 'gallery-cluster-label-title';
      titleEl.textContent = label.title;
      el.appendChild(titleEl);
      if (label.desc) {
        const descEl = document.createElement('span');
        descEl.className = 'gallery-cluster-label-desc';
        descEl.textContent = label.desc;
        el.appendChild(descEl);
      }
      layer.appendChild(el);
    });
  };

  const centerTitleAndItems = () => {
    const minMult = state.isMobile ? 10 : 14;
    const maxMult = state.isMobile ? 20 : 24;
    let placements = [];
    let labels = [];

    for (let mult = minMult; mult <= maxMult; mult += 1) {
      state.canvasWidth = state.itemWidth * mult;
      state.canvasHeight = state.itemHeight * mult;
      const result = placeByRules();
      placements = result.placements;
      labels = result.labels;
      const placedCount = placements.filter(Boolean).length;
      if (placedCount === mediaItems.length) break;
    }

    if (!placements.some(Boolean)) return;

    const cx = state.canvasWidth * 0.5;
    const cy = state.canvasHeight * 0.5;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    placements.forEach((p) => {
      if (!p) return;
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x + p.w);
      maxY = Math.max(maxY, p.y + p.h);
    });
    labels.forEach((label) => {
      minX = Math.min(minX, label.logoX ?? label.x);
      minY = Math.min(minY, label.y);
      maxX = Math.max(maxX, label.x + label.w);
      maxY = Math.max(maxY, label.y + (label.labelSlot ?? 28));
    });

    const fitPad = state.isMobile ? 18 : 48;
    const shiftX = -minX + fitPad;
    const shiftY = -minY + fitPad;
    state.canvasWidth = Math.ceil(maxX - minX + fitPad * 2);
    state.canvasHeight = Math.ceil(maxY - minY + fitPad * 2);
    container.style.width = `${state.canvasWidth}px`;
    container.style.height = `${state.canvasHeight}px`;

    const titleX = Math.round(cx + shiftX);
    const titleY = Math.round(cy + shiftY);
    title.style.left = `${titleX}px`;
    title.style.top = `${titleY}px`;

    mediaItems.forEach((item, i) => {
      const place = placements[i];
      if (!place) {
        item.style.display = 'none';
        return;
      }
      item.style.display = '';
      item.style.left = `${Math.round(place.x + shiftX)}px`;
      item.style.top = `${Math.round(place.y + shiftY)}px`;
      item.style.width = `${place.w}px`;
      item.style.height = `${place.h}px`;
      item.style.setProperty('--stagger-delay', `${Math.min(i * 70, 1100)}ms`);
    });

    syncClusterLabels(labels, shiftX, shiftY);
    syncFloatLogos(labels, shiftX, shiftY);

    const focusGroup = buildGroups().find((group) => group.id === 'blockfi');
    if (focusGroup) {
      let focusMinX = Infinity;
      let focusMinY = Infinity;
      let focusMaxX = -Infinity;
      let focusMaxY = -Infinity;
      focusGroup.indices.forEach((index) => {
        const place = placements[index];
        if (!place) return;
        const x = place.x + shiftX;
        const y = place.y + shiftY;
        focusMinX = Math.min(focusMinX, x);
        focusMinY = Math.min(focusMinY, y);
        focusMaxX = Math.max(focusMaxX, x + place.w);
        focusMaxY = Math.max(focusMaxY, y + place.h);
      });
      const focusLabel = labels.find((label) => label.id === 'blockfi');
      if (focusLabel) {
        focusMinX = Math.min(focusMinX, (focusLabel.logoX ?? focusLabel.x) + shiftX);
        focusMinY = Math.min(focusMinY, focusLabel.y + shiftY);
        focusMaxX = Math.max(focusMaxX, focusLabel.x + shiftX + focusLabel.w);
        focusMaxY = Math.max(focusMaxY, focusLabel.y + shiftY + (focusLabel.labelSlot ?? 28));
      }
      state.focusX = (focusMinX + focusMaxX) * 0.5;
      state.focusY = (focusMinY + focusMaxY) * 0.5;
    } else {
      state.focusX = state.canvasWidth * 0.5;
      state.focusY = state.canvasHeight * 0.5;
    }

    if (!state.hasAnimatedIn) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        mediaItems.forEach((item) => item.classList.add('is-visible'));
      } else {
        requestAnimationFrame(() => {
          mediaItems.forEach((item) => item.classList.add('is-visible'));
        });
      }
      state.hasAnimatedIn = true;
    }
  };

  const recenterCamera = () => {
    const { w: viewW, h: viewH } = getViewSize();
    const focusX = state.focusX || state.canvasWidth * 0.5;
    const focusY = state.focusY || state.canvasHeight * 0.5;
    const targetScreenX = viewW * 0.5;
    const targetScreenY = viewH * 0.5;
    const startX = targetScreenX - focusX * state.zoom;
    const startY = targetScreenY - focusY * state.zoom;
    const bounded = applyBounds(startX, startY);
    state.targetX = bounded.x;
    state.targetY = bounded.y;
    setCamera(bounded.x, bounded.y);
  };

  const focusViewport = () => {
    if (typeof viewport.focus === 'function') {
      try {
        viewport.focus({ preventScroll: true });
      } catch {
        viewport.focus();
      }
    }
  };

  const refreshForViewport = () => {
    state.isMobile = window.innerWidth < 768;
    state.zoom = state.isMobile ? 0.56 : 0.76;
    state.itemWidth = state.isMobile ? IMG_SIZE_MOBILE : IMG_SIZE_DESKTOP;
    state.itemHeight = state.isMobile ? IMG_SIZE_MOBILE : IMG_SIZE_DESKTOP;
    centerTitleAndItems();
    recenterCamera();
    focusViewport();
  };

  const onPointerDown = (e) => {
    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = 0;
    state.isDragging = true;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    state.downX = e.clientX;
    state.downY = e.clientY;
    state.dragDistance = 0;
    viewport.style.cursor = 'grabbing';
  };

  const onPointerMove = (e) => {
    if (!state.isDragging) return;
    const dx = e.clientX - state.lastX;
    const dy = e.clientY - state.lastY;
    state.dragDistance = Math.hypot(e.clientX - state.downX, e.clientY - state.downY);
    const bounded = applyBounds(state.targetX + dx, state.targetY + dy);
    state.targetX = bounded.x;
    state.targetY = bounded.y;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    scheduleAnimation();
  };

  const onPointerUp = () => {
    state.isDragging = false;
    viewport.style.cursor = 'grab';
  };

  const resetInteraction = () => {
    state.isDragging = false;
    viewport.style.cursor = 'grab';
    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
  };

  const onWheel = (e) => {
    e.preventDefault();
    const bounded = applyBounds(
      state.targetX - e.deltaX * wheelSpeed,
      state.targetY - e.deltaY * wheelSpeed,
    );
    state.targetX = bounded.x;
    state.targetY = bounded.y;
    scheduleAnimation();
  };

  refreshForViewport();
  viewport.style.cursor = 'grab';

  viewport.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });
  viewport.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('resize', refreshForViewport, { passive: true });

  // Back/forward cache restores the page without re-running this script; do not
  // tear down listeners on beforeunload or pan/zoom stops working after navigation.
  window.addEventListener('pageshow', (event) => {
    resetInteraction();
    refreshForViewport();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    resetInteraction();
    refreshForViewport();
  }, { passive: true });
}

