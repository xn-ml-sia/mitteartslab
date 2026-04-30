const appState = {
  jobs: new Map(),
  selectedRock: null,
  generatedRocks: [],
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

    refs.generateStatus.textContent = `Generating... ${payload.progress || 0}%`;
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
    card.innerHTML = `
      <img class="gr-rock-image" src="${rock.image}" alt="${rock.title}" />
      <h4>${rock.title}</h4>
      <p><strong>Emotion:</strong> ${rock.emotion}</p>
      <p><strong>Meaning:</strong> ${rock.meaning}</p>
      <p><strong>Short:</strong> ${rock.messageShort}</p>
      <p><strong>Quality:</strong> ${(rock.qualityScore || 0).toFixed(2)} | <strong>Diversity:</strong> ${(rock.diversityScore || 0).toFixed(2)}</p>
      <p><strong>Occasions:</strong> ${(rock.occasion || []).join(', ') || '-'}</p>
    `;
    refs.generatedGrid.appendChild(card);
  });
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
};

init();
