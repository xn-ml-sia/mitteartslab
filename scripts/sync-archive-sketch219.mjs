import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARKER = '<!-- ARCHIVE_SKETCH219_HERO -->';
const templatePath = path.join(ROOT, 'archive.template.html');
const outputPath = path.join(ROOT, 'archive.html');
const heroPath = path.join(ROOT, 'public/portfolio-sketch219/hero-body.html');

const loadArchiveHtml = () => {
  if (fs.existsSync(outputPath)) {
    return fs.readFileSync(outputPath, 'utf8');
  }
  return fs.readFileSync(templatePath, 'utf8');
};

const html = loadArchiveHtml();
const hero = fs.readFileSync(heroPath, 'utf8');

if (!html.includes(MARKER)) {
  console.error('archive.html is missing the sketch219 hero marker.');
  process.exit(1);
}

fs.writeFileSync(outputPath, html.replace(MARKER, hero.trim()));
console.log('Synced sketch219 hero into archive.html');
