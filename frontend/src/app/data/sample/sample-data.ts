/**
 * ⚠️ DATOS DE EJEMPLO — no proceden de ningún banco ni del backend.
 * Las fechas se calculan a partir de "hoy" para que la interfaz siempre parezca actual.
 */
import { IsoDate, addDays, toIsoDate } from '../../core/clock';
import { eur } from '../../core/money';
import { AccountsOverview, CategoryBreakdown, MonthSummary, Transaction } from '../models';

export function sampleAccounts(today: Date): AccountsOverview {
  const at = (daysAgo: number, hour: number, minute: number) => {
    const d = addDays(today, -daysAgo);
    d.setHours(hour, minute);
    return d.toISOString();
  };
  const minutesAgo = (minutes: number) => new Date(today.getTime() - minutes * 60_000).toISOString();

  return {
    connections: [
      { id: 'cx-caixabank', bankName: 'CaixaBank', logoUrl: null, status: 'expiring', validUntil: toIsoDate(addDays(today, 6)), lastSyncedAt: minutesAgo(14) },
      { id: 'cx-ing', bankName: 'ING', logoUrl: null, status: 'active', validUntil: toIsoDate(addDays(today, 142)), lastSyncedAt: minutesAgo(14) },
      { id: 'cx-revolut', bankName: 'Revolut', logoUrl: null, status: 'error', validUntil: toIsoDate(addDays(today, 60)), lastSyncedAt: at(3, 9, 12) },
    ],
    accounts: [
      { id: 'ac-1', connectionId: 'cx-caixabank', bankName: 'CaixaBank', name: 'Cuenta nómina', lastDigits: '4821', kind: 'current', balance: eur(348_217), shared: false },
      { id: 'ac-2', connectionId: 'cx-caixabank', bankName: 'CaixaBank', name: 'Tarjeta de crédito', lastDigits: '0937', kind: 'card', balance: eur(-41_260), shared: false },
      { id: 'ac-3', connectionId: 'cx-ing', bankName: 'ING', name: 'Cuenta conjunta', lastDigits: '7702', kind: 'current', balance: eur(120_533), shared: true },
      { id: 'ac-4', connectionId: 'cx-ing', bankName: 'ING', name: 'Cuenta Naranja', lastDigits: '1150', kind: 'savings', balance: eur(1_264_000), shared: false },
      { id: 'ac-5', connectionId: 'cx-revolut', bankName: 'Revolut', name: 'Depósito ahorro', lastDigits: '3391', kind: 'savings', balance: null, shared: false },
    ],
  };
}

export function sampleMonthSummary(month: IsoDate): MonthSummary {
  return {
    month,
    current: { income: eur(289_000), expenses: eur(173_485) },
    previous: { income: eur(265_000), expenses: eur(191_240) },
  };
}

export function sampleCategoryBreakdown(month: IsoDate): CategoryBreakdown {
  return {
    month,
    items: [
      { categoryId: 'housing', name: 'Vivienda', amount: eur(85_000) },
      { categoryId: 'groceries', name: 'Supermercado', amount: eur(31_248) },
      { categoryId: 'eating-out', name: 'Restaurantes', amount: eur(14_690) },
      { categoryId: 'transport', name: 'Transporte', amount: eur(9_835) },
      { categoryId: 'subscriptions', name: 'Suscripciones', amount: eur(5_297) },
      { categoryId: null, name: 'Sin categoría', amount: eur(27_415) },
    ],
  };
}

export function sampleTransactions(today: Date): Transaction[] {
  const day = (daysAgo: number) => toIsoDate(addDays(today, -daysAgo));
  const tx = (
    id: string,
    daysAgo: number,
    description: string,
    minor: number,
    categoryName: string | null,
    accountId: string,
    accountName: string,
    status: Transaction['status'] = 'booked',
  ): Transaction => ({
    id,
    accountId,
    accountName,
    bookingDate: day(daysAgo),
    // El banco lo comparte unas horas después de la operación.
    importedAt: new Date(today.getTime() - (daysAgo * 24 + 2) * 3_600_000).toISOString(),
    description,
    amount: eur(minor),
    categoryName,
    status,
  });

  return [
    tx('tx-01', 0, 'Mercadona', -6_432, 'Supermercado', 'ac-3', 'Cuenta conjunta', 'pending'),
    tx('tx-02', 0, 'Bizum recibido', 4_000, 'Ingresos', 'ac-1', 'Cuenta nómina'),
    tx('tx-03', 1, 'Renfe Cercanías', -1_240, 'Transporte', 'ac-2', 'Tarjeta de crédito'),
    tx('tx-04', 1, 'Spotify', -1_099, 'Suscripciones', 'ac-2', 'Tarjeta de crédito'),
    tx('tx-05', 2, 'Bar La Esquina', -2_350, 'Restaurantes', 'ac-2', 'Tarjeta de crédito'),
    tx('tx-10', 2, 'Comisión de mantenimiento', 0, 'Comisiones', 'ac-1', 'Cuenta nómina'),
    tx('tx-06', 2, 'Devolución Amazon', 2_999, null, 'ac-2', 'Tarjeta de crédito'),
    tx('tx-07', 4, 'Alquiler', -85_000, 'Vivienda', 'ac-3', 'Cuenta conjunta'),
    tx('tx-08', 4, 'Traspaso a Cuenta Naranja', -20_000, null, 'ac-1', 'Cuenta nómina'),
    tx('tx-09', 5, 'Nómina', 265_000, 'Ingresos', 'ac-1', 'Cuenta nómina'),
    tx('tx-11', 6, 'Farmacia', -1_845, 'Salud', 'ac-3', 'Cuenta conjunta'),
  ];
}
