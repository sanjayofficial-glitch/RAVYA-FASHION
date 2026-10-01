/**
 * Indian mobile normalization. Accepts `+91…`, `91…`, `0…` or bare
 * 10-digit input (with spaces/dashes), returns digits with country code,
 * or null when the number cannot be a valid Indian mobile.
 */
export function normalizePhone(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  let d = input.replace(/[^0-9]/g, '');
  if (d.length === 12 && d.startsWith('91')) {
    // already country-coded
  } else if (d.length === 11 && d.startsWith('0')) {
    d = `91${d.slice(1)}`;
  } else if (d.length === 10) {
    d = `91${d}`;
  } else {
    return null;
  }
  return /^91[6-9][0-9]{9}$/.test(d) ? d : null;
}
