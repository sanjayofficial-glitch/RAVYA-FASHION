import { site } from '@/config/site';

export interface DayHours {
  dayIndex: number; // 0 = Sunday (JS convention)
  label: string;
  range: string; // '10:00-21:00' or ''
  open: string;
  close: string;
}

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function parseRange(range: string): { open: string; close: string } | null {
  if (!range) return null;
  const [open, close] = range.split('-');
  if (!open || !close) return null;
  return { open, close };
}

/** Weekly hours in JS day order (0-6), for tables. */
export function weeklyHours(): DayHours[] {
  return [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
    const range = site.hours[dayIndex] ?? '';
    const parsed = parseRange(range);
    return {
      dayIndex,
      label: DAY_LABELS[dayIndex] ?? '',
      range,
      open: parsed?.open ?? '',
      close: parsed?.close ?? '',
    };
  });
}

export interface OpenStatus {
  isOpen: boolean;
  label: string;
  detail: string;
}

/** Compute open/closed against the Asia/Kolkata clock, never the machine's. */
export function computeOpenStatus(now: Date = new Date()): OpenStatus {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? '';
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);
  const idx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekday);
  const minutesNow = hour * 60 + minute;

  const range = site.hours[idx] ?? '';
  const parsed = parseRange(range);
  if (!parsed) {
    return { isOpen: false, label: 'Closed today', detail: `${DAY_LABELS[idx] ?? 'Today'}: closed` };
  }
  const [oh, om] = parsed.open.split(':').map(Number);
  const [ch, cm] = parsed.close.split(':').map(Number);
  const openMin = (oh ?? 0) * 60 + (om ?? 0);
  const closeMin = (ch ?? 0) * 60 + (cm ?? 0);

  if (minutesNow >= openMin && minutesNow < closeMin) {
    return {
      isOpen: true,
      label: 'Open now',
      detail: `Until ${parsed.close} IST`,
    };
  }
  if (minutesNow < openMin) {
    return {
      isOpen: false,
      label: 'Closed',
      detail: `Opens today at ${parsed.open} IST`,
    };
  }
  const nextIdx = (idx + 1) % 7;
  const nextRange = site.hours[nextIdx] ?? '';
  const nextParsed = parseRange(nextRange);
  return {
    isOpen: false,
    label: 'Closed',
    detail: nextParsed
      ? `Opens ${DAY_LABELS[nextIdx] ?? 'tomorrow'} at ${nextParsed.open} IST`
      : 'Opens tomorrow',
  };
}
