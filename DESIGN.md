---
name: "OpenFinance"
description: "Banca tradicional, profesional: estructura marina, papel frío y profundidad contenida."
colors:
  navy: "#0b2e5f"
  navy-deep: "#071f42"
  navy-ink: "#ffffff"
  navy-soft: "#c9d6ea"
  paper: "#f3f6fa"
  surface: "#ffffff"
  paper-sunk: "#e9eef5"
  fill: "#eef3fa"
  fill-strong: "#dde6f2"
  ink: "#16213a"
  ink-soft: "#33405a"
  ink-faint: "#5a6579"
  rule: "#e1e7ef"
  rule-strong: "#c5cfdc"
  accent: "#1a5bb5"
  accent-hover: "#144a96"
  on-accent: "#ffffff"
  accent-wash: "#e8f0fb"
  credit: "#12733f"
  credit-wash: "#e6f4ec"
  danger: "#b4232a"
  danger-wash: "#fdecec"
  caution: "#8a5300"
  caution-wash: "#fff4e0"
  cat-housing: "#0b2e5f"
  cat-groceries: "#0f766e"
  cat-eating-out: "#b45309"
  cat-transport: "#1d4ed8"
  cat-subscriptions: "#6d28d9"
  cat-income: "#15803d"
  cat-fees: "#475569"
  cat-health: "#be185d"
  cat-other: "#64748b"
  dark-navy: "#0f2747"
  dark-navy-deep: "#0a1b33"
  dark-navy-soft: "#b5c4dc"
  dark-paper: "#0c1421"
  dark-surface: "#131d2e"
  dark-paper-sunk: "#1a2638"
  dark-fill: "#1a2638"
  dark-fill-strong: "#233249"
  dark-ink: "#eef2f8"
  dark-ink-soft: "#d0d8e5"
  dark-ink-faint: "#9fabbf"
  dark-rule: "#233249"
  dark-rule-strong: "#34465f"
  dark-accent: "#7fb0f5"
  dark-accent-hover: "#a2c6f8"
  dark-on-accent: "#071f42"
  dark-accent-wash: "#1a2c47"
  dark-credit: "#5fcf8f"
  dark-credit-wash: "#12301f"
  dark-danger: "#ff8a85"
  dark-danger-wash: "#3a1719"
  dark-caution: "#f2b84b"
  dark-caution-wash: "#33260d"
  dark-cat-housing: "#9cc0f2"
  dark-cat-groceries: "#4fd1c5"
  dark-cat-eating-out: "#f6ad55"
  dark-cat-transport: "#7aa2ff"
  dark-cat-subscriptions: "#b794f4"
  dark-cat-income: "#68d391"
  dark-cat-fees: "#a0aec0"
  dark-cat-health: "#f687b3"
  dark-cat-other: "#a0aec0"
typography:
  display:
    fontFamily: "Public Sans Variable, Public Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.6rem + 2.4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Public Sans Variable, Public Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Public Sans Variable, Public Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Public Sans Variable, Public Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Public Sans Variable, Public Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
  chip:
    fontFamily: "Public Sans Variable, Public Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "8px"
  card: "12px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
  "10": "2.5rem"
  "12": "3rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: "0 1rem"
    height: "2.5rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.on-accent}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
    rounded: "{rounded.md}"
    padding: "0 1rem"
    height: "2.5rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  chip-info:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "2px 0.5rem"
  chip-ok:
    backgroundColor: "{colors.credit-wash}"
    textColor: "{colors.credit}"
    rounded: "{rounded.pill}"
  chip-caution:
    backgroundColor: "{colors.caution-wash}"
    textColor: "{colors.caution}"
    rounded: "{rounded.pill}"
  chip-danger:
    backgroundColor: "{colors.danger-wash}"
    textColor: "{colors.danger}"
    rounded: "{rounded.pill}"
---

# Design System: OpenFinance

## Overview

**Creative North Star: "Banca tradicional, profesional"**

OpenFinance mantiene una presencia serena, clara y profesional, inspirada en la banca tradicional. La estructura azul marino encuadra la información; el papel frío, las superficies blancas y la profundidad contenida facilitan la lectura cotidiana. BBVA y CaixaBank son referencias de oficio y tono, no identidades que copiar.

