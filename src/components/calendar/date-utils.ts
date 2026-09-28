/*
 * Dependency-free date helpers for Calendar and DatePicker (private — not exported from the package barrel).
 * All helpers work on local calendar days: times are dropped and results are new `Date` objects at 00:00.
 */

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Local midnight of the given date. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/** Adds months, clamping the day to the target month's length (Jan 31 + 1 month → Feb 28/29). */
export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const day = Math.min(date.getDate(), daysInMonth(target.getFullYear(), target.getMonth()));
  return new Date(target.getFullYear(), target.getMonth(), day);
}

export function addYears(date: Date, amount: number): Date {
  return addMonths(date, amount * 12);
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isSameMonth(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Negative when `a` is an earlier day than `b`, 0 on the same day, positive when later. */
export function compareDays(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

/** Clamps a day into [min, max] (either bound optional). */
export function clampDay(date: Date, min?: Date | null, max?: Date | null): Date {
  if (min && compareDays(date, min) < 0) return startOfDay(min);
  if (max && compareDays(date, max) > 0) return startOfDay(max);
  return startOfDay(date);
}

export function isOutOfBounds(date: Date, min?: Date | null, max?: Date | null): boolean {
  return (!!min && compareDays(date, min) < 0) || (!!max && compareDays(date, max) > 0);
}

/** Start of the week containing `date`. */
export function startOfWeek(date: Date, weekStartsOn: WeekDay): Date {
  const diff = (date.getDay() - weekStartsOn + 7) % 7;
  return addDays(date, -diff);
}

export function endOfWeek(date: Date, weekStartsOn: WeekDay): Date {
  return addDays(startOfWeek(date, weekStartsOn), 6);
}

/**
 * Weeks of the month as rows of 7 cells. Cells outside the month are `null` (Figma leaves them empty).
 * Only the weeks the month needs are returned (4–6 rows).
 */
export function getMonthWeeks(month: Date, weekStartsOn: WeekDay): (Date | null)[][] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const total = daysInMonth(year, m);
  const lead = (new Date(year, m, 1).getDay() - weekStartsOn + 7) % 7;
  const cells: (Date | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(year, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** Stable key for a day: `yyyy-mm-dd`. */
export function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/*  Pattern formatting / parsing (Figma placeholders "mm.dd.yyyy")      */
/* ------------------------------------------------------------------ */

const TOKEN_RE = /yyyy|mm|dd/gi;

/** Formats a date with a pattern made of `dd`, `mm`, `yyyy` and any separators (case-insensitive). */
export function formatDatePattern(date: Date, pattern: string): string {
  return pattern.replace(TOKEN_RE, (token) => {
    switch (token.toLowerCase()) {
      case 'yyyy':
        return String(date.getFullYear()).padStart(4, '0');
      case 'mm':
        return String(date.getMonth() + 1).padStart(2, '0');
      default:
        return String(date.getDate()).padStart(2, '0');
    }
  });
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Parses text typed in `pattern` format. Returns `null` for incomplete or impossible dates (e.g. 02.30.2024).
 * Day and month accept one or two digits; the year needs four.
 */
export function parseDatePattern(text: string, pattern: string): Date | null {
  const order: string[] = [];
  let source = '^\\s*';
  let last = 0;
  pattern.replace(TOKEN_RE, (token, offset: number) => {
    source += escapeRegExp(pattern.slice(last, offset)).replace(/\s+/g, '\\s*');
    const t = token.toLowerCase();
    order.push(t);
    source += t === 'yyyy' ? '(\\d{4})' : '(\\d{1,2})';
    last = offset + token.length;
    return token;
  });
  source += escapeRegExp(pattern.slice(last)).replace(/\s+/g, '\\s*') + '\\s*$';
  const match = new RegExp(source).exec(text);
  if (!match || order.length !== 3) return null;
  const parts: Record<string, number> = {};
  order.forEach((t, i) => {
    parts[t] = Number(match[i + 1]);
  });
  const { yyyy: year, mm: month, dd: day } = parts;
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month - 1)) return null;
  const date = new Date(year, month - 1, day);
  date.setFullYear(year); // years 0–99 would otherwise map to 1900–1999
  return date;
}
