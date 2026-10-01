const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export function formatINR(value: number): string {
  return `\u20B9${inr.format(value)}`;
}

export function formatPrice(price: number, priceTo?: number): string {
  return priceTo ? `${formatINR(price)}\u2013${inr.format(priceTo)}` : formatINR(price);
}
