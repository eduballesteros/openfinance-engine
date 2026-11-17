# OpenFinance · Frontend

Interfaz web de OpenFinance. Angular 22 (componentes standalone, signals, sin zone.js), TypeScript estricto y CSS propio con variables de diseño.

Requiere Node ≥ 22.22.3 o ≥ 24.15.

## Comandos

```bash
npm install
npm start          # servidor de desarrollo en http://localhost:4200
npm test           # pruebas unitarias y de accesibilidad (Vitest + axe-core)
npx ng lint        # ESLint (angular-eslint)
npm run build      # compilación de producción en dist/
```

## Datos: de ejemplo a reales

La aplicación funciona hoy con **datos de ejemplo** (se indica en pantalla con la etiqueta «Datos de ejemplo»), porque el backend aún no expone endpoints.

- Las pantallas solo dependen de `FinanceApi` (`src/app/data/finance-api.ts`).
- `SampleFinanceApi` sirve datos ficticios; `HttpFinanceApi` contiene el **contrato propuesto** contra `/api/v1/...`.
- Para usar el backend, cambia `DATA_SOURCE` a `'api'` en `src/app/data/provide-finance-api.ts` y ajusta `HttpFinanceApi` a los controladores reales.

Con datos de ejemplo, el parámetro `?escenario=` permite revisar los estados de la interfaz:

| Escenario | Qué muestra |
| --- | --- |
| `normal` (por defecto) | Datos completos, con un aviso de caducidad y una cuenta sin saldo |
| `vacio` | Sin bancos conectados |
| `parcial` | Falla un bloque (gastos por categoría) y el resto funciona |
| `error` | Fallan todas las peticiones |
| `lento` | Respuestas lentas para ver los estados de carga |

## Convenciones financieras

- Importes en céntimos enteros (`Money`); el backend debe enviar decimales como texto.
- Todo importe se presenta con `<of-money>`: formato `es-ES`, miles siempre agrupados, dos decimales, signo menos tipográfico (`−`).
- `null` = dato ausente (`—` y «Sin datos» para lectores de pantalla); `0,00 €` es un cero real; los errores se muestran por bloque con «Reintentar».
- Verde solo para entradas; rojo solo para errores y descubiertos (no para gastos ni para el crédito dispuesto de una tarjeta).
- Fechas: `17 nov 2026`; «Hoy»/«Ayer» en listas. La fecha actual se inyecta con `CLOCK`.

## Estructura

```text
src/app/
├── core/        # dinero, fechas, reloj, estados de carga, títulos
├── data/        # modelos, contrato FinanceApi, implementaciones de ejemplo y HTTP
├── shared/ui/   # importes, iconos, carga, vacío y error
├── layout/      # navegación principal
└── features/    # pantallas (summary = Resumen)
```
