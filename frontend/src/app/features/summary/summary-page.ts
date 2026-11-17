import { Component, computed, effect, inject, resource, signal } from '@angular/core';
import { CLOCK, toIsoDate } from '../../core/clock';
import { formatLongDate } from '../../core/dates';
import { Loadable, toLoadable } from '../../core/loadable';
import { FinanceApi } from '../../data/finance-api';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/ui/icon';
import { AccountsSectionComponent } from './accounts-section';
import { BalanceHeroComponent } from './balance-hero';
import { CategoryBreakdownComponent } from './category-breakdown';
import { MonthFlowComponent } from './month-flow';
import { RecentLedgerComponent } from './recent-ledger';
import { connectionNotices, firstOfMonth, noticeText } from './summary.logic';

/** Número de movimientos que se muestran en el Resumen. */
const RECENT_LIMIT = 8;

@Component({
  selector: 'of-summary-page',
  imports: [
    RouterLink,
    IconComponent,
    BalanceHeroComponent,
    MonthFlowComponent,
    AccountsSectionComponent,
    CategoryBreakdownComponent,
    RecentLedgerComponent,
  ],
  templateUrl: './summary-page.html',
  styleUrl: './summary-page.css',
})
export class SummaryPage {
  private readonly api = inject(FinanceApi);
  private readonly clock = inject(CLOCK);

  protected readonly now = signal(this.clock.now());
  protected readonly month = computed(() => firstOfMonth(this.now()));
  protected readonly todayLabel = computed(() => {
    const text = formatLongDate(toIsoDate(this.now()));
    return text.charAt(0).toLocaleUpperCase('es-ES') + text.slice(1);
  });

  // Cada bloque se carga por separado: si uno falla, el resto de la pantalla sigue siendo útil.
  private readonly accountsRes = resource({
    loader: ({ abortSignal }) => this.api.getAccounts(abortSignal),
  });
  private readonly summaryRes = resource({
    params: () => this.month(),
    loader: ({ params, abortSignal }) => this.api.getMonthSummary(params, abortSignal),
  });
  private readonly categoriesRes = resource({
    params: () => this.month(),
    loader: ({ params, abortSignal }) => this.api.getSpendingByCategory(params, abortSignal),
  });
  private readonly transactionsRes = resource({
    loader: ({ abortSignal }) => this.api.getRecentTransactions(RECENT_LIMIT, abortSignal),
  });

  protected readonly accounts = computed(() => toLoadable(this.accountsRes));
  protected readonly summary = computed(() => toLoadable(this.summaryRes));
  protected readonly categories = computed(() => toLoadable(this.categoriesRes));
  protected readonly transactions = computed(() => toLoadable(this.transactionsRes));

  /** Resumen de bancos que necesitan atención, para el aviso compacto bajo el saldo. */
  protected readonly attention = computed(() => {
    const notices = this.notices();
    if (notices.length === 0) {
      return null;
    }
    const severe = notices.some((n) => n.kind !== 'expiring');
    const text =
      notices.length === 1
        ? noticeText(notices[0])
        : `${notices.length} bancos necesitan tu atención. Revísalos en Mis cuentas.`;
    return { severe, text };
  });

  protected readonly notices = computed(() => {
    const a = this.accounts();
    return a.status === 'ready' ? connectionNotices(a.value.connections, this.now()) : [];
  });

  protected readonly busy = computed(
    () =>
      this.accountsRes.isLoading() ||
      this.summaryRes.isLoading() ||
      this.categoriesRes.isLoading() ||
      this.transactionsRes.isLoading(),
  );

  /** Mensaje para lectores de pantalla al terminar una actualización pedida por la persona. */
  protected readonly announcement = signal('');
  /** `requested` → (empieza a cargar) → `loading` → (termina) → anuncio. */
  private readonly refreshPhase = signal<'idle' | 'requested' | 'loading'>('idle');

  constructor() {
    effect(() => {
      const phase = this.refreshPhase();
      const busy = this.busy();
      if (phase === 'requested' && busy) {
        this.refreshPhase.set('loading');
      } else if (phase === 'loading' && !busy) {
        this.refreshPhase.set('idle');
        const failed = [this.accounts(), this.summary(), this.categories(), this.transactions()].some(
          (s) => s.status === 'error',
        );
        this.announcement.set(failed ? 'Actualización incompleta: algunos datos no se han podido cargar.' : 'Datos actualizados.');
      }
    });
  }

  protected refresh(): void {
    if (this.busy()) {
      return;
    }
    this.announcement.set('');
    this.now.set(this.clock.now());
    this.refreshPhase.set('requested');
    this.accountsRes.reload();
    this.summaryRes.reload();
    this.categoriesRes.reload();
    this.transactionsRes.reload();
  }

  /** `true` solo al recargar un bloque que ya tiene datos: se atenúa en lugar de vaciarse. */
  protected refreshing(state: Loadable<unknown>): true | null {
    return state.status === 'ready' && state.refreshing ? true : null;
  }

  protected reloadAccounts(): void {
    this.accountsRes.reload();
  }
  protected reloadSummary(): void {
    this.summaryRes.reload();
  }
  protected reloadCategories(): void {
    this.categoriesRes.reload();
  }
  protected reloadTransactions(): void {
    this.transactionsRes.reload();
  }
}
