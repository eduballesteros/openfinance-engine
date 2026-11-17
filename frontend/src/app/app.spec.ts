import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { CLOCK } from './core/clock';
import { FinanceApi } from './data/finance-api';
import { SampleFinanceApi } from './data/sample/sample-finance-api';
import { PlaceholderPage } from './features/placeholder/placeholder-page';

describe('App', () => {
  beforeEach(() => {
    const clock = { now: () => new Date(2026, 10, 17) };
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(
          [{ path: 'movimientos', component: PlaceholderPage, data: { heading: 'Movimientos', description: 'x' } }],
          withComponentInputBinding(),
        ),
        { provide: CLOCK, useValue: clock },
        { provide: FinanceApi, useValue: new SampleFinanceApi(clock, 'normal', 0) },
      ],
    });
  });

  it('ofrece un enlace para saltar al contenido y una navegación principal con nombre', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.skip-link')?.textContent).toContain('Saltar al contenido');
    expect(el.querySelector('nav[aria-label="Principal"]')).toBeTruthy();
    expect(el.querySelector('main#contenido')).toBeTruthy();
  });

  it('indica de forma visible que los datos son de ejemplo', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Datos de ejemplo');
  });

  it('mantiene marcada la sección aunque la URL lleve parámetros de consulta', async () => {
    const harness = await RouterTestingHarness.create();
    const fixture = TestBed.createComponent(App);
    await harness.navigateByUrl('/movimientos?filtro=gastos');
    fixture.detectChanges();
    await fixture.whenStable();
    const current = (fixture.nativeElement as HTMLElement).querySelector('a[aria-current="page"]');
    expect(current?.textContent).toContain('Movimientos');
  });

  it('marca la página actual con aria-current', async () => {
    const harness = await RouterTestingHarness.create();
    const fixture = TestBed.createComponent(App);
    await harness.navigateByUrl('/movimientos');
    fixture.detectChanges();
    await fixture.whenStable();
    const current = (fixture.nativeElement as HTMLElement).querySelector('a[aria-current="page"]');
    expect(current?.textContent).toContain('Movimientos');
  });
});
