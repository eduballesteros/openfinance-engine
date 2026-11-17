/**
 * Importes en unidades mínimas (céntimos) como enteros, para no arrastrar errores
 * de coma flotante al sumar. La API del backend debe traducirse a esta forma en la capa de datos.
 */
export type CurrencyCode = 'EUR';

export interface Money {
  /** Céntimos. Negativo = salida de dinero. */
  readonly minor: number;
  readonly currency: CurrencyCode;
}

export const LOCALE = 'es-ES';

export function eur(minor: number): Money {
  return { minor: Math.round(minor), currency: 'EUR' };
}

/** Convierte un decimal en texto ("1234.56", tal como lo serializa BigDecimal) a céntimos sin pasar por float. */
export function minorFromDecimalString(value: string): number {
  const match = /^(-)?(\d+)(?:\.(\d{1,2})\d*)?$/.exec(value.trim());
  if (!match) {
    throw new Error(`Importe con formato no válido: "${value}"`);
  }
  const [, minus, units, fraction = ''] = match;
  const minor = Number(units) * 100 + Number(fraction.padEnd(2, '0'));
  return minus ? -minor : minor;
}

export function sumMoney(values: readonly Money[], currency: CurrencyCode = 'EUR'): Money {
  return { minor: values.reduce((acc, v) => acc + v.minor, 0), currency };
}

/**
 * - `auto`: solo se marca el signo de los negativos (saldos).
 * - `always`: `+` en entradas y `−` en salidas; el cero no lleva signo (movimientos).
 * - `never`: valor absoluto, cuando el contexto ya indica la dirección ("Gastos").
 */
export type SignMode = 'auto' | 'always' | 'never';

const MINUS = '−';
const formatters = new Map<CurrencyCode, Intl.NumberFormat>();

function currencyFormatter(currency: CurrencyCode): Intl.NumberFormat {
  let formatter = formatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      // En es-ES los miles solo se agrupan a partir de 10 000; en columnas eso desalinea.
      useGrouping: 'always',
      signDisplay: 'never',
    });
    formatters.set(currency, formatter);
  }
  return formatter;
}

export function formatMoney(money: Money, sign: SignMode = 'auto'): string {
  const abs = currencyFormatter(money.currency).format(Math.abs(money.minor) / 100);
  if (money.minor < 0 && sign !== 'never') {
    return MINUS + abs;
  }
  if (money.minor > 0 && sign === 'always') {
    return '+' + abs;
  }
  return abs;
}

/**
 * Divide un importe para destacar la parte entera, como hacen las apps bancarias:
 * `16.914,90 €` → `{ main: '16.914', minor: ',90 €' }` (con el signo delante de `main` si procede).
 */
export function splitMoney(money: Money, sign: SignMode = 'auto'): { main: string; minor: string } {
  const parts = currencyFormatter(money.currency).formatToParts(Math.abs(money.minor) / 100);
  let main = '';
  let minor = '';
  let seenDecimal = false;
  for (const part of parts) {
    if (part.type === 'decimal') {
      seenDecimal = true;
    }
    if (!seenDecimal && (part.type === 'integer' || part.type === 'group')) {
      main += part.value;
    } else {
      minor += part.value;
    }
  }
  const prefix = money.minor < 0 && sign !== 'never' ? MINUS : money.minor > 0 && sign === 'always' ? '+' : '';
  return { main: prefix + main, minor };
}

const percentFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  maximumFractionDigits: 0,
  signDisplay: 'never',
});

/** `0.124` → `12 %`; con `signed`, `+12 %` / `−12 %`. */
export function formatPercent(ratio: number, signed = false): string {
  const abs = percentFormatter.format(Math.abs(ratio));
  if (!signed || Math.round(ratio * 100) === 0) {
    return abs;
  }
  return (ratio < 0 ? MINUS : '+') + abs;
}

/** Variación relativa; `null` si no hay base para comparar (anterior en cero). */
export function relativeChange(current: number, previous: number): number | null {
  if (previous === 0) {
    return null;
  }
  return (current - previous) / Math.abs(previous);
}
