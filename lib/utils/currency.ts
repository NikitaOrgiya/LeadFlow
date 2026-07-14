const formatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return `${formatter.format(value)} ₽`;
}

export function formatPriceRange(min: number, max: number): string {
  if (min === max) return formatCurrency(min);
  return `${formatter.format(min)}–${formatCurrency(max)}`;
}
