import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Pantalla provisional para secciones aún no construidas. Recibe los textos desde `data` de la ruta. */
@Component({
  selector: 'of-placeholder-page',
  imports: [RouterLink],
  template: `
    <div class="page">
      <h1>{{ heading() }}</h1>
      <p class="lead">{{ description() }}</p>
      <p class="note">Esta sección todavía está en construcción.</p>
      <a routerLink="/" class="btn">Volver al resumen</a>
    </div>
  `,
  styles: `
    .page {
      display: grid;
      gap: var(--s-4);
      justify-items: start;
      max-inline-size: 40rem;
      padding: var(--s-8) var(--gutter);
    }
    h1 {
      font-size: var(--text-2xl);
    }
    .lead {
      font-size: var(--text-lg);
      color: var(--ink-soft);
    }
    .note {
      inline-size: 100%;
      padding: var(--s-4) var(--s-5);
      border-radius: var(--radius-card);
      background: var(--surface);
      box-shadow: var(--card-shadow);
      color: var(--ink-faint);
    }
  `,
})
export class PlaceholderPage {
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
}
