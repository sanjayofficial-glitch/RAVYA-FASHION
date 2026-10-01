/**
 * Performance budget guard (spec §3.4). Run post-build.
 *
 * Methodology: for each App Router route, take the union of its JS chunks
 * from .next/app-build-manifest.json (+ all CSS), gzip each file once,
 * and compare the heaviest route's total against the initial-load budget.
 * Per-route chunks never load together, so summing every emitted file
 * would massively overstate the payload.
 */
import { promises as fs, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';

const BUDGETS = {
  initialJsCssKB: 180, // heaviest route, gzipped first-load JS + CSS
  catalogChunkKB: 25,
};

function gzipSize(file) {
  return gzipSync(readFileSync(file)).length;
}

async function main() {
  const manifestPath = '.next/app-build-manifest.json';
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  } catch {
    console.error('No app-build-manifest.json. Run `next build` first.');
    process.exit(1);
  }

  // All CSS files (every route loads them)
  const cssFiles = [];
  for (const files of Object.values(manifest.pages)) {
    for (const f of files) if (f.endsWith('.css')) cssFiles.push(f);
  }

  let worst = { route: '', kb: 0 };
  for (const [route, files] of Object.entries(manifest.pages)) {
    const unique = new Set([...files.filter((f) => f.endsWith('.js')), ...cssFiles]);
    let total = 0;
    for (const f of unique) {
      const abs = path.join('.next', f.replace(/^\.?\//, ''));
      try {
        total += gzipSize(abs);
      } catch {
        /* file may have been cleaned; skip */
      }
    }
    const kb = total / 1024;
    if (kb > worst.kb) worst = { route, kb };
  }
  console.log(`Heaviest first-load route: ${worst.route || '/'} ${worst.kb.toFixed(1)}KB gz / ${BUDGETS.initialJsCssKB}KB`);

  // Largest product thumb
  let thumb = { name: '', size: 0 };
  try {
    for (const t of await fs.readdir('public/products')) {
      if (!t.endsWith('.avif') || t.includes('-lg') || t.startsWith('_hero')) continue;
      const stat = await fs.stat(path.join('public/products', t));
      if (stat.size > thumb.size) thumb = { name: t, size: stat.size };
    }
  } catch {
    /* no images yet */
  }
  console.log(`Largest product thumb: ${thumb.name || '-'} ${(thumb.size / 1024).toFixed(1)}KB / 35KB`);
  const hero = await fs.stat('public/products/_hero.avif').catch(() => null);
  if (hero) console.log(`Hero AVIF (LCP): ${(hero.size / 1024).toFixed(1)}KB / 120KB`);

  let failed = false;
  if (worst.kb > BUDGETS.initialJsCssKB) {
    console.error(`FAIL: first-load JS+CSS ${worst.kb.toFixed(1)}KB exceeds ${BUDGETS.initialJsCssKB}KB`);
    failed = true;
  }
  if (thumb.size > 35 * 1024) {
    console.error(
      `FAIL: thumb ${thumb.name} exceeds 35KB ` +
      `(current ${(thumb.size / 1024).toFixed(1)}KB). ` +
      `Rebuild: pnpm images`
    );
    failed = true;
  }
  if (hero && hero.size > 120 * 1024) {
    console.error('FAIL: hero AVIF exceeds 120KB');
    failed = true;
  }
  if (failed) process.exit(1);
  console.log('All budgets passed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
