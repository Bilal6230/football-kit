# Architecture

## Boundaries

A single Git repository contains independently installable applications:

```text
football-boots-store/
  frontend/                 Next.js App Router, React, TypeScript, Tailwind
    src/app/                Routes, root layout and global styles
    src/components/         Shared presentation components
    src/lib/                Shared utilities (empty foundation)
    src/features/           Future approved feature modules
    public/                 Static assets
  backend/                  Laravel REST API
    app/Http/Controllers/Api/V1/
    bootstrap/app.php       API registration and JSON error rendering
    config/                 Database and exact-origin CORS configuration
    routes/api.php          /api/v1 routes
    database/migrations/    Laravel infrastructure migrations only
    tests/                  PHPUnit feature and unit tests
  docs/
  .github/workflows/        Frontend and backend quality checks
  scripts/                  Optional local Windows tool activation
  README.md
```

The frontend owns rendering; Laravel owns the API and all future business/database operations. The frontend never receives database credentials. API versioning is centralized in `routes/api.php`; controllers live under `Api/V1`. No Next.js API, proxy, shared package, repository layer or speculative service abstraction is needed yet.

## Decisions

- Next.js 16 App Router with strict TypeScript, React 19, Tailwind 4 and ESLint. Server components are the default. The placeholder uses system fonts, with no third-party font fetch during builds.
- ESLint 10 uses recommended JavaScript, TypeScript and React Hooks rules plus the standalone Next.js 16.4.0 Core Web Vitals configuration. The Next plugin matches the installed framework version and installs with strict peer checking. Its development-only glob dependency has an unpatched advisory, detailed in PROJECT_STATUS.md. The larger `eslint-config-next` bundle is still excluded. Published `eslint-plugin-jsx-a11y` 6.10.2 does not support ESLint 10 in its peer range, so dedicated accessibility linting remains deferred without overrides or downgrades. TypeScript keeps strict mode and additionally checks unchecked indexed access and switch fallthrough.
- Laravel 13 with PHP 8.3+ and PostgreSQL. Composer/npm lockfiles make installations reproducible. Stable versions were checked against official documentation and registries before installation.
- Laravel's standard schema is retained as requested. No products, inventory, orders, payments or authentication endpoints exist. Sanctum is not installed; registering API routes directly avoids enabling authentication in Phase 0A.
- Successful health responses remain `{"data":{"status":"ok"}}`. API errors add a stable machine-readable `error.code` while preserving `error.status` and `error.message`. Error normalization stays in Laravel's existing exception-response hook; no service layer or error abstraction is added. It preserves protocol headers such as `Allow` and `Retry-After` and leaves non-API responses alone.
- Health is application liveness only. Database connection/migration checks are separate.
- File sessions/cache and synchronous queues avoid unnecessary services locally. These are development choices, not a multi-instance production deployment design.
- CORS has exact origins, limited methods/headers and no cookies. An unset allowlist denies cross-origin access. Revisit methods and credentialed CORS when Sanctum is explicitly in scope.
- Examples contain only placeholders and safe local configuration. Actual keys, passwords, logs, dependencies, build outputs and local runtime binaries/data are ignored. No nested repositories.

## Inventory direction (not implemented)

Future schema work must distinguish a sellable listing from stock quantity and condition. A pre-owned pair may have quantity one; a new pair may have multiple units. Do not hard-code all listings to used condition or globally constrain quantity to one. Final product, variant, sizing and stock rules require a later approved design; no business schema is created here.

## API error contract (Phase 0B)

| HTTP status | Stable `error.code` | Details |
| --- | --- | --- |
| 404 | `not_found` | Generic message, including custom HTTP exceptions |
| 405 | `method_not_allowed` | Retains the `Allow` header |
| 422 | `validation_failed` | `error.fields` only for Laravel `ValidationException` |
| 500–599 | `internal_error` | Generic `Server Error`, regardless of debug mode |
| Other errors | `http_error` | Standard HTTP message; inspect `error.status` |

Validation example:

```json
{"error":{"code":"validation_failed","status":422,"message":"Validation failed.","fields":{"email":["The email field is required."]}}}
```

Field keys retain Laravel's dot notation and each field has a list of messages. The only detailed client-visible errors are validator messages; future custom rules/messages must be written for clients and must not interpolate secrets, SQL or submitted sensitive values. The handler does not echo request input or serialize exception messages, stack traces or paths. A plain HTTP 422 exception never becomes a source of field errors. Server diagnostics remain in protected logs. Regression routes are registered only inside PHPUnit tests, not in the application's route files.

## Continuous integration

`.github/workflows/quality.yml` runs on pull requests to `main`, pushes to `main`, and pushes to the Phase 0B branch. Separate Ubuntu jobs use Node 24 and PHP 8.4. Actions are pinned to reviewed release commit hashes; repository permissions are read-only. The frontend uses the npm lockfile and runs lint, type checking and build. The backend validates/installs the Composer lockfile, generates an ephemeral application key, runs the existing migrations against a disposable PostgreSQL 18 service, then runs Pint and PHPUnit. Its fixed CI-only database password is not a real environment secret. No deployment, publication, merge or production access is configured. Audits are reported separately; these jobs do not silently suppress advisory results.

## Official references

Checked during bootstrap on 2026-10-14:

- [Next.js installation and runtime requirements](https://nextjs.org/docs/app/getting-started/installation)
- [Laravel 13 support and PHP compatibility](https://laravel.com/docs/13.x/releases)
- [Laravel API route registration](https://laravel.com/docs/13.x/routing)
- [Laravel errors](https://laravel.com/docs/13.x/errors)
- [Laravel database configuration](https://laravel.com/docs/13.x/database)
- [Official PHP Windows releases](https://www.php.net/downloads.php?os=windows)
- [PostgreSQL Windows distributions](https://www.postgresql.org/download/windows/)

## Phase 1A presentation foundation

The temporary `/` route demonstrates the design system documented in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). Semantic CSS variables map to Tailwind v4 utilities; reusable primitives live in `frontend/src/components/ui/`. The root layout self-hosts Inter and Playfair Display through `next/font/google`. Components use Server Components except the isolated button interaction specimen. CSS owns transitions, entrance timing and reduced-motion behavior; no motion or UI dependency was introduced. The showcase carries noindex metadata and must be replaced deliberately in a later storefront phase. Laravel, database schema, API contracts and lockfiles are unchanged.
