function parityReport(editorSegments, exportedSegments) {
  const countA = editorSegments.length;
  const countB = exportedSegments.length;
  const count = Math.min(countA, countB);
  if (!count) return { countA, countB, rmse: 0 };
  let sumSq = 0;
  for (let i = 0; i < count; i += 1) {
    const a = editorSegments[i];
    const b = exportedSegments[i];
    const dx1 = a.x1 - b.x1;
    const dy1 = a.y1 - b.y1;
    const dx2 = a.x2 - b.x2;
    const dy2 = a.y2 - b.y2;
    sumSq += dx1 * dx1 + dy1 * dy1 + dx2 * dx2 + dy2 * dy2;
  }
  return {
    countA,
    countB,
    rmse: Math.sqrt(sumSq / (count * 4)),
  };
}

export function createTypeLabCommands({ store, presets, exporter, timeline, rerender, getCurrentSegments }) {
  return [
    {
      id: 'mode-path',
      label: 'Switch to Path mode',
      run: () => store.patchRuntime({ transformMode: 'path' }),
    },
    {
      id: 'mode-pivot',
      label: 'Switch to Pivot mode',
      run: () => store.patchRuntime({ transformMode: 'pivot' }),
    },
    {
      id: 'toggle-expert',
      label: 'Toggle Expert controls',
      run: () => store.patch((prev) => ({ ...prev, ui: { ...prev.ui, expertMode: !prev.ui.expertMode } })),
    },
    {
      id: 'save-preset',
      label: 'Save preset',
      run: () => presets.savePreset(`Preset ${new Date().toLocaleTimeString()}`),
    },
    {
      id: 'load-latest-preset',
      label: 'Load latest preset',
      run: () => {
        const list = presets.listPresets();
        if (list.length) presets.loadPreset(list[list.length - 1].id);
      },
    },
    {
      id: 'export-code',
      label: 'Export self-contained code bundle',
      run: () => exporter.downloadBundle(),
    },
    {
      id: 'copy-json',
      label: 'Copy scene JSON',
      run: async () => {
        const text = exporter.getConfigJson();
        await navigator.clipboard.writeText(text);
      },
    },
    {
      id: 'parity-check',
      label: 'Run export parity check (t=0)',
      run: () => {
        const editor = getCurrentSegments();
        const exported = exporter.evaluateSegmentsAt(0);
        const report = parityReport(editor, exported);
        alert(`Parity check\nEditor segments: ${report.countA}\nExport segments: ${report.countB}\nRMSE: ${report.rmse.toFixed(4)}`);
      },
    },
    {
      id: 'copy-embed',
      label: 'Copy embed snippet',
      run: async () => {
        const text = exporter.getEmbedSnippet();
        await navigator.clipboard.writeText(text);
      },
    },
    {
      id: 'play-stop',
      label: 'Play/Stop keyframes',
      run: () => {
        const current = store.getState().runtime.keyframePlaying;
        if (current) timeline.stopKeyframes();
        else timeline.startKeyframes();
        rerender();
      },
    },
  ];
}
