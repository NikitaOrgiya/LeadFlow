-- Начальные данные по услугам. Значения синхронизированы с
-- lib/pricing/pricing-config.ts — при изменении цены обновите оба места.

insert into services (slug, name, description, base_price, duration_label, is_active)
values
  ('landing', 'Лендинг', 'Одностраничный сайт для продвижения продукта или акции.', 35000, 'от 5 дней', true),
  ('corporate-site', 'Корпоративный сайт', 'Многостраничный сайт компании с каталогом и разделами.', 60000, 'от 10 дней', true),
  ('telegram-bot', 'Telegram-бот', 'Бот для заявок, записи клиентов или поддержки.', 45000, 'от 7 дней', true),
  ('mini-crm', 'Мини-CRM', 'Внутренний кабинет для учёта клиентов и сделок.', 80000, 'от 14 дней', true),
  ('automation', 'Автоматизация процессов', 'Связываем сайт, мессенджеры и внутренние системы по API.', 50000, 'от 7 дней', true),
  ('ai-assistant', 'AI-помощник', 'Помощник, который отвечает на вопросы по вашим документам.', 70000, 'от 10 дней', true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  base_price = excluded.base_price,
  duration_label = excluded.duration_label,
  is_active = excluded.is_active;
