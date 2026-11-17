# OpenFinance Engine — Roadmap de aprendizaje

## Objetivo

Aprender Java 21 y backend con Spring Boot 4.x construyendo OpenFinance Engine, un backend de agregación bancaria y finanzas personales para homelab.

- **80 %**: Java, JVM, diseño, SQL/PostgreSQL, Spring y testing.
- **20 %**: IA como tutor, revisor y herramienta de desarrollo gradual.
- El avance depende de **explicar, implementar y verificar**, nunca solo de compilar ni de aceptar respuestas de IA.
- La duración es orientativa (6–8 horas/semana). El orden y la profundidad se ajustan al diagnóstico y a la evidencia.

## Fases

| Fase | Conceptos | Investigación inicial | Ejercicio pequeño en OpenFinance | IA | Evidencia de avance | Duración |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Fundamentos Java | Tipos, referencias, paso por valor, clases, interfaces, encapsulación, composición, inmutabilidad, `equals/hashCode`, excepciones | ¿Qué cambia al pasar una referencia a un método? | Modelos `Money` y `Transaction` en Java puro | Tutor socrático | Explicación propia, invariantes y pruebas de igualdad, dinero y errores | 2–3 semanas |
| 2. Colecciones y genéricos | `List`, `Set`, `Map`, contratos, genéricos, Big-O, Streams y bucles | ¿Cuándo elegir `HashSet` frente a `List`? | Buscar, agrupar y deduplicar movimientos | Revisión de código y casos límite | Elección justificada, complejidad razonada y tests | 2–3 semanas |
| 3. JVM y memoria | Stack, heap, ciclo de objetos, GC, retención y medición | ¿Por qué un objeto continúa vivo? | Procesar lotes de ingestas bancarias | Ayuda para interpretar mediciones | Perfilado con JFR/herramientas y comparación medida | 2 semanas |
| 4. Java moderno | Records, sealed classes, pattern matching, modelos | ¿Qué diferencia un record de una clase? | DTOs y estados de conexión bancaria | Revisión de modelado | Pruebas y defensa de elección de tipos | 1–2 semanas |
| 5. Diseño y arquitectura | SOLID, composición, inversión de dependencias, límites entre features | ¿Cómo aislar un proveedor bancario? | Contratos y adaptador Enable Banking | Instrucciones de repositorio | Dependencias verificadas y tests aislados | 3 semanas |
| 6. Persistencia | SQL, PostgreSQL, índices, restricciones, JPA, transacciones, aislamiento, locking, idempotencia | ¿Qué pasa con dos inserciones simultáneas del mismo movimiento? | Guardado y sincronización de movimientos | Revisión de consultas y pruebas | Migraciones y tests con PostgreSQL, UNIQUE e idempotencia | 3–4 semanas |
| 7. Concurrencia Java 21 | Race conditions, sincronización, executors, Virtual Threads, límites, errores | ¿Por qué más hilos no implica más rendimiento? | Sincronización concurrente y limitada de cuentas | Revisión y diseño de experimentos | Tests de carreras, fallos y medidas | 2–3 semanas |
| 8. Spring y APIs | DI, configuración, validación, HTTP, RestClient, seguridad, ProblemDetail | ¿Dónde termina Controller y empieza Service? | Endpoints y consumo bancario | Cambios pequeños con agente solo si ya se verifica autónomamente | Tests HTTP, validación, seguridad y WireMock | 3–4 semanas |
| 9. Testing y observabilidad | JUnit, AssertJ, Testcontainers, WireMock, logs, métricas, profiling | ¿Qué verifica cada nivel de test? | Suite de sincronización y observabilidad | Skills de revisión/testing si hay repetición real | Suite repetible, métricas y diagnóstico reproducible | 2–3 semanas |
| 10. IA en producto | Spring AI, tools, contexto filtrado, seguridad, evaluación | ¿Por qué el LLM no calcula importes? | Asistente financiero que llama a servicios | LLM integrado con límites y evaluación | Pruebas de privacidad y resultados deterministas | 3–4 semanas |

**Total orientativo:** 23–31 semanas, sin obligación de avanzar por calendario.

## Método de trabajo por bloque

1. **Diagnóstico:** preguntas cortas para comprobar conocimientos previos.
2. **Investigación:** una pregunta concreta, documentación y experimento mínimo.
3. **Explicación:** el estudiante expone sus conclusiones; el mentor señala errores y pide justificarlas.
4. **Ejercicio:** alcance reducido, una dificultad nueva cada vez; rama propuesta antes de cambiar código.
5. **Verificación:** tests de comportamiento y, si aplica, medidas de rendimiento.
6. **Defensa:** explicar decisiones, alternativas y limitaciones.
7. **Seguimiento:** registrar evidencia, dificultades y siguiente paso en `progress.md`.

No entregar soluciones completas salvo petición expresa. Emplear pistas y ejemplos pequeños.

## Puertas de entrada de la IA

1. Fases 1–2: tutor y revisor de razonamientos, luego revisión de código y generación de casos de prueba.
2. Fases 3–5: ayuda para interpretar perfiles, revisar diseño e instrucciones ligeras de repositorio.
3. Fases 6–9: skills de revisión/testing cuando existan tareas repetidas; agente para cambios pequeños y diff solo después de poder verificarlo.
4. Fase 10: Spring AI integrado en producto, con tools limitadas y evaluaciones.

No introducir varios agentes, MCP o automatizaciones complejas sin una necesidad identificada. Una respuesta de IA no es evidencia: el comportamiento se prueba; el rendimiento se mide.

## Reglas técnicas

- Java 21. Verificar en el `pom.xml` la versión de Spring Boot 4.x y su compatibilidad antes de añadir dependencias o proponer sintaxis.
- Paquete raíz `es.eduballesteros.openfinance`, organización **package-by-feature**: `common`, `bankconnection`, `account`, `transaction`, `category`, `analytics`, `savings`, `assistant` e `integration/enablebanking`.
- Las features se relacionan mediante contratos públicos de sus Services; nunca acceder a repositorios o entidades internas de otra feature.
- Importe con `BigDecimal`, moneda y política explícita de escala/redondeo, nunca `float`/`double`.
- Deduplicación persistente: hash determinista + restricción `UNIQUE` en PostgreSQL.
- Integraciones externas aisladas y probadas con WireMock.
- Nunca enviar credenciales, tokens ni IBAN completos a un LLM. Las tools exponen datos filtrados; los cálculos los realiza código determinista.

## Git

Flujo: `main ← develop ← feature/* | fix/* | chore/* | docs/*`. Commits Conventional Commits. Antes de un ejercicio con código: indicar rama, objetivo, criterios de aceptación y pruebas. No suponer estado del repositorio sin inspeccionarlo.

## Criterios para cambiar de fase

- Puede explicar los conceptos sin apoyarse en una respuesta generada.
- Implementa una solución de alcance controlado y defiende decisiones.
- Demuestra con tests los requisitos y casos límite.
- Explica qué no cubren sus pruebas y qué riesgos permanecen.
- Registra evidencia en `progress.md` y decisiones relevantes en `decisions.md`.
