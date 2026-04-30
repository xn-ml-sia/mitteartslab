const appState = {
  jobs: new Map(),
  selectedRock: null,
  generatedRocks: [],
  currentGenerationContext: null,
  lockedRockIds: new Set(),
  favoriteRockIds: new Set(),
};

const refs = {
  singleGrid: document.getElementById('single-rock-grid'),
  selectedRockName: document.getElementById('selected-rock-name'),
  revealButton: document.getElementById('reveal-button'),
  revealResult: document.getElementById('reveal-result'),
  revealEmotion: document.getElementById('reveal-emotion'),
  revealShort: document.getElementById('reveal-short'),
  revealLong: document.getElementById('reveal-long'),
  promptForm: document.getElementById('prompt-form'),
  promptInput: document.getElementById('prompt-input'),
  setSizeInput: document.getElementById('set-size'),
  toneInput: document.getElementById('tone'),
  abstractnessInput: document.getElementById('abstractness'),
  generateStatus: document.getElementById('generate-status'),
  generatedGrid: document.getElementById('generated-grid'),
  regenerateAllButton: document.getElementById('regenerate-all'),
  exportSingleButton: document.getElementById('export-single'),
  exportSetButton: document.getElementById('export-set'),
  exportStatus: document.getElementById('export-status'),
};

if (document.body.classList.contains('phase1-app')) {
  document.body.classList.remove('phase1-app');
}
document.body.classList.add('gr-app-shell');

const SINGLE_ROCKS = [
  { id: 'single_river_anchor', name: 'River Anchor', emotion: 'steadfast support' },
  { id: 'single_weathered_bridge', name: 'Weathered Bridge', emotion: 'reconciliation' },
  { id: 'single_quiet_echo', name: 'Quiet Echo', emotion: 'remembrance' },
  { id: 'single_first_light', name: 'First Light Pebble', emotion: 'new beginnings' },
  { id: 'single_held_weight', name: 'Held Weight', emotion: 'accountability' },
  { id: 'single_open_grain', name: 'Open Grain', emotion: 'vulnerability' },
];

const renderSingleGrid = () => {
  refs.singleGrid.innerHTML = '';
  SINGLE_ROCKS.forEach((rock) => {
    const card = document.createElement('button');
    card.className = 'gr-rock-card';
    card.type = 'button';
    card.dataset.rockId = rock.id;
    card.innerHTML = `
      <div class="gr-rock-chip"></div>
      <h4>${rock.name}</h4>
      <p>${rock.emotion}</p>
    `;
    card.addEventListener('click', () => {
      appState.selectedRock = rock;
      document.querySelectorAll('.gr-rock-card').forEach((node) => node.classList.remove('is-selected'));
      card.classList.add('is-selected');
      refs.selectedRockName.textContent = `${rock.name} (${rock.emotion})`;
      refs.revealButton.disabled = false;
    });
    refs.singleGrid.appendChild(card);
  });
};

const revealSelectedRock = async () => {
  if (!appState.selectedRock) return;

  refs.revealButton.disabled = true;
  refs.revealButton.textContent = 'Revealing...';

  try {
    const response = await fetch('/api/v1/rocks/reveal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rockId: appState.selectedRock.id,
        emotion: appState.selectedRock.emotion,
        tone: 'poetic',
        locale: 'en-US',
      }),
    });

    if (!response.ok) throw new Error('Reveal request failed');
    const payload = await response.json();

    refs.revealEmotion.textContent = payload.emotion || '-';
    refs.revealShort.textContent = payload.messageShort || '-';
    refs.revealLong.textContent = payload.messageLong || '-';
    refs.revealResult.hidden = false;
  } catch (error) {
    refs.revealResult.hidden = false;
    refs.revealEmotion.textContent = 'error';
    refs.revealShort.textContent = 'Could not reveal this rock right now.';
    refs.revealLong.textContent = 'Please try again.';
  } finally {
    refs.revealButton.disabled = false;
    refs.revealButton.textContent = 'Reveal Message';
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pollJob = async (jobId) => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const response = await fetch(`/api/v1/jobs/${encodeURIComponent(jobId)}`);
    if (!response.ok) throw new Error('Polling failed');
    const payload = await response.json();
    appState.jobs.set(jobId, payload);

    if (payload.status === 'completed') return payload.result;
    if (payload.status === 'failed' || payload.status === 'blocked') {
      const error = new Error(payload.error || 'Generation failed');
      error.status = payload.status;
      error.reason = payload.error || '';
      throw error;
    }

    refs.generateStatus.textContent = `Generating (${payload.stage || 'running'})... ${payload.progress || 0}%`;
    await sleep(600);
  }

  throw new Error('Generation timed out');
};

