import { plain } from '../../testing/text';
import { eur, formatMoney, formatPercent, minorFromDecimalString, relativeChange, splitMoney } from './money';


describe('formatMoney', () => {
  it('agrupa los miles siempre, también por debajo de 10 000 (alineación en columnas)', () => {
    expect(plain(formatMoney(eur(123_456)))).toBe('1.234,56 €');
    expect(plain(formatMoney(eur(1_264_000)))).toBe('12.640,00 €');
  });

  it('muestra siempre dos decimales', () => {
    expect(plain(formatMoney(eur(1_230)))).toBe('12,30 €');
  });

  it('usa el signo menos tipográfico (U+2212), no el guion', () => {
    expect(plain(formatMoney(eur(-41_260)))).toBe('−412,60 €');
  });

  it('con sign="always" marca + en entradas y deja el cero sin signo', () => {
    expect(plain(formatMoney(eur(4_000), 'always'))).toBe('+40,00 €');
    expect(plain(formatMoney(eur(-1_099), 'always'))).toBe('−10,99 €');
    expect(plain(formatMoney(eur(0), 'always'))).toBe('0,00 €');
  });

  it('con sign="never" muestra el valor absoluto', () => {
    expect(plain(formatMoney(eur(-173_485), 'never'))).toBe('1.734,85 €');
  });

  it('distingue el cero real (0,00 €)', () => {
    expect(plain(formatMoney(eur(0)))).toBe('0,00 €');
  });
});

describe('minorFromDecimalString', () => {
  it('convierte decimales serializados sin errores de coma flotante', () => {
    expect(minorFromDecimalString('1234.56')).toBe(123_456);
    expect(minorFromDecimalString('0.1')).toBe(10);
    expect(minorFromDecimalString('-412.60')).toBe(-41_260);
    expect(minorFromDecimalString('7')).toBe(700);
  });

  it('rechaza formatos no válidos', () => {
    expect(() => minorFromDecimalString('12,50')).toThrow();
    expect(() => minorFromDecimalString('')).toThrow();
  });
});

describe('formatPercent y relativeChange', () => {
  it('formatea porcentajes con signo opcional', () => {
    expect(plain(formatPercent(0.124))).toBe('12 %');
    expect(plain(formatPercent(-0.093, true))).toBe('−9 %');
    expect(plain(formatPercent(0.001, true))).toBe('0 %');
  });

  it('no compara contra una base cero', () => {
    expect(relativeChange(100, 0)).toBeNull();
    expect(relativeChange(110, 100)).toBeCloseTo(0.1);
  });
});

describe('splitMoney', () => {
  it('separa la parte entera de los céntimos y el símbolo', () => {
    const p = splitMoney(eur(1_691_490));
    expect(plain(p.main)).toBe('16.914');
    expect(plain(p.minor)).toBe(',90 €');
  });

  it('mantiene el signo delante de la parte entera', () => {
    expect(splitMoney(eur(-41_260)).main).toBe('−412');
    expect(splitMoney(eur(4_000), 'always').main).toBe('+40');
  });
});
