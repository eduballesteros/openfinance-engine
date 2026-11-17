import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IsoDate } from '../../core/clock';
import { CurrencyCode, Money, minorFromDecimalString } from '../../core/money';
import { DataError, FinanceApi } from '../finance-api';
import {
  Account,
  AccountsOverview,
  BankConnection,
  CategoryBreakdown,
  MonthSummary,
  MonthTotals,
  Transaction,
} from '../models';

/*
 * Implementación contra el backend Spring.
 *
 * ⚠️ CONTRATO PROPUESTO: el backend aún no expone estos endpoints. Las rutas y los DTO
 * de abajo son la propuesta del frontend; ajústalos aquí cuando existan los controladores.
 * Los importes viajan como texto decimal (BigDecimal serializado) para no perder precisión.
 */

interface MoneyDto {
  amount: string;
  currency: CurrencyCode;
}

type AccountDto = Omit<Account, 'balance'> & { balance: MoneyDto | null };
type TransactionDto = Omit<Transaction, 'amount'> & { amount: MoneyDto };
interface MonthTotalsDto {
  income: MoneyDto;
  expenses: MoneyDto;
}

const API = '/api/v1';

function money(dto: MoneyDto): Money {
  return { minor: minorFromDecimalString(dto.amount), currency: dto.currency };
}

function totals(dto: MonthTotalsDto): MonthTotals {
  return { income: money(dto.income), expenses: money(dto.expenses) };
}

/** `2026-11-01` → `2026-11` */
function monthParam(month: IsoDate): string {
  return month.slice(0, 7);
}

export class HttpFinanceApi extends FinanceApi {
  readonly isSample = false;
  private readonly http = inject(HttpClient);

  async getAccounts(signal?: AbortSignal): Promise<AccountsOverview> {
    const dto = await this.request(
      this.http.get<{ accounts: AccountDto[]; connections: BankConnection[] }>(`${API}/accounts`),
      signal,
    );
    return {
      connections: dto.connections,
      accounts: dto.accounts.map((a) => ({ ...a, balance: a.balance ? money(a.balance) : null })),
    };
  }

  async getMonthSummary(month: IsoDate, signal?: AbortSignal): Promise<MonthSummary> {
    const params = new HttpParams().set('month', monthParam(month));
    const dto = await this.request(
      this.http.get<{ month: IsoDate; current: MonthTotalsDto; previous: MonthTotalsDto | null }>(
        `${API}/analytics/monthly-summary`,
        { params },
      ),
      signal,
    );
    return { month: dto.month, current: totals(dto.current), previous: dto.previous ? totals(dto.previous) : null };
  }

  async getSpendingByCategory(month: IsoDate, signal?: AbortSignal): Promise<CategoryBreakdown> {
    const params = new HttpParams().set('month', monthParam(month));
    const dto = await this.request(
      this.http.get<{ month: IsoDate; items: { categoryId: string | null; name: string; amount: MoneyDto }[] }>(
        `${API}/analytics/spending-by-category`,
        { params },
      ),
      signal,
    );
    return { month: dto.month, items: dto.items.map((i) => ({ ...i, amount: money(i.amount) })) };
  }

  async getRecentTransactions(limit: number, signal?: AbortSignal): Promise<readonly Transaction[]> {
    const params = new HttpParams().set('limit', limit).set('sort', 'bookingDate,desc');
    const dto = await this.request(this.http.get<{ items: TransactionDto[] }>(`${API}/transactions`, { params }), signal);
    return dto.items.map((t) => ({ ...t, amount: money(t.amount) }));
  }

  private async request<T>(source: Observable<T>, signal?: AbortSignal): Promise<T> {
    try {
      // Cancelar la petición si la pantalla deja de necesitarla.
      return await new Promise<T>((resolve, reject) => {
        const sub = source.subscribe({ next: resolve, error: reject });
        signal?.addEventListener('abort', () => {
          sub.unsubscribe();
          reject(signal.reason);
        }, { once: true });
      });
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw error.status === 0
          ? new DataError('No hemos podido conectar con el servidor.', 'network')
          : new DataError('El servidor no ha podido responder. Inténtalo de nuevo en unos minutos.', 'server');
      }
      throw error;
    }
  }
}
