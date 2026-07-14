/**
 * Приводит телефон к формату +<цифры> для хранения. Допускает пробелы,
 * скобки, дефисы и знак + на входе; отбрасывает всё, кроме цифр, и
 * восстанавливает ведущий +, если он был в исходном значении или номер
 * начинается с 8 (нормализуется в +7).
 */
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("8")) {
    return `+7${digits.slice(1)}`;
  }

  if (trimmed.startsWith("+")) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+7${digits}`;
  }

  return digits.length > 0 ? `+${digits}` : "";
}

export function countPhoneDigits(raw: string): number {
  return raw.replace(/\D/g, "").length;
}