const renderGeneratedRocks = (rocks) => {
  refs.generatedGrid.innerHTML = '';
  appState.generatedRocks = rocks;

  rocks.forEach((rock) => {
    const card = document.createElement('article');
    card.className = 'gr-generated-card';
    const isLocked = appState.lockedRockIds.has(rock.id);
    const isFavorite = appState.favoriteRockIds.has(rock.id);
    if (isLocked) card.classList.add('is-locked');
    if (isFavorite) card.classList.add('is-favorite');
    card.innerHTML = `
      <img class="gr-rock-image" src="${rock.image}" alt="${rock.title}" />
      <h4>${rock.title}</h4>
      <p><strong>Emotion:</strong> ${rock.emotion}</p>
      <p><strong>Meaning:</strong> ${rock.meaning}</p>
      <p><strong>Short:</strong> ${rock.messageShort}</p>
      <p><strong>Quality:</strong> ${(rock.quality?.compositeScore || 0).toFixed(2)} | <strong>Diversity:</strong> ${(rock.quality?.diversityScore || 0).toFixed(2)}</p>
      <p><strong>Occasions:</strong> ${(rock.occasion || []).join(', ') || '-'}</p>
      <div class="gr-card-actions">
        <button type="button" class="gr-mini-button" data-action="lock" data-id="${rock.id}">${isLocked ? 'Unlock' : 'Lock'}</button>
        <button type="button" class="gr-mini-button" data-action="favorite" data-id="${rock.id}">${isFavorite ? 'Unfavorite' : 'Favorite'}</button>
        <button type="button" class="gr-mini-button" data-action="regenerate" data-id="${rock.id}">Regenerate</button>
      </div>
    `;
    card.addEventListener('click', async (event) => {
      const actionButton = event.target.closest('button[data-action]');
      if (!actionButton) return;
      const action = actionButton.dataset.action;
      const rockId = actionButton.dataset.id;
      if (!rockId) return;

      if (action === 'lock') {
        if (appState.lockedRockIds.has(rockId)) appState.lockedRockIds.delete(rockId);
        else appState.lockedRockIds.add(rockId);
        renderGeneratedRocks(appState.generatedRocks);
        return;
      }

      if (action === 'favorite') {
        const currentlyFavorite = appState.favoriteRockIds.has(rockId);
        try {
          await fetch('/api/v1/favorites/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rockId, favorite: !currentlyFavorite }),
          });
        } catch {
          // Keep local behavior even if favorite persistence fails.
        }
        if (currentlyFavorite) appState.favoriteRockIds.delete(rockId);
        else appState.favoriteRockIds.add(rockId);
        renderGeneratedRocks(appState.generatedRocks);
        return;
      }

      if (action === 'regenerate') {
        await regenerateSingleRock(rockId);
      }
    });
    refs.generatedGrid.appendChild(card);
  });
};

const regenerateSingleRock = async (rockId) => {
  if (!appState.currentGenerationContext) {
    refs.generateStatus.textContent = 'No generation context available yet.';
    return;
  }
  refs.generateStatus.textContent = `Regenerating ${rockId}...`;
  try {
    const response = await fetch('/api/v1/rocks/regenerate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rockId,
        promptText: appState.currentGenerationContext.promptText,
        controls: appState.currentGenerationContext.controls,
        lockedRockIds: Array.from(appState.lockedRockIds),
      }),
    });
    if (!response.ok) throw new Error('Failed to regenerate selected rock.');
    const payload = await response.json();
    const idx = appState.generatedRocks.findIndex((rock) => rock.id === rockId);
    if (idx >= 0 && payload.rock) {
      appState.generatedRocks[idx] = payload.rock;
      renderGeneratedRocks(appState.generatedRocks);
      refs.generateStatus.textContent = `Regenerated ${rockId}.`;
    }
  } catch (error) {
    refs.generateStatus.textContent = error.message || 'Single regeneration failed.';
  }
};

