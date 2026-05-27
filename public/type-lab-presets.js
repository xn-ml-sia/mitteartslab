import { createTypeLabDocument, hydrateStateFromDocument } from './type-lab-state-model.js';

const PRESET_KEY = 'mal:typeLab:presets:v1';

function readPresetList() {
  try {
    const raw = localStorage.getItem(PRESET_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function writePresetList(items) {
  localStorage.setItem(PRESET_KEY, JSON.stringify(items));
}

export function createPresetApi({ store }) {
  return {
    savePreset(name = 'Preset') {
      const list = readPresetList();
      const doc = createTypeLabDocument(store.getState());
      list.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        doc,
      });
      writePresetList(list);
      return list[list.length - 1];
    },
    listPresets() {
      return readPresetList();
    },
    loadPreset(id) {
      const preset = readPresetList().find((item) => item.id === id);
      if (!preset) return false;
      store.setState((prev) => hydrateStateFromDocument(prev, preset.doc));
      return true;
    },
    exportCurrentJson() {
      return JSON.stringify(createTypeLabDocument(store.getState()), null, 2);
    },
    importJson(jsonText) {
      const parsed = JSON.parse(jsonText);
      store.setState((prev) => hydrateStateFromDocument(prev, parsed));
    },
  };
}
