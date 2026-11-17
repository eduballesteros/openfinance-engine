import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loadable } from '../../core/loadable';
import { Account, AccountKind, AccountsOverview } from '../../data/models';
import { BlockEmptyComponent, BlockErrorComponent, SkeletonComponent } from '../../shared/ui/block-state';
import { IconComponent, IconName } from '../../shared/ui/icon';
import { BankMarkComponent } from '../../shared/ui/bank-mark';
import { MoneyComponent } from '../../shared/ui/money';
import { BankHealth, groupAccountsByBank } from './summary.logic';

const KIND_LABEL: Record<AccountKind, string> = {
  current: 'Cuenta corriente',
  savings: 'Ahorro',
  card: 'Tarjeta',
};

const KIND_ICON: Record<AccountKind, IconName> = {
  current: 'account-current',
  savings: 'account-savings',
  card: 'account-card',
};

const HEALTH_CHIP: Record<BankHealth, string> = {
  ok: 'chip--ok',
  expiring: 'chip--caution',
  expired: 'chip--danger',
  error: 'chip--danger',
};

const HEALTH_ICON: Record<BankHealth, IconName> = {
  ok: 'ok',
  expiring: 'alert',
  expired: 'error',
  error: 'error',
};

/** Productos agrupados por banco, con el estado de cada conexión y su acción junto a sus cuentas. */
@Component({
  selector: 'of-accounts-section',
  imports: [
    MoneyComponent,
    SkeletonComponent,
    BlockErrorComponent,
    BlockEmptyComponent,
    IconComponent,
    RouterLink,
    BankMarkComponent,
  ],
  template: `
    <div class="head">
      <h2 id="accounts-title">Mis cuentas</h2>
      @if (groups().length > 0) {
        <a routerLink="/cuentas" class="link-arrow">Gestionar<span class="visually-hidden">&nbsp;cuentas</span></a>
      }
    </div>
    @switch (state().status) {
      @case ('loading') {
        <of-skeleton [rows]="4" label="Cargando cuentas…" />
      }
      @case ('error') {
        <of-block-error title="No hemos podido cargar tus cuentas." subject="cuentas" (retry)="retry.emit()" />
      }
      @case ('ready') {
        @if (groups().length === 0) {
          <of-block-empty
            title="Aún no has conectado ningún banco"
            detail="Conecta tu banco para ver aquí tus cuentas, saldos y movimientos. El acceso es de solo lectura."
          >
            <a routerLink="/cuentas" class="btn btn--primary"><of-icon name="link" />Conectar un banco</a>
          </of-block-empty>
        } @else {
          <div class="banks reveal">
            @for (group of groups(); track group.connectionId) {
              <section class="bank">
                <div class="bank-head">
                  <of-bank-mark [name]="group.bankName" [logoUrl]="group.logoUrl" />
                  <div class="bank-title">
                    <h3 [id]="'bank-' + group.connectionId">{{ group.bankName }}</h3>
                    @if (group.status) {
                      <span [class]="'chip ' + chip(group.health)">
                        <of-icon [name]="healthIcon(group.health)" />{{ group.status }}
                      </span>
                    }
                  </div>
                  @if (group.action) {
                    <a routerLink="/cuentas" class="btn bank-action">
                      {{ group.action }}<span class="visually-hidden">&nbsp;acceso a {{ group.bankName }}</span>
                    </a>
                  }
                </div>
                <ul role="list" [attr.aria-labelledby]="'bank-' + group.connectionId">
                  @for (account of group.accounts; track account.id) {
                    <li>
                      <span class="icon-badge" aria-hidden="true"><of-icon [name]="kindIcon(account)" /></span>
                      <span class="who">
                        <span class="name">{{ account.name }}</span>
                        <span class="meta">
                          <span>
                            {{ kindLabel(account) }}
                            <span class="visually-hidden">terminada en</span><span aria-hidden="true">··</span>{{ account.lastDigits }}
                          </span>
                          @if (account.shared) {
                            <span class="chip chip--info"><of-icon name="shared" />Compartida</span>
                          }
                        </span>
                      </span>
                      <span class="balance">
                        <!-- En una tarjeta el saldo negativo es crédito dispuesto, no un descubierto: sin rojo. -->
                        <of-money [value]="account.balance" [tone]="account.kind === 'card' ? 'plain' : 'balance'" />
                        @if (account.balance === null) {
                          <span class="hint">Saldo no disponible</span>
                        }
                      </span>
                    </li>
                  }
                </ul>
              </section>
            }
          </div>
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
      align-items: center;
      justify-content: space-between;
    }
    h2 {
      font-size: var(--text-lg);
    }
    .banks {
      display: grid;
      gap: var(--s-3);
    }
    /* Un solo contenedor (la tarjeta «Mis cuentas»): los bancos se separan con una línea, no con cajas */
    .bank + .bank {
      padding-block-start: var(--s-3);
      border-block-start: 1px solid var(--rule-strong);
    }
    .bank-head {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--s-3);
      padding-block: var(--s-1) var(--s-2);
    }
    .bank-title {
      display: grid;
      justify-items: start;
      gap: 2px;
    }
    h3 {
      font-size: var(--text-md);
      font-weight: 700;
    }
    .bank-action {
      min-block-size: 2.25rem;
      padding-inline: var(--s-3);
    }
    ul {
      margin: 0;
    }
    li {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--s-3);
      min-block-size: 3.75rem;
      padding-block: var(--s-2);
    }
    li:not(:last-child) {
      border-block-end: 1px solid var(--rule);
    }
    .who {
      display: grid;
      min-inline-size: 0;
    }
    .name {
      font-weight: 600;
      overflow-wrap: anywhere;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--s-1) var(--s-2);
      font-size: var(--text-sm);
      color: var(--ink-faint);
    }
    .balance {
      display: grid;
      justify-items: end;
      font-weight: 700;
    }
    @container (width < 18rem) {
      .bank-head { grid-template-columns: auto minmax(0, 1fr); }
      .bank-title { min-inline-size: 0; }
      .bank-title .chip { white-space: normal; }
      .bank-action {
        grid-column: 2;
        justify-self: start;
      }
    }
    .hint {
      font-size: var(--text-xs);
      font-weight: 400;
      color: var(--ink-faint);
    }
  `,
})
export class AccountsSectionComponent {
  readonly state = input.required<Loadable<AccountsOverview>>();
  readonly today = input.required<Date>();
  readonly retry = output<void>();

  protected readonly groups = computed(() => {
    const s = this.state();
    return s.status === 'ready' ? groupAccountsByBank(s.value.accounts, s.value.connections, this.today()) : [];
  });

  protected chip(health: BankHealth): string {
    return HEALTH_CHIP[health];
  }

  protected healthIcon(health: BankHealth): IconName {
    return HEALTH_ICON[health];
  }

  protected kindIcon(account: Account): IconName {
    return KIND_ICON[account.kind];
  }

  protected kindLabel(account: Account): string {
    return KIND_LABEL[account.kind];
  }
}
