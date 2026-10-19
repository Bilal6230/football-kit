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
  scripts/                  Optional local Windows tool activation
  README.md
```

The frontend owns rendering; Laravel owns the API and all future business/database operations. The frontend never receives database credentials. API versioning is centralized in `routes/api.php`; controllers live under `Api/V1`. No Next.js API, proxy, shared package, repository layer or speculative service abstraction is needed yet.

## Decisions

- Next.js 16 App Router with strict TypeScript, React 19, Tailwind 4 and ESLint. Server components are the default. The placeholder uses system fonts, with no third-party font fetch during builds.
- ESLint 10 uses the recommended JavaScript, TypeScript and React Hooks rules directly. The generated Next.js lint bundle still pulls ESLint 9-only peers and a vulnerable glob chain at bootstrap time. Removing that bundle provides a supported, compatible dependency tree with a clean audit. Next-specific lint rules and the legacy React/accessibility lint plugins are not enabled; reconsider them once upstream declares ESLint 10 compatibility.
- Laravel 13 with PHP 8.3+ and PostgreSQL. Composer/npm lockfiles make installations reproducible. Stable versions were checked against official documentation and registries before installation.
- Laravel's standard schema is retained as requested. No products, inventory, orders, payments or authentication endpoints exist. Sanctum is not installed; registering API routes directly avoids enabling authentication in Phase 0A.
- Successful health responses use `{"data":{"status":"ok"}}`. API errors use `{"error":{"status":404,"message":"Not Found"}}` with appropriate HTTP status and protocol headers. Exception text and traces are never serialized by the API, even with debug enabled. Validation details can be designed when input endpoints are introduced.
- Health is application liveness only. Database connection/migration checks are separate.
- File sessions/cache and synchronous queues avoid unnecessary services locally. These are development choices, not a multi-instance production deployment design.
- CORS has exact origins, limited methods/headers and no cookies. An unset allowlist denies cross-origin access. Revisit methods and credentialed CORS when Sanctum is explicitly in scope.
- Examples contain only placeholders and safe local configuration. Actual keys, passwords, logs, dependencies, build outputs and local runtime binaries/data are ignored. No nested repositories.

## Inventory direction (not implemented)

Future schema work must distinguish a sellable listing from stock quantity and condition. A pre-owned pair may have quantity one; a new pair may have multiple units. Do not hard-code all listings to used condition or globally constrain quantity to one. Final product, variant, sizing and stock rules require a later approved design; no business schema is created here.

## Official references

Checked during bootstrap on 2026-10-14:

- [Next.js installation and runtime requirements](https://nextjs.org/docs/app/getting-started/installation)
- [Laravel 13 support and PHP compatibility](https://laravel.com/docs/13.x/releases)
- [Laravel API route registration](https://laravel.com/docs/13.x/routing)
- [Laravel errors](https://laravel.com/docs/13.x/errors)
- [Laravel database configuration](https://laravel.com/docs/13.x/database)
- [Official PHP Windows releases](https://www.php.net/downloads.php?os=windows)
- [PostgreSQL Windows distributions](https://www.postgresql.org/download/windows/)
