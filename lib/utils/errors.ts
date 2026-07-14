/**
 * Логирует ошибку на сервере без раскрытия секретов и без передачи
 * технических деталей пользователю. Используйте вместе с понятным
 * сообщением, которое возвращается в ответе API.
 */
export function logServerError(context: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${context}]`, message);
}

export const USER_ERROR_MESSAGES = {
  validation: "Проверьте данные и попробуйте ещё раз.",
  generic: "Не удалось отправить заявку. Попробуйте ещё раз чуть позже.",
  spam: "Не удалось отправить заявку. Попробуйте ещё раз.",
} as const;