La densidad permite revisar movimientos y cuentas sin perder la jerarquía de los importes. La S entrelazada con un clavo, reinterpretada en azul marino con trazo redondeado minimalista a partir del emblema de la Esclavitud de la Encarnación, es la identidad de la aplicación; su procedencia está en `frontend/public/brand/README.md`.

**Key Characteristics:**
- Estructura marina y acción azul corporativo.
- Public Sans con cifras tabulares reales.
- Tarjetas con borde suave, líneas de separación y sombra ligera.
- Estados financieros explícitos y color acompañado de texto o signo.

## Colors

### Primary

El marino (`navy`, `navy-deep`) estructura cabecera y banda de saldo; sus textos usan `navy-ink` y `navy-soft`. El azul corporativo (`accent`, `accent-hover`, `accent-wash`, `on-accent`) identifica enlaces, acciones y selección.

### Neutral

El papel frío (`paper`) sostiene las superficies (`surface`); `paper-sunk`, `fill` y `fill-strong` distinguen zonas de apoyo. La tinta (`ink`, `ink-soft`, `ink-faint`) separa contenido, apoyo y metadatos. `rule` y `rule-strong` delimitan tarjetas y filas.

Los pares `credit`, `danger` y `caution` con sus fondos `*-wash` expresan estado. Los tokens `cat-*` mantienen identidad estable entre iconos y gráfico de categorías; no son una segunda paleta de acciones.

El tema sigue `prefers-color-scheme: dark`: los tokens `dark-*` del frontmatter son los valores que sustituyen al token sin prefijo. Los no redefinidos se mantienen. En oscuro, `on-accent` es tinta marina sobre azul claro. Dentro de la banda marina se invierten los textos a blanco y azul pálido; sus acciones de reintento heredan superficie marina y texto blanco, no el esquema de botón primario oscuro. Los estados usan tonos claros sobre fondos de estado oscuros.

**The Semántica financiera Rule.** El verde señala entradas y estados correctos; el rojo señala errores y descubiertos. Un gasto normal conserva el color de texto. El signo acompaña al color; el crédito dispuesto de una tarjeta no se trata como descubierto.

## Typography

**Display Font / Body Font:** Public Sans Variable, Public Sans, Segoe UI, system-ui, sans-serif. Public Sans se aloja en la aplicación; no hay una familia ornamental separada.

La jerarquía se construye con peso y espaciado antes que con tamaños extremos. El frontmatter registra las funciones principales; las etiquetas pequeñas de navegación móvil y metadatos conservan su escala compacta.

- **Display:** cifra principal de saldo; parte decimal y símbolo a 0.55em, peso 600 y separación inicial de 0.04em.
- **Headline:** título de página.
- **Title:** títulos de tarjetas; los subtítulos de banco usan tamaño de cuerpo y peso 700.
- **Body / Label / Chip:** contenido, metadatos y fichas de estado; sin transformación sistemática a mayúsculas.
- **Cifras:** `tabular-nums lining-nums`, con `tnum` y `lnum`; importes sin salto de línea. El metadato de saldo limita su ancho a 46ch.

**The Dato ausente Rule.** Un importe ausente se presenta como «—» y «Sin datos» accesible; un cero real se presenta como «0,00 €». La carga, el error y la ausencia de cuentas mantienen mensajes propios.

## Layout

Contenedores centrados de máximo 84rem y margen lateral de 1rem. Ritmo de cuarto de rem en el frontmatter; separación habitual de bloques 1.25rem y relleno de tarjetas de contenido 1.25rem. El cuerpo empieza en una columna y evita mínimos intrínsecos que provoquen desbordamientos.

El resumen conserva su composición existente: banda de saldo y mes, accesos que se solapan 1.5rem con ella, aviso y tarjetas de detalle. No impone esa composición a todas las pantallas. A 48rem de contenedor, saldo y mes se distribuyen 5:7 y los accesos pasan de dos a cuatro columnas. A 64rem de contenedor, el contenido de detalle se distribuye 7:5.

La navegación usa barra inferior de cinco destinos y altura 3.75rem con área segura hasta 64rem de viewport; desde ese umbral pasa a la cabecera marina de 4rem. Por debajo de 24rem de viewport, el aviso de datos de ejemplo se compacta. Las cuentas reubican la acción bancaria por debajo de 18rem de contenedor; la tabla de categorías reduce separación por debajo de 20rem. El movimiento apila categoría y cuenta por debajo de 30rem de su contenedor.

## Elevation & Depth

