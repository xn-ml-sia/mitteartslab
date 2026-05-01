# Generative Rock UX Specification

## Product goals

1. Help users express feelings that are difficult to verbalize.
2. Provide a meaningful symbolic interaction (not just a novelty generator).
3. Support both intimate one-to-one expression and exploratory multi-output generation.

## Primary use cases

### Use case 1: choose rock then reveal message

User selects a rock first, then uncovers a message through a small ritual interaction.

### Use case 2: prompt then generate many rocks

User writes an emotional prompt and receives a curated set of generated rocks with meaning and messaging options.

## Information architecture

- Entry
  - Choose a rock
  - Generate from prompt
- Single Rock Flow
  - Gallery
  - Rock Detail
  - Reveal
  - Message Actions
- Multi Rock Flow
  - Prompt Composer
  - Generation Loading
  - Generated Set
  - Rock Detail Drawer
  - Export/Share

## Screen specification

## Screen A: entry

### Purpose
Route the user into the interaction style they need.

### UI elements
- Hero statement
- Two mode cards
- "How it works" link
- Cultural respect and AI disclosure footer

### Success criteria
User selects one mode within a single screen.

## Screen B: single flow gallery

### Purpose
Offer selectable rocks with lightweight emotional cues.

### UI elements
- Grid of rock cards
- Emotion filter chips
- Search by intent (optional)

### Card content
- Image
- Rock title
- One-word emotion tag

## Screen C: reveal ritual

### Purpose
Create emotional pacing before message exposure.

### Interaction pattern
- Press-and-hold or swipe-to-polish
- Visual progress ring
- Optional haptic/audio feedback

### Accessibility support
- Tap-to-reveal fallback
- Reduced motion mode

## Screen D: revealed message

### Purpose
Present message and let user act on it.

### UI elements
- Rock image
- Message short
- Message long
- Tone toggle (poetic/plain)
- Save, Share, Regift, Generate companions

### Empty resonance path
If user does not connect:
- "Try another rock"
- "Generate from how you feel"

## Screen E: prompt composer (multi flow)

### Purpose
Capture user intent for generation.

### UI elements
- Prompt input textarea
- Tone slider
- Abstractness slider
- Set-size selector
- Generate button

### Prompt guidance
- Placeholder examples
- Inline rewrite help for short or vague prompts

## Screen F: generation loading

### Purpose
Build trust during processing latency.

### UI elements
- Skeleton cards
- Stage labels:
  - Interpreting intent
  - Shaping stones
  - Pairing meanings
- Cancel action

## Screen G: generated set

### Purpose
Enable exploration and curation.

### UI elements
- Generated rock grid
- Bulk actions: regenerate all, lock selected, export
- Sort options (resonance, variety, mood)

## Screen H: rock detail drawer

### Purpose
Let user inspect and edit individual outputs.

### UI elements
- Enlarged image
- Emotion and meaning
- Suggested messages
- Occasion tags
- Regenerate single action
- Edit text action

## Screen I: export and share

### Purpose
Convert emotional output into usable communication artifact.

### Formats
- Single rock card
- Three-rock strip
- Full set PDF/PNG
- Private share link

### Privacy controls
- Public link or private link
- Expiring links

## Core interaction states

- idle
- mode_selected
- single_browse
- single_reveal
- single_message
- prompt_editing
- generating
- multi_results
- detail_open
- exporting
- error

## Error and edge handling

- Generation timeout: retry and fallback message
- Duplicate-heavy set: auto-regenerate low-diversity items
- Moderation block: safe copy and reframe options
- Empty prompt: suggestions and examples

## Event tracking plan

- `mode_selected`
- `rock_selected`
- `reveal_started`
- `reveal_completed`
- `prompt_submitted`
- `generation_completed`
- `regenerate_all`
- `regenerate_single`
- `message_saved`
- `message_shared`
- `export_completed`

## UX quality metrics

- Reveal completion rate
- Save/share rate
- Regeneration per session (monitor for dissatisfaction)
- Resonance self-rating after reveal
- Export completion rate

## Content design notes

- Avoid cliches in generated copy.
- Provide both poetic and plain variants.
- Keep default short message under 12 words.
- Keep long message under 200 characters by default.

