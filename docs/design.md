# MITTE ARTS LAB — site design reference

Living spec for visual and interaction consistency across **active** routes. Use this when reviewing UI bugs, new pages, or refactors.

**Source of truth for tokens:** [`public/styles.css`](../public/styles.css) (`:root`)

**Out of scope:** `/archive`, `/phase1.html`, `/skewed` — frozen; not audited or updated here.

---

## Design intent

- **Monospace craft aesthetic** — IBM Plex Mono on chapter pages; precise, editorial, lowercase voice in nav.
- **Warm ivory surface** — Rubin ivory (`#f5ecde`) as the default “studio” background on marketing pages.
- **Portfolio as a distinct mode** — cooler gray field (`#ececec`), uppercase grid typography, crisp non-antialiased rendering.
- **4px layout grid** — padding, margin, gap, and dimensions snap to multiples of 4px via `--space-*` tokens.
- **Motion** — short, functional transitions; respect `prefers-reduced-motion` where implemented.

---

## Color tokens

| Token | Value | Use |
|-------|-------|-----|
| `--rubin-ivory` | `#f5ecde` | Default page background (about, second-life, home shell) |
| `--portfolio-surface` | `#ececec` | Portfolio page background |
| `--background-color` | `var(--rubin-ivory)` | Alias for marketing pages |
| `--text-color` | `rgba(0,0,0,0.85)` | Body copy on ivory |
| `--ink-strong` / `--portfolio-ink` | `#111111` | Portfolio text, focus rings |
| `--brand-mark` | `#603553` | Logo/favicon stroke, portfolio grid focus |
| `--rubin-gray` | `#87867f` | Logo strokes, muted UI |
| `--rubin-slate` | `#1f1e1d` | Logo dot, dark accents |
| `--rubin-dark-gray` | `#5e5d59` | Logo cap |
| `--rubin-riso` | `#5e7edf` | Accent (sparse) |
| `--mono-0` … `--mono-900` | gray scale | Borders, panels, utilities |
| `--focus-ring` | `var(--ink-strong)` | Focus outlines on portfolio controls |

**Module / artwork RGB:** `--module-ink-rgb`, `--module-accent-rgb`, etc.

---

## Typography

| Token / rule | Value | Where |
|--------------|-------|--------|
| `--font-family-mono` | IBM Plex Mono + system mono fallback | **Primary** — use this in new CSS |
| `--font-family-base`, `--font-family-code` | alias → `--font-family-mono` | Legacy names, still valid |
| `--font-size-ui` | `12px` | Chapter header |
| `--font-size-body` | `15px` | About copy |
| `--font-size-portfolio` | `13px` | Portfolio grid + detail |
| `--font-size-section` | `14px` | Section titles (shared utility) |
| `--letter-spacing-ui` | `0.08em` | Header, section titles |
| `--letter-spacing-base` | `0.02em` | Body |
| `--font-weight-body` | `300` | About, second-life |
| `--font-weight-regular` | `400` | UI labels |

### Font loading

Canonical Google Fonts URL (in-scope pages):

```
https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap
```

---

## Layout & spacing

### 4px grid rule

All **layout** values — `padding`, `margin`, `gap`, `width`, `height`, `inset`, `top`/`left` offsets — must be multiples of **4px**.

- Base unit: `--space-unit` (`4px`)
- Prefer scale tokens (`--space-1` … `--space-18`) over raw pixel literals
- **Typography** (`font-size`, `line-height`, `letter-spacing`) is exempt — optical sizing wins
- **1px borders** and **2px focus rings** are exempt
- `clamp()` / `vw` fluid values should resolve to on-grid numbers at common breakpoints; round off-grid results to the nearest 4px when auditing

```css
/* Spacing scale — public/styles.css :root */
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-9: 36px;
--space-10: 40px; --space-12: 48px; --space-14: 56px; --space-15: 60px;
--space-16: 64px; --space-18: 72px;
```

### Layout tokens

| Token | Value | Use |
|-------|-------|-----|
| `--header-height` | `60px` (`--space-15`) | Chapter header |
| `--header-padding-x` | `24px` (`--space-6`) | Header horizontal inset |
| `--page-max-width` | `1400px` | About shell, chapter-page |
| `--content-max-width` | `1120px` | Second Life wrap |
| `--page-gutter-desktop` | `72px` (`--space-18`) | About section inline padding |
| `--page-gutter-mobile` | `16px` (`--space-4`) | About mobile padding |

### Page patterns

