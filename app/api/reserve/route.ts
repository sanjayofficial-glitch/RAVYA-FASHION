import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { holdMessage } from '@/lib/whatsapp';
import { normalizePhone } from '@/lib/phone';
import { upstashCreds, upstashPipeline } from '@/lib/store';
import { notifyConfigured, sendWhatsAppText } from '@/lib/notify';

/** 3-hour rack hold, per PRD §5.1. */
const HOLD_TTL_MS = 3 * 60 * 60 * 1000;

export interface HoldTicket {
  id: string;
  productId: string;
  name: string;
  price: string;
  size: string | null;
  expiresAt: string;
  notified: boolean;
}

/** Demo-mode fallback when Upstash is unconfigured (process-local). */
const memoryHolds: HoldTicket[] = [];

function ticketId(): string {
  return `RF-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, '0')}`;
}

async function persist(ticket: HoldTicket): Promise<'upstash' | 'memory'> {
  if (!upstashCreds()) {
    memoryHolds.push(ticket);
    if (memoryHolds.length > 500) memoryHolds.shift();
    return 'memory';
  }
  await upstashPipeline([
    ['HSET', 'rf:holds', ticket.id, JSON.stringify(ticket)],
    ['EXPIRE', 'rf:holds', String(7 * 86400)],
  ]);
  return 'upstash';
}

export async function POST(req: NextRequest) {
  let body: { productId?: unknown; size?: unknown; phone?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const product = products.find((p) => p.id === body.productId);
  if (!product) {
    return NextResponse.json({ ok: false, error: 'unknown_product' }, { status: 400 });
  }
  const size = typeof body.size === 'string' && body.size ? body.size : null;
  if (size && !product.sizes.includes(size)) {
    return NextResponse.json({ ok: false, error: 'unknown_size' }, { status: 400 });
  }
  const phone = body.phone === undefined ? null : normalizePhone(body.phone);
  if (body.phone !== undefined && phone === null) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 });
  }

  const ticket: HoldTicket = {
    id: ticketId(),
    productId: product.id,
    name: product.name,
    price: formatPrice(product.price, product.priceTo),
    size,
    expiresAt: new Date(Date.now() + HOLD_TTL_MS).toISOString(),
    notified: false,
  };

  let mode: 'upstash' | 'memory' = 'memory';
  try {
    mode = await persist(ticket);
  } catch {
    memoryHolds.push(ticket);
  }

  if (phone && notifyConfigured()) {
    const sizeBit = size ? ` in size ${size}` : '';
    ticket.notified = await sendWhatsAppText(
      phone,
      `Ravya Fashion: ${product.name}${sizeBit} (${ticket.price}) is on hold for you until ${new Date(ticket.expiresAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })} IST. Ticket ${ticket.id}. Show this message at our Sector 5 store.`,
    );
  } else if (!phone) {
    // No customer number: the wa.me deep link (with ticket id) remains the
    // confirmation channel — see `holdLink` in lib/whatsapp.ts.
  }

  return NextResponse.json({
    ok: true,
    ticket,
    mode,
    message: holdMessage(product, size ?? undefined),
  });
}
