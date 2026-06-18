#!/usr/bin/env node
/**
 * Audit public/assets for files not referenced by live site sources.
 * Excludes _archive/. Scans HTML, JS, CSS, templates, and pre-built sketch bundles.
 *
 * Usage:
 *   node scripts/audit-public-assets.mjs          # report orphans
 *   node scripts/audit-public-assets.mjs --delete   # delete reported orphans (except dot-icon)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'public', 'assets');
const DELETE = process.argv.includes('--delete');

const DOT_ICON_ALLOWLIST = new Set([
  'MANIFEST.md',
  'arrow-left.svg', 'cube-solid.png', 'heart-full.svg', 'search.svg', 'water-clock.svg',
  'light.svg', 'ghost.svg', 'arrow-right.svg', 'arrow-top.svg', 'arrow-bottom.svg',
  'close.svg', 'menu.svg', 'chevron-left.svg', 'chevron-right.svg', 'check.svg',
  'link.svg', 'play.svg', 'home.svg', 'heart-empty.svg', 'alert.svg',
]);

const LIVE_GLOBS = [
  '*.html',
  '*.template.html',
  'public/*.js',
  'public/*.css',
  'public/portfolio-free-for-all/*.js',
  'public/type-lab-transforms/*.js',
];

const EXTRA_SCAN_FILES = [
  'public/portfolio-data.js',
  'public/portfolio-sketch501/portfolio-sketch501.js',
  'public/portfolio-sketch501/portfolio-sketch501.css',
  'public/about-sketch393/about-sketch393.js',
];

const ASSET_PATH_RE = /(?:\.\/public\/assets\/|\/public\/assets\/|public\/assets\/)([^\s"'`)]+)/g;

const walkFiles = (dir, acc = []) => {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
};

const expandGlob = (pattern) => {
  if (pattern === '*.html' || pattern === '*.template.html') {
    const suffix = pattern === '*.html' ? '.html' : '.template.html';
    return fs.readdirSync(ROOT)
      .filter((f) => f.endsWith(suffix))
      .map((f) => path.join(ROOT, f));
  }
  if (pattern.includes('/*')) {
    const [base, rest] = pattern.split('/*');
    const dir = path.join(ROOT, base);
    if (!fs.existsSync(dir)) return [];
    const ext = rest;
    return fs.readdirSync(dir)
      .filter((f) => f.endsWith(ext))
      .map((f) => path.join(dir, f));
  }
  const full = path.join(ROOT, pattern);
  return fs.existsSync(full) ? [full] : [];
};

const collectSourceFiles = () => {
  const files = new Set();
  for (const pattern of LIVE_GLOBS) {
    if (pattern.includes('*')) {
      expandGlob(pattern).forEach((f) => files.add(f));
    } else {
      const full = path.join(ROOT, pattern);
      if (fs.existsSync(full)) files.add(full);
    }
  }
  for (const rel of EXTRA_SCAN_FILES) {
    const full = path.join(ROOT, rel);
    if (fs.existsSync(full)) files.add(full);
  }
  return [...files].filter((f) => !f.includes(`${path.sep}_archive${path.sep}`));
};

const normalizeAssetPath = (raw) => {
  let p = raw.replace(/^\.\//, '').replace(/^\//, '');
  if (p.startsWith('public/assets/')) p = p.slice('public/assets/'.length);
  return p;
};

const collectReferencedAssets = (files) => {
  const refs = new Set();
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    let m;
    ASSET_PATH_RE.lastIndex = 0;
    while ((m = ASSET_PATH_RE.exec(text)) !== null) {
      refs.add(normalizeAssetPath(m[1]));
    }
  }
  return refs;
};

const listAssetFiles = () => {
  const files = walkFiles(ASSETS_DIR);
  return files.map((full) => ({
    full,
    rel: path.relative(ASSETS_DIR, full).split(path.sep).join('/'),
  }));
};

const main = () => {
  const sourceFiles = collectSourceFiles();
  const refs = collectReferencedAssets(sourceFiles);
  const onDisk = listAssetFiles();

  const orphans = onDisk.filter(({ rel }) => {
    if (rel.startsWith('dot-icon/')) {
      const name = rel.slice('dot-icon/'.length);
      if (DOT_ICON_ALLOWLIST.has(name)) return false;
    }
    if (rel === 'dot-icon/MANIFEST.md') return false;
    // exact match or directory prefix for nested assets
    if (refs.has(rel)) return false;
    for (const r of refs) {
      if (r.startsWith(`${rel}/`) || rel.startsWith(`${r}/`)) return false;
    }
    return true;
  });

  const byFolder = {};
  for (const o of orphans) {
    const folder = o.rel.includes('/') ? o.rel.split('/')[0] : '(root)';
    if (!byFolder[folder]) byFolder[folder] = [];
    byFolder[folder].push(o);
  }

  console.log(`Scanned ${sourceFiles.length} live source files`);
  console.log(`Referenced asset paths: ${refs.size}`);
  console.log(`Files on disk under public/assets/: ${onDisk.length}`);
  console.log(`Orphans: ${orphans.length}\n`);

  for (const [folder, items] of Object.entries(byFolder).sort()) {
    console.log(`## ${folder} (${items.length})`);
    for (const { rel } of items.sort((a, b) => a.rel.localeCompare(b.rel))) {
      console.log(`  ${rel}`);
    }
    console.log('');
  }

  if (DELETE) {
    const toDelete = orphans.filter((o) => !o.rel.startsWith('dot-icon/'));
    for (const { full, rel } of toDelete) {
      fs.rmSync(full, { force: true });
      console.log(`deleted ${rel}`);
    }
    console.log(`\nDeleted ${toDelete.length} orphan files (dot-icon handled separately)`);
  }

  if (orphans.length > 0 && !DELETE) {
    process.exitCode = 1;
  }
};

main();
