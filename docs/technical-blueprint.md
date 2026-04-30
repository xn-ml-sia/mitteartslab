# Generative Rock: Technical Blueprint

This blueprint translates product intent into implementable system design for two flows:

1. **Single rock reveal** (choose -> reveal message)
2. **Multi-rock generation** (prompt -> generated set)

## 1) Recommended stack

- Frontend: Next.js + TypeScript
- API layer: Next.js route handlers or a separate Node service
- Queue: Redis + BullMQ
- Database: Postgres + Prisma
- Storage: S3-compatible object storage
- AI providers:
  - LLM for semantic concept generation
  - Text-to-image model for rock rendering
  - Optional embedding model for dedupe and ranking

## 2) Service boundaries

### API gateway

Handles auth, validation, rate limits, and orchestration.

### Moderation service

Runs prompt safety checks and blocks prohibited generation requests.

### Semantic generation service

Converts user intent into structured rock concepts.

### Render worker

Generates image assets for each rock concept asynchronously.

### Ranking and assembly

Scores outputs for quality, alignment, and diversity before returning results.

## 3) Core API routes

### `POST /api/v1/rocks/reveal`

Input: `rockId`, `tone`, locale.  
Output: emotional metadata and message variants.

### `POST /api/v1/rocks/generate`

Input: prompt text and controls.  
Output: asynchronous `jobId`.

### `GET /api/v1/jobs/:jobId`

Returns status (`queued|running|completed|failed|blocked`) and final set payload when complete.

### `POST /api/v1/rocks/:rockId/regenerate`

Regenerates one rock while preserving locked rocks.

### `POST /api/v1/exports`

Creates share artifacts for single rock or full set.

## 4) Data model (minimum)

### `rock_generation_jobs`

- `id`
- `user_id`
- `prompt_text`
- `tone`, `abstractness`, `set_size`
- `status`
- `progress`
- `moderation_flags`
- timestamps

### `rock_concepts`

- `id`, `job_id`
- `title`
- `emotion`, `sub_emotion`
- `meaning`
- `message_short`, `message_long`
- `occasion_tags`
- `visual_traits` (json)
- `seed`
- `rank_score`

### `rock_assets`

- `id`, `concept_id`
- `image_url`, `thumb_url`
- dimensions
- `quality_score`
- optional `embedding`

### `saved_rocks` and `share_exports`

Persist user collections and generated export artifacts.

## 5) Generation pipeline

1. Validate and moderate prompt.
2. Generate `N + buffer` semantic concepts via LLM.
3. Enforce schema validity.
4. Apply cultural safety and diversity rules.
5. Render each rock image (parallel workers).
6. Assess quality and rerender weak outputs.
7. Deduplicate and rank.
8. Return top `N` set to client.

## 6) Prompt engineering strategy

### Semantic prompt (LLM)

Generates structured JSON fields:

- title
- emotion
- meaning
- short/long message
- occasion tags
- visual traits
- generation seed

### Image prompt composition

Base style:

> single meaningful stone portrait, minimalist composition, geological realism, tactile texture, soft cinematic lighting, no text

Then append per-rock visual traits.

Negative prompt includes:

- no people
- no logos/text
- no sacred symbols
- no direct imitation of tribal motifs

## 7) Quality and ranking logic

Weighted score example:

- 0.45 prompt alignment
- 0.30 visual quality
- 0.25 diversity contribution

Near-duplicate policy:

- reject if similarity exceeds threshold
- rerender with new seed and adjusted style variance

## 8) Reliability and observability

- Idempotency key for generation requests
- Provider retries with backoff
- Dead-letter queue for failed render jobs
- Structured logs with job IDs
- Metrics:
  - generation completion rate
  - average latency
  - moderation block rate
  - regeneration frequency

## 9) Security and governance

- Input sanitization and prompt filtering
- PII minimization in logs
- Private-by-default sharing
- Terms disclosure for AI generated symbolic content

## 10) MVP build order

1. Async job framework and generation endpoints
2. Semantic generation with schema validation
3. Image rendering worker and asset persistence
4. Multi-rock result UI
5. Single-rock reveal interaction
6. Save/share/export features
7. Moderation hardening and analytics
