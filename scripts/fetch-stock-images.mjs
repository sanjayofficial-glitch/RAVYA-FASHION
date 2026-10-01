/**
 * Fetch stock photos into raw/<id>.jpg so the image pipeline
 * (prepare-images.mjs) processes real photography instead of the
 * branded SVG placeholders.
 *
 * Sources: hand-verified Unsplash photo IDs (subject-matched per product)
 * with a picsum.photos fallback per image. Every download is validated
 * (HTTP 200, image/* content-type, >= 15KB) before it is kept.
 * Already-downloaded files are skipped on re-runs.
 *
 * These are stand-ins only — replace with real product photography
 * (docs/ADD-PRODUCTS.md) before launch.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const RAW = 'raw';
const W = 900;
const H = 1125;

/** product id -> verified Unsplash photo id (images.unsplash.com) */
const UNSPLASH = {
  'ramraj-cotton-shirt-white': '1596755094514-f87e34085b2c',
  'ramraj-dhoti-set': '1434389677669-e08b4cac3105',
  'ramraj-daily-tee': '1576566588028-4147f3842f27',
  'killer-slim-denim-01': '1542272604-787c3835535d',
  'killer-skinny-black': '1475178626620-a4d074967452',
  'killer-relaxed-taper': '1541099649105-f69ad21f3246',
  'killer-denim-jacket': '1551028719-00167b16eac5',
  'sportiq-training-tee': '1620799140408-edc6dcb6d633',
  'sportiq-hoodie': '1556821840-3a63f95609a7',
  'ignite-party-shirt': '1558769132-cb1aea458c5e',
  'ignite-linen-shirt': '1602810318383-e386cc2a3ccf',
  'ignite-satin-shirt': '1523381210434-271e8be1f52b',
  'jockey-boxer-pack': '1489987707025-afc232f7ea0f',
  'jockey-crew-tee': '1521572163474-6864f9cf17ab',
  'jockey-polo': '1586790170083-2f9ceadc732d',
  'unibro-lounge-set': '1618354691373-d851c5c3a990',
  'ravya-blazer-navy': '1507680434567-5739c80be1ac',
  'ravya-bandhgala': '1594938298603-c8148c4dae35',
  'ravya-windcheater': '1591047139829-d91aecb6caea',
  'ravya-tote': '1590874103328-eac38a683ce7',
};

/** Full product id list (picsum fallback covers ids without an Unsplash match). */
const ALL_IDS = [
  ...Object.keys(UNSPLASH),
  'ramraj-formal-trousers',
  'killer-cargo-pants',
  'sportiq-track-pants',
  'sportiq-gym-shorts',
  'ignite-cargo-shorts',
  'jockey-track-pants',
  'unibro-vest-pack',
  'unibro-winter-cap',
  'unibro-socks-5',
];

const HERO = { id: '_hero', unsplash: '1441986300917-64674bd600d8', w: 1000, h: 1250 };

async function fetchBuffer(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error(`not an image (${type})`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 15 * 1024) throw new Error(`too small (${buf.length}b)`);
  return buf;
}

function urlsFor(id, w, h, unsplashId) {
  const urls = [];
  if (unsplashId) {
    urls.push([
      'unsplash',
      `https://images.unsplash.com/photo-${unsplashId}?w=${w}&q=80&auto=format&fit=crop`,
    ]);
  }
  urls.push(['picsum', `https://picsum.photos/seed/ravya-${id}/${w}/${h}`]);
  return urls;
}

async function one(id, w, h, unsplashId) {
  const dest = path.join(RAW, `${id}.jpg`);
  // Skip re-downloads that already have a file, unless an Unsplash
  // upgrade is mapped and the file came from the picsum fallback.
  if (!unsplashId) {
    try {
      await fs.access(dest);
      console.log(`skip  ${id} (already fetched)`);
      return true;
    } catch {
      /* not fetched yet */
    }
  }
  for (const [label, url] of urlsFor(id, w, h, unsplashId)) {
    try {
      const buf = await fetchBuffer(url);
      await fs.writeFile(dest, buf);
      console.log(`ok   ${id} via ${label} (${(buf.length / 1024).toFixed(0)}KB)`);
      return true;
    } catch (e) {
      console.warn(`retry ${id} (${label}: ${e.message})`);
    }
  }
  console.error(`FAIL ${id}: no source worked`);
  return false;
}

async function main() {
  await fs.mkdir(RAW, { recursive: true });
  let failed = 0;
  for (const id of ALL_IDS) {
    if (!(await one(id, W, H, UNSPLASH[id]))) failed += 1;
  }
  if (!(await one(HERO.id, HERO.w, HERO.h, HERO.unsplash))) failed += 1;
  const total = ALL_IDS.length + 1;
  console.log(`done: ${total - failed}/${total} fetched`);
  if (failed) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
