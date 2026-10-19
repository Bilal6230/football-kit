# Project status — Phase 0A

## Scope

Bootstrap only. One repository contains Next.js frontend, Laravel API, documentation and an optional Windows tool activation script. No storefront, products, checkout, payments or authentication have been implemented. No subsequent phase is authorized.

## Implemented

- Next.js App Router with `src/`, strict TypeScript, Tailwind CSS and supported ESLint rules. Minimal placeholder page, root layout and documented component/utility/feature locations.
- Versioned `GET /api/v1/health`, JSON success/error envelopes, generic errors, explicit-origin CORS and safe environment examples.
- PostgreSQL configuration and Laravel's unmodified infrastructure migrations; no business-domain migrations.
- PHPUnit coverage for health, missing routes, wrong methods, server-error redaction and allowed/denied/preflight CORS.
- Root setup instructions and architecture decisions, ignored secrets/artifacts, npm/Composer lockfiles, no nested application Git repositories.

## Versions

| Component | Version |
| --- | --- |
| OS | Windows 11 Pro, 10.0.26200 |
| Node.js / npm | 24.15.0 / 11.12.1 |
| Next.js / React | 16.4.0 / 19.3.0 |
| TypeScript / Tailwind CSS | 5.9.3 / 4.3.3 |
| ESLint | 10.12.0 |
| PHP | 8.4.26 portable; original system PHP 8.3.0 left untouched |
| Composer | 2.8.6 |
| Laravel | 13.36.0 |
| PHPUnit | 12.5.39 |
| PostgreSQL | 18.6 |
| Git | 2.49.0.windows.1 |

Exact transitive versions are in the lockfiles.

## Verification (2026-10-14)

| Executed check | Result |
| --- | --- |
| `npm ci --no-fund` | Passed; 176 packages installed from final lockfile |
| `npm run lint` | Passed; zero warnings |
| `npm run typecheck` | Passed; Next route type generation and `tsc --noEmit` |
| `npm run build` | Passed; `/` and `/_not-found` prerendered |
| `npm audit --audit-level=low` | Passed; zero vulnerabilities |
| `npm run start -- --hostname 127.0.0.1` and HTTP request | Passed; HTTP 200 and expected placeholder content |
| `composer install --no-interaction --prefer-dist` | Passed; lockfile install, autoload generation and package discovery |
| `composer validate --strict` | Passed |
| `composer check-platform-reqs` | Passed on PHP 8.4.26 |
| `composer audit --format=plain` | Passed; no vulnerability advisories |
| `php artisan key:generate` | Passed; generated key exists only in ignored `.env` |
| `php artisan migrate --no-interaction` | Passed; all three initial migrations executed against PostgreSQL |
| `php artisan migrate:status` | Passed; all three show batch 1 / Ran |
| `psql` connection/schema/role queries | Passed; application role connected, nine framework tables, no superuser/CREATEDB/CREATEROLE privileges |
| `php artisan test --colors=never` | Passed; 10 tests, 23 assertions |
| `php vendor/bin/pint --test` | Passed after formatting corrections |
| `php artisan route:list --path=api` | Passed; one API route, GET/HEAD `/api/v1/health` |
| `php artisan serve --host=127.0.0.1 --port=8000` and HTTP checks | Passed; health 200 JSON, missing route 404 JSON, allowed preflight 204, unlisted origin without CORS allowance |
| `git diff --cached --check` | Passed; no whitespace errors |
| Git secret/artifact checks | Passed; generated app/admin passwords and app key absent from staged diff; local env files/tooling/dependencies ignored; examples trackable |

All Phase 0A acceptance checks passed. No unresolved environment blocker remains. Verification web servers were stopped to free ports 3000/8000; the local PostgreSQL cluster remains running. No browser automation or deployment was executed, and neither is claimed as verified. No Git commit or remote push was created; project files are staged on `main` for review.

## Changed files

All 78 repository files are new. Main implementation/configuration files:

- Root `.gitignore`, `.gitattributes`, `.editorconfig`, `README.md` and `scripts/use-local-tools.ps1`.
- Frontend `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `.env.example`, `.nvmrc`, `src/app/{layout.tsx,page.tsx,globals.css}` and source-directory READMEs, plus generated framework scaffolding.
- Backend `composer.json`, `composer.lock`, `.env.example`, `bootstrap/app.php`, `routes/api.php`, `app/Http/Controllers/Api/V1/HealthController.php`, `config/{database.php,cors.php}`, `phpunit.xml`, `tests/Feature/{HealthTest.php,ExampleTest.php}`, and standard Laravel scaffolding/migrations.
- `docs/ARCHITECTURE.md` and this status document.

`git diff --cached --name-only` lists the complete reviewable file inventory.

## Environment work and resolved issues

- Initial PostgreSQL tools/service were missing; downloaded official EDB PostgreSQL Windows binaries into ignored `.local/`. Server components are installed; optional pgAdmin/StackBuilder extraction was stopped because they are not needed.
- Initial PHP 8.3.0 emitted missing-Imagick warnings and lacked the PostgreSQL PDO extension. Installed PHP 8.4.26 under `.local/php`, checked its official SHA-256 digest and enabled required extensions. Global PHP configuration and PATH were not changed.
- Initialized an isolated loopback-only PostgreSQL cluster with SCRAM passwords and a non-superuser application role. Real credentials exist only in ignored local files.
- Slow downloads caused timeouts during PostgreSQL and Composer installation. Downloads were retried/resumed; completed official archives were reused.
- Optimized Composer autoload generation was stopped after an unusually slow filesystem scan. Standard development autoloading completed successfully; production optimization is documented as a separate packaging flag and was not verified.
- Initial API tests caught missing default middleware registration; restored `withMiddleware()`. A CORS assertion was corrected to test the actual two-origin allowlist, since a singleton allowlist returns a fixed allowed-origin header. The final suite and live HTTP CORS checks pass.
- The generator selected unsupported ESLint 9. Upgrading exposed older peer constraints and a vulnerable glob dependency in the generated Next lint bundle. Replaced the bundle with compatible JavaScript, TypeScript and React Hooks recommended rules; npm installation now reports zero vulnerabilities. No force-fix or unsupported peer override is retained.

## Limitations and next task

- Local development foundation only; no deployment, production infrastructure, browser automation or commerce flow testing is included.
- The static frontend deliberately does not call the API. Health means application liveness, not database readiness.
- Local tool binaries, data and credentials are not in Git. Fresh machines must follow the README prerequisites/provisioning instructions.
- Next-specific, legacy React and accessibility lint rules are deferred until compatible supported plugins are available; semantic markup was reviewed manually.
- Recommended next step: review and approve the Phase 0B brief, including catalogue/listing, boot sizing, condition and stock rules before any domain schema or storefront work. Phase 0B has not begun.
