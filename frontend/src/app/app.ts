import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IsActiveMatchOptions, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';
import { FinanceApi } from './data/finance-api';
import { NAV_ITEMS } from './layout/nav-items';
import { IconComponent } from './shared/ui/icon';
import { LogoComponent } from './shared/ui/logo';

@Component({
  selector: 'of-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent, LogoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly navItems = NAV_ITEMS;
  protected readonly isSample = inject(FinanceApi).isSample;
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  constructor() {
    // Tras cada navegación (no la carga inicial) el foco pasa al contenido, como en una carga de página.
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.focusMain());
  }

  /**
   * La sección activa depende solo de la ruta: los parámetros de consulta (filtros, escenarios)
   * no deben hacer que deje de marcarse. "/" exige coincidencia exacta para no marcarse siempre.
   */
  protected activeOptions(path: string): IsActiveMatchOptions {
    return {
      paths: path === '/' ? 'exact' : 'subset',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    };
  }

  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.focusMain();
  }

  private focusMain(): void {
    this.main().nativeElement.focus({ preventScroll: false });
  }
}
