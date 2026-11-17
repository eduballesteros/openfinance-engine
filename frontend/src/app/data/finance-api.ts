import { IsoDate } from '../core/clock';
import { AccountsOverview, CategoryBreakdown, MonthSummary, Transaction } from './models';

/**
 * Contrato único de acceso a datos financieros.
 *
 * Las pantallas solo dependen de esta clase abstracta. Hoy se resuelve con datos de ejemplo
 * (`SampleFinanceApi`); cuando el backend exponga sus endpoints, basta con implementar
 * `HttpFinanceApi` y cambiar `DATA_SOURCE` en `provide-finance-api.ts`.
 */
export abstract class FinanceApi {
  /** `true` si los datos no son reales; la interfaz lo indica de forma visible. */
  abstract readonly isSample: boolean;

  abstract getAccounts(signal?: AbortSignal): Promise<AccountsOverview>;

  /** `month` es el primer día del mes (`AAAA-MM-01`). */
  abstract getMonthSummary(month: IsoDate, signal?: AbortSignal): Promise<MonthSummary>;

  abstract getSpendingByCategory(month: IsoDate, signal?: AbortSignal): Promise<CategoryBreakdown>;

  /** Movimientos más recientes de todas las cuentas, del más nuevo al más antiguo. */
  abstract getRecentTransactions(limit: number, signal?: AbortSignal): Promise<readonly Transaction[]>;
}

/** Error de la capa de datos con un mensaje apto para mostrar a la persona usuaria. */
export class DataError extends Error {
  constructor(
    message: string,
    readonly kind: 'network' | 'server' | 'unavailable' = 'server',
  ) {
    super(message);
    this.name = 'DataError';
  }
}
