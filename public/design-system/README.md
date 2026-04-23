# Way of Code CSS Extract

Files in this folder are extracted/reconstructed from the production CSS string embedded in `wayofcode-main.js`:

- `wayofcode.tokens.css` — reusable design tokens
- `wayofcode.layout.css` — reusable layout/component primitives

## Source snapshot

- Raw extracted string: `../wayofcode-extracted.css`
- Bundle source: `../wayofcode-main.js`

## Usage

```css
@import "./wayofcode.tokens.css";
@import "./wayofcode.layout.css";
```

Then apply `.woc-page`, `.woc-header`, `.woc-main`, `.woc-chapter-grid`, etc.