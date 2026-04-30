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

## Why this exists in the repo

The goal of this documentation set is to make the concept executable by design, product, and engineering teams without requiring additional discovery before prototyping.

## Notes on cultural framing

The research references traditions where stones are aesthetic, relational, or sacred (including Japanese and Indigenous contexts). This work intentionally uses those references as **inspiration and context**, not as direct replication of sacred forms.
