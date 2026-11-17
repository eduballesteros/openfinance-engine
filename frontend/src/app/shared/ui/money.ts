import { Component, computed, input } from '@angular/core';
import { Money, SignMode, formatMoney, splitMoney } from '../../core/money';

/**
 * Único punto de presentación de importes.
 * - `null`/`undefined` = dato ausente: guion largo + "Sin datos" para lectores de pantalla.
 * - `0` se muestra como `0,00 €`, nunca como ausente.
 * - Color: verde solo para entradas con `tone="flow"`; rojo solo para saldos negativos (`tone="balance"`).
 *   El signo siempre acompaña al color.
 * - `emphasis`: la parte entera destaca y los céntimos y el símbolo van más pequeños (cifras principales).
 */
@Component({
  selector: 'of-money',
  template: `
    @if (value(); as v) {
      @if (emphasis()) {
        @if (parts(); as p) {
          <span class="main">{{ p.main }}</span><span class="minor">{{ p.minor }}</span>
        }
      } @else {
        {{ text() }}
      }
    } @else {
      <span aria-hidden="true">—</span><span class="visually-hidden">Sin datos</span>
    }
  `,
  host: {
    class: 'num',
    '[attr.data-tone]': 'toneAttr()',
  },
  styles: `
    :host {
      white-space: nowrap;
      font-variant-numeric: tabular-nums lining-nums;
    }
    :host([data-tone='credit']) {
      color: var(--credit);
    }
    :host([data-tone='overdrawn']) {
      color: var(--danger);
    }
    :host([data-tone='missing']) {
      color: var(--ink-faint);
    }
    .minor {
      font-size: 0.55em;
      font-weight: 600;
      letter-spacing: 0;
      margin-inline-start: 0.04em;
    }
  `,
})
export class MoneyComponent {
  readonly value = input<Money | null | undefined>();
  readonly sign = input<SignMode>('auto');
  /** `flow`: movimiento (verde si entra). `balance`: saldo (rojo si es negativo). `plain`: sin color. */
  readonly tone = input<'flow' | 'balance' | 'plain'>('plain');
  readonly emphasis = input(false);

  protected readonly text = computed(() => {
    const value = this.value();
    return value ? formatMoney(value, this.sign()) : null;
  });

  protected readonly parts = computed(() => {
    const value = this.value();
    return value ? splitMoney(value, this.sign()) : null;
  });

  protected readonly toneAttr = computed(() => {
    const value = this.value();
    if (!value) {
      return 'missing';
    }
    if (this.tone() === 'flow' && value.minor > 0) {
      return 'credit';
    }
    if (this.tone() === 'balance' && value.minor < 0) {
      return 'overdrawn';
    }
    return null;
  });
}
