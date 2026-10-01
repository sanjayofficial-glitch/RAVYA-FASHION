export type TrackEvent =
  | 'whatsapp_click'
  | 'directions_tap'
  | 'call_tap'
  | 'quick_view_open'
  | 'filter_apply'
  | 'store_page_view'
  | 'hold_created'
  | 'booking_created'
  | 'inventory_update';

const EVENTS: readonly TrackEvent[] = [
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

/** First-party counter. No cookies, no PII. No-ops on save-data. */
export function track(event: TrackEvent, props?: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  if (document.documentElement.dataset.savedata === 'true') return;
  if (!EVENTS.includes(event)) return;
  const body = JSON.stringify({ event, props: props ?? {}, t: Date.now() });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
      return;
    }
  } catch {
    /* fall through to fetch */
  }
  fetch('/api/track', { method: 'POST', body, keepalive: true }).catch(() => {});
}
