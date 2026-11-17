import { plain } from '../../../testing/text';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CLOCK } from '../../core/clock';
import { FinanceApi } from '../../data/finance-api';
import { AccountsOverview } from '../../data/models';
import { SampleFinanceApi, SampleScenario } from '../../data/sample/sample-finance-api';
import { SummaryPage } from './summary-page';

const clock = { now: () => new Date(2026, 10, 17, 10, 30) };

/** Falla la primera carga de cuentas y funciona en los reintentos. */
class FlakyAccountsApi extends SampleFinanceApi {
  private calls = 0;
  override async getAccounts(signal?: AbortSignal): Promise<AccountsOverview> {
    this.calls++;
    if (this.calls === 1) {
      throw new Error('fallo de red simulado');
    }
    return super.getAccounts(signal);
  }
}

async function render(api: FinanceApi) {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: CLOCK, useValue: clock }, { provide: FinanceApi, useValue: api }],
  });
  const fixture = TestBed.createComponent(SummaryPage);
  const el = fixture.nativeElement as HTMLElement;
  return { fixture, el };
}

const sample = (scenario: SampleScenario = 'normal', latency = 0) => new SampleFinanceApi(clock, scenario, latency);

describe('SummaryPage', () => {
  beforeEach(() => localStorage.clear());

  it('muestra marcadores de carga mientras llegan los datos', async () => {
    const { fixture, el } = await render(sample('normal', 50));
    fixture.detectChanges();
    expect(el.textContent).toContain('Cargando cuentas…');
    expect(el.textContent).toContain('Cargando movimientos…');
    await fixture.whenStable();
    expect(el.textContent).not.toContain('Cargando cuentas…');
  });

  it('presenta saldo total, resumen del mes, cuentas, categorías y movimientos', async () => {
    const { fixture, el } = await render(sample());
    await fixture.whenStable();
    const text = plain(el.textContent);

    expect(el.querySelector('h1')?.textContent).toContain('Posición global');
    // 3.482,17 − 412,60 + 1.205,33 + 12.640,00 = 16.914,90 (el depósito sin saldo no suma)
    expect(text).toContain('16.914,90 €');
    expect(text).toContain('No incluye Depósito ahorro (Revolut)');
    expect(text).toContain('+2.890,00 €');
    // Aviso compacto bajo el saldo y detalle en la cabecera de cada banco
    expect(text).toContain('2 bancos necesitan tu atención.');
    expect(text).toContain('Caduca en 6 días');
    expect(text).toContain('Sin sincronizar');
    expect(text).toContain('Has gastado el 60 % de lo que has ingresado');
    // Tablero: lo llegado en las últimas 24 h (primera visita) se ilumina como nuevo
    expect(text).toContain('2 nuevos desde tu última visita');
    expect(text).toContain('Saldo no disponible');
    expect(text).toContain('Compartida');
    expect(text).toContain('Vivienda');
    expect(text).toContain('Hoy');
    expect(text).toContain('Pendiente');
    // El cero se muestra como importe, no como dato ausente
    expect(text).toContain('Comisión de mantenimiento');
    expect(text).toContain('0,00 €');
  });

  it('«Marcar como leídos» apaga lo nuevo y lo anuncia', async () => {
    localStorage.clear();
    const { fixture, el } = await render(sample());
    await fixture.whenStable();
    const button = Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes('Marcar como leídos'));
    button!.click();
    await fixture.whenStable();
    expect(el.querySelectorAll('tr.is-new').length).toBe(0);
    expect(el.textContent).toContain('2 movimientos marcados como leído.');
  });

  it('si falla un bloque, el resto sigue visible y se puede reintentar', async () => {
    const { fixture, el } = await render(new FlakyAccountsApi(clock, 'normal', 0));
    await fixture.whenStable();

    expect(el.textContent).toContain('No hemos podido cargar tus cuentas.');
    expect(el.textContent).toContain('Movimientos');
    expect(el.textContent).toContain('Mercadona');

    const retry = Array.from(el.querySelectorAll('button')).find((b) => plain(b.textContent).includes('Reintentar cuentas'));
    expect(retry).toBeTruthy();
    retry!.click();
    await fixture.whenStable();

    expect(el.textContent).not.toContain('No hemos podido cargar tus cuentas.');
    expect(el.textContent).toContain('Cuenta nómina');
  });

  it('sin bancos conectados invita a conectar el primero', async () => {
    const { fixture, el } = await render(sample('vacio'));
    await fixture.whenStable();
    expect(el.textContent).toContain('Aún no has conectado ningún banco');
    const ctas = Array.from(el.querySelectorAll('a[href="/cuentas"]')).map((a) => a.textContent ?? '');
    expect(ctas.some((t) => t.includes('Conectar un banco'))).toBe(true);
    expect(el.textContent).toContain('Todavía no hay movimientos');
    expect(el.textContent).toContain('Sin gastos este mes');
  });

  it('muestra un error recuperable en cada bloque si el servidor no responde', async () => {
    const { fixture, el } = await render(sample('error'));
    await fixture.whenStable();
    expect(el.querySelectorAll('of-block-error').length).toBeGreaterThanOrEqual(4);
  });
});
