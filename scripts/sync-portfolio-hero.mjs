import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARKER = '<!-- PORTFOLIO_OKPALETTE_HERO -->';
const templatePath = path.join(ROOT, 'portfolio.template.html');
const outputPath = path.join(ROOT, 'portfolio.html');
const heroPath = path.join(ROOT, 'public/portfolio-hero/hero-body.html');

const template = fs.readFileSync(templatePath, 'utf8');
const hero = fs.readFileSync(heroPath, 'utf8');

if (!template.includes(MARKER)) {
  console.error('portfolio.template.html is missing the hero marker.');
  process.exit(1);
}

fs.writeFileSync(outputPath, template.replace(MARKER, hero.trim()));
console.log('Synced portfolio hero into portfolio.html');
