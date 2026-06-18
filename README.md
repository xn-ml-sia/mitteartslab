# Mitte Arts Lab

Static site and lightweight Node server for the MAL portfolio, about page, archive, tools, and Generative Rock prototype.

## Production routes

| Route | Page | Notes |
|-------|------|-------|
| `/` | `index.html` | Home |
| `/about` | `about.html` | About + pre-built sketch393 letter canvas |
| `/portfolio`, `/portfolio/:id` | `portfolio.html` | Portfolio grid + detail panel; sketch501 hero |
| `/archive` | `archive.html` | Slim archive: free-for-all hero, intro, moss hero |
| `/second-life` | `second-life.html` | Linked from index Apps |
| `/skewed`, `/type-lab` | `skewed.html` | Type lab tool |
| `/phase1.html` | `phase1.html` | Generative Rock prototype + API |

Retired pages (`/services`, `/stoneface`, `/landing`) are no longer routed and return 404.

## Run locally

1. Install Node.js 18+.
2. `npm install`
3. `npm start`
4. Open `http://localhost:3000/`

## Archive and retired code

- `_archive/retired-pages/` — former `services` and `stoneface` page stacks (not served in production).
- `_archive/retired-experiments/` — heavy archive experiment sections removed from the live `/archive` page.

To restore retired content, copy files back into the repo root / `archive.template.html` and re-add routes in `server.js`.

## Pre-built sketch heroes

Interactive heroes ship as built bundles only:

- `public/portfolio-sketch501/` — portfolio hero
- `public/about-sketch393/` — about letter pull

Source sketch projects (`sketch501/`, `sketch393/`) were removed from the repo. To rebuild historically, restore those folders from git history.

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm start` | Run `server.js` |
| `npm run sync:archive` | Regenerate `archive.html` from `archive.template.html` |
| `npm run sync:portfolio` | Sync portfolio sketch501 bundle into `portfolio.html` |
| `npm run vendor:gsap` | Copy GSAP vendor files into `public/vendor/` |
| `npm run test:skewed` | Smoke test for type-lab |

## Generative Rock (Phase 1)

Prototype UI and API for prompt-to-rocks and reveal flows.

- `phase1.html`, `public/phase1.js`, `public/phase1.css`
- `server.js` — `POST /api/v1/rocks/generate`, job polling, reveal, analytics, collections, shares

See [Research findings](docs/research-findings.md) and [Gift of Rock creative brief](docs/gift-of-rock-creative-brief.md) for concept background.