Profundidad contenida: borde y tono hacen la separación principal; la sombra `shadow-card` aporta elevación ligera en claro y se convierte en un contorno tenue en oscuro. La barra inferior tiene sombra superior suave. Los valores exactos y el movimiento están en el sidecar, fuera del esquema de tokens visuales del frontmatter.

Las respuestas son breves: presión de botón de 100ms con escala 0.98, estado de 200ms, flecha de enlace de 150ms y fondo de movimiento de 400ms. Se respeta movimiento reducido: no animaciones ni desplazamiento de iconos al pulsar. Contraste aumentado refuerza bordes y elimina la sombra de tarjeta; colores forzados usan colores del sistema para bordes y acción.

## Shapes

Tarjetas de esquinas suaves (`card`), controles moderadamente redondeados (`md`) y detalles pequeños (`sm`). Las fichas y barras son cápsulas; los iconos de producto son círculos de 2.5rem. Las marcas de banco ocupan 3rem con esquina de 10px y margen interior de 6px; las imágenes oficiales conservan proporción sobre blanco. ING, Revolut y CaixaBank usan símbolos vectoriales. BBVA y Openbank conservan recursos de respaldo para otras conexiones. El emblema de la aplicación ocupa 2rem sobre blanco y usa la esquina mediana.

## Components

### Buttons

Acciones claras y contenidas: botón secundario sobre superficie, borde fuerte y texto de acción; primario con relleno de acción y `on-accent`. Altura mínima 2.5rem, relleno horizontal de 1rem y peso 600. Hover del secundario: lavado azul y borde de acción; el primario usa `accent-hover`. Las acciones compactas de banco y marcar leído bajan a 2.25rem. Deshabilitado: opacidad 0.6 y cursor de progreso. Sobre marino, botón transparente con borde blanco translúcido y texto blanco.

Foco general: contorno de 2px, desplazado 2px, con `accent`; sobre marino usa blanco. No se depende del color de hover para comunicar foco.

### Chips

Fichas de estado con texto de peso 600, fondo tenue, radio cápsula y relleno de 2px por 0.5rem. Variantes neutra, informativa, correcta, aviso y error. Estado bancario con icono y texto; el texto puede partir en el contenedor más estrecho.

### Cards / Containers

Superficie, borde de 1px y sombra de tarjeta. Los bancos de una misma tarjeta se separan con líneas, sin crear tarjetas anidadas. Las filas de cuentas tienen un mínimo de 3.75rem; los movimientos, 4rem. Descripción flexible a la izquierda e importe alineado al final. Un movimiento nuevo usa `accent-wash` y ficha «Nuevo» hasta marcarlo como leído.

### Navigation

Iconos Lucide de trazo uniforme y etiqueta visible. En móvil, icono sobre texto compacto, activo en azul; en escritorio, disposición horizontal sobre marino, activo blanco con línea inferior de 3px. Las etiquetas cortas móviles conservan el nombre accesible completo.

### Financial data, identity and states

Importes centralizados en el componente monetario; nunca reemplazar el dato ausente por cero. El gráfico apilado de categorías se acompaña de tabla con importes y porcentajes; un gasto positivo inferior al redondeo muestra «<1 %». Carga con esqueletos, vacío con explicación y error local con reintento mantienen su distinción.

La marca bancaria intenta primero el logotipo del proveedor, después la copia oficial local (ING, Revolut, CaixaBank; BBVA y Openbank como respaldo), después un monograma estable. El nombre del banco siempre aparece al lado; la imagen es decorativa. No se sustituye el emblema minimalista solicitado por un icono genérico.

## Do's and Don'ts

### Do:
- **Do** conservar el emblema minimalista solicitado y la procedencia de los activos.
- **Do** usar los tokens semánticos y sus equivalentes oscuros; mantener foco visible y preferencias de accesibilidad.
- **Do** alinear importes con cifras tabulares, formato es-ES y moneda EUR.
- **Do** acompañar los estados con texto o icono y mostrar la frescura o ausencia del dato donde corresponde.

### Don't:
- **Don't** sustituir la identidad propia por las marcas de los bancos de referencia.
- **Don't** mostrar ausencia o error como cero ni colorear de rojo todo gasto.
- **Don't** asignar un color nuevo a una categoría según su posición si su categoría es conocida.
- **Don't** convertir los datos de ejemplo en prueba de clientes, resultados o conexiones reales.
