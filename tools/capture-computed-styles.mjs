import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const TARGET = 'https://wayofcode.com/#78';
const OUT = new URL('../public/design-system/wayofcode.computed.curated.css', import.meta.url);

const selectorConfig = {
  body: [
    'background-color', 'color', 'font-family'
  ],
  '.galleryPage': [
    'display', 'flex-direction', 'height', 'background-color'
  ],
  '.header': [
    'height', 'padding', 'display', 'align-items', 'justify-content', 'background-color', 'box-shadow', 'z-index'
  ],
  '.main': [
    'flex', 'height', 'overflow'
  ],
  '.poem-section': [
    'display', 'position', 'align-items', 'justify-content', 'gap', 'padding', 'max-width'
  ],
  '.column-1': [
    'width', 'text-align', 'font-size'
  ],
  '.poem': [
    'display', 'align-items', 'gap'
  ],
  '.poem .poem-text': [
    'white-space'
  ],
  '.poem .poem-number': [
    'white-space'
  ],
  '.poem .poem-text p': [
    'margin', 'margin-bottom', 'line-height'
  ],
  '.poem .poem-number p': [
    'margin', 'margin-bottom'
  ],
  '.artwork-container': [
    'display', 'align-items', 'justify-content'
  ],
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(TARGET, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(5000);

const data = await page.evaluate(({ selectorConfig }) => {
  const root = getComputedStyle(document.documentElement);
  const vars = {};
  for (let i = 0; i < root.length; i += 1) {
    const name = root[i];
    if (name.startsWith('--')) vars[name] = root.getPropertyValue(name).trim();
  }

  const out = {};
  for (const [selector, props] of Object.entries(selectorConfig)) {
    const el = document.querySelector(selector);
    if (!el) continue;
    const cs = getComputedStyle(el);
    const map = {};
    for (const p of props) {
      const v = cs.getPropertyValue(p).trim();
      if (v) map[p] = v;
    }
    out[selector] = map;
  }

  return { vars, out };
}, { selectorConfig });

const lines = [];
lines.push('/* Curated computed-style capture from https://wayofcode.com/#78 */');
lines.push('/* Safe overrides only: no fixed viewport widths/heights from snapshot except intended section sizing */');
lines.push('');
lines.push(':root {');
for (const [k, v] of Object.entries(data.vars)) lines.push(`  ${k}: ${v};`);
lines.push('}');
lines.push('');
for (const [selector, styles] of Object.entries(data.out)) {
  lines.push(`${selector} {`);
  for (const [prop, value] of Object.entries(styles)) lines.push(`  ${prop}: ${value};`);
  lines.push('}');
  lines.push('');
}

await fs.writeFile(OUT, lines.join('\n'));
console.log(`Wrote ${OUT.pathname}`);
await browser.close();
