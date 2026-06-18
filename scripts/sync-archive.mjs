import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templatePath = path.join(ROOT, 'archive.template.html');
const outputPath = path.join(ROOT, 'archive.html');

const sections = [
  {
    marker: '<!-- ARCHIVE_FREE_FOR_ALL_HERO -->',
    heroPath: path.join(ROOT, 'public/portfolio-free-for-all/hero-body.html'),
    label: 'free-for-all hero',
  },
  {
    marker: '<!-- ARCHIVE_MOSS_HERO -->',
    heroPath: path.join(ROOT, 'public/portfolio-hero/hero-body.html'),
    label: 'moss hero',
  },
];

let html = fs.readFileSync(templatePath, 'utf8');

for (const section of sections) {
  if (!html.includes(section.marker)) {
    console.error(`archive.template.html is missing ${section.label} marker.`);
    process.exit(1);
  }
  const hero = fs.readFileSync(section.heroPath, 'utf8');
  html = html.replace(section.marker, hero.trim());
}

fs.writeFileSync(outputPath, html);
console.log('Synced archive.html (free-for-all, moss hero)');
