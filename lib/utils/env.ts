/**
 * Next.js инлайнит NEXT_PUBLIC_*-переменные в клиентский бандл только когда
 * видит статическое обращение вида `process.env.NEXT_PUBLIC_X` — динамический
 * доступ `process.env[name]` не заменяется на этапе сборки и в браузере
 * возвращает undefined. Поэтому каждая переменная читается отдельным
 * литеральным обращением, а не через общий геттер по имени.
 */
function requireEnv(value: string | undefined, name: string): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Отсутствует обязательная переменная окружения: ${name}`);
  }
  return value;
}

export function getPublicSupabaseUrl(): string {
  return requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
}

export function getPublicSupabaseAnonKey(): string {
  return requireEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getSupabaseServiceRoleKey(): string {
  return requireEnv(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY");
}

export function getTelegramBotToken(): string {
  return requireEnv(process.env.TELEGRAM_BOT_TOKEN, "TELEGRAM_BOT_TOKEN");
}

export function getTelegramChatId(): string {
  return requireEnv(process.env.TELEGRAM_CHAT_ID, "TELEGRAM_CHAT_ID");
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
