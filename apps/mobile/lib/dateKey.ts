/** Calendar day keys (`YYYY-MM-DD`). Same clock as habit reset / grant logs (UTC date of `Date`). */

export function todayKey(now = new Date()): string {
  return now.toISOString().split('T')[0]!;
}

export function yesterdayKey(now = new Date()): string {
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  return y.toISOString().split('T')[0]!;
}

export function shiftDateKey(key: string, days: number): string {
  const dt = new Date(`${key}T12:00:00Z`);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().split('T')[0]!;
}

/** Monday-first index 0–6 for a `YYYY-MM-DD` key. */
export function weekdayMon0(dateKey: string): number {
  const js = new Date(`${dateKey}T12:00:00Z`).getUTCDay();
  return js === 0 ? 6 : js - 1;
}

export function startOfWeekMonday(dateKey: string): string {
  return shiftDateKey(dateKey, -weekdayMon0(dateKey));
}
