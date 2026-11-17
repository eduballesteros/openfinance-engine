import { IsoDate, IsoDateTime, addDays, parseIsoDate, toIsoDate } from './clock';
import { LOCALE } from './money';

const dayInYear = new Intl.DateTimeFormat(LOCALE, { weekday: 'short', day: 'numeric', month: 'short' });
const fullDate = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' });
const longDate = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const monthYear = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' });
const monthOnly = new Intl.DateTimeFormat(LOCALE, { month: 'long' });
const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase(LOCALE) + text.slice(1);
}

/** `17 nov 2026` — formato estándar de fecha en toda la aplicación. */
export function formatDate(iso: IsoDate): string {
  return fullDate.format(parseIsoDate(iso)).replace(/\./g, '');
}

/** Fecha completa para lectores de pantalla: `martes, 17 de noviembre de 2026`. */
export function formatLongDate(iso: IsoDate): string {
  return longDate.format(parseIsoDate(iso));
}

/** Cabecera de día en listas de movimientos: `Hoy`, `Ayer`, `Lun, 12 nov` o `12 nov 2025`. */
export function formatDayHeading(iso: IsoDate, today: Date): string {
  const todayIso = toIsoDate(today);
  if (iso === todayIso) {
    return 'Hoy';
  }
  if (iso === toIsoDate(addDays(today, -1))) {
    return 'Ayer';
  }
  const date = parseIsoDate(iso);
  if (date.getFullYear() === today.getFullYear()) {
    return capitalize(dayInYear.format(date).replace(/\./g, ''));
  }
  return formatDate(iso);
}

/** `Noviembre de 2026` */
export function formatMonthYear(date: Date): string {
  return capitalize(monthYear.format(date));
}

/** `octubre` */
export function formatMonthName(date: Date): string {
  return monthOnly.format(date);
}

/** `hace 12 minutos`, `hace 3 horas`, `ayer`… */
export function formatRelativeTime(at: IsoDateTime, now: Date): string {
  const seconds = Math.round((new Date(at).getTime() - now.getTime()) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) {
    return 'hace un momento';
  }
  if (abs < 3600) {
    return relative.format(Math.round(seconds / 60), 'minute');
  }
  if (abs < 86_400) {
    return relative.format(Math.round(seconds / 3600), 'hour');
  }
  return relative.format(Math.round(seconds / 86_400), 'day');
}

/** Días de calendario entre hoy y una fecha (negativo si ya pasó). */
export function daysUntil(iso: IsoDate, today: Date): number {
  const start = parseIsoDate(toIsoDate(today)).getTime();
  const end = parseIsoDate(iso).getTime();
  return Math.round((end - start) / 86_400_000);
}
