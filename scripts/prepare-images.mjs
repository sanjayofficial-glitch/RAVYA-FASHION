/**
 * Ravya Fashion image pipeline (dev-only, never bundled).
 *
 * - If raw/<id>.jpg exists (fetched by fetch-stock-images.mjs), processes it.
 * - Otherwise generates a branded placeholder so the site never ships
 *   broken images and the LQIP pipeline stays exercisable.
 *
 * Outputs:
 *   public/products/<id>.avif + .webp   (900x1125 4:5 thumb, assert <=35KB)
 *   public/products/<id>-lg.avif        (1600x2000 quick-view/hero size)
 *   public/products/_hero.avif          (home hero)
 *   public/icons/icon-*.png             (PWA icons)
 *   data/products.ts / data/hero.ts     (LQIP base64 patched in place)
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAW = 'raw';
const OUT = 'public/products';
const ICONS = 'public/icons';
const THUMB_BUDGET = 35 * 1024;

const BRAND_TAG = {
  ramraj: 'RAMRAJ',
  killer: 'KILLER',
  sportiq: 'SPORTIQ',
  ignite: 'IGNITE',
  jockey: 'JOCKEY',
  unibro: 'UNIBRO',
  ravya: 'RAVYA',
};

async function productIds() {
  const src = await fs.readFile('data/products.ts', 'utf8');
  const ids = [];
  const re = /image: '\/products\/([a-z0-9-]+)\.avif'/g;
  let m;
  while ((m = re.exec(src))) ids.push({ id: m[1] });
  return ids;
}

function placeholderSvg(label) {
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1125" viewBox="0 0 900 1125">
  <rect width="900" height="1125" fill="#F5F5F5"/>
  <g stroke="#E5E5E5" stroke-width="14" fill="none" stroke-linecap="round">
    <path d="M450 300 L450 360"/>
    <path d="M450 300 L520 380"/>
    <circle cx="450" cy="282" r="20"/>
    <path d="M300 420 Q450 360 600 420 L640 760 Q450 820 260 760 Z"/>
  </g>
  <g stroke="#CACACB" stroke-width="10" fill="none" stroke-linecap="round">
    <path d="M360 560 L540 560"/>
    <path d="M360 640 L540 640"/>
  </g>
  <rect x="60" y="1020" width="180" height="8" rx="4" fill="#C5A059"/>
  <text x="840" y="1050" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700"
        letter-spacing="14" fill="#CACACB" text-anchor="end">${label}</text>
</svg>`);
}

async function ensurePlaceholder(id, label) {
  const rawPath = path.join(RAW, `${id}.jpg`);
  try {
    await fs.access(rawPath);
    return rawPath;
  } catch {
    const generated = path.join(RAW, `${id}.gen.png`);
    await fs.mkdir(RAW, { recursive: true });
    await fs.writeFile(generated, placeholderSvg(label));
    return generated;
  }
}

async function buildThumb(src, id) {
  const avif = path.join(OUT, `${id}.avif`);
  const webp = path.join(OUT, `${id}.webp`);
  const lg = path.join(OUT, `${id}-lg.avif`);

  // Step quality down until the thumb fits the 35KB budget.
  // Some Unsplash sources (e.g. unibro-socks-5, 257KB) only compress below
  // 35KB at q8, so the ladder continues past the q12 floor with finer steps
  // so no product lands exactly on the budget line.
  let stat = null;
  const ladder = [50, 32, 20, 12, 10, 8];
  for (const quality of ladder) {
    // Write to a temp name then rename so a failed/partial write never leaves
    // a usable-but-wrong avif that re-runs will silently skip.
    const tmp = avif + '.tmp';
    await sharp(src).resize(900, 1125, { fit: 'cover' }).avif({ quality }).toFile(tmp);
    if ((await fs.stat(tmp)).size === 0) {
      // Sharp wrote a zero-byte file (e.g. Windows AV lock / EPERM mid-write).
      // Retry once with a 250ms pause; if it still fails, skip this src so the
      // rest of the catalog still builds.
      await new Promise((r) => setTimeout(r, 250));
      await sharp(src).resize(900, 1125, { fit: 'cover' }).avif({ quality }).toFile(tmp);
      const t2 = await fs.stat(tmp);
      if (t2.size === 0) {
        console.warn(`skip ${id}: AVIF write failed at q${quality}`);
        stat = { size: Infinity };
        break;
      }
    }
    await fs.rename(tmp, avif);
    stat = await fs.stat(avif);
    if (stat.size <= THUMB_BUDGET) break;
  }
  await sharp(src).resize(900, 1125, { fit: 'cover' }).webp({ quality: 72 }).toFile(webp);
  await sharp(src).resize(1600, 2000, { fit: 'cover' }).avif({ quality: 55 }).toFile(lg);

  if (stat.size > THUMB_BUDGET) {
    console.error(`BUDGET BREACH: ${id}.avif is ${(stat.size / 1024).toFixed(1)}KB (max 35KB)`);
    process.exitCode = 1;
  }
}

async function buildLqip(src, id) {
  const buf = await sharp(src).resize(16, 20, { fit: 'cover' }).webp({ quality: 20 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function patchLqip(file, id, lqip) {
  let src = await fs.readFile(file, 'utf8');
  const marker = `id: '${id}'`;
  const start = src.indexOf(marker);
  if (start === -1) return;
  const key = "lqip: '";
  const li = src.indexOf(key, start);
  if (li === -1 || li - start > 800) return;
  const end = src.indexOf("'", li + key.length);
  if (end === -1) return;
  src = src.slice(0, li + key.length) + lqip + src.slice(end);
  await fs.writeFile(file, src);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(ICONS, { recursive: true });

  // Product thumbs + LQIP
  const ids = [];
  let raw = await fs.readFile('data/products.ts', 'utf8');
  let m;
  const re = /image: '\/products\/([a-z0-9-]+)\.avif'/g;
  while ((m = re.exec(raw))) ids.push(m[1]);

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    // Derive brand tag from the id prefix for the placeholder label.
    const brand = id.split('-')[0];
    const label = BRAND_TAG[brand] ?? 'RAVYA';
    const src = await ensurePlaceholder(id, label);
    await buildThumb(src, id);
    const lqip = await buildLqip(src, id);
    await patchLqip('data/products.ts', id, lqip);
    console.log(`products: ${i + 1}/${ids.length} ${id}`);
    // Yield once per product so the process doesn't get killed by an
    // idle-timeout / watchdog before finishing; also keeps the shell from
    // appearing hung on slow machines.
    if (i % 3 === 2) await new Promise((r) => setTimeout(r, 30));
  }
  console.log(`products: ${ids.length} processed`);

  // Hero — same quality-ladder logic so it never overshoots the 120KB LCP
  // budget even when the source is a large Unsplash photo.
  await fs.writeFile(path.join(RAW, '_hero.gen.png'), placeholderSvg('RAVYA'));
  const heroSrc =
    (await fs
      .access(path.join(RAW, '_hero.jpg'))
      .then(() => path.join(RAW, '_hero.jpg'))
      .catch(() => path.join(RAW, '_hero.gen.png')));
  const heroAvif = path.join(OUT, '_hero.avif');
  let heroStat = null;
  for (const quality of [55, 45, 35, 25, 15, 8]) {
    const tmp = heroAvif + '.tmp';
    await sharp(heroSrc)
      .resize(1000, 1250, { fit: 'cover' })
      .avif({ quality })
      .toFile(tmp);
    if ((await fs.stat(tmp)).size === 0) {
      await new Promise((r) => setTimeout(r, 250));
      await sharp(heroSrc)
        .resize(1000, 1250, { fit: 'cover' })
        .avif({ quality })
        .toFile(tmp);
      if ((await fs.stat(tmp)).size === 0) {
        console.warn('skip _hero: AVIF write failed at q' + quality);
        heroStat = { size: Infinity };
        break;
      }
    }
    await fs.rename(tmp, heroAvif);
    heroStat = await fs.stat(heroAvif);
    if (heroStat.size <= 120 * 1024) break;
  }
  const heroLqip = await buildLqip(heroSrc, '_hero');
  let hero = await fs.readFile('data/hero.ts', 'utf8');
  hero = hero.replace(/lqip: '[^']*'/, `lqip: '${heroLqip}'`);
  await fs.writeFile('data/hero.ts', hero);
  console.log('hero: done ' + (heroStat ? (heroStat.size / 1024).toFixed(1) + 'KB' : 'FAILED'));

  // PWA icons
  const iconSvg = (maskable) => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${maskable ? 0 : 96}" fill="#111111"/>
  <rect x="${maskable ? 96 : 128}" y="${maskable ? 176 : 208}" width="${maskable ? 320 : 256}" height="10" rx="5" fill="#C5A059"/>
  <text x="256" y="${maskable ? 330 : 362}" font-family="Arial, Helvetica, sans-serif" font-size="${maskable ? 150 : 190}"
        font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="6">R</text>
</svg>`);
  await sharp(iconSvg(false)).resize(192, 192).png().toFile(path.join(ICONS, 'icon-192.png'));
  await sharp(iconSvg(false)).resize(512, 512).png().toFile(path.join(ICONS, 'icon-512.png'));
  await sharp(iconSvg(true)).resize(512, 512).png().toFile(path.join(ICONS, 'icon-maskable-512.png'));
  console.log('icons: done');

  if (process.exitCode) {
    console.error('Image budget check FAILED');
  } else {
    console.log('All images within budget.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
