import { TYPE_LAB_GROUPS, TYPE_LAB_PARAMS } from './type-lab-schema.js';

function readInputValue(el, type) {
  if (!el) return undefined;
  if (type === 'boolean') return Boolean(el.checked);
  if (type === 'number') return Number(el.value);
  return el.value;
}

function writeInputValue(el, type, value) {
  if (!el) return;
  if (type === 'boolean') {
    el.checked = Boolean(value);
    return;
  }
  el.value = String(value);
}

export function bindSchemaToDom({ store }) {
  const refs = {};
  TYPE_LAB_PARAMS.forEach((item) => {
    if (item.id) refs[item.key] = document.getElementById(item.id);
  });

  const modePivotButton = document.getElementById('mode-pivot-button');
  const modePathButton = document.getElementById('mode-path-button');
  if (modePivotButton) {
    modePivotButton.addEventListener('click', () => {
      store.patchRuntime({ transformMode: 'pivot' });
    });
  }
  if (modePathButton) {
    modePathButton.addEventListener('click', () => {
      store.patchRuntime({ transformMode: 'path' });
    });
  }

  TYPE_LAB_PARAMS.forEach((item) => {
    if (!item.id) return;
    const el = refs[item.key];
    if (!el) return;
    const evt = el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(evt, () => {
      const value = readInputValue(el, item.type);
      store.patchParams({ [item.key]: value });
    });
  });

  const sectionMap = new Map();
  const sections = Array.from(document.querySelectorAll('.controlSection'));
  sections.forEach((section) => {
    const titleEl = section.querySelector('.controlSectionTitle');
    const title = (titleEl?.textContent || '').trim();
    const match = TYPE_LAB_GROUPS.find((group) => group.title === title);
    if (match) {
      section.dataset.groupId = match.id;
      section.dataset.tier = match.tier;
      sectionMap.set(match.id, section);
    }
  });

  function applyVisibility(state) {
    document.body.classList.toggle('is-expert', state.ui.expertMode);
    const mode = state.runtime.transformMode;
    TYPE_LAB_GROUPS.forEach((group) => {
      const section = sectionMap.get(group.id);
      if (!section) return;
      const modeMatch = !group.when || group.when.transformMode === mode;
      const tierVisible = group.tier !== 'expert' || state.ui.expertMode;
      section.hidden = !(modeMatch && tierVisible);
    });
    if (modePivotButton) modePivotButton.classList.toggle('is-active', mode === 'pivot');
    if (modePathButton) modePathButton.classList.toggle('is-active', mode === 'path');
  }

  function writeStateToDom(state) {
    TYPE_LAB_PARAMS.forEach((item) => {
      if (!item.id) return;
      const el = refs[item.key];
      if (!el) return;
      const value = state.params[item.key];
      writeInputValue(el, item.type, value);
    });
    applyVisibility(state);
  }

  return {
    refs,
    writeStateToDom,
  };
}
