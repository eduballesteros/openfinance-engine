import { Component, computed, input, output } from '@angular/core';
import { parseIsoDate } from '../../core/clock';
import { formatMonthName } from '../../core/dates';
import { Loadable } from '../../core/loadable';
import { formatPercent } from '../../core/money';
import { CategoryBreakdown } from '../../data/models';
import { BlockEmptyComponent, BlockErrorComponent, SkeletonComponent } from '../../shared/ui/block-state';
import { IconComponent, categoryColor, categoryIcon } from '../../shared/ui/icon';
import { MoneyComponent } from '../../shared/ui/money';
import { categoryShares } from './summary.logic';

/**
 * Gasto por categoría: una barra apilada como lectura rápida y una tabla que es a la vez
 * leyenda y alternativa accesible del gráfico (la barra está oculta para lectores de pantalla).
 */
@Component({
  selector: 'of-category-breakdown',
  imports: [MoneyComponent, SkeletonComponent, BlockErrorComponent, BlockEmptyComponent, IconComponent],
  template: `
    <div class="head">
      <h2 id="categories-title">Gastos por categoría</h2>
      @if (monthName(); as m) {
        <span class="label">{{ m }}</span>
      }
    </div>
    @switch (state().status) {
      @case ('loading') {
        <of-skeleton [rows]="4" label="Cargando gastos por categoría…" />
      }
      @case ('error') {
        <of-block-error title="No hemos podido cargar tus gastos por categoría." subject="gastos por categoría" (retry)="retry.emit()" />
      }
      @case ('ready') {
        @if (shares(); as s) {
          @if (s.items.length === 0) {
            <of-block-empty title="Sin gastos este mes" detail="Cuando tengas gastos, verás aquí en qué se reparten." />
          } @else {
            <div class="bar reveal" aria-hidden="true">
              @for (item of s.items; track item.name) {
                <span [style.flex-grow]="item.ratio" [style.background]="color(item.name)"></span>
              }
            </div>
            <table class="reveal" aria-labelledby="categories-title">
              <thead>
                <tr>
                  <th scope="col">Categoría</th>
                  <th scope="col" class="n">Importe</th>
                  <th scope="col" class="n">%</th>
                </tr>
              </thead>
              <tbody>
                @for (item of s.items; track item.name) {
                  <tr>
                    <th scope="row">
                      <span class="cat">
                        <of-icon class="cat-icon" [name]="icon(item.name)" [style.color]="color(item.name)" />
                        {{ item.name }}
                      </span>
                    </th>
                    <td class="n"><of-money [value]="item.amount" sign="never" /></td>
                    <td class="n num">{{ percent(item.ratio) }}</td>
                  </tr>
                }
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  <td class="n"><of-money [value]="s.total" sign="never" /></td>
                  <td class="n num">100&nbsp;%</td>
                </tr>
              </tfoot>
            </table>
          }
        }
      }
    }
  `,
  styles: `
    :host {
      display: grid;
      container-type: inline-size;
      gap: var(--s-3);
      align-content: start;
    }
    .head {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--s-3);
    }
    h2 {
      font-size: var(--text-lg);
    }
    /* Barra de reparto del gasto */
    .bar {
      display: flex;
      gap: 2px;
      block-size: 0.625rem;
      margin-block: var(--s-1) var(--s-2);
      border-radius: var(--radius-pill);
      overflow: hidden;
    }
    .bar span {
      flex-basis: 0;
      min-inline-size: 3px;
    }
    table {
      inline-size: 100%;
      border-collapse: collapse;
      font-size: var(--text-md);
    }
    th,
    td {
      padding: var(--s-2) 0;
      border-block-end: 1px solid var(--rule);
      text-align: start;
      font-weight: 400;
    }
    thead th {
      padding-block-start: 0;
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--ink-faint);
    }
    .n {
      font-size: var(--text-sm);
      font-variant-numeric: tabular-nums;
      text-align: end;
      padding-inline-start: var(--s-3);
    }
    .cat {
      display: flex;
      align-items: center;
      gap: var(--s-2);
    }
    .cat-icon {
      font-size: 1rem;
      color: var(--ink-faint);
    }
    .swatch {
      inline-size: 0.625rem;
      aspect-ratio: 1;
      border-radius: 2px;
      flex-shrink: 0;
    }
    td:last-child {
      color: var(--ink-faint);
      inline-size: 4rem;
    }
    @container (width < 20rem) {
      table { font-size: var(--text-sm); }
      .cat { gap: var(--s-1); }
      .n { padding-inline-start: var(--s-2); }
      td:last-child { inline-size: auto; }
    }
    tfoot th,
    tfoot td {
      font-weight: 700;
      color: var(--ink);
      border-block-end: 0;
      padding-block-end: 0;
    }
  `,
})
export class CategoryBreakdownComponent {
  readonly state = input.required<Loadable<CategoryBreakdown>>();
  readonly retry = output<void>();

  protected readonly shares = computed(() => {
    const s = this.state();
    return s.status === 'ready' ? categoryShares(s.value.items) : null;
  });

  protected readonly monthName = computed(() => {
    const s = this.state();
    return s.status === 'ready' ? formatMonthName(parseIsoDate(s.value.month)) : null;
  });

  protected readonly icon = categoryIcon;
  /** Mismo color estable que el icono de la categoría en los movimientos. */
  protected readonly color = categoryColor;

  /** Un gasto real nunca se muestra como "0 %". */
  protected readonly percent = (ratio: number) => (ratio > 0 && ratio < 0.005 ? '<1 %' : formatPercent(ratio));
}
