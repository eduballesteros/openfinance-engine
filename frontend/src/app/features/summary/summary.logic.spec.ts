import { eur } from '../../core/money';
import { Account, BankConnection, Transaction } from '../../data/models';
import {
  balanceTotal,
  categoryShares,
  connectionNotices,
  firstOfMonth,
  groupAccountsByBank,
  groupByDay,
  monthFlow,
  noticeText,
} from './summary.logic';

const today = new Date(2026, 10, 17);

const account = (over: Partial<Account>): Account => ({
  id: 'a',
  connectionId: 'c',
  bankName: 'Banco',
  name: 'Cuenta',
  lastDigits: '0000',
  kind: 'current',
  balance: eur(0),
  shared: false,
  ...over,
});

const connection = (over: Partial<BankConnection>): BankConnection => ({
  id: 'c',
  bankName: 'Banco',
  logoUrl: null,
  status: 'active',
  validUntil: '2027-03-01',
  lastSyncedAt: null,
  ...over,
});

describe('balanceTotal', () => {
  it('suma los saldos conocidos y separa las cuentas sin saldo (dato ausente ≠ cero)', () => {
    const result = balanceTotal([
      account({ id: '1', bankName: 'A', balance: eur(10_000) }),
      account({ id: '2', bankName: 'A', balance: eur(-2_500) }),
      account({ id: '3', bankName: 'B', balance: eur(0) }),
      account({ id: '4', bankName: 'C', balance: null }),
    ]);
    expect(result.total.minor).toBe(7_500);
    expect(result.accountCount).toBe(4);
    expect(result.bankCount).toBe(3);
    expect(result.missing.map((a) => a.id)).toEqual(['4']);
  });
});

describe('connectionNotices', () => {
  it('avisa de caducidad próxima, caducidad y errores, por orden de gravedad', () => {
    const notices = connectionNotices(
      [
        connection({ id: 'ok', validUntil: '2027-04-01' }),
        connection({ id: 'soon', bankName: 'BBVA', validUntil: '2026-11-23' }),
        connection({ id: 'gone', bankName: 'ING', validUntil: '2026-11-10' }),
        connection({ id: 'err', bankName: 'Openbank', status: 'error' }),
      ],
      today,
    );
    expect(notices.map((n) => n.connectionId)).toEqual(['gone', 'err', 'soon']);
    expect(noticeText(notices[2])).toBe('El acceso a BBVA caduca en 6 días.');
  });

  it('usa el singular y el caso "hoy"', () => {
    const [oneDay] = connectionNotices([connection({ bankName: 'X', validUntil: '2026-11-18' })], today);
    const [sameDay] = connectionNotices([connection({ bankName: 'X', validUntil: '2026-11-17' })], today);
    expect(noticeText(oneDay)).toBe('El acceso a X caduca en 1 día.');
    expect(noticeText(sameDay)).toBe('El acceso a X caduca hoy.');
  });
});

describe('groupAccountsByBank', () => {
  it('agrupa por conexión, pone primero los bancos con problemas y omite conexiones sin cuentas', () => {
    const groups = groupAccountsByBank(
      [
        account({ id: '1', connectionId: 'ok', bankName: 'ING' }),
        account({ id: '2', connectionId: 'soon', bankName: 'BBVA' }),
        account({ id: '3', connectionId: 'soon', bankName: 'BBVA' }),
      ],
      [
        connection({ id: 'ok', bankName: 'ING', validUntil: '2027-04-01' }),
        connection({ id: 'soon', bankName: 'BBVA', validUntil: '2026-11-23' }),
        connection({ id: 'empty', bankName: 'Otro' }),
      ],
      today,
    );
    expect(groups.map((g) => [g.bankName, g.health, g.accounts.length, g.action])).toEqual([
      ['BBVA', 'expiring', 2, 'Renovar'],
      ['ING', 'ok', 1, null],
    ]);
    expect(groups[0].status).toBe('Caduca en 6 días');
  });

  it('no pierde cuentas cuya conexión no ha llegado', () => {
    const groups = groupAccountsByBank([account({ id: '1', connectionId: 'x', bankName: 'Banco X' })], [], today);
    expect(groups).toHaveLength(1);
    expect(groups[0].accounts[0].id).toBe('1');
  });
});

describe('groupByDay', () => {
  it('agrupa movimientos consecutivos del mismo día manteniendo el orden', () => {
    const tx = (id: string, bookingDate: string) => ({ id, bookingDate }) as Transaction;
    const groups = groupByDay([tx('1', '2026-11-17'), tx('2', '2026-11-17'), tx('3', '2026-11-15')]);
    expect(groups.map((g) => [g.date, g.items.length])).toEqual([
      ['2026-11-17', 2],
      ['2026-11-15', 1],
    ]);
  });
});

describe('categoryShares', () => {
  it('ordena por importe, deja "Sin categoría" al final con el color neutro y calcula proporciones', () => {
    const { total, items } = categoryShares([
      { categoryId: null, name: 'Sin categoría', amount: eur(1_000) },
      { categoryId: 'a', name: 'A', amount: eur(1_000) },
      { categoryId: 'b', name: 'B', amount: eur(3_000) },
      { categoryId: 'z', name: 'Cero', amount: eur(0) },
    ]);
    expect(total.minor).toBe(5_000);
    expect(items.map((i) => i.name)).toEqual(['B', 'A', 'Sin categoría']);
    expect(items.map((i) => i.colorSlot)).toEqual([1, 2, 6]);
    expect(items[0].ratio).toBeCloseTo(0.6);
  });

  it('agrupa el exceso de categorías para no superar seis colores', () => {
    const many = Array.from({ length: 8 }, (_, i) => ({ categoryId: `c${i}`, name: `C${i}`, amount: eur(800 - i * 10) }));
    const { items } = categoryShares(many);
    expect(items).toHaveLength(6);
    expect(items.at(-1)?.name).toBe('Otras categorías');
  });
});

describe('monthFlow y firstOfMonth', () => {
  it('calcula el balance y no compara si no hay mes anterior', () => {
    const flow = monthFlow({ month: '2026-11-01', current: { income: eur(100_000), expenses: eur(130_000) }, previous: null });
    expect(flow.net.minor).toBe(-30_000);
    expect(flow.incomeChange).toBeNull();
    expect(flow.spentRatio).toBeCloseTo(1.3);
  });

  it('no calcula la parte gastada si no hubo ingresos', () => {
    const flow = monthFlow({ month: '2026-11-01', current: { income: eur(0), expenses: eur(5_000) }, previous: null });
    expect(flow.spentRatio).toBeNull();
  });

  it('devuelve el primer día del mes', () => {
    expect(firstOfMonth(today)).toBe('2026-11-01');
  });
});
