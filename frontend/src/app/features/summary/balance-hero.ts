import { Component, computed, input, output } from '@angular/core';
import { formatRelativeTime } from '../../core/dates';
import { Loadable } from '../../core/loadable';
import { AccountsOverview } from '../../data/models';
import { BlockErrorComponent, SkeletonComponent } from '../../shared/ui/block-state';
import { MoneyComponent } from '../../shared/ui/money';
import { balanceTotal } from './summary.logic';

/** Segmento principal de la tarjeta: el saldo total, la cifra que se lee primero. */
@Component({
  selector: 'of-balance-hero',
  imports: [MoneyComponent, SkeletonComponent, BlockErrorComponent],
  template: `
    <h2 class="label">Saldo total</h2>
    @switch (state().status) {
      @case ('loading') {
        <div class="figure figure--loading" aria-hidden="true"></div>
        <of-skeleton [rows]="1" [trailing]="false" label="Cargando saldo total…" />
      }
      @case ('error') {
        <of-block-error title="No hemos podido calcular tu saldo total." subject="saldo total" (retry)="retry.emit()" />
      }
      @case ('ready') {
        @if (total(); as t) {
          @if (t.accountCount === 0) {
            <!-- Sin cuentas no hay total: ni cero ni guion, solo el siguiente paso. -->
            <p class="meta">Conecta un banco para ver aquí tu saldo total.</p>
          } @else {
            <p class="figure reveal" aria-describedby="balance-meta">
              <of-money [value]="t.total" tone="balance" [emphasis]="true" />
            </p>
            <p class="meta" id="balance-meta">
              {{ t.accountCount }} {{ t.accountCount === 1 ? 'cuenta' : 'cuentas' }} en {{ t.bankCount }}
              {{ t.bankCount === 1 ? 'banco' : 'bancos' }}
            </p>
            @if (syncedAgo(); as ago) {
              <p class="meta">Datos bancarios de {{ ago }}</p>
            }
            @if (t.missing.length > 0) {
              <p class="meta">No incluye {{ missingNames() }}: el banco no ha informado del saldo.</p>
            }
          }
        }
      }
    }
  `,
  styles: `
    :host {
      display: grid;
      align-content: start;
      gap: var(--s-2);
    }
    /* La cifra principal de la posición global */
    .figure {
      justify-self: start;
      font-family: var(--font-display);
      font-size: var(--text-hero);
      font-weight: 700;
      letter-spacing: -0.025em;
      line-height: 1.05;
      margin-block: var(--s-1);
    }
    .figure--loading {
      inline-size: 16rem;
      block-size: 3.5rem;
      border-radius: var(--radius-sm);
      background: var(--paper-sunk);
    }
    .meta {
      font-size: var(--text-sm);
      color: var(--ink-faint);
      max-inline-size: 46ch;
    }
  `,
})
export class BalanceHeroComponent {
  readonly state = input.required<Loadable<AccountsOverview>>();
  readonly now = input.required<Date>();
  readonly retry = output<void>();

  protected readonly total = computed(() => {
    const s = this.state();
    return s.status === 'ready' ? balanceTotal(s.value.accounts) : null;
  });

  protected readonly missingNames = computed(() =>
    (this.total()?.missing ?? []).map((a) => `${a.name} (${a.bankName})`).join(', '),
  );

  /** Sincronización bancaria más reciente entre todas las conexiones. */
  protected readonly syncedAgo = computed(() => {
    const s = this.state();
    if (s.status !== 'ready') {
      return null;
    }
    const latest = s.value.connections
      .map((c) => c.lastSyncedAt)
      .filter((d): d is string => d !== null)
      .sort()
      .at(-1);
    // Espacios de no separación: «hace 14 minutos» nunca se parte entre líneas.
    return latest ? formatRelativeTime(latest, this.now()).replace(/ /g, '\u00a0') : null;
  });
}
