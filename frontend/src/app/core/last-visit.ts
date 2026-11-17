import { Service, computed, inject, signal } from '@angular/core';
import { CLOCK, IsoDateTime } from './clock';

const STORAGE_KEY = 'openfinance.vistoHasta';

/** Sin registro previo, lo de las últimas 24 horas se considera nuevo. */
const FIRST_VISIT_WINDOW_MS = 24 * 3_600_000;

/**
 * Recuerda hasta cuándo ha visto la persona sus movimientos, para iluminar lo nuevo
 * hasta que lo marque como visto. Es una comodidad de este navegador: si el almacenamiento
 * no está disponible (navegación privada, bloqueo), funciona solo durante la sesión.
 */
@Service()
export class LastVisit {
  private readonly clock = inject(CLOCK);
  private readonly seenUntil = signal<IsoDateTime>(this.read());

  /** Fecha y hora hasta la que todo se considera visto. */
  readonly since = computed(() => this.seenUntil());

  isNew(importedAt: IsoDateTime): boolean {
    // Comparación por instante, no por texto: el backend puede enviar otra zona horaria.
    return Date.parse(importedAt) > Date.parse(this.seenUntil());
  }

  markAllSeen(): void {
    const now = this.clock.now().toISOString();
    this.seenUntil.set(now);
    try {
      localStorage.setItem(STORAGE_KEY, now);
    } catch {
      // Sin almacenamiento persistente: el estado vale para esta sesión.
    }
  }

  private read(): IsoDateTime {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && !Number.isNaN(Date.parse(stored))) {
        return stored;
      }
    } catch {
      // Ignorado: se usa la ventana de primera visita.
    }
    return new Date(this.clock.now().getTime() - FIRST_VISIT_WINDOW_MS).toISOString();
  }
}
