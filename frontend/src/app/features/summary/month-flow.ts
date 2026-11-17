import { Component, computed, input, output } from '@angular/core';
import { parseIsoDate } from '../../core/clock';
import { formatMonthName } from '../../core/dates';
import { Loadable } from '../../core/loadable';
import { formatPercent } from '../../core/money';
import { MonthSummary } from '../../data/models';
import { BlockErrorComponent, SkeletonComponent } from '../../shared/ui/block-state';
import { MoneyComponent } from '../../shared/ui/money';
import { monthFlow } from './summary.logic';

/**
 * Los tres segmentos del mes en la tarjeta: ingresos, gastos (con la parte gastada de lo ingresado)
 * y balance, cada uno comparado con el mismo periodo del mes anterior.
 */
@Component({
  selector: 'of-month-flow',
  imports: [MoneyComponent, SkeletonComponent, BlockErrorComponent],
  template: `
    <h2 class="label caption">Este mes</h2>
    @switch (state().status) {
      @case ('loading') {
        <div class="span"><of-skeleton [rows]="2" label="Cargando el resumen del mes…" /></div>
      }
      @case ('error') {
        <div class="span">
          <of-block-error title="No hemos podido cargar el resumen del mes." subject="resumen del mes" (retry)="retry.emit()" />
        </div>
      }
      @case ('ready') {
        @if (flow(); as f) {
          <dl class="segs reveal">
            <div class="seg">
              <dt class="label">Ingresos</dt>
              <dd class="amount"><of-money [value]="f.income" sign="always" tone="flow" /></dd>
              <dd class="note">{{ compare(f.incomeChange) }}</dd>
            </div>
            <div class="seg">
              <dt class="label">Gastos</dt>
              <dd class="amount"><of-money [value]="f.expenses" sign="never" /></dd>
              @if (spent(); as s) {
                <!-- La barra da la intuición; el texto, el dato. -->
                <dd class="gauge" [attr.data-over]="s.over ? 'true' : null">
                  <span class="track" aria-hidden="true"><span class="fill" [style.inline-size.%]="s.width"></span></span>
                  <span class="note">{{ s.text }}</span>
                </dd>
              }
              <dd class="note">{{ compare(f.expensesChange) }}</dd>
            </div>
            <div class="seg">
              <dt class="label">Balance</dt>
              <dd class="amount"><of-money [value]="f.net" sign="always" tone="flow" /></dd>
              <dd class="note">{{ netNote() }}</dd>
            </div>
          </dl>
        }
      }
    }
  `,
  styles: `
    :host {
      display: grid;
      gap: var(--s-2);
      container-type: inline-size;
    }
    .caption {
      font-family: var(--font-ui);
      font-weight: 600;
      letter-spacing: 0;
    }

    .span {
      padding: var(--s-5);
    }
    /* Móvil: fila compacta de tres cifras; las notas quedan para lectores de pantalla y pantallas anchas */
    .segs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .seg {
      display: grid;
      align-content: start;
      gap: 2px;
      padding: 0 var(--s-2);
    }
    .seg:first-child {
      padding-inline-start: 0;
    }
    .seg + .seg {
      border-inline-start: 1px solid var(--rule);
    }
    .amount {
      margin: 0;
      font-family: var(--font-display);
      font-size: var(--text-md);
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.2;
      font-variant-numeric: tabular-nums;
    }
    .note {
      position: absolute;
      clip-path: inset(50%);
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      white-space: nowrap;
      margin: 0;
    }
    .gauge {
      display: grid;
      gap: var(--s-1);
      margin: var(--s-1) 0 0;
    }
    .track {
      display: block;
      block-size: 6px;
      border-radius: 3px;
      overflow: hidden;
      background: var(--fill-strong);
    }
    .fill {
      display: block;
      block-size: 100%;
      background: var(--ink);
    }
    .gauge[data-over] .fill {
      background: var(--danger);
    }
    @container (width >= 34rem) {
      .seg {
        gap: var(--s-1);
        padding-inline: var(--s-5);
      }
      .amount {
        font-size: var(--text-xl);
        font-weight: 600;
        letter-spacing: -0.015em;
      }
      .note {
        position: static;
        clip-path: none;
        inline-size: auto;
        block-size: auto;
        overflow: visible;
        white-space: normal;
        font-size: var(--text-sm);
        color: var(--ink-faint);
      }
    }  `,
})
export class MonthFlowComponent {
  readonly state = input.required<Loadable<MonthSummary>>();
  readonly retry = output<void>();

  protected readonly flow = computed(() => {
    const s = this.state();
    return s.status === 'ready' ? monthFlow(s.value) : null;
  });

  private readonly previousMonthName = computed(() => {
    const s = this.state();
    if (s.status !== 'ready') {
      return '';
    }
    const month = parseIsoDate(s.value.month);
    return formatMonthName(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  });

  protected compare(change: number | null): string {
    const prev = this.previousMonthName();
    if (change === null) {
      return `Sin datos de ${prev} para comparar`;
    }
    const pct = formatPercent(change);
    if (Math.round(change * 100) === 0) {
      return `Igual que en ${prev} a estas alturas`;
    }
    return change > 0 ? `${pct} más que en ${prev} a estas alturas` : `${pct} menos que en ${prev} a estas alturas`;
  }

  protected readonly spent = computed(() => {
    const ratio = this.flow()?.spentRatio;
    if (ratio === null || ratio === undefined) {
      return null;
    }
    const over = ratio > 1;
    return {
      over,
      width: Math.min(ratio, 1) * 100,
      text: over
        ? `Has gastado un ${formatPercent(ratio - 1)} más de lo que has ingresado`
        : `Has gastado el ${formatPercent(ratio)} de lo que has ingresado`,
    };
  });

  protected readonly netNote = computed(() => {
    const f = this.flow();
    if (!f) {
      return '';
    }
    if (f.net.minor > 0) {
      return 'Has ingresado más de lo que has gastado';
    }
    if (f.net.minor < 0) {
      return 'Has gastado más de lo que has ingresado';
    }
    return f.income.minor === 0 ? 'Aún no hay movimientos este mes' : 'Ingresos y gastos igualados';
  });
}
