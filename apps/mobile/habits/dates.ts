/** Local calendar helpers. V1 often used UTC ISO day keys — we do not. */

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function dateKeyFromDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function todayKey(now = new Date()): string {
  return dateKeyFromDate(now);
}

export function parseDateKey(key: string): { y: number; m: number; d: number } | null {
  const match = key.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

export function dateFromKey(key: string): Date | null {
  const parsed = parseDateKey(key);
  if (!parsed) return null;
  return new Date(parsed.y, parsed.m - 1, parsed.d, 12, 0, 0, 0);
}

export function addDays(key: string, days: number): string {
  const date = dateFromKey(key);
  if (!date) return key;
  date.setDate(date.getDate() + days);
  return dateKeyFromDate(date);
}

export function daysInMonth(y: number, month: number): number {
  return new Date(y, month, 0).getDate();
}

/** Monday-first month cells; `null` = padding. */
export function buildMonthGridCells(y: number, month: number): (number | null)[] {
  const dim = daysInMonth(y, month);
  const first = new Date(y, month - 1, 1);
  const pad = (first.getDay() + 6) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function mondayOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function formatDayLabel(key: string, locale = 'pl-PL'): string {
  const date = dateFromKey(key);
  if (!date) return key;
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function formatShortDate(key: string, locale = 'pl-PL'): string {
  const date = dateFromKey(key);
  if (!date) return key;
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

export function formatMonthYear(y: number, month: number, locale = 'pl-PL'): string {
  return new Date(y, month - 1, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
}
