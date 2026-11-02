const DEFAULT_COUNTRY_CODE = "91";
const MIN_DIGITS = 11;
const MAX_DIGITS = 15;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns digits only, with country code, or "" when the number can't be valid. */
export function toInternationalDigits(raw: string, countryCode = DEFAULT_COUNTRY_CODE): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = countryCode + digits.slice(1);
  } else if (digits.length === 10) {
    digits = countryCode + digits;
  }
  return digits.length >= MIN_DIGITS && digits.length <= MAX_DIGITS ? digits : "";
}

export function whatsappLink(raw: string, message?: string): string | null {
  const digits = toInternationalDigits(raw);
  if (!digits) return null;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}

export function telLink(raw: string): string | null {
  const digits = toInternationalDigits(raw);
  return digits ? `tel:+${digits}` : null;
}

export function mailtoLink(email: string, subject?: string): string | null {
  const trimmed = email.trim();
  if (!EMAIL_PATTERN.test(trimmed)) return null;
  return subject ? `mailto:${trimmed}?subject=${encodeURIComponent(subject)}` : `mailto:${trimmed}`;
}

export function formatPhone(raw: string): string {
  const digits = toInternationalDigits(raw);
  if (!digits) return raw.trim();
  if (digits.startsWith("91") && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return `+${digits}`;
}

export function bookingMessage(input: {
  school: string;
  instrument?: string;
  level?: string;
  grading?: boolean;
}): string {
  const base = `Hi, I'd like to book a session at ${input.school}.`;
  if (!input.instrument) return base;
  const course = input.level ? `${input.instrument} (${input.level})` : input.instrument;
  return `${base} I'm interested in ${course}${input.grading ? " grading classes" : ""}.`;
}
