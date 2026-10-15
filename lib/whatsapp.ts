import { site } from '@/config/site';
import type { Product } from '@/data/products';

export function waNumber(): string {
  return site.PLACEHOLDER_WHATSAPP.replace(/[^0-9]/g, '');
}

export function waLink(message: string): string {
  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(message)}`;
}

export function productEnquiry(p: Product): string {
  const sizes = p.sizes.join(', ');
  const colors = p.colors ? ` — Colours: ${p.colors.join(', ')}` : '';
  return waLink(
    `Hi Ravya Fashion! I'm interested in the following product:\n\n` +
    `Product: ${p.name}\n` +
    `Brand: ${p.brand}\n` +
    `Sizes: ${sizes}${colors}\n\n` +
    `I'd like to know the price and availability at your Rourkela store.`,
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
