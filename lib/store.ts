/**
 * Shared Upstash REST helper (server-only). Mirrors the pattern in
 * `app/api/track/route.ts`: plain `fetch`, no SDK, null creds when
 * unconfigured so every route degrades to a logged demo mode.
 */

interface UpstashCreds {
  url: string;
  token: string;
}

export function upstashCreds(): UpstashCreds | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

/** Fire one pipeline round-trip. Throws on transport or Upstash errors. */
export async function upstashPipeline(commands: unknown[][]): Promise<unknown> {
  const c = upstashCreds();
  if (!c) throw new Error('upstash not configured');
  const res = await fetch(`${c.url}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${c.token}`, 'content-type': 'application/json' },
    body: JSON.stringify(commands),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  return res.json();
}
