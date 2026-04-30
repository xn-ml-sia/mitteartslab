const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, '.data');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');
const FAVORITES_FILE = path.join(DATA_DIR, 'favorites.json');
const EXPORTS_FILE = path.join(DATA_DIR, 'exports.json');
const MAX_PERSISTED_JOBS = 300;

const jobs = new Map();
const favorites = new Map();
const exportsStore = new Map();
const analytics = {
  prompt_submitted: 0,
  generation_completed: 0,
  moderation_blocked: 0,
  reveal_completed: 0,
  generation_failed: 0,
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const STONE_LIBRARY = [
  { title: 'Quiet Anchor', emotion: 'steadfast support', occasion: ['grief', 'distance'], palette: ['#6f747d', '#a9b0b8', '#d6dae0'] },
  { title: 'Weathered Bridge', emotion: 'reconciliation', occasion: ['apology', 'repair'], palette: ['#7f6d5f', '#b49b84', '#e4d4bc'] },
  { title: 'First Step Pebble', emotion: 'courage', occasion: ['beginnings', 'uncertainty'], palette: ['#5f666a', '#9aa4aa', '#cbd2d7'] },
  { title: 'Long Echo', emotion: 'longing', occasion: ['distance', 'memory'], palette: ['#63616a', '#9e9aac', '#cfccdb'] },
  { title: 'Held Weight', emotion: 'accountability', occasion: ['apology', 'commitment'], palette: ['#5f5752', '#9a8e86', '#cec1b6'] },
  { title: 'Open Grain', emotion: 'vulnerability', occasion: ['truth', 'confession'], palette: ['#666258', '#a39d8f', '#d4cebc'] },
  { title: 'Soft Horizon', emotion: 'hope', occasion: ['transition', 'recovery'], palette: ['#687487', '#9fb0cb', '#d2deed'] },
  { title: 'Rooted Signal', emotion: 'belonging', occasion: ['friendship', 'family'], palette: ['#5e6a5d', '#95a391', '#c6d0c2'] },
  { title: 'Still Flame', emotion: 'devotion', occasion: ['commitment', 'love'], palette: ['#7b625f', '#b29089', '#dec4bf'] },
  { title: 'Returning Tide', emotion: 'forgiveness', occasion: ['reconciliation', 'repair'], palette: ['#5f727c', '#94acb8', '#c5d8e1'] },
];

const BLOCKLIST = ['suicide', 'kill myself', 'self-harm', 'bomb', 'hate crime'];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function saveJsonFile(filePath, data) {
  ensureDataDir();
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function persistState() {
  const allJobs = Array.from(jobs.values()).sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  const trimmedJobs = allJobs.slice(0, MAX_PERSISTED_JOBS);
  saveJsonFile(JOBS_FILE, trimmedJobs);
  saveJsonFile(ANALYTICS_FILE, analytics);
  saveJsonFile(FAVORITES_FILE, Array.from(favorites.values()));
  saveJsonFile(EXPORTS_FILE, Array.from(exportsStore.values()).slice(-MAX_PERSISTED_JOBS));
}

function hydrateState() {
  const persistedAnalytics = loadJsonFile(ANALYTICS_FILE, null);
  if (persistedAnalytics && typeof persistedAnalytics === 'object') {
    Object.assign(analytics, persistedAnalytics);
  }
  const persistedJobs = loadJsonFile(JOBS_FILE, []);
  if (Array.isArray(persistedJobs)) {
    persistedJobs.forEach((job) => {
      if (job && job.id) jobs.set(job.id, job);
    });
  }
  const persistedFavorites = loadJsonFile(FAVORITES_FILE, []);
  if (Array.isArray(persistedFavorites)) {
    persistedFavorites.forEach((favorite) => {
      if (favorite && favorite.id) favorites.set(favorite.id, favorite);
    });
  }
  const persistedExports = loadJsonFile(EXPORTS_FILE, []);
  if (Array.isArray(persistedExports)) {
    persistedExports.forEach((artifact) => {
      if (artifact && artifact.id) exportsStore.set(artifact.id, artifact);
    });
  }
}

function setJob(jobId, jobValue) {
  jobs.set(jobId, jobValue);
  persistState();
}

function sendJson(res, code, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function seededRandom(seed) {
  const hash = crypto.createHash('sha256').update(seed).digest();
  let i = 0;
  return function rand() {
    if (i >= hash.length - 4) i = 0;
    const value = hash.readUInt32BE(i);
    i += 4;
    return value / 0xffffffff;
  };
}

function normalizeText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function tokenizePrompt(promptText) {
  return normalizeText(promptText).split(' ').filter((token) => token.length > 2);
}

function scoreStoneRelevance(baseStone, tokens) {
  const haystack = normalizeText(`${baseStone.title} ${baseStone.emotion} ${baseStone.occasion.join(' ')}`);
  let score = 0;
  tokens.forEach((token) => {
    if (haystack.includes(token)) score += 1;
  });
  return score;
}

function scoreStoneDiversity(baseStone, selectedBases) {
  let diversityPenalty = 0;
  selectedBases.forEach((selected) => {
    if (selected.emotion === baseStone.emotion) diversityPenalty += 0.8;
    const sharedOccasion = selected.occasion.some((occ) => baseStone.occasion.includes(occ));
    if (sharedOccasion) diversityPenalty += 0.35;
    if (selected.palette[0] === baseStone.palette[0]) diversityPenalty += 0.2;
  });
  return Math.max(0, 1 - diversityPenalty);
}

function moderatePrompt(promptText) {
  const lowered = normalizeText(promptText);
  const blockedTerm = BLOCKLIST.find((term) => lowered.includes(term));
  if (blockedTerm) {
    analytics.moderation_blocked += 1;
    persistState();
    return {
      blocked: true,
      reason: `Prompt includes blocked term: ${blockedTerm}`,
      safeRewrite: 'Try describing a supportive message, apology, gratitude, or remembrance without harmful language.',
    };
  }
  return { blocked: false };
}

function sampleShortMessage(emotion) {
  const map = {
    'steadfast support': 'Still with you.',
    reconciliation: 'I want to cross back.',
    courage: 'I can take one step.',
    longing: 'I miss what we had.',
    accountability: 'I carry my part.',
    vulnerability: 'I am ready to be honest.',
    hope: 'A softer day can come.',
    belonging: 'You are not outside this circle.',
    devotion: 'I remain, quietly.',
    forgiveness: 'Can we begin again?',
  };
  return map[emotion] || 'I am here.';
}

function sampleLongMessage(emotion, promptText) {
  return `From your prompt "${String(promptText || '').slice(0, 80)}", this stone expresses ${emotion} in a calm, durable form.`;
}

function createStoneSvgDataUri(base, index) {
  const [c1, c2, c3] = base.palette;
  const seed = index * 13 + 7;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
  <defs>
    <radialGradient id='g' cx='35%' cy='28%' r='68%'>
      <stop offset='0%' stop-color='${c3}'/>
      <stop offset='58%' stop-color='${c2}'/>
      <stop offset='100%' stop-color='${c1}'/>
    </radialGradient>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' seed='${seed}'/>
      <feColorMatrix type='saturate' values='0'/>
      <feComponentTransfer><feFuncA type='table' tableValues='0 0.06'/></feComponentTransfer>
    </filter>
  </defs>
  <rect width='512' height='512' fill='#f5f5f5'/>
  <ellipse cx='256' cy='390' rx='162' ry='34' fill='rgba(0,0,0,0.12)'/>
  <path d='M84 293c0-100 86-181 192-181 84 0 152 56 152 125 0 77-72 163-185 163-91 0-159-46-159-107z' fill='url(#g)'/>
  <path d='M146 278c28-24 59-37 92-37 47 0 77 18 107 43' fill='none' stroke='rgba(255,255,255,0.26)' stroke-width='4'/>
  <rect width='512' height='512' filter='url(#n)'/>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function generateStoneSet(promptText, controls) {
  const setSize = Math.min(12, Math.max(3, Number(controls?.setSize || 6)));
  const tokens = tokenizePrompt(promptText);
  const rand = seededRandom(`${promptText}|${JSON.stringify(controls || {})}`);
  const selected = [];
  const candidates = STONE_LIBRARY.map((stone) => ({
    stone,
    relevanceScore: scoreStoneRelevance(stone, tokens),
  }));

  while (selected.length < setSize && selected.length < STONE_LIBRARY.length) {
    let best = null;
    candidates.forEach((candidate) => {
      if (selected.some((entry) => entry.stone.title === candidate.stone.title)) return;
      const diversityScore = scoreStoneDiversity(candidate.stone, selected.map((entry) => entry.stone));
      const jitter = (rand() - 0.5) * 0.15;
      const compositeScore = candidate.relevanceScore * 0.6 + diversityScore * 0.4 + jitter;
      if (!best || compositeScore > best.compositeScore) {
        best = { ...candidate, diversityScore, compositeScore };
      }
    });
    if (!best) break;
    selected.push(best);
  }

  return selected.map((entry, index) => {
    const base = entry.stone;
    return {
      id: `rock_${index + 1}`,
      title: base.title,
      emotion: base.emotion,
      occasion: base.occasion,
      meaning: `This stone carries ${base.emotion} for moments of ${base.occasion.join(' and ')}.`,
      messageShort: sampleShortMessage(base.emotion),
      messageLong: sampleLongMessage(base.emotion, promptText),
      image: createStoneSvgDataUri(base, index),
      quality: {
        relevanceScore: Number(entry.relevanceScore.toFixed(2)),
        diversityScore: Number(entry.diversityScore.toFixed(2)),
        compositeScore: Number(entry.compositeScore.toFixed(2)),
      },
    };
  });
}

function generateSingleRock(promptText, controls, excludedTitles = []) {
  const tokens = tokenizePrompt(promptText);
  const rand = seededRandom(`${promptText}|single|${JSON.stringify(controls || {})}|${excludedTitles.join('|')}`);
  let best = null;
  STONE_LIBRARY.forEach((stone) => {
    if (excludedTitles.includes(stone.title)) return;
    const relevanceScore = scoreStoneRelevance(stone, tokens);
    const diversityScore = 1;
    const jitter = (rand() - 0.5) * 0.2;
    const compositeScore = relevanceScore * 0.7 + diversityScore * 0.3 + jitter;
    if (!best || compositeScore > best.compositeScore) {
      best = { stone, relevanceScore, diversityScore, compositeScore };
    }
  });
  if (!best) best = { stone: STONE_LIBRARY[Math.floor(rand() * STONE_LIBRARY.length)], relevanceScore: 0, diversityScore: 1, compositeScore: 0.1 };
  return {
    id: `rock_regen_${Date.now()}`,
    title: best.stone.title,
    emotion: best.stone.emotion,
    occasion: best.stone.occasion,
    meaning: `This stone carries ${best.stone.emotion} for moments of ${best.stone.occasion.join(' and ')}.`,
    messageShort: sampleShortMessage(best.stone.emotion),
    messageLong: sampleLongMessage(best.stone.emotion, promptText),
    image: createStoneSvgDataUri(best.stone, Math.floor(rand() * 1000)),
    quality: {
      relevanceScore: Number(best.relevanceScore.toFixed(2)),
      diversityScore: Number(best.diversityScore.toFixed(2)),
      compositeScore: Number(best.compositeScore.toFixed(2)),
    },
  };
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function handleGenerationLifecycle(jobId, promptText, controls) {
  setTimeout(() => {
    const current = jobs.get(jobId);
    if (!current || current.status === 'blocked') return;
    setJob(jobId, { ...current, status: 'running', progress: 35, stage: 'semantic_generation' });
  }, 200);

  setTimeout(() => {
    const current = jobs.get(jobId);
    if (!current || current.status === 'blocked') return;
    setJob(jobId, { ...current, status: 'running', progress: 62, stage: 'diversity_scoring' });
  }, 550);

  setTimeout(() => {
    const current = jobs.get(jobId);
    if (!current || current.status === 'blocked') return;
    try {
      const rocks = generateStoneSet(promptText, controls || {});
      const completed = {
        ...current,
        status: 'completed',
        progress: 100,
        stage: 'completed',
        result: {
          prompt: promptText,
          controls: controls || {},
          rocks,
          quality: {
            strategy: 'relevance_and_diversity_weighted_selection',
            candidatePoolSize: STONE_LIBRARY.length,
          },
        },
      };
      setJob(jobId, completed);
      analytics.generation_completed += 1;
      persistState();
    } catch (error) {
      analytics.generation_failed += 1;
      setJob(jobId, {
        ...current,
        status: 'failed',
        progress: 100,
        stage: 'failed',
        error: error.message || 'Generation failed unexpectedly.',
      });
      persistState();
    }
  }, 980);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/api/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/v1/analytics' && req.method === 'GET') {
    sendJson(res, 200, analytics);
    return;
  }

  if (pathname === '/api/v1/favorites' && req.method === 'GET') {
    sendJson(res, 200, { favorites: Array.from(favorites.values()) });
    return;
  }

  if (pathname === '/api/v1/events' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const event = String(body.event || '');
      if (event && Object.prototype.hasOwnProperty.call(analytics, event)) {
        analytics[event] += 1;
        persistState();
      }
      sendJson(res, 202, { accepted: true });
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  if (pathname === '/api/v1/rocks/generate' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      analytics.prompt_submitted += 1;
      persistState();
      const promptText = String(body.promptText || '').trim();
      if (promptText.length < 8) {
        sendJson(res, 400, { error: 'Prompt must be at least 8 characters long.' });
        return;
      }

      const moderation = moderatePrompt(promptText);
      if (moderation.blocked) {
        const blockedId = crypto.randomUUID();
        setJob(blockedId, {
          id: blockedId,
          status: 'blocked',
          progress: 100,
          stage: 'moderation_blocked',
          createdAt: Date.now(),
          error: moderation.reason,
          safeRewrite: moderation.safeRewrite,
        });
        sendJson(res, 200, { jobId: blockedId, status: 'blocked', error: moderation.reason, safeRewrite: moderation.safeRewrite });
        return;
      }

      const id = crypto.randomUUID();
      setJob(id, {
        id,
        status: 'queued',
        progress: 5,
        stage: 'queued',
        createdAt: Date.now(),
      });
      handleGenerationLifecycle(id, promptText, body.controls || {});
      sendJson(res, 202, { jobId: id, status: 'queued' });
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  if (pathname === '/api/v1/rocks/regenerate' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const promptText = String(body.promptText || '').trim();
      if (promptText.length < 8) {
        sendJson(res, 400, { error: 'Prompt must be at least 8 characters long.' });
        return;
      }
      const excludedTitles = Array.isArray(body.excludedTitles) ? body.excludedTitles.map((v) => String(v)) : [];
      const rock = generateSingleRock(promptText, body.controls || {}, excludedTitles);
      sendJson(res, 200, { rock });
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  if (pathname.startsWith('/api/v1/jobs/') && req.method === 'GET') {
    const id = pathname.split('/').pop();
    const job = jobs.get(id);
    if (!job) {
      sendJson(res, 404, { error: 'Job not found' });
      return;
    }
    sendJson(res, 200, job);
    return;
  }

  if (pathname === '/api/v1/rocks/reveal' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const rockId = String(body.rockId || '');
      const emotionHint =
        STONE_LIBRARY.find((stone) => rockId.includes(stone.title.toLowerCase().replace(/\s+/g, '_')))?.emotion ||
        String(body.emotion || '').trim() ||
        'steadfast support';
      const message = String(body.message || '').trim() || sampleShortMessage(emotionHint);
      analytics.reveal_completed += 1;
      persistState();
      sendJson(res, 200, {
        rockId,
        emotion: emotionHint,
        messageShort: message,
        messageLong: `${message} This stone is a quiet signal of care and continuity.`,
      });
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  if (pathname === '/api/v1/favorites/toggle' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const rock = body.rock;
      if (!rock || !rock.id) {
        sendJson(res, 400, { error: 'rock payload required' });
        return;
      }
      const existing = favorites.get(rock.id);
      if (existing) favorites.delete(rock.id);
      else favorites.set(rock.id, { ...rock, favoritedAt: Date.now() });
      persistState();
      sendJson(res, 200, { favorited: !existing });
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  if (pathname === '/api/v1/exports' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const format = String(body.format || 'json');
      const rocks = Array.isArray(body.rocks) ? body.rocks : [];
      const id = crypto.randomUUID();
      const artifact = {
        id,
        format,
        createdAt: Date.now(),
        count: rocks.length,
        title: `generative-rock-export-${new Date().toISOString()}`,
        content: {
          summary: rocks.map((rock) => ({
            id: rock.id,
            title: rock.title,
            emotion: rock.emotion,
            messageShort: rock.messageShort,
          })),
        },
      };
      exportsStore.set(id, artifact);
      persistState();
      sendJson(res, 201, { exportId: id, url: `/api/v1/exports/${id}` });
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  if (pathname.startsWith('/api/v1/exports/') && req.method === 'GET') {
    const id = pathname.split('/').pop();
    const artifact = exportsStore.get(id);
    if (!artifact) {
      sendJson(res, 404, { error: 'Export not found' });
      return;
    }
    sendJson(res, 200, artifact);
    return;
  }

  if (pathname === '/' || pathname === '/index.html') {
    serveFile(res, path.join(ROOT, 'index.html'));
    return;
  }

  if (pathname === '/phase1.html') {
    serveFile(res, path.join(ROOT, 'phase1.html'));
    return;
  }

  if (pathname.startsWith('/public/')) {
    const filePath = path.join(PUBLIC_DIR, pathname.replace('/public/', ''));
    if (!filePath.startsWith(PUBLIC_DIR)) {
      sendJson(res, 403, { error: 'Forbidden' });
      return;
    }
    serveFile(res, filePath);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

hydrateState();
server.listen(PORT, () => {
  console.log(`Generative Rock Phase 1.1 server running on http://localhost:${PORT}`);
});
