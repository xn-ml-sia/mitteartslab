# Generative Rock Concept Documentation

This repository currently contains a lightweight static web experience (`index.html`, `gallery.html`, and assets in `public/`).

This documentation package defines a full product concept direction for a new initiative: **Generative Rock**.

## What is Generative Rock?

Generative Rock is a symbolic product concept built on one core idea:

> **What words cannot hold, a stone can.**

Users can either:

1. **Choose a rock and reveal a message** (ritual discovery flow), or
2. **Type a prompt and generate many rocks** (AI-assisted emotional expression flow).

Each generated rock includes visual form, emotional meaning, suggested language, and occasion fit.

## Documentation Index

- [Research findings](docs/research-findings.md)
- [Brand strategy](docs/brand-strategy.md)
- [UX specification](docs/ux-spec.md)
- [Technical blueprint](docs/technical-blueprint.md)
- [Roadmap and delivery plan](docs/roadmap.md)

## Phase 1 Prototype (Implemented)

This repository now includes a Phase 1 prototype implementation aligned to the roadmap:

- `phase1.html`: prototype UI for both required flows
  - Use case 2: prompt -> many generated rocks
  - Use case 1: choose a rock -> reveal message
- `public/phase1.js`: client logic for prompt submission, async job polling, rendering generated cards, and reveal flow
- `public/phase1.css`: dedicated styles for prototype UI
- `server.js`: lightweight Node HTTP server with:
  - `POST /api/v1/rocks/generate` (async job creation)
  - `GET /api/v1/jobs/:jobId` (job polling)
  - `POST /api/v1/rocks/reveal` (single reveal response)
  - `POST /api/v1/events` + `GET /api/v1/analytics` (baseline event logging)
  - prompt moderation blocklist and deterministic SVG rock image generation
  - file-backed persistence for jobs and analytics (`.data/jobs.json`, `.data/analytics.json`)
  - generation quality pass with diversity-aware ranking metadata
- `package.json`: start script for the prototype server

### Run locally

1. Install Node.js 18+.
2. Start server:
   - `npm install`
   - `npm start`
3. Open:
   - `http://localhost:3000/phase1.html`
   - `http://localhost:3000/landing.html`

### Environment note

The current cloud environment did not include `node`/`npm`, so runtime execution could not be validated here. The implementation was completed with static code validation and clear run instructions for local verification.

## Phase 1.2 Enhancements (Implemented)

The prototype now includes the next iteration features from the roadmap:

- **Single-rock regeneration**
  - `POST /api/v1/rocks/regenerate`
  - Regenerates one generated rock while preserving the rest of the set context.
- **Lock and favorite controls**
  - Client-side lock/favorite state with visual indicators.
  - Locked rocks are excluded from "regenerate unlocked" actions.
- **Export/share artifacts**
  - `POST /api/v1/exports`
  - Generates simple text artifact files under `.data/exports/`
  - Returns downloadable artifact metadata and URL.

### New interactive controls in `phase1.html`

- **Regenerate unlocked**: refreshes only non-locked rocks.
- **Export current set**: creates a text artifact summarizing the current set.
- Per-rock actions:
  - Favorite / Unfavorite
  - Lock / Unlock
  - Regenerate

### Additional endpoints

- `POST /api/v1/rocks/regenerate`
- `POST /api/v1/favorites/toggle`
- `GET /api/v1/favorites`
- `POST /api/v1/exports`
- `GET /api/v1/exports/:id`

These endpoints are implemented in `server.js` and integrated in `public/phase1.js`.

## Phase 1.3 Enhancements (Implemented)

The prototype now includes the next product-operational layer:

- **Analytics dashboard panel**
  - `GET /api/v1/dashboard`
  - Aggregates analytics counters with counts for jobs, favorites, collections, exports, and active shares.
- **Saved collections view**
  - `POST /api/v1/collections`
  - `GET /api/v1/collections`
  - Save and browse named rock sets directly from the Phase 1 page.
- **Share-link expiry controls**
  - `POST /api/v1/shares`
  - `GET /api/v1/shares`
  - `GET /s/:token`
  - Create links with selectable expiry windows (15m, 1h, 24h, 7d) and enforce expiration at read time.

### New UI sections in `phase1.html`

- Dashboard metrics cards with refresh action
- Save collection input + list
- Share list with expiry display
- Share expiry selector tied to "Create share link"

### Additional persistence files

- `.data/collections.json`
- `.data/shares.json`

## Concept Landing Page (Implemented)

The landing route is now a stone-gallery experience cloned from the gallery interaction model:

- `landing.html`
- `public/landing.css`
- `public/landing.js`

### Landing + Shader behavior

- Gallery-clone draggable/pannable field of stone cards (deterministic placement and camera behavior).
- Each card mounts the `sec2_rock` shader on its own canvas.
- A local deterministic expression engine (no backend/API call) maps emotion seeds into:
  - caption text
  - shader uniforms (`uShapeProfile`, `uNoiseAmount`, `uCutDepth`, `uMorphSeed`)
- WebGL fallback caption note is shown when rendering is unavailable.
- Reduced-motion mode removes non-essential motion while keeping interaction feedback.

### Sixth pass: Stoneface narrative layer

- `landing.html` now includes a fixed `Stoneface` title, tagline, drag helper text, and pun-dial legend overlay.
- Landing card set uses the current 12-card count with curated Stoneface voice/pun examples.
- Captions now render as two lines:
  - metadata (`emotion / pun level / mode`)
  - expressive Stoneface line
- Rendering model uses a single shared WebGL renderer + per-card blit with a throttled shared animation loop for subtle motion.
- Hybrid art direction now tracks the `index.html` section-2 rock vibe while preserving Stoneface material storytelling:
  - cards blend toward index-like baseline uniforms (`uShapeProfile ~ 0.5`, `uNoiseAmount ~ 0.1`, `uCutDepth ~ 0.8`, `uMorphSeed ~ 0.3`)
  - grading is near-monochrome (`contrast/brightness` forward, low saturation) for a closer gallery mood
  - cards use lightweight shared-time animation and optional hover tilt (`iMouse`) for subtle live motion
  - material families are intentionally focused on `smooth` and `granite`, each offset from the baseline with small texture/luster deltas
- Clicking a card opens a right-side details drawer with caption, rationale, and shader profile values.
- Drawer preview stone animates while the drawer is open (card field remains static).

Access it directly at:

- `http://localhost:3000/landing.html`

Navigation link:

- `index.html` now includes a `concept` link in the header.

## Phase 1.1 Hardening (Implemented)

The prototype includes:

- persistent state hydration/snapshot for jobs and analytics
- improved moderation UX with explicit blocked status and safe rewrite hints
- richer generated card metadata:
  - quality score
  - diversity score
  - composite score
- clearer generation stage/error states in UI

## Why this exists in the repo

The goal of this documentation set is to make the concept executable by design, product, and engineering teams without requiring additional discovery before prototyping.

## Notes on cultural framing

The research references traditions where stones are aesthetic, relational, or sacred (including Japanese and Indigenous contexts). This work intentionally uses those references as **inspiration and context**, not as direct replication of sacred forms.