| Pattern | Spec |
|---------|------|
| Chapter header | `60px` tall, `24px` horizontal padding, `12px` internal gap |
| About section gap | `40px` desktop (`--space-10`), `20px` tablet (`--space-5`) |
| Portfolio shell | `8px` padding (`--portfolio-gap` → `--space-2`) |
| Portfolio card gap | `8px` between cards (`--portfolio-card-gap` on `.portfolio-work-list` + columns) |
| Portfolio detail padding | `clamp(16px, 3vw, 24px)` |
| Portfolio detail split | `clamp(40px, 6vw, 64px)` desktop column gap |
| Portfolio detail cell gap | `8px` between copy blocks / thumbs |
| Portfolio inner radius | `16px` (`--portfolio-inner-radius`) |
| Second Life outer margin | `32px` total (`100% - var(--space-8)`) |

---

## Breakpoints (watch for mismatch)

| Name | Value | Used by |
|------|-------|---------|
| `tablet` | `max-width: 1024px` | `styles.css`, `about.css`, `home.css` |
| `portfolio-detail` | `min-width: 40em` (~640px) | `portfolio-detail.css` desktop split |
| `portfolio-detail` mobile | `max-width: 39.99em` | detail panel stack |
| Second Life | various `clamp()` | responsive type and grids |

**Audit note:** Portfolio detail flips layout at **640px**, while about/home use **1024px**. Tablet portfolio grid may still look “desktop” while detail is mobile layout.

---

## Shared components

### `mal-chapter-header` ([`public/chapter-header.js`](../public/chapter-header.js))

Used on: about, portfolio, second-life.

- Left: logo (`data-mal-logo`) + brand text `"mitte arts lab"`
- Right: optional `label` attribute (page name)
- Attributes: `logo-variant`, `brand`, `home-href`, `home-label`

**Not used on:** index (custom home brand).

### Logo ([`public/mal-logo.js`](../public/mal-logo.js))

- SVG ellipse mark; variants via `data-mal-logo` / `logo-variant`
- Favicon: inline SVG in each HTML `<head>` (rubin stroke `#603553`)

### `.gr-btn` / `.gr-panel` (`styles.css`)

Shared primitives in `styles.css`. Second Life overrides: `border-radius: 0`, no underline on links.

### Portfolio detail panel

- Desktop: hero **left**, copy + thumbs **right** (`portfolio-detail.css`, `.is-gallery-three`)
- Mobile: back → copy → hero → thumbs
- Phone toggle: bottom-left desktop, bottom-right mobile (`portfolio-detail-phone.css`)

### Portfolio cards

**Data:** [`public/portfolio-data.js`](../public/portfolio-data.js) — ordered list of cards (grid order).  
**Factory:** [`public/portfolio-card.js`](../public/portfolio-card.js) — `definePortfolioCard()` normalizes assets and detail layout.

#### Add a card

1. Put images in `public/assets/services/`.
2. Append one `definePortfolioCard({ ... })` entry to `PORTFOLIO_CASES` in `portfolio-data.js`.
3. Reload `/portfolio` — URL becomes `/portfolio/{id}` (`id` optional; defaults to slug of `company`).

#### Card config

| Field | Required | Notes |
|-------|----------|-------|
| `company` | yes | Grid title + detail heading |
| `keywords` | yes | string[] — shown under title on grid |
| `hero` | yes | filename or `{ src, alt }` — detail hero + default thumb/hover |
| `thumbs` | no | detail panel images after hero |
| `screens` | no | phone flip layers; filenames under `services/` |
| `subtitle` | yes | detail panel subtitle |
| `description` | yes | detail panel body |
| `id` | no | URL slug; default: lowercase slug of `company` |
| `title` | no | fallback aria label; default: `company` |
| `hover` / `thumbnail` | no | override hover bg or grid thumb; default: `hero` |

Derived automatically: `detailImages`, `detailImageCount`, `slides`, `phoneScreens`, full asset paths (`/public/assets/services/…`).

#### Example

```js
definePortfolioCard({
  company: 'Acme',
  keywords: ['product', 'mobile'],
  hero: { src: 'acme-hero.jpg', alt: 'Acme product hero' },
  thumbs: ['acme-mock-1.png', 'acme-mock-2.png'],
  screens: ['acme-1.png', 'acme-2.png', 'acme-3.png'],
  subtitle: 'one line hook',
  description: 'Longer detail copy for the panel.',
}),
```

#### Grid layout

