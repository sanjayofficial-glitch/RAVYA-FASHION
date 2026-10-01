'use client';

import { useEffect, useMemo, useState } from 'react';
import { track } from '@/lib/track';

const SLOTS = [
  { id: 'morning', label: 'Morning · 10–1' },
  { id: 'afternoon', label: 'Afternoon · 1–5' },
  { id: 'evening', label: 'Evening · 5–9' },
] as const;

const FOCUS = [
  { id: 'festive', label: 'Festive & Occasion' },
  { id: 'corporate', label: 'Corporate Executive' },
  { id: 'casual', label: 'Casual Overhaul' },
] as const;

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'done'; id: string; date: string; slot: string }
  | { state: 'error'; message: string };

function nextDays(n: number): string[] {
  const out: string[] = [];
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return out;
}

function dayLabel(iso: string, i: number): string {
  if (i === 0) return 'Today';
  if (i === 1) return 'Tomorrow';
  return new Date(`${iso}T00:00:00+05:30`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/** Private fitting / stylist booking (PRD §5.3). Mount-gated: date list depends on IST today. */
export function BookingForm() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [slot, setSlot] = useState<(typeof SLOTS)[number]['id']>('evening');
  const [focus, setFocus] = useState<(typeof FOCUS)[number]['id']>('casual');
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const days = useMemo(() => nextDays(7), []);
  const [date, setDate] = useState('');

  useEffect(() => {
    setMounted(true);
    setDate((d) => d || nextDays(7)[0]!);
  }, []);

  if (!mounted) {
    return (
      <section aria-label="Book a stylist" aria-busy="true">
        <div className="h-64 animate-pulse rounded-card bg-canvas-alt" />
      </section>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.state === 'sending') return;
    setStatus({ state: 'sending' });
    try {
      const res = await fetch('/api/stylist-booking', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, phone, date, slot, focus }),
      });
      const json = (await res.json()) as { ok: boolean; booking?: { id: string }; error?: string };
      if (!res.ok || !json.ok || !json.booking) {
        const hints: Record<string, string> = {
          invalid_name: 'Please enter your name.',
          invalid_phone: 'Please enter a valid 10-digit mobile number.',
          invalid_date: 'Please pick a date within the next two weeks.',
          invalid_slot: 'Please pick a time slot.',
          invalid_focus: 'Please pick a styling focus.',
        };
        throw new Error(hints[json.error ?? ''] ?? 'Booking failed — please try again.');
      }
      track('booking_created', { slot });
      setStatus({ state: 'done', id: json.booking.id, date, slot });
    } catch (err) {
      setStatus({ state: 'error', message: err instanceof Error ? err.message : 'Booking failed.' });
    }
  };

  if (status.state === 'done') {
    return (
      <section aria-label="Booking confirmed" className="rounded-card border border-accent/40 bg-accent/5 p-5" role="status">
        <h2 className="text-lg font-semibold text-ink">Fitting booked</h2>
        <p className="mt-1 text-sm text-ink-2">
          Booking <span className="font-mono font-semibold text-ink">{status.id}</span> · {status.date} · {status.slot}.
          We will confirm on WhatsApp shortly — valet parking is available at Sector 5.
        </p>
      </section>
    );
  }

  const inputCls =
    'min-h-[48px] w-full rounded-btn border border-line bg-canvas px-4 text-[15px] text-ink placeholder:text-ink-2/70 focus:border-accent focus:outline-none';

  return (
    <section aria-label="Book a stylist" className="rounded-card border border-line p-5">
      <h2 className="text-lg font-semibold text-ink">Book a 1-on-1 stylist</h2>
      <p className="mt-1 text-sm text-ink-2">Private fitting suite · garment steam · 30-min master tailor.</p>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Full name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Your name"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Mobile / WhatsApp
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            required
            inputMode="tel"
            placeholder="98765 43210"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Preferred date
          <select value={date} onChange={(e) => setDate(e.target.value)} className={inputCls}>
            {days.map((d, i) => (
              <option key={d} value={d}>
                {dayLabel(d, i)} · {d}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend className="text-sm font-medium text-ink">Time slot</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {SLOTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSlot(s.id)}
                aria-pressed={slot === s.id}
                className={`min-h-[44px] rounded-pill border px-4 text-sm transition-colors ${
                  slot === s.id ? 'border-accent bg-accent/10 font-semibold text-ink' : 'border-line text-ink-2'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium text-ink">Styling focus</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {FOCUS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFocus(f.id)}
                aria-pressed={focus === f.id}
                className={`min-h-[44px] rounded-pill border px-4 text-sm transition-colors ${
                  focus === f.id ? 'border-accent bg-accent/10 font-semibold text-ink' : 'border-line text-ink-2'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </fieldset>
        {status.state === 'error' ? (
          <p className="text-sm text-sale" role="alert">
            {status.message}
          </p>
        ) : null}
        <button type="submit" disabled={status.state === 'sending'} className="btn btn-primary w-full disabled:opacity-60">
          {status.state === 'sending' ? 'Booking…' : 'Request fitting'}
        </button>
      </form>
    </section>
  );
}
