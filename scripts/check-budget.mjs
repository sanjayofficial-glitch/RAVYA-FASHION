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
  catalogChunkKB: 25, // gzip cost of pulling data/products.ts into a client bundle
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

  let failed = false;

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

  // Catalog cost in the *client* bundle. Measured by scanning the emitted
  // browser chunks for a product-id sentinel and gzipping whatever matches —
  // the chunk boundary is wherever the bundler put it, so a per-route estimate
  // would miss a catalog that lives in a chunk shared across several pages.
  // Server chunks (.next/server/**) are excluded: they never reach the browser,
  // so counting them would charge the budget for API handlers and RSC payloads.
  // Before this was enforced, the budget was declared and never checked, and
  // data/products.ts was free to grow silently (its base64 LQIPs rode along in
  // it until they were split out into data/lqip.ts).
  const CATALOG_SENTINEL = /ramraj-cotton-shirt-white/;
  const catalogChunks = new Set();
  const walk = async (dir) => {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) await walk(abs);
      else if (e.name.endsWith('.js')) {
        try {
          if (CATALOG_SENTINEL.test(await fs.readFile(abs, 'utf8'))) catalogChunks.add(abs);
        } catch {
          /* binary or unreadable; skip */
        }
      }
    }
  };
  await walk(path.join('.next', 'static', 'chunks'));

  let catalogKb = 0;
  for (const abs of catalogChunks) catalogKb += gzipSize(abs) / 1024;
  if (catalogChunks.size === 0) {
    console.warn('WARN: catalog sentinel not found in any chunk — is this check still wired up?');
  } else {
    console.log(
      `Catalog chunk(s): ${catalogChunks.size} file(s), ${catalogKb.toFixed(1)}KB gz / ${BUDGETS.catalogChunkKB}KB`,
    );
    if (catalogKb > BUDGETS.catalogChunkKB) {
      console.error(
        `FAIL: catalog chunks ${catalogKb.toFixed(1)}KB exceed ${BUDGETS.catalogChunkKB}KB. ` +
          `Usually data/products.ts or data/lqip.ts growing.`,
      );
      failed = true;
    }
  }

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
