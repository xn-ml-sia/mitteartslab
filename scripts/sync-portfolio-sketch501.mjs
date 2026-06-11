import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARKER = '        <!-- PORTFOLIO_SKETCH501_HERO -->';
const INDENT = '        ';
const templatePath = path.join(ROOT, 'portfolio.template.html');
const outputPath = path.join(ROOT, 'portfolio.html');
const heroPath = path.join(ROOT, 'public/portfolio-sketch501/hero-body.html');

const template = fs.readFileSync(templatePath, 'utf8');
const hero = fs
  .readFileSync(heroPath, 'utf8')
  .trim()
  .split('\n')
  .map((line) => `${INDENT}${line}`)
  .join('\n');

if (!template.includes(MARKER)) {
  console.error('portfolio.template.html is missing the sketch501 hero marker.');
  process.exit(1);
}

fs.writeFileSync(outputPath, template.replace(MARKER, hero));
console.log('Synced sketch501 hero into portfolio.html');
