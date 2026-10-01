import { NextRequest, NextResponse } from 'next/server';

const ALLOWED: readonly string[] = [
  'whatsapp_click',
  'directions_tap',
  'call_tap',
  'quick_view_open',
  'filter_apply',
  'store_page_view',
  'hold_created',
  'booking_created',
  'inventory_update',
];

const RETENTION_DAYS = 90;

function dayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

interface UpstashCreds {
  url: string;
  token: string;
}

function creds(): UpstashCreds | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

async function incr(key: string, c: UpstashCreds): Promise<void> {
  await fetch(`${c.url}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${c.token}`, 'content-type': 'application/json' },
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, String(RETENTION_DAYS * 86400)],
    ]),
    cache: 'no-store',
  });
}

export async function POST(req: NextRequest) {
  let event: string | undefined;
  try {
    const body = (await req.json()) as { event?: string };
    event = body.event;
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  if (!event || !ALLOWED.includes(event)) {
    return new NextResponse(null, { status: 204 });
  }

  const c = creds();
  if (!c) {
    // Zero-config mode: site works without env vars; events are just logged.
    console.warn(`[track] ${event}`);
    return new NextResponse(null, { status: 204 });
  }

  try {
    await incr(`rf:${dayKey()}:${event}`, c);
  } catch {
    // Never let measurement break the experience.
  }
  return new NextResponse(null, { status: 204 });
}
