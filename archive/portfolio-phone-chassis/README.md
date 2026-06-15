# Portfolio phone chassis (archived)

CSS 3D titanium-style iPhone shell that previously wrapped the portfolio detail phone showcase.

Archived so the live showcase renders **screen layers only** while keeping explode interactions, effect toggle, and hero flip.

## Restore

1. Copy `chassis.html` markup back inside `.portfolio-phone__device` (before `.portfolio-phone__screens`).
2. Link `chassis.css` after `portfolio-detail-phone.css`, or merge its rules into that file.
3. Restore `portfolio-phone__screens::before` (notch) and `::after` (glass) from `chassis.css` if desired.

## Files

- `chassis.html` — body + face markup
- `chassis.css` — shell, bezel, notch, glass overlay styles
