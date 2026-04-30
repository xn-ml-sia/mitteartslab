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
