import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import axe from 'axe-core';
import { CLOCK } from '../../core/clock';
import { FinanceApi } from '../../data/finance-api';
import { SampleFinanceApi, SampleScenario } from '../../data/sample/sample-finance-api';
import { SummaryPage } from './summary-page';

const clock = { now: () => new Date(2026, 10, 17, 10, 30) };

/**
 * Comprobación automática con axe en cada estado de la pantalla.
 * jsdom no calcula estilos, así que el contraste de color se revisa aparte (tokens) y en navegador.
 */
async function violations(scenario: SampleScenario) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: CLOCK, useValue: clock },
      { provide: FinanceApi, useValue: new SampleFinanceApi(clock, scenario, 0) },
    ],
  });
  const fixture = TestBed.createComponent(SummaryPage);
  await fixture.whenStable();
  const host = fixture.nativeElement as HTMLElement;
  // La página se monta dentro de <main> en la aplicación real.
  const main = document.createElement('main');
  host.replaceWith(main);
  main.appendChild(host);
  const result = await axe.run(main, {
    rules: { 'color-contrast': { enabled: false } },
  });
  main.remove();
  return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

describe('SummaryPage · accesibilidad (axe)', () => {
  for (const scenario of ['normal', 'vacio', 'parcial', 'error'] as const) {
    it(`no tiene infracciones en el escenario "${scenario}"`, async () => {
      expect(await violations(scenario)).toEqual([]);
    });
  }
});
