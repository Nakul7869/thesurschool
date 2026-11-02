const INDIA_TIME_ZONE = "Asia/Kolkata";
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Today's date (YYYY-MM-DD) in India, where the school's students are. */
export function todayInIndia(now: Date): string {
  return now.toLocaleDateString("en-CA", { timeZone: INDIA_TIME_ZONE });
}

export function formatEventDate(isoDate: string): string {
  if (!ISO_DATE.test(isoDate)) return isoDate;
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function partitionEvents<T extends { startsOn: string }>(
  events: readonly T[],
  today: string,
): { upcoming: T[]; past: T[] } {
  const upcoming = events.filter((e) => e.startsOn >= today).sort((a, b) => a.startsOn.localeCompare(b.startsOn));
  const past = events.filter((e) => e.startsOn < today).sort((a, b) => b.startsOn.localeCompare(a.startsOn));
  return { upcoming, past };
}

/** Splits admin-written text into paragraphs at blank lines. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}
