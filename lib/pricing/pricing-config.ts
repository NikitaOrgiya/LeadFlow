export type ServiceIconName =
  | "LayoutTemplate"
  | "Building2"
  | "Send"
  | "Database"
  | "Workflow"
  | "Bot";

export type ServiceDefinition = {
  slug: string;
  name: string;
  shortDescription: string;
  icon: ServiceIconName;
  basePrice: number;
  durationLabel: string;
};

/**
 * Единый источник данных об услугах: используется в карточках услуг,
 * калькуляторе и на сервере при пересчёте цены. Значения синхронизированы
 * с seed-данными в supabase/seed.sql — при изменении цены обновите оба места.
 */
export const SERVICES: ServiceDefinition[] = [
  {
    slug: "landing",
    name: "Лендинг",
    shortDescription: "Одностраничный сайт для продвижения продукта или акции.",
    icon: "LayoutTemplate",
    basePrice: 35_000,
    durationLabel: "от 5 дней",
  },
  {
    slug: "corporate-site",
    name: "Корпоративный сайт",
    shortDescription: "Многостраничный сайт компании с каталогом и разделами.",
    icon: "Building2",
    basePrice: 60_000,
    durationLabel: "от 10 дней",
  },
  {
    slug: "telegram-bot",
    name: "Telegram-бот",
    shortDescription: "Бот для заявок, записи клиентов или поддержки.",
    icon: "Send",
    basePrice: 45_000,
    durationLabel: "от 7 дней",
  },
  {
    slug: "mini-crm",
    name: "Мини-CRM",
    shortDescription: "Внутренний кабинет для учёта клиентов и сделок.",
    icon: "Database",
    basePrice: 80_000,
    durationLabel: "от 14 дней",
  },
  {
    slug: "automation",
    name: "Автоматизация процессов",
    shortDescription: "Связываем сайт, мессенджеры и внутренние системы по API.",
    icon: "Workflow",
    basePrice: 50_000,
    durationLabel: "от 7 дней",
  },
  {
    slug: "ai-assistant",
    name: "AI-помощник",
    shortDescription: "Помощник, который отвечает на вопросы по вашим документам.",
    icon: "Bot",
    basePrice: 70_000,
    durationLabel: "от 10 дней",
  },
];

export type OptionKind = "percentage" | "per_unit" | "flat";

export type OptionDefinition = {
  id: string;
  label: string;
  kind: OptionKind;
  amount: number;
  unitLabel?: string;
  min?: number;
  max?: number;
};

/**
 * Дополнительные опции калькулятора. per_unit-опции (страницы, интеграции)
 * имеют разумные ограничения (min/max), чтобы избежать некорректного ввода.
 */
export const OPTIONS: OptionDefinition[] = [
  {
    id: "urgent",
    label: "Срочная разработка (+30%)",
    kind: "percentage",
    amount: 0.3,
  },
  {
    id: "extra_pages",
    label: "Дополнительные страницы",
    kind: "per_unit",
    amount: 5_000,
    unitLabel: "страница",
    min: 0,
    max: 20,
  },
  {
    id: "integrations",
    label: "Внешние интеграции",
    kind: "per_unit",
    amount: 15_000,
    unitLabel: "интеграция",
    min: 0,
    max: 10,
  },
  {
    id: "admin_panel",
    label: "Административная панель",
    kind: "flat",
    amount: 25_000,
  },
  {
    id: "auth",
    label: "Авторизация пользователей",
    kind: "flat",
    amount: 20_000,
  },
  {
    id: "file_upload",
    label: "Загрузка файлов",
    kind: "flat",
    amount: 10_000,
  },
  {
    id: "analytics",
    label: "Расширенная аналитика",
    kind: "flat",
    amount: 20_000,
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

export function getOptionById(id: string): OptionDefinition | undefined {
  return OPTIONS.find((option) => option.id === id);
}
