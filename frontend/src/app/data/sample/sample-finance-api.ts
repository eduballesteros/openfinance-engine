import { IsoDate } from '../../core/clock';
import { Clock } from '../../core/clock';
import { eur } from '../../core/money';
import { DataError, FinanceApi } from '../finance-api';
import { AccountsOverview, CategoryBreakdown, MonthSummary, Transaction } from '../models';
import { sampleAccounts, sampleCategoryBreakdown, sampleMonthSummary, sampleTransactions } from './sample-data';

/**
 * Escenarios para revisar los estados de la interfaz sin backend.
 * Se eligen con `?escenario=` en la URL (solo con datos de ejemplo).
 */
export type SampleScenario = 'normal' | 'vacio' | 'error' | 'parcial' | 'lento';

export function scenarioFromUrl(search: string): SampleScenario {
  const value = new URLSearchParams(search).get('escenario');
  const known: readonly SampleScenario[] = ['normal', 'vacio', 'error', 'parcial', 'lento'];
  return known.includes(value as SampleScenario) ? (value as SampleScenario) : 'normal';
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const id = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(id);
      reject(signal.reason);
    }, { once: true });
  });
}

export class SampleFinanceApi extends FinanceApi {
  readonly isSample = true;

  constructor(
    private readonly clock: Clock,
    private readonly scenario: SampleScenario = 'normal',
    private readonly latencyMs = 450,
  ) {
    super();
  }

  async getAccounts(signal?: AbortSignal): Promise<AccountsOverview> {
    await this.simulate(signal);
    if (this.scenario === 'vacio') {
      return { accounts: [], connections: [] };
    }
    return sampleAccounts(this.clock.now());
  }

  async getMonthSummary(month: IsoDate, signal?: AbortSignal): Promise<MonthSummary> {
    await this.simulate(signal);
    if (this.scenario === 'vacio') {
      return { month, current: { income: eur(0), expenses: eur(0) }, previous: null };
    }
    return sampleMonthSummary(month);
  }

  async getSpendingByCategory(month: IsoDate, signal?: AbortSignal): Promise<CategoryBreakdown> {
    await this.simulate(signal, this.scenario === 'parcial');
    if (this.scenario === 'vacio') {
      return { month, items: [] };
    }
    return sampleCategoryBreakdown(month);
  }

  async getRecentTransactions(limit: number, signal?: AbortSignal): Promise<readonly Transaction[]> {
    await this.simulate(signal);
    if (this.scenario === 'vacio') {
      return [];
    }
    return sampleTransactions(this.clock.now()).slice(0, limit);
  }

  private async simulate(signal?: AbortSignal, fail = false): Promise<void> {
    const wait = this.scenario === 'lento' ? this.latencyMs * 6 : this.latencyMs;
    await delay(wait, signal);
    if (this.scenario === 'error' || fail) {
      throw new DataError('No hemos podido conectar con el servidor.', 'network');
    }
  }
}
