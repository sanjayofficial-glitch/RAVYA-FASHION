/**
 * Generate product images with Google AI Studio (Gemini 2.5 Flash Image).
 * Saves to raw/<id>.jpg so prepare-images.mjs processes them.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const KEY = process.env.GEMINI_KEY;
if (!KEY) {
  console.error('Set GEMINI_KEY (Google AI Studio key) before running: $env:GEMINI_KEY="..."');
  process.exit(1);
}
const MODEL = 'gemini-2.5-flash-image';
const RAW = 'raw';

const PRODUCTS = [
  ['ramraj-cotton-shirt-white', 'white cotton formal shirt on invisible mannequin, product photography, studio lighting, clean grey background, fashion catalog'],
  ['ramraj-dhoti-set', 'traditional white kurta and dhoti set on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['ramraj-formal-trousers', 'navy blue formal trousers on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['ramraj-daily-tee', 'plain white crew neck t-shirt on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['killer-slim-denim-01', 'light blue slim fit denim jeans on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['killer-skinny-black', 'black skinny jeans on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['killer-denim-jacket', 'blue denim jacket on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['killer-cargo-pants', 'khaki cargo pants on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['sportiq-training-tee', 'athletic training t-shirt on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['sportiq-track-pants', 'sporty track pants on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['sportiq-gym-shorts', 'gym shorts on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['sportiq-hoodie', 'black hoodie on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['ignite-party-shirt', 'stylish printed party shirt on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['ignite-linen-shirt', 'beige linen shirt on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['ignite-satin-shirt', 'satin shirt on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['ignite-cargo-shorts', 'cargo shorts on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['jockey-crew-tee', 'basic crew neck t-shirt pack on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['jockey-polo', 'polo t-shirt on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['jockey-boxer-pack', 'boxer shorts pack on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['jockey-track-pants', 'cotton track pants on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['unibro-vest-pack', 'vest underwear pack on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['unibro-boxer', 'boxer underwear pack on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['unibro-lounge-set', 'lounge wear set on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['unibro-winter-cap', 'winter cap on invisible mannequin, product photography, studio lighting, clean grey background'],
  ['unibro-socks-5', 'socks pack, product photography, studio lighting, clean grey background'],
  ['ravya-bandhgala', 'elegant black bandhgala suit on invisible mannequin, high fashion product photography, studio lighting, dark grey background'],
  ['ravya-blazer-navy', 'navy blue blazer on invisible mannequin, high fashion product photography, studio lighting, dark grey background'],
  ['ravya-tote', 'leather tote bag, product photography, studio lighting, dark grey background'],
  ['ravya-windcheater', 'windcheater jacket on invisible mannequin, high fashion product photography, studio lighting, dark grey background'],
];

async function generate(id, prompt) {
  const dest = path.join(RAW, `${id}.jpg`);
  try {
    await fs.access(dest);
    console.log(`skip ${id}`);
    return;
  } catch {}
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const headers = { 'Content-Type': 'application/json', 'X-goog-api-key': KEY };
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`ERR ${id}: ${JSON.stringify(data).slice(0, 200)}`);
    return;
  }
  const parts = data.candidates?.[0]?.content?.parts || [];
  const img = parts.find((p) => p.inlineData);
  if (!img) {
    console.error(`ERR ${id}: no image in response`);
    return;
  }
  await fs.writeFile(dest, Buffer.from(img.inlineData.data, 'base64'));
  console.log(`ok   ${id}`);
}

await fs.mkdir(RAW, { recursive: true });
for (const [id, prompt] of PRODUCTS) {
  await generate(id, prompt);
  await new Promise((r) => setTimeout(r, 1500));
}

// Hero
try {
  await fs.access(path.join(RAW, '_hero.jpg'));
  console.log('skip _hero');
} catch {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const headers = { 'Content-Type': 'application/json', 'X-goog-api-key': KEY };
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'high fashion boutique storefront, elegant clothing display, editorial fashion photography, warm lighting' }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }),
  });
  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const img = parts.find((p) => p.inlineData);
  if (img) {
    await fs.writeFile(path.join(RAW, '_hero.jpg'), Buffer.from(img.inlineData.data, 'base64'));
    console.log('ok   _hero');
  } else {
    console.error('ERR _hero');
  }
}
console.log('done');

