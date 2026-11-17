import { Component, computed, input } from '@angular/core';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  ChartColumn,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock,
  CreditCard,
  HeartPulse,
  House,
  type IconNode,
  Landmark,
  LayoutDashboard,
  Link,
  List,
  MessageCircle,
  PiggyBank,
  Receipt,
  RefreshCw,
  Repeat,
  ShieldCheck,
  ShoppingCart,
  Tag,
  TrainFront,
  TriangleAlert,
  Users,
  Utensils,
  Wallet,
} from 'lucide';

/**
 * Iconografía de la aplicación: Lucide (licencia ISC), trazo uniforme de 2 px.
 * Solo se importan los iconos usados. Siempre decorativos: el texto acompañante da el nombre accesible.
 */
const ICONS = {
  // Navegación
  summary: LayoutDashboard,
  transactions: List,
  analysis: ChartColumn,
  savings: PiggyBank,
  assistant: MessageCircle,
  accounts: Landmark,
  // Acciones y estados
  refresh: RefreshCw,
  alert: TriangleAlert,
  error: CircleAlert,
  ok: CircleCheck,
  arrow: ArrowRight,
  chevron: ChevronRight,
  shared: Users,
  pending: Clock,
  link: Link,
  secure: ShieldCheck,
  // Productos
  'account-current': Wallet,
  'account-savings': PiggyBank,
  'account-card': CreditCard,
  bank: Landmark,
  // Movimientos y categorías
  inflow: ArrowDownLeft,
  outflow: ArrowUpRight,
  income: Banknote,
  housing: House,
  groceries: ShoppingCart,
  'eating-out': Utensils,
  transport: TrainFront,
  subscriptions: Repeat,
  fees: Receipt,
  health: HeartPulse,
  other: Tag,
} satisfies Record<string, IconNode>;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'of-icon',
  template: `
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">
      @for (node of nodes(); track $index) {
        @switch (node[0]) {
          @case ('path') {
            <path [attr.d]="node[1]['d']" />
          }
          @case ('circle') {
            <circle [attr.cx]="node[1]['cx']" [attr.cy]="node[1]['cy']" [attr.r]="node[1]['r']" />
          }
          @case ('rect') {
            <rect
              [attr.x]="node[1]['x']"
              [attr.y]="node[1]['y']"
              [attr.width]="node[1]['width']"
              [attr.height]="node[1]['height']"
              [attr.rx]="node[1]['rx']"
            />
          }
          @case ('line') {
            <line [attr.x1]="node[1]['x1']" [attr.y1]="node[1]['y1']" [attr.x2]="node[1]['x2']" [attr.y2]="node[1]['y2']" />
          }
          @case ('polyline') {
            <polyline [attr.points]="node[1]['points']" />
          }
          @case ('polygon') {
            <polygon [attr.points]="node[1]['points']" />
          }
          @case ('ellipse') {
            <ellipse [attr.cx]="node[1]['cx']" [attr.cy]="node[1]['cy']" [attr.rx]="node[1]['rx']" [attr.ry]="node[1]['ry']" />
          }
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
      font-size: 1.25rem;
      line-height: 0;
    }
    svg {
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  protected readonly nodes = computed(() => ICONS[this.name()] as readonly (readonly [string, Record<string, string | number>])[]);
}

const CATEGORY_KEYS: Record<string, IconName> = {
  Vivienda: 'housing',
  Supermercado: 'groceries',
  Restaurantes: 'eating-out',
  Transporte: 'transport',
  Suscripciones: 'subscriptions',
  Ingresos: 'income',
  Comisiones: 'fees',
  Salud: 'health',
};

/** Icono de una categoría a partir de su nombre visible. */
export function categoryIcon(name: string | null): IconName {
  return (name && CATEGORY_KEYS[name]) || 'other';
}

/** Color estable de una categoría (variable CSS), el mismo en iconos y gráficos. */
export function categoryColor(name: string | null): string {
  return `var(--cat-${categoryIcon(name)})`;
}
