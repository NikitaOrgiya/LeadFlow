import { getOptionById, getServiceBySlug, OPTIONS } from "@/lib/pricing/pricing-config";

/**
 * Значение выбора опции: boolean для flat/percentage-опций,
 * количество единиц (страниц, интеграций) для per_unit-опций.
 */
export type OptionSelections = Partial<Record<string, boolean | number>>;

export type PriceBreakdownItem = {
  id: string;
  label: string;
  amount: number;
};

export type PriceEstimate = {
  serviceSlug: string;
  serviceName: string;
  basePrice: number;
  min: number;
  max: number;
  selectedOptionLabels: string[];
};

const roundToHundred = (value: number) => Math.round(value / 100) * 100;

function clampQuantity(quantity: number, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  if (!Number.isFinite(quantity) || quantity < min) return min;
  return Math.min(Math.floor(quantity), max);
}

/**
 * Пересчитывает диапазон стоимости по услуге и выбранным опциям.
 * Используется и на клиенте (для мгновенного отображения), и на сервере
 * (для авторитетного пересчёта — клиентским значениям не доверяем).
 */
export function calculatePrice(
  serviceSlug: string,
  selections: OptionSelections
): PriceEstimate | null {
  const service = getServiceBySlug(serviceSlug);
  if (!service) return null;

  let additive = 0;
  let isUrgent = false;
  const selectedOptionLabels: string[] = [];

  for (const option of OPTIONS) {
    const value = selections[option.id];
    if (value === undefined || value === false || value === 0) continue;

    if (option.kind === "percentage") {
      if (option.id === "urgent" && value) {
        isUrgent = true;
        selectedOptionLabels.push(option.label);
      }
      continue;
    }

    if (option.kind === "flat") {
      if (value) {
        additive += option.amount;
        selectedOptionLabels.push(option.label);
      }
      continue;
    }

    if (option.kind === "per_unit") {
      const quantity = clampQuantity(Number(value), option.min ?? 0, option.max);
      if (quantity > 0) {
        additive += option.amount * quantity;
        selectedOptionLabels.push(`${option.label}: ${quantity} (${option.unitLabel ?? "шт."})`);
      }
    }
  }

  let subtotal = service.basePrice + additive;
  if (isUrgent) {
    subtotal = subtotal * 1.3;
  }

  const min = roundToHundred(subtotal);
  const max = roundToHundred(subtotal * 1.2);

  return {
    serviceSlug: service.slug,
    serviceName: service.name,
    basePrice: service.basePrice,
    min,
    max,
    selectedOptionLabels,
  };
}

export function isValidOptionId(id: string): boolean {
  return getOptionById(id) !== undefined;
}
