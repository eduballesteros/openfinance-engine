import { IsoDate, toIsoDate } from '../../core/clock';
import { daysUntil } from '../../core/dates';
import { Money, eur, relativeChange, sumMoney } from '../../core/money';
import { Account, BankConnection, CategorySpend, MonthSummary, Transaction } from '../../data/models';

/** Lógica pura de la pantalla Resumen: sin Angular, fácil de probar. */

export function firstOfMonth(today: Date): IsoDate {
  return toIsoDate(new Date(today.getFullYear(), today.getMonth(), 1));
}

export interface BalanceTotal {
  /** Suma de los saldos conocidos. */
  readonly total: Money;
  readonly accountCount: number;
  readonly bankCount: number;
  /** Cuentas cuyo saldo no se conoce y por tanto no están en el total. */
  readonly missing: readonly Account[];
}

export function balanceTotal(accounts: readonly Account[]): BalanceTotal {
  const known = accounts.filter((a) => a.balance !== null);
  return {
    total: sumMoney(known.map((a) => a.balance as Money)),
    accountCount: accounts.length,
    bankCount: new Set(accounts.map((a) => a.bankName)).size,
    missing: accounts.filter((a) => a.balance === null),
  };
}

/** Días antes de la caducidad a partir de los cuales avisamos de renovar el acceso. */
export const RENEWAL_WARNING_DAYS = 14;

export type NoticeKind = 'expired' | 'error' | 'expiring';

export interface ConnectionNotice {
  readonly connectionId: string;
  readonly bankName: string;
  readonly kind: NoticeKind;
  /** Días restantes (solo para `expiring`). */
  readonly days: number;
}

export function connectionNotices(connections: readonly BankConnection[], today: Date): ConnectionNotice[] {
  const order: Record<NoticeKind, number> = { expired: 0, error: 1, expiring: 2 };
  return connections
    .map((c): ConnectionNotice | null => {
      const days = daysUntil(c.validUntil, today);
      if (c.status === 'expired' || days < 0) {
        return { connectionId: c.id, bankName: c.bankName, kind: 'expired', days };
      }
      if (c.status === 'error') {
        return { connectionId: c.id, bankName: c.bankName, kind: 'error', days };
      }
      if (c.status === 'expiring' || days <= RENEWAL_WARNING_DAYS) {
        return { connectionId: c.id, bankName: c.bankName, kind: 'expiring', days };
      }
      return null;
    })
    .filter((n): n is ConnectionNotice => n !== null)
    .sort((a, b) => order[a.kind] - order[b.kind] || a.days - b.days);
}

export function noticeText(notice: ConnectionNotice): string {
  switch (notice.kind) {
    case 'expired':
      return `El acceso a ${notice.bankName} ha caducado. Sus cuentas no se actualizan.`;
    case 'error':
      return `No hemos podido sincronizar ${notice.bankName}. Sus saldos pueden no estar al día.`;
    case 'expiring':
      return notice.days === 0
        ? `El acceso a ${notice.bankName} caduca hoy.`
        : `El acceso a ${notice.bankName} caduca en ${notice.days} ${notice.days === 1 ? 'día' : 'días'}.`;
  }
}

export type BankHealth = 'ok' | NoticeKind;

export interface BankGroup {
  readonly connectionId: string;
  readonly bankName: string;
  readonly logoUrl: string | null;
  readonly health: BankHealth;
  /** Texto corto de estado para la cabecera del banco. */
  readonly status: string;
  /** Acción recomendada, si la hay. */
  readonly action: 'Renovar' | 'Revisar' | null;
  readonly accounts: readonly Account[];
}

/**
 * Agrupa las cuentas por conexión bancaria, con el estado de cada conexión junto a sus cuentas.
 * Los bancos que necesitan atención van primero; dentro de cada grupo se respeta el orden recibido.
 */
