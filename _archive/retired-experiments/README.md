# Retired archive experiments

Heavy archive sections removed from the live `/archive` page (canvas portraits, particle vessel, shader decks).

Restore by copying `archive-heavy-sections.html` back into `archive.template.html` and re-adding the experiment runtime from git history:

- `public/app.js`
- `public/shader-deck-shaders.js`
- `public/interlude-torus-card.js`
- `public/interlude-orbit-text-card.js`

These files were removed from `public/` during production cleanup. Use `git log` / `git show` to recover them, then add `<script type="module" src="./public/app.js">` and required GSAP plugins to the archive template.
