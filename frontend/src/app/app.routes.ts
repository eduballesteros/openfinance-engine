import { Routes } from '@angular/router';

const placeholder = () => import('./features/placeholder/placeholder-page').then((m) => m.PlaceholderPage);

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Posición global',
    loadComponent: () => import('./features/summary/summary-page').then((m) => m.SummaryPage),
  },
  {
    path: 'movimientos',
    title: 'Movimientos',
    loadComponent: placeholder,
    data: { heading: 'Movimientos', description: 'Busca, filtra y categoriza todos los movimientos de tus cuentas.' },
  },
  {
    path: 'analisis',
    title: 'Análisis',
    loadComponent: placeholder,
    data: { heading: 'Análisis', description: 'Cómo evolucionan tus gastos e ingresos mes a mes y por categoría.' },
  },
  {
    path: 'ahorro',
    title: 'Ahorro',
    loadComponent: placeholder,
    data: { heading: 'Ahorro', description: 'Crea objetivos de ahorro y sigue su progreso.' },
  },
  {
    path: 'asistente',
    title: 'Asistente',
    loadComponent: placeholder,
    data: { heading: 'Asistente', description: 'Pregunta en lenguaje natural sobre tus finanzas.' },
  },
  {
    path: 'cuentas',
    title: 'Cuentas y bancos',
    loadComponent: placeholder,
    data: {
      heading: 'Cuentas y bancos',
      description: 'Conecta tus bancos, renueva los permisos de acceso y gestiona tus cuentas.',
    },
  },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: placeholder,
    data: { heading: 'No encontramos esta página', description: 'Puede que el enlace sea antiguo o esté mal escrito.' },
  },
];
