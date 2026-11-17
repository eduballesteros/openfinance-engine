import { InjectionToken } from '@angular/core';

/**
 * Fuente única de "ahora". Inyectarla (en lugar de usar `new Date()` directamente)
 * permite fijar la fecha en pruebas y en los datos de ejemplo.
 */
export interface Clock {
  now(): Date;
}

export const CLOCK = new InjectionToken<Clock>('CLOCK', {
  providedIn: 'root',
  factory: () => ({ now: () => new Date() }),
});

/** Fecha de calendario local en formato ISO `AAAA-MM-DD`, sin zona horaria. */
export type IsoDate = string;

/** Fecha y hora absolutas en ISO 8601 con zona (`2026-11-17T08:30:00Z`). */
export type IsoDateTime = string;

export function toIsoDate(date: Date): IsoDate {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Interpreta `AAAA-MM-DD` como fecha local (evita el desfase de `new Date('2026-11-17')`, que es UTC). */
export function parseIsoDate(iso: IsoDate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + days);
  return copy;
}
