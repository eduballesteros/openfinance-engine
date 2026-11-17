import { IconName } from '../shared/ui/icon';

export interface NavItem {
  readonly path: string;
  readonly label: string;
  /** Etiqueta corta para la barra de pestañas del móvil. */
  readonly short?: string;
  readonly icon: IconName;
  /** En móvil la barra inferior solo admite cinco destinos; el resto se alcanza desde Posición global. */
  readonly inMobileBar: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: '/', label: 'Posición global', short: 'Inicio', icon: 'summary', inMobileBar: true },
  { path: '/movimientos', label: 'Movimientos', icon: 'transactions', inMobileBar: true },
  { path: '/analisis', label: 'Análisis', icon: 'analysis', inMobileBar: true },
  { path: '/ahorro', label: 'Ahorro', icon: 'savings', inMobileBar: true },
  { path: '/asistente', label: 'Asistente', icon: 'assistant', inMobileBar: true },
  { path: '/cuentas', label: 'Cuentas y bancos', icon: 'accounts', inMobileBar: false },
];
