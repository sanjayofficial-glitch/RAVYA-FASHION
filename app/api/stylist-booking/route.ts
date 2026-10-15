import { NextRequest, NextResponse } from 'next/server';
import { normalizePhone } from '@/lib/phone';
import { upstashCreds, upstashPipeline } from '@/lib/store';
import { notifyConfigured, sendWhatsAppText } from '@/lib/notify';

/** Private fitting / stylist booking (PRD §5.3). */

const SLOTS = ['morning', 'afternoon', 'evening'] as const;
const FOCUS = ['festive', 'corporate', 'casual'] as const;

export type Slot = (typeof SLOTS)[number];
export type Focus = (typeof FOCUS)[number];

export interface Booking {
  id: string;
  name: string;
  phone: string;
  date: string;
  slot: Slot;
  focus: Focus;
  notified: boolean;
}

const memoryBookings: Booking[] = [];

function bookingId(): string {
  return `RB-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, '0')}`;
}

function validDate(input: unknown): string | null {
  if (typeof input !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(input)) return null;
  const day = new Date(`${input}T00:00:00+05:30`).getTime();
  if (Number.isNaN(day)) return null;
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((day - today.getTime()) / 86_400_000);
  return diffDays >= 0 && diffDays <= 13 ? input : null;
}

export async function POST(req: NextRequest) {
  let body: { name?: unknown; phone?: unknown; date?: unknown; slot?: unknown; focus?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : '';
  const phone = normalizePhone(body.phone);
  const date = validDate(body.date);
  const slot = SLOTS.includes(body.slot as Slot) ? (body.slot as Slot) : null;
  const focus = FOCUS.includes(body.focus as Focus) ? (body.focus as Focus) : null;

  if (!name) return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 });
  if (!phone) return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 });
  if (!date) return NextResponse.json({ ok: false, error: 'invalid_date' }, { status: 400 });
  if (!slot) return NextResponse.json({ ok: false, error: 'invalid_slot' }, { status: 400 });
  if (!focus) return NextResponse.json({ ok: false, error: 'invalid_focus' }, { status: 400 });

  const booking: Booking = { id: bookingId(), name, phone, date, slot, focus, notified: false };

  let mode: 'upstash' | 'memory' = 'memory';
  let stored = false;
  try {
    if (!upstashCreds()) {
      memoryBookings.push(booking);
      if (memoryBookings.length > 500) memoryBookings.shift();
      stored = true;
    } else {
      await upstashPipeline([
        ['RPUSH', 'rf:bookings', JSON.stringify(booking)],
        ['LTRIM', 'rf:bookings', '-500', '-1'],
        ['EXPIRE', 'rf:bookings', String(90 * 86400)],
      ]);
      mode = 'upstash';
      stored = true;
    }
  } catch {
    // Only attempt memory storage if Upstash fails and there are available slots
    if (memoryBookings.length < 500) {
      memoryBookings.push(booking);
      stored = true;
    } else {
      console.error('[stylist-booking] Storage failed: both Upstash and memory storage unavailable');
    }
  }
  
  if (!stored) {
    return NextResponse.json({ ok: false, error: 'storage_unavailable' }, { status: 503 });
  }

  if (notifyConfigured()) {
    booking.notified = await sendWhatsAppText(
      phone,
      `Ravya Fashion: hi ${name}, your private fitting is booked for ${date} (${slot}). Focus: ${focus}. Booking ${booking.id}. Valet parking available at our Sector 5 store — see you soon!`,
    );
  }

  // Track booking creation for analytics
  try {
    await fetch(new URL('/api/track', req.url), {
      method: 'POST',
      body: JSON.stringify({ event: 'booking_created', bookingId: booking.id, name, phone, date, slot, focus, mode }),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
  } catch {
    console.warn(`[stylist-booking] Failed to track booking_created for booking ${booking.id}`);
  }

  return NextResponse.json({ ok: true, booking, mode });
}
