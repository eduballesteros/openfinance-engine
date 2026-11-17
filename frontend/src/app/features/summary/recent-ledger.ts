import { Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatDayHeading, formatLongDate } from '../../core/dates';
import { LastVisit } from '../../core/last-visit';
import { Loadable } from '../../core/loadable';
import { Transaction } from '../../data/models';
import { BlockEmptyComponent, BlockErrorComponent, SkeletonComponent } from '../../shared/ui/block-state';
import { IconComponent, categoryColor, categoryIcon } from '../../shared/ui/icon';
import { MoneyComponent } from '../../shared/ui/money';
import { groupByDay } from './summary.logic';

/**
 * Últimos movimientos agrupados por día, con el icono de su categoría.
 * Lo recibido desde tu última visita se marca como «Nuevo» hasta que lo marcas como leído.
 */
@Component({
  selector: 'of-recent-ledger',
  imports: [MoneyComponent, SkeletonComponent, BlockErrorComponent, BlockEmptyComponent, IconComponent, RouterLink],
  template: `
    <div class="head">
      <h2 id="moves-title">Últimos movimientos</h2>
      @if (newCount() > 0) {
        <span class="chip chip--info">{{ newCount() }} {{ newCount() === 1 ? 'nuevo' : 'nuevos' }} desde tu última visita</span>
        <button type="button" class="btn mark" (click)="markSeen()">Marcar como leídos</button>
      }
    </div>
    <p class="visually-hidden" role="status">{{ announcement() }}</p>

    @switch (state().status) {
      @case ('loading') {
        <of-skeleton [rows]="6" label="Cargando movimientos…" />
      }
      @case ('error') {
        <of-block-error title="No hemos podido cargar tus movimientos." subject="movimientos" (retry)="retry.emit()" />
      }
      @case ('ready') {
        @if (days().length === 0) {
          <of-block-empty
            title="Todavía no hay movimientos"
            detail="Aparecerán aquí en cuanto tu banco los comparta con OpenFinance."
          />
        } @else {
          <ol role="list" class="days reveal" aria-labelledby="moves-title">
            @for (day of days(); track day.date) {
              <li>
                <h3 class="day">
                  <time [attr.datetime]="day.date">{{ day.heading }}</time>
                  @if (day.relative) {
                    <span class="visually-hidden">, {{ day.long }}</span>
                  }
                </h3>
                <ul role="list">
                  @for (row of day.rows; track row.tx.id) {
                    <li class="tx" [class.is-new]="row.isNew">
                      <span class="icon-badge cat" aria-hidden="true" [style.--cat]="row.color"><of-icon [name]="row.icon" /></span>
                      <span class="what">
                        <span class="desc">
                          <span class="desc-text">{{ row.tx.description }}</span>
                          @if (row.isNew) {
                            <span class="chip chip--info">Nuevo</span>
                          }
                        </span>
                        <!-- Ancho: «Categoría · Cuenta» en una línea. Estrecho: apiladas, sin separador que pueda quedar colgado. -->
                        <span class="meta">
                          <span [class.uncategorized]="!row.tx.categoryName">{{ row.tx.categoryName ?? 'Sin categoría' }}</span>
                          <span class="account">{{ row.tx.accountName }}</span>
                        </span>
                      </span>
                      <span class="side">
                        <of-money class="amount" [value]="row.tx.amount" sign="always" tone="flow" />
                        @if (row.tx.status === 'pending') {
                          <span class="chip chip--caution"><of-icon name="pending" />Pendiente</span>
                        }
                      </span>
                    </li>
                  }
                </ul>
              </li>
            }
          </ol>
          <a routerLink="/movimientos" class="link-arrow more">Ver todos los movimientos <of-icon name="arrow" /></a>
        }
      }
    }
  `,
  styles: `
    :host {
      display: grid;
      align-content: start;
      gap: var(--s-2);
      container: ledger / inline-size;
    }
    .head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--s-2) var(--s-3);
    }
    h2 {
      font-size: var(--text-lg);
      margin-inline-end: auto;
    }
    .mark {
      min-block-size: 2.25rem;
      padding-inline: var(--s-3);
    }
    .days {
      margin: 0;
    }
    .day {
      padding: var(--s-4) 0 var(--s-1);
      font-family: var(--font-ui);
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--ink-faint);
      border-block-end: 1px solid var(--rule);
    }
    ul {
      margin: 0;
    }
    .tx {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--s-3);
      min-block-size: 4rem;
      padding: var(--s-2);
      margin-inline: calc(var(--s-2) * -1);
      transition: background-color 400ms var(--ease-out);
    }
    .tx:not(:last-child) {
      border-block-end: 1px solid var(--rule);
    }
    .tx.is-new {
      background: var(--accent-wash);
    }
    .what {
      display: grid;
      min-inline-size: 0;
    }
    .desc {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--s-2);
      font-weight: 600;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      column-gap: var(--s-2);
      font-size: var(--text-sm);
      color: var(--ink-faint);
    }
    .uncategorized {
      font-style: italic;
    }
    .account::before {
      content: '·' / '';
      margin-inline-end: var(--s-2);
    }
    .side {
      display: grid;
      justify-items: end;
      gap: var(--s-1);
    }
    .amount {
      font-weight: 650;
      text-align: end;
      font-variant-numeric: tabular-nums;
    }
    /* Icono teñido con el color estable de su categoría */
    .cat {
      background: color-mix(in oklab, var(--cat) 12%, var(--surface));
      color: var(--cat);
    }
    .tx.is-new .cat {
      background: var(--surface);
    }
    /* Estrecho: categoría y cuenta apiladas, sin separador */
    @container ledger (width < 30rem) {
      .meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 0;
      }
      .account::before {
        content: none;
      }
    }
    .more {
      justify-self: start;
    }
  `,
})
export class RecentLedgerComponent {
  readonly state = input.required<Loadable<readonly Transaction[]>>();
  readonly today = input.required<Date>();
  readonly retry = output<void>();

  private readonly lastVisit = inject(LastVisit);
  protected readonly announcement = signal('');

  protected readonly days = computed(() => {
    const s = this.state();
    if (s.status !== 'ready') {
      return [];
    }
    return groupByDay(s.value).map((group) => {
      const heading = formatDayHeading(group.date, this.today());
      return {
        date: group.date,
        heading,
        relative: heading === 'Hoy' || heading === 'Ayer',
        long: formatLongDate(group.date),
        rows: group.items.map((tx) => ({
          tx,
          icon: categoryIcon(tx.categoryName),
          color: categoryColor(tx.categoryName),
          isNew: this.lastVisit.isNew(tx.importedAt),
        })),
      };
    });
  });

  protected readonly newCount = computed(() =>
    this.days().reduce((n, d) => n + d.rows.filter((r) => r.isNew).length, 0),
  );

  protected markSeen(): void {
    const count = this.newCount();
    this.lastVisit.markAllSeen();
    this.announcement.set(`${count} ${count === 1 ? 'movimiento marcado' : 'movimientos marcados'} como leído.`);
  }
}