export function groupAccountsByBank(
  accounts: readonly Account[],
  connections: readonly BankConnection[],
  today: Date,
): BankGroup[] {
  const notices = new Map(connectionNotices(connections, today).map((n) => [n.connectionId, n]));
  const order: Record<BankHealth, number> = { expired: 0, error: 1, expiring: 2, ok: 3 };

  const groups = connections
    .map((c): BankGroup => {
      const notice = notices.get(c.id);
      const health: BankHealth = notice?.kind ?? 'ok';
      return {
        connectionId: c.id,
        bankName: c.bankName,
        logoUrl: c.logoUrl,
        health,
        status: bankStatus(health, notice?.days ?? 0),
        action: health === 'ok' ? null : health === 'error' ? 'Revisar' : 'Renovar',
        accounts: accounts.filter((a) => a.connectionId === c.id),
      };
    })
    .filter((g) => g.accounts.length > 0);

  // Cuentas cuya conexión no ha llegado: se muestran igualmente, sin estado.
  const known = new Set(connections.map((c) => c.id));
  const orphans = accounts.filter((a) => !known.has(a.connectionId));
  for (const bankName of new Set(orphans.map((a) => a.bankName))) {
    groups.push({
      connectionId: `sin-conexion-${bankName}`,
      bankName,
      logoUrl: null,
      health: 'ok',
      status: '',
      action: null,
      accounts: orphans.filter((a) => a.bankName === bankName),
    });
  }

  return groups.sort((a, b) => order[a.health] - order[b.health]);
}

function bankStatus(health: BankHealth, days: number): string {
  switch (health) {
    case 'expired':
      return 'Acceso caducado';
    case 'error':
      return 'Sin sincronizar';
    case 'expiring':
      return days === 0 ? 'Caduca hoy' : `Caduca en ${days} ${days === 1 ? 'día' : 'días'}`;
    case 'ok':
      return 'Al día';
  }
}

export interface DayGroup {
  readonly date: IsoDate;
  readonly items: readonly Transaction[];
}

/** Agrupa por día conservando el orden recibido (del más reciente al más antiguo). */
export function groupByDay(transactions: readonly Transaction[]): DayGroup[] {
  const groups: { date: IsoDate; items: Transaction[] }[] = [];
  for (const tx of transactions) {
    const last = groups.at(-1);
    if (last && last.date === tx.bookingDate) {
      last.items.push(tx);
    } else {
      groups.push({ date: tx.bookingDate, items: [tx] });
    }
  }
  return groups;
}

export interface CategoryShare extends CategorySpend {
  readonly ratio: number;
  /** Ranura de color 1–6; "Sin categoría" siempre usa la neutra (6). */
  readonly colorSlot: number;
}

export interface CategoryShares {
  readonly total: Money;
  readonly items: readonly CategoryShare[];
}

/** Ordena de mayor a menor gasto, deja "Sin categoría" al final y agrupa a partir de la 6.ª en "Otras". */
export function categoryShares(items: readonly CategorySpend[], maxSlices = 5): CategoryShares {
  const positive = items.filter((i) => i.amount.minor > 0);
  const total = sumMoney(positive.map((i) => i.amount));
  const named = positive.filter((i) => i.categoryId !== null).sort((a, b) => b.amount.minor - a.amount.minor);
  const uncategorized = positive.filter((i) => i.categoryId === null);

  const head = named.slice(0, maxSlices);
  const tail = named.slice(maxSlices);
  const rest: CategorySpend[] = [...uncategorized];
  if (tail.length > 0) {
    rest.unshift({ categoryId: '__others', name: 'Otras categorías', amount: sumMoney(tail.map((i) => i.amount)) });
  }
  const restTotal = sumMoney(rest.map((i) => i.amount));
  const merged: CategorySpend[] =
    rest.length > 1 ? [{ categoryId: null, name: 'Otras y sin categoría', amount: restTotal }] : rest;

  const shares = [...head, ...merged].map((item, index) => ({
    ...item,
    ratio: total.minor === 0 ? 0 : item.amount.minor / total.minor,
    colorSlot: index < head.length ? index + 1 : 6,
  }));
  return { total, items: shares };
}

export interface MonthFlow {
  readonly income: Money;
  readonly expenses: Money;
  readonly net: Money;
  /** Variación relativa respecto al mes anterior; `null` si no hay con qué comparar. */
  readonly incomeChange: number | null;
  readonly expensesChange: number | null;
  /** Parte de lo ingresado que ya se ha gastado (puede superar 1); `null` si no hubo ingresos. */
  readonly spentRatio: number | null;
}

export function monthFlow(summary: MonthSummary): MonthFlow {
  const { income, expenses } = summary.current;
  return {
    income,
    expenses,
    net: eur(income.minor - expenses.minor),
    incomeChange: summary.previous ? relativeChange(income.minor, summary.previous.income.minor) : null,
    expensesChange: summary.previous ? relativeChange(expenses.minor, summary.previous.expenses.minor) : null,
    spentRatio: income.minor > 0 ? expenses.minor / income.minor : null,
  };
}
