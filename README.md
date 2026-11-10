# openfinance-engine

Backend en Spring Boot para conectar cuentas bancarias mediante [Enable Banking](https://enablebanking.com/) y ofrecer un chat con IA a través de [Anthropic](https://www.anthropic.com/).

> **Estado:** esqueleto inicial. La aplicación arranca y se conecta a la base de datos, pero las integraciones bancaria y de IA aún no están implementadas.

## Stack

| Área | Tecnología |
| --- | --- |
| Lenguaje y framework | Java 21, Spring Boot 4.1.2 (Spring MVC) |
| Persistencia | PostgreSQL, Spring Data JPA, Flyway |
| Seguridad | Spring Security |
| IA | Spring AI 2.0.1 (Anthropic) |
| Observabilidad | Spring Boot Actuator |
| Tests | JUnit, Testcontainers |
| Entorno local | Docker Compose |

## Requisitos

- Java 21
- Docker en ejecución (lo usan tanto Docker Compose como Testcontainers)

No hace falta instalar Maven: el proyecto incluye Maven Wrapper.

## Puesta en marcha

1. Copia la plantilla de variables de entorno:

   ```bash
   cp .env.example .env
   ```

2. Rellena en `.env` las variables `POSTGRES_DB`, `POSTGRES_USER` y `POSTGRES_PASSWORD`. El resto aún no son necesarias para arrancar.

3. Arranca la aplicación. Spring Boot levanta y detiene PostgreSQL automáticamente con `compose.yaml`:

   ```bash
   ./mvnw spring-boot:run
   ```

   En Windows, usa `.\mvnw.cmd` en lugar de `./mvnw`.

4. Comprueba que responde:

   ```bash
   curl http://localhost:8080/actuator/health
   ```

## Tests

```bash
./mvnw clean verify
```

Los tests levantan su propio PostgreSQL con Testcontainers, así que no necesitan `.env`.

## Integración continua

GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) se ejecuta en cada PR y en cada push a `main` y `develop`:

- **Build y tests:** `./mvnw clean verify`.
- **Secretos:** falla si se versiona un `.env`, una clave (`*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.jks`) o un `application-local.yml`, y busca credenciales en todo el historial con [gitleaks](https://github.com/gitleaks/gitleaks).

Si la CI detecta un secreto, ya está publicado en GitHub: revócalo y genera uno nuevo antes de limpiar el historial.

## Configuración

Las variables están descritas en [`.env.example`](.env.example):

| Variable | Uso |
| --- | --- |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Base de datos local |
| `ANTHROPIC_API_KEY` | Chat con IA |
| `ENABLE_BANKING_APPLICATION_ID`, `ENABLE_BANKING_PRIVATE_KEY_PATH` | Integración bancaria |

Nunca versiones `.env`, claves privadas (`*.pem`, `*.key`) ni `application-local.yml`: están en `.gitignore`.

## Estructura del proyecto

El código se organiza por funcionalidad: cada módulo de negocio tiene su propio paquete.

```
src/main/java/es/eduballesteros/openfinance/
├── common/
│   ├── config/              # configuración transversal
│   ├── exception/           # excepciones y gestión de errores
│   ├── money/               # tipos para importes y divisas
│   └── security/            # autenticación y autorización
├── bankconnection/          # conexiones con bancos
├── account/                 # cuentas bancarias
├── transaction/             # movimientos
├── category/                # categorías de movimientos
├── analytics/               # análisis de gastos e ingresos
├── savings/                 # ahorro
├── assistant/               # asistente con IA (Anthropic)
└── integration/
    └── enablebanking/       # cliente de Enable Banking

src/main/resources/
├── application.yml
└── db/migration/            # migraciones Flyway (V1__descripcion.sql, ...)

src/test/java/...            # misma estructura que src/main/java
src/test/resources/wiremock/ # respuestas simuladas de APIs externas
docs/                        # documentación del proyecto
```

Las carpetas vacías llevan un `.gitkeep` para que Git las versione; bórralo cuando la carpeta tenga contenido.

## Ramas

- `main`: código estable.
- `develop`: rama de integración.
- `feature/*`: una rama por funcionalidad, creada desde `develop`.

## Documentación

- [Catálogo de funciones](docs/functions.md)
