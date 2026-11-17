import { Component, computed, input, linkedSignal } from '@angular/core';

/**
 * Colores para los monogramas: tonos sobrios de banca, todos con texto blanco ≥4,5:1.
 * No imitan los colores de marca de ninguna entidad: se asignan de forma estable por nombre.
 */
const TILE_COLORS = ['#0b2e5f', '#1a5bb5', '#0f5e63', '#5a3e8c', '#7a3b2e', '#2f4858', '#1d6b47', '#8a4b08'];

const LOCAL_LOGOS: Readonly<Record<string, string>> = {
  bbva: 'banks/bbva.png',
  ing: 'banks/ing.svg',
  revolut: 'banks/revolut.svg',
  caixabank: 'banks/caixabank.svg',
  caixa: 'banks/caixabank.svg',
  openbank: 'banks/openbank.svg',
};

function hash(text: string): number {
  let h = 0;
  for (const ch of text.toLowerCase()) {
    h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return h;
}

/** Siglas cortas tal cual (BBVA, ING); nombres de varias palabras, sus iniciales; el resto, dos letras. */
export function bankMonogram(bank: string): string {
  const words = bank.trim().split(/\s+/);
  if (words.length > 1) {
    return words
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase();
  }
  return (bank.length <= 4 ? bank : bank.slice(0, 2)).toUpperCase();
}

/**
 * Identidad de una entidad bancaria: su logotipo oficial si Enable Banking lo facilita;
 * después su copia local y, si ambas faltan o fallan, un monograma con color estable.
 * Decorativo: el nombre del banco siempre aparece como texto al lado.
 */
@Component({
  selector: 'of-bank-mark',
  template: `
    @if (logoSources()[logoIndex()]; as src) {
      <img [src]="src" alt="" width="48" height="48" loading="lazy" decoding="async" (error)="nextLogo()" />
    } @else {
      <span class="mono" [style.background]="color()" [attr.data-len]="monogram().length">{{ monogram() }}</span>
    }
  `,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host {
      display: inline-grid;
      inline-size: 3rem;
      aspect-ratio: 1;
      flex-shrink: 0;
    }
    img,
    .mono {
      inline-size: 100%;
      block-size: 100%;
      border-radius: 10px;
    }
    img {
      object-fit: contain;
      padding: 6px;
      box-sizing: border-box;
      background: #fff;
      outline: 1px solid rgb(11 46 95 / 0.12);
      outline-offset: -1px;
    }
    /* Monograma: brillo superior sutil, como el de una tarjeta física */
    .mono {
      display: grid;
      place-items: center;
      color: #fff;
      font-size: 0.8125rem;
      font-weight: 750;
      letter-spacing: 0.01em;
      box-shadow:
        inset 0 1px 0 rgb(255 255 255 / 0.18),
        inset 0 -1px 0 rgb(0 0 0 / 0.12);
    }
    .mono[data-len='4'] {
      font-size: 0.6875rem;
    }
  `,
})
export class BankMarkComponent {
  readonly name = input.required<string>();
  readonly logoUrl = input<string | null>(null);

  protected readonly logoSources = computed(() => {
    const local = LOCAL_LOGOS[this.name().trim().toLowerCase()];
    return [...new Set([this.logoUrl(), local].filter((url): url is string => !!url))];
  });
  protected readonly logoIndex = linkedSignal({ source: this.logoSources, computation: () => 0 });

  protected nextLogo(): void {
    this.logoIndex.update((index) => index + 1);
  }

  protected readonly monogram = computed(() => bankMonogram(this.name()));
  protected readonly color = computed(() => TILE_COLORS[hash(this.name()) % TILE_COLORS.length]);
}
