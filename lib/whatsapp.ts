import { site } from '@/config/site';
import { formatPrice } from './format';
import type { Product } from '@/data/products';

export function waNumber(): string {
  return site.PLACEHOLDER_WHATSAPP.replace(/[^0-9]/g, '');
}

export function waLink(message: string): string {
  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(message)}`;
}

export function productEnquiry(p: Product): string {
  return waLink(
    `Hi Ravya Fashion! I'm interested in ${p.name} (${formatPrice(p.price, p.priceTo)}). Is it available in my size at the Rourkela store?`,
  );
}

export function generalEnquiry(): string {
  return waLink("Hi Ravya Fashion! I'd like to know what's new in store.");
}

/**
 * 3-hour rack-hold message (PRD §5.1). Size and rack are optional: sample
 * rows carry no rack coordinate yet, so the segment is omitted when absent
 * rather than invented.
 */
export function holdMessage(p: Product, size?: string, rack?: string): string {
  const spec: string[] = [];
  if (size) spec.push(`Size ${size}`);
  spec.push(formatPrice(p.price, p.priceTo));
  if (rack) spec.push(`Rack #${rack}`);
  return (
    `Hi Ravya Fashion! I want to hold the ${p.name} (${spec.join(', ')}) ` +
    `for trial at your Sector 5 showroom today.`
  );
}

export function holdLink(p: Product, size?: string, rack?: string, ticketId?: string): string {
  const base = holdMessage(p, size, rack);
  return waLink(ticketId ? `${base} My hold ticket is ${ticketId}.` : base);
}