const exportArtifact = async (format) => {
  if (appState.generatedRocks.length === 0) {
    refs.exportStatus.textContent = 'Generate rocks before exporting.';
    return;
  }
  refs.exportStatus.textContent = `Exporting ${format}...`;
  try {
    const payload = {
      format,
      rocks: format === 'single'
        ? appState.generatedRocks.filter((rock) => appState.favoriteRockIds.has(rock.id)).slice(0, 1)
        : appState.generatedRocks,
      promptText: appState.currentGenerationContext?.promptText || '',
    };
    if (payload.rocks.length === 0) payload.rocks = [appState.generatedRocks[0]];
    const response = await fetch('/api/v1/exports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Export failed.');
    const result = await response.json();
    refs.exportStatus.innerHTML = `Export ready: <a href="${result.url}" target="_blank" rel="noopener">${result.exportId}</a>`;
  } catch (error) {
    refs.exportStatus.textContent = error.message || 'Export failed.';
  }
};

const regenerateAll = async () => {
  if (!appState.currentGenerationContext) {
    refs.generateStatus.textContent = 'No previous prompt found for regeneration.';
    return;
  }
  refs.generateStatus.textContent = 'Regenerating full set...';
  const payload = {
    promptText: appState.currentGenerationContext.promptText,
    controls: appState.currentGenerationContext.controls,
    lockedRockIds: Array.from(appState.lockedRockIds),
  };
  try {
    const response = await fetch('/api/v1/rocks/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Could not queue regeneration.');
    const createPayload = await response.json();
    const result = await pollJob(createPayload.jobId);
    appState.generatedRocks = result.rocks || [];
    renderGeneratedRocks(appState.generatedRocks);
    refs.generateStatus.textContent = `Regenerated set with ${appState.generatedRocks.length} rocks.`;
  } catch (error) {
    refs.generateStatus.textContent = error.message || 'Regenerate all failed.';
  }
};

const submitPrompt = async (event) => {
  event.preventDefault();

  const promptText = refs.promptInput.value.trim();
  if (!promptText) {
    refs.generateStatus.textContent = 'Please enter a prompt first.';
    return;
  }

  refs.generateStatus.textContent = 'Submitting generation job...';
  refs.generatedGrid.innerHTML = '';

  const controls = {
    setSize: Number(refs.setSizeInput.value) || 6,
    tone: Number(refs.toneInput.value) || 0.5,
    abstractness: Number(refs.abstractnessInput.value) || 0.5,
  };

  try {
    const createRes = await fetch('/api/v1/rocks/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptText, controls }),
    });
    if (!createRes.ok) throw new Error('Could not start generation job');
    const createPayload = await createRes.json();

    if (createPayload.status === 'blocked') {
      refs.generateStatus.textContent = `Blocked by moderation: ${createPayload.reason || 'prompt not allowed'}. Try reframing with supportive language.`;
      return;
    }

    refs.generateStatus.textContent = `Job queued: ${createPayload.jobId}`;

    const result = await pollJob(createPayload.jobId);
    appState.currentGenerationContext = { promptText, controls };
    appState.lockedRockIds.clear();
    appState.favoriteRockIds.clear();
    renderGeneratedRocks(result.rocks || []);
    refs.generateStatus.textContent = `Completed. Generated ${(result.rocks || []).length} rocks.`;
  } catch (error) {
    if (error.status === 'blocked') {
      refs.generateStatus.textContent = `Blocked by moderation: ${error.reason || 'prompt not allowed'}.`;
      return;
    }
    refs.generateStatus.textContent = error.message || 'Generation failed.';
  }
};

const init = () => {
  renderSingleGrid();
  refs.revealButton.addEventListener('click', revealSelectedRock);
  refs.promptForm.addEventListener('submit', submitPrompt);
  refs.regenerateAllButton?.addEventListener('click', regenerateAll);
  refs.exportSingleButton?.addEventListener('click', () => exportArtifact('single'));
  refs.exportSetButton?.addEventListener('click', () => exportArtifact('set'));
};

init();
