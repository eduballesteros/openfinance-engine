import { Component, input, output } from '@angular/core';
import { IconComponent } from './icon';

/** Marcador de carga: líneas grises con la forma aproximada del contenido. Silencioso para lectores de pantalla. */
@Component({
  selector: 'of-skeleton',
  template: `
    <span class="visually-hidden">{{ label() }}</span>
    @for (row of rowsArray(); track $index) {
      <span class="row" aria-hidden="true">
        <span class="bar" [style.inline-size.%]="row"></span>
        @if (trailing()) {
          <span class="bar bar--end"></span>
        }
      </span>
    }
  `,
  styles: `
    :host {
      display: grid;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--s-4);
      min-block-size: var(--row-min);
    }
    .bar {
      display: block;
      block-size: 0.75rem;
      border-radius: var(--radius-pill);
      background: var(--paper-sunk);
      animation: pulse 1.4s ease-in-out infinite;
    }
    .bar--end {
      inline-size: 5rem;
      flex-shrink: 0;
    }
    @keyframes pulse {
      50% {
        opacity: 0.55;
      }
    }
  `,
})
export class SkeletonComponent {
  readonly rows = input(3);
  readonly label = input('Cargando…');
  readonly trailing = input(true);
  protected rowsArray(): number[] {
    const widths = [62, 48, 70, 40, 56, 66];
    return Array.from({ length: this.rows() }, (_, i) => widths[i % widths.length]);
  }
}

/** Error de un bloque: explica qué falló y ofrece reintentar sin afectar al resto de la pantalla. */
@Component({
  selector: 'of-block-error',
  host: { class: 'reveal' },
  imports: [IconComponent],
  template: `
    <of-icon name="error" />
    <div class="body">
      <p class="title">{{ title() }}</p>
      <p class="detail">{{ detail() }}</p>
    </div>
    <button type="button" class="btn" (click)="retry.emit()">
      <of-icon name="refresh" />
      Reintentar<span class="visually-hidden">&nbsp;{{ subject() }}</span>
    </button>
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--s-3);
      padding: var(--s-4);
      border-radius: var(--radius-md);
      background: var(--danger-wash);
      color: var(--ink);
    }
    of-icon {
      color: var(--danger);
      margin-block-start: 1px;
    }
    .btn of-icon {
      color: inherit;
      font-size: 1rem;
    }
    .body {
      flex: 1 1 12rem;
    }
    .title {
      font-weight: 600;
    }
    .detail {
      color: var(--ink-soft);
      font-size: var(--text-sm);
    }
  `,
})
export class BlockErrorComponent {
  readonly title = input.required<string>();
  readonly detail = input('Comprueba tu conexión e inténtalo de nuevo.');
  /** Completa el nombre accesible del botón ("Reintentar cuentas") cuando hay varios en pantalla. */
  readonly subject = input.required<string>();
  readonly retry = output<void>();
}

/** Estado vacío: qué significa que no haya datos y, si procede, el siguiente paso. */
@Component({
  selector: 'of-block-empty',
  host: { class: 'reveal' },
  template: `
    <p class="title">{{ title() }}</p>
    @if (detail()) {
      <p class="detail">{{ detail() }}</p>
    }
    <ng-content />
  `,
  styles: `
    /* Estado vacío: explica qué falta y ofrece el siguiente paso */
    :host {
      display: grid;
      gap: var(--s-2);
      justify-items: start;
      padding: var(--s-5);
      border-radius: var(--radius-md);
      background: var(--paper);
    }
    .title {
      font-size: var(--text-md);
      font-weight: 700;
    }
    .detail {
      color: var(--ink-faint);
      max-inline-size: 36ch;
      margin-block-end: var(--s-2);
    }
  `,
})
export class BlockEmptyComponent {
  readonly title = input.required<string>();
  readonly detail = input<string>();
}
