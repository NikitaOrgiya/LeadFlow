/**
 * Логирует ошибку на сервере без раскрытия секретов и без передачи
 * технических деталей пользователю. Используйте вместе с понятным
 * сообщением, которое возвращается в ответе API.
 */

type PostgrestErrorShape = {
  message?: unknown;
  code?: unknown;
  details?: unknown;
  hint?: unknown;
};

function isPostgrestErrorShape(error: unknown): error is PostgrestErrorShape {
  return (
    typeof error === "object" &&
    error !== null &&
    ("code" in error || "details" in error || "hint" in error || "message" in error)
  );
}

function safeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Достаёт из Supabase/PostgREST-ошибки только безопасные для лога поля:
 * code, message, details, hint. Никогда не выводит ключи, токены, пароли
 * или содержимое запроса — только эти четыре строковых поля объекта ошибки.
 * Если ни одного непустого поля нет, возвращает нейтральную строку вместо
 * пустого лога.
 */
function formatError(error: unknown): string {
  if (isPostgrestErrorShape(error)) {
    const code = safeString(error.code);
    const message = safeString(error.message);
    const details = safeString(error.details);
    const hint = safeString(error.hint);

    const parts: string[] = [];
    if (code) parts.push(`code=${code}`);
    if (message) parts.push(`message="${message}"`);
    if (details) parts.push(`details="${details}"`);
    if (hint) parts.push(`hint="${hint}"`);

    if (parts.length > 0) return parts.join(" ");
  }

  if (error instanceof Error) {
    return error.message.trim().length > 0 ? error.message : "Unknown Supabase error";
  }
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  return "Unknown Supabase error";
}

/**
 * @param context Название события, например "api/leads:insert_failed".
 * @param error   Исходная ошибка (Error, PostgrestError или произвольное
 *                значение) — в лог попадут только безопасные поля.
 * @param leadRef Публичный номер заявки или её id, если она уже известна
 *                к моменту ошибки — помогает найти заявку в базе по логу.
 */
export function logServerError(context: string, error: unknown, leadRef?: string) {
  const parts = [`[${context}]`, formatError(error)];
  if (leadRef) parts.push(`lead=${leadRef}`);
  parts.push(`at=${new Date().toISOString()}`);
  console.error(...parts);
}

export const USER_ERROR_MESSAGES = {
  validation: "Проверьте данные и попробуйте ещё раз.",
  generic: "Не удалось отправить заявку. Попробуйте ещё раз чуть позже.",
  spam: "Не удалось отправить заявку. Попробуйте ещё раз.",
} as const;
