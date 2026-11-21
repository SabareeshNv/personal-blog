import { SITE } from '@/site.config';

const part = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(SITE.locale, { timeZone: SITE.timeZone, ...options });

const dayFormat = part({ day: '2-digit' });
const monthFormat = part({ month: 'short' });
const monthLongFormat = part({ month: 'long' });
const weekdayFormat = part({ weekday: 'short' });
const yearFormat = part({ year: 'numeric' });
const fullFormat = part({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const shortFormat = part({ day: '2-digit', month: 'short', year: 'numeric' });

/** The pieces of the date block: 21 · NOV · SAT · 2026. */
export function dateParts(date: Date) {
  return {
    day: dayFormat.format(date),
    month: monthFormat.format(date).toUpperCase(),
    weekday: weekdayFormat.format(date).toUpperCase(),
    year: yearFormat.format(date),
  };
}

/** “Saturday 21 November 2026”: the accessible name of a date block. */
export const fullDate = (date: Date) => fullFormat.format(date);

/** “21 Nov 2026”. */
export const shortDate = (date: Date) => shortFormat.format(date);

/** Year and month name, used to group the archive. */
export const yearOf = (date: Date) => yearFormat.format(date);
export const monthNameOf = (date: Date) => monthLongFormat.format(date).toLowerCase();
