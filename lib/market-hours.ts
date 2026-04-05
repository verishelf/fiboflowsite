/**
 * US equity regular session (NYSE / Nasdaq), America/New_York.
 * Used to auto-switch the Trade UI to crypto when stocks are closed.
 *
 * Note: Does not model early-close days (day before holidays); full NYSE holidays
 * are included for common dates. Verify against an exchange calendar yearly.
 */

/** Full-day NYSE closures (YYYY-MM-DD, America/New_York calendar date). */
const NYSE_FULL_CLOSURES = new Set<string>([
  "2025-01-01",
  "2025-01-20",
  "2025-02-17",
  "2025-04-18",
  "2025-05-26",
  "2025-06-19",
  "2025-07-04",
  "2025-09-01",
  "2025-11-27",
  "2025-12-25",
  "2026-01-01",
  "2026-01-19",
  "2026-02-16",
  "2026-04-03",
  "2026-05-25",
  "2026-06-19",
  "2026-07-03",
  "2026-09-07",
  "2026-11-26",
  "2026-12-25",
]);

function nyDateParts(d: Date): { y: number; m: number; day: number; wd: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const y = parseInt(get("year"), 10);
  const m = parseInt(get("month"), 10);
  const day = parseInt(get("day"), 10);
  const wdStr = get("weekday");
  const wdMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return { y, m, day, wd: wdMap[wdStr] ?? 0 };
}

function nyMinutesSinceMidnight(d: Date): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const s = fmt.format(d);
  const [h, m] = s.split(":").map((x) => parseInt(x, 10));
  return h * 60 + m;
}

function isoDateNY(y: number, m: number, day: number): string {
  const mm = String(m).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

/** True during Mon–Fri NYSE regular hours 9:30–16:00 ET, excluding listed holidays. */
export function isUsEquityRegularSessionOpen(now: Date = new Date()): boolean {
  const { y, m, day, wd } = nyDateParts(now);
  if (wd === 0 || wd === 6) return false;

  const key = isoDateNY(y, m, day);
  if (NYSE_FULL_CLOSURES.has(key)) return false;

  const mins = nyMinutesSinceMidnight(now);
  const open = 9 * 60 + 30;
  const close = 16 * 60;
  return mins >= open && mins < close;
}
