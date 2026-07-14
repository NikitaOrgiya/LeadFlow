/**
 * Логирует ошибку на сервере без раскрытия секретов и без передачи
 * технических деталей пользователю. Используйте вместе с понятным
 * сообщением, которое возвращается в ответе API.
 */
function extractMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return String(error);
}

export function logServerError(context: string, error: unknown) {
  console.error(`[${context}]`, extractMessage(error));
}

export const USER_ERROR_MESSAGES = {
  validation: "Проверьте данные и попробуйте ещё раз.",
  generic: "Не удалось отправить заявку. Попробуйте ещё раз чуть позже.",
  spam: "Не удалось отправить заявку. Попробуйте ещё раз.",
} as const;
