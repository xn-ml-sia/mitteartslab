import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

async function assertFileContains(relativePath, needles) {
  const abs = path.join(ROOT, relativePath);
  const content = await fs.readFile(abs, 'utf8');
  const missing = needles.filter((needle) => !content.includes(needle));
  if (missing.length) {
    throw new Error(`${relativePath} missing markers: ${missing.join(', ')}`);
  }
  console.log(`OK file ${relativePath}`);
}

async function assertUrlContains(url, needles) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const text = await response.text();
  const missing = needles.filter((needle) => !text.includes(needle));
  if (missing.length) {
    throw new Error(`${url} missing markers: ${missing.join(', ')}`);
  }
  console.log(`OK url ${url}`);
}

async function run() {
  await assertFileContains('public/type-lab.js', [
    'createTypeLabPipeline',
    'createTypeLabTimeline',
    'createCommandPalette',
    'createExportApi',
  ]);
  await assertFileContains('public/type-lab-export.js', [
    'createTypeLabAnimation',
    'buildExportScene',
    'getEmbedSnippet',
    'getConfigJson',
  ]);
  await assertFileContains('skewed.html', [
    'path-smoothness-input',
    'skew-x-input',
    'skew-y-input',
  ]);

  const urls = [
    ['http://localhost:3000/skewed', ['path-smoothness-input', 'skew-x-input', 'skew-y-input']],
    ['http://localhost:3000/public/type-lab.js', ['createTypeLabPipeline', 'createCommandPalette']],
    ['http://localhost:3000/public/type-lab-export.js', ['createTypeLabAnimation', 'buildExportScene']],
  ];

  for (const [url, needles] of urls) {
    await assertUrlContains(url, needles);
  }

  console.log('SKEWED_SMOKE_TEST_PASSED');
}

run().catch((error) => {
  console.error(`SKEWED_SMOKE_TEST_FAILED: ${error.message}`);
  process.exit(1);
});