- Cards distribute round-robin into columns: **4** desktop (≥1024px), **3** tablet, **2** mobile — see `getColumnCount()` in `portfolio.js`.
- Spacing: `--portfolio-card-gap` in `portfolio.css` (currently `8px`).

---

## Live pages — CSS stack & body class

| Route | Body class | styles.css | Page CSS |
|-------|------------|------------|----------|
| `/` | `home-mode` | yes | `home.css` |
| `/about` | `about-page` | yes | `about.css` |
| `/portfolio` | `portfolio-page` | yes | `portfolio-sketch501.css`, `portfolio.css`, `portfolio-detail*.css` |
| `/second-life` | (see `second-life.html`) | yes | `second-life.css` |

---

## Motion tokens

```css
--motion-fast: 140ms;
--motion-base: 240ms;
--motion-slow: 420ms;
--motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
```

Portfolio hover bg: `0.45s ease`. Detail phone flip: `0.8s ease-in-out`. Not all animations use the shared tokens.

---

## Consistency audit checklist

Use when reviewing a page or PR. Flag anything that diverges without intentional “mode” reason.

### Color & surface

- [ ] Background is `--rubin-ivory` on marketing pages (not `#ececec` unless portfolio)
- [ ] Text uses `--text-color` (ivory) or `--portfolio-ink` (portfolio mode)
- [ ] No stray `#111` / `#ececec` — use `--portfolio-ink` / `--portfolio-surface`
- [ ] Borders use `--mono-200` / `--mono-300` family

### Typography

- [ ] IBM Plex Mono loaded in HTML for that page
- [ ] New CSS uses `var(--font-family-mono)` and size tokens (`--font-size-*`)
- [ ] Portfolio-only uppercase / no-smoothing not leaking to other pages
- [ ] Chapter header labels lowercase on marketing pages; portfolio context uppercase where appropriate

### Header & nav

- [ ] Chapter pages use `<mal-chapter-header>` with `--header-height` and `--header-padding-x`
- [ ] Logo + “mitte arts lab” spelling consistent (home uses `home-brand-name` separately)
- [ ] Link hover: portfolio vs `mal-header-right a` underline behavior

### Layout & spacing

- [ ] Padding, margin, gap, and box dimensions use `--space-*` tokens (multiples of 4px)
- [ ] No off-grid layout literals (`10px`, `14px`, `22px`) in new CSS
- [ ] Max-width uses `--page-max-width` (1400) or `--content-max-width` (1120)
- [ ] Mobile gutters use `--page-gutter-mobile` (`16px`) on about; SL uses `--space-8` outer margin
- [ ] `100dvh` vs `100vh` used consistently for full-height sections

### Portfolio detail

- [ ] Hero left / content right on desktop
- [ ] Toggle position: left bottom desktop, right bottom mobile
- [ ] Detail open: `body.portfolio-detail-open`, header hidden
- [ ] New cards use `definePortfolioCard()` in `portfolio-data.js`; assets under `public/assets/services/`

### Accessibility & motion

- [ ] Focus outlines visible (`var(--focus-ring)` 2px on portfolio controls)
- [ ] `prefers-reduced-motion` honored on phone showcase and chapter scroll
- [ ] Icon-only buttons have `aria-label`

---

## Known inconsistencies (backlog)

| ID | Area | Issue | Files |
|----|------|-------|-------|
| C4 | Breakpoints | `1024px` vs `40em` (~640px) split across pages | multiple |
| C9 | Paths | Portfolio uses `/public/...`; other pages use `./public/...` | `*.html` |

---

## How to extend this doc

1. Add a row to **Known inconsistencies** when you spot a bug.
2. When fixing, prefer promoting hardcoded values to `:root` tokens in `styles.css` (especially `--space-*`).
3. For a new live route, add a row to **Live pages** and confirm header, font, and background against this checklist.
4. For a new portfolio card, add a `definePortfolioCard()` entry — see **Portfolio cards**.

---

## Related files

| File | Role |
|------|------|
| [`public/styles.css`](../public/styles.css) | Global tokens, chapter header, `.gr-btn` |
| [`public/chapter-header.js`](../public/chapter-header.js) | Shared header web component |
| [`public/mal-logo.js`](../public/mal-logo.js) | Logo SVG injection |
| [`public/portfolio-data.js`](../public/portfolio-data.js) | Portfolio card list (edit to add work) |
| [`public/portfolio-card.js`](../public/portfolio-card.js) | `definePortfolioCard()` factory |
| [`README.md`](../README.md) | Live routes list |
