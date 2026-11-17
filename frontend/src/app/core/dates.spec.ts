import { plain } from '../../testing/text';
import { parseIsoDate, toIsoDate } from './clock';
import { daysUntil, formatDate, formatDayHeading, formatRelativeTime } from './dates';

const today = new Date(2026, 10, 17, 10, 30); // martes, 17 nov 2026

describe('fechas', () => {
  it('interpreta AAAA-MM-DD como fecha local, sin desfase horario', () => {
    expect(toIsoDate(parseIsoDate('2026-11-01'))).toBe('2026-11-01');
  });

  it('usa "Hoy" y "Ayer" en las cabeceras de día', () => {
    expect(formatDayHeading('2026-11-17', today)).toBe('Hoy');
    expect(formatDayHeading('2026-11-16', today)).toBe('Ayer');
  });

  it('omite el año en fechas del año en curso y lo muestra en las anteriores', () => {
    expect(plain(formatDayHeading('2026-11-12', today))).toBe('Jue, 12 nov');
    expect(plain(formatDayHeading('2025-12-30', today))).toBe('30 dic 2025');
  });

  it('formato de fecha estándar sin puntos de abreviatura', () => {
    expect(plain(formatDate('2026-09-03'))).toBe('3 sept 2026');
  });

  it('calcula días de calendario hasta una fecha', () => {
    expect(daysUntil('2026-11-23', today)).toBe(6);
    expect(daysUntil('2026-11-17', today)).toBe(0);
    expect(daysUntil('2026-11-10', today)).toBe(-7);
  });

  it('expresa el tiempo relativo en lenguaje natural', () => {
    const fourteenMinutesAgo = new Date(today.getTime() - 14 * 60_000).toISOString();
    expect(formatRelativeTime(fourteenMinutesAgo, today)).toBe('hace 14 minutos');
  });
});
