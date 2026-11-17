import { IsoDate, IsoDateTime } from '../core/clock';
import { Money } from '../core/money';

/** Modelos de dominio que consume la interfaz. Son independientes del formato del backend. */

export type ConnectionStatus = 'active' | 'expiring' | 'expired' | 'error';

/** Conexión con un banco a través de Enable Banking (permiso PSD2 con caducidad). */
export interface BankConnection {
  readonly id: string;
  readonly bankName: string;
  /**
   * Logotipo oficial de la entidad, tal y como lo publica Enable Banking en su catálogo de ASPSP
   * (campo `logo`). `null` si no hay: la interfaz muestra un monograma.
   */
  readonly logoUrl: string | null;
  readonly status: ConnectionStatus;
  /** Último día en que el permiso de acceso es válido. */
  readonly validUntil: IsoDate;
  /** `null` si nunca se ha sincronizado. */
  readonly lastSyncedAt: IsoDateTime | null;
}

export type AccountKind = 'current' | 'savings' | 'card';

export interface Account {
  readonly id: string;
  readonly connectionId: string;
  readonly bankName: string;
  readonly name: string;
  /** Últimos cuatro dígitos del IBAN o de la tarjeta. */
  readonly lastDigits: string;
  readonly kind: AccountKind;
  /** `null` cuando el banco no ha informado del saldo (distinto de un saldo de 0,00 €). */
  readonly balance: Money | null;
  /** Cuenta compartida entre varias personas usuarias (p. ej. cuenta conjunta). */
  readonly shared: boolean;
}

export interface AccountsOverview {
  readonly accounts: readonly Account[];
  readonly connections: readonly BankConnection[];
}

export interface MonthTotals {
  /** Entradas del mes, en positivo. */
  readonly income: Money;
  /** Salidas del mes, en positivo. */
  readonly expenses: Money;
}

export interface MonthSummary {
  /** Primer día del mes resumido. */
  readonly month: IsoDate;
  readonly current: MonthTotals;
  /** Mismo periodo del mes anterior; `null` si no hay histórico suficiente. */
  readonly previous: MonthTotals | null;
}

export interface CategorySpend {
  /** `null` = movimientos sin categoría. */
  readonly categoryId: string | null;
  readonly name: string;
  /** Gasto en positivo. */
  readonly amount: Money;
}

export interface CategoryBreakdown {
  readonly month: IsoDate;
  readonly items: readonly CategorySpend[];
}

export type TransactionStatus = 'booked' | 'pending';

export interface Transaction {
  readonly id: string;
  readonly accountId: string;
  readonly accountName: string;
  readonly bookingDate: IsoDate;
  /** Momento en que OpenFinance recibió el movimiento del banco: decide qué es «nuevo desde tu última visita». */
  readonly importedAt: IsoDateTime;
  readonly description: string;
  /** Negativo = gasto o salida; positivo = ingreso o entrada. */
  readonly amount: Money;
  readonly categoryName: string | null;
  readonly status: TransactionStatus;
}
