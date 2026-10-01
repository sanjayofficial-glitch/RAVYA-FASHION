import { NextRequest, NextResponse } from 'next/server';

const EVENTS = ['whatsapp_click', 'directions_tap', 'call_tap', 'quick_view_open', 'filter_apply', 'store_page_view', 'hold_created', 'booking_created', 'inventory_update'] as const;

export async function GET(req: NextRequest) {
  const token = process.env.STATS_TOKEN;
  const provided = req.nextUrl.searchParams.get('token');
  if (!token || provided !== token) {
    return new NextResponse(null, { status: 404 });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const auth = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !auth) {
    return NextResponse.json({ ok: true, mode: 'log-only', days: [] });
  }

  const days: Record<string, Record<string, number>> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    days[d] = {};
    for (const e of EVENTS) days[d]![e] = 0;
  }

  try {
    const commands = Object.keys(days).flatMap((d) => EVENTS.map((e) => ['GET', `rf:${d}:${e}`]));
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { authorization: `Bearer ${auth}`, 'content-type': 'application/json' },
      body: JSON.stringify(commands),
      cache: 'no-store',
    });
    const json = (await res.json()) as { result: (string | null)[] };
    const keys = Object.keys(days);
    keys.forEach((d, di) => {
      EVENTS.forEach((e, ei) => {
        const raw = json.result?.[di * EVENTS.length + ei];
        days[d]![e] = raw ? parseInt(String(raw), 10) || 0 : 0;
      });
    });
  } catch {
    // fall through with zeroed table
  }

  return NextResponse.json({ ok: true, mode: 'upstash', days });
}
