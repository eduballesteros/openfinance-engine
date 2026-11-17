# OpenFinance Engine — Decisiones técnicas y de aprendizaje

Registro breve de decisiones y sus consecuencias. Las reglas **objetivo** no deben confundirse con funcionalidades ya implementadas. Para cambios de arquitectura relevantes, crear ADRs separados si el volumen lo justifica.

## D-001 — Aprendizaje guiado por evidencia
- **Estado:** aceptada
- **Fecha:** 2026-11-17
- **Decisión:** avanzar por comprensión explicada, implementación propia y verificación con pruebas; no por calendario ni compilación.
- **Consecuencias:** diagnóstico inicial; ejercicios pequeños; soluciones completas solo si se solicitan; registro de evidencia en `progress.md`.

## D-002 — IA gradual y subordinada a ingeniería Java
- **Estado:** aceptada
- **Fecha:** 2026-11-17
- **Decisión:** reparto orientativo 80 % ingeniería/20 % IA. Primero tutor, después revisor de código y pruebas; skills e instrucciones del repositorio cuando aporten valor; agentes limitados únicamente después de dominar la verificación; LLM en producto al final.
- **Consecuencias:** evitar automatizaciones complejas, MCP y varios agentes sin necesidad concreta. Toda recomendación de IA debe verificarse.

## D-003 — Límites de features y proveedor bancario
- **Estado:** objetivo de arquitectura
- **Fecha:** 2026-11-17
- **Decisión:** package-by-feature bajo `es.eduballesteros.openfinance`. Features: `common`, `bankconnection`, `account`, `transaction`, `category`, `analytics`, `savings`, `assistant`, `integration/enablebanking`. Comunicación entre features mediante Services públicos; integración Enable Banking aislada.
- **Consecuencias:** no importar repositorios ni entidades internas de otra feature. Contratos y límites sujetos a revisión cuando se implementen.

## D-004 — Precisión monetaria e idempotencia
- **Estado:** principio aceptado; detalles por diseñar
- **Fecha:** 2026-11-17
- **Decisión:** `BigDecimal` para dinero y política explícita de escala/redondeo, nunca `float` ni `double`. Movimientos deduplicados por hash determinista con restricción `UNIQUE` en PostgreSQL.
- **Pendiente:** definir moneda, tratamiento de escalas por divisa, momento de redondeo y campos canonizados para el hash; verificar con pruebas de colisiones lógicas y concurrencia.
- **Consecuencias:** no fijar reglas financieras arbitrarias antes del ejercicio de diseño correspondiente.

## D-005 — Seguridad de herramientas del asistente
- **Estado:** principio aceptado; implementación futura
- **Fecha:** 2026-11-17
- **Decisión:** nunca enviar credenciales, tokens ni IBAN completos al LLM. Herramientas consultan servicios del backend con contexto filtrado. Cálculos financieros deterministas en Java.
- **Consecuencias:** controles de acceso, minimización de datos y evaluación antes del despliegue del asistente.

## D-006 — Versiones y workflow
- **Estado:** aceptada como regla de trabajo
- **Fecha:** 2026-11-17
- **Decisión:** Java 21 y Spring Boot 4.x, confirmando versión exacta y compatibilidad en cada cambio relevante. Flujo `main ← develop ← feature/* | fix/* | chore/* | docs/*` y Conventional Commits.
- **Observación:** el `pom.xml` consultado en `main` declaraba Java 21 y Spring Boot 4.1.2; no se ha demostrado aún la resolución completa de dependencias ni el arranque del proyecto.
- **Consecuencias:** inspeccionar estado actual de la rama antes de implementar y documentar verificación.

## Plantilla para nuevas decisiones

### D-XXX — Título
- **Estado:** propuesta / aceptada / sustituida
- **Fecha:**
- **Contexto y problema:**
- **Alternativas consideradas:**
- **Decisión y justificación:**
- **Consecuencias y riesgos:**
- **Evidencia o PR relacionado:**
