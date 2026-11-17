import { TestBed } from '@angular/core/testing';
import { CLOCK } from './clock';
import { LastVisit } from './last-visit';

describe('LastVisit', () => {
  let now = new Date('2026-11-17T10:30:00Z');

  beforeEach(() => {
    localStorage.clear();
    now = new Date('2026-11-17T10:30:00Z');
    TestBed.configureTestingModule({ providers: [{ provide: CLOCK, useValue: { now: () => now } }] });
  });

  it('en la primera visita considera nuevo lo de las últimas 24 horas', () => {
    const visit = TestBed.inject(LastVisit);
    expect(visit.isNew('2026-11-17T08:30:00Z')).toBe(true);
    expect(visit.isNew('2026-11-16T08:30:00Z')).toBe(false);
  });

  it('marcar como visto apaga lo nuevo y lo recuerda en el navegador', () => {
    const visit = TestBed.inject(LastVisit);
    visit.markAllSeen();
    expect(visit.isNew('2026-11-17T08:30:00Z')).toBe(false);
    expect(localStorage.getItem('openfinance.vistoHasta')).toBe('2026-11-17T10:30:00.000Z');
  });

  it('compara instantes aunque el backend use otra zona horaria', () => {
    localStorage.setItem('openfinance.vistoHasta', '2026-11-17T10:00:00.000Z');
    const visit = TestBed.inject(LastVisit);
    // 11:15 en Madrid (UTC+1) = 10:15 UTC → posterior a lo visto
    expect(visit.isNew('2026-11-17T11:15:00+01:00')).toBe(true);
  });
});
