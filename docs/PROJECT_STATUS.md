# Project status - Phase 0B

## Repository and scope

Repository: `Bilal6230/football-kit`. Reviewed the clean `main` branch at `898ee75` before making changes; it matched `origin/main`. Work is on `feature/phase-0b-quality`. Phase 0A remains functional. No storefront design, authentication, products, checkout or payments were added. Do not begin the next phase or merge automatically.

## Changes

- API error normalization now includes stable `error.code`, preserves existing status/message fields, and returns validator messages in `error.fields` for Laravel validation exceptions only. Unexpected exceptions remain generic even with debug enabled. HTTP headers survive normalization.
- Focused regression coverage increased from 10 tests / 23 assertions to 20 tests / 55 assertions: validation with nested field names and different Accept/debug settings, 404, 405, 422, 500, Retry-After and CORS including denied preflight and singleton origin behavior. All test-only routes stay inside tests.
- Added standalone Next.js Core Web Vitals rules compatible with ESLint 10. Added TypeScript unchecked-index and switch-fallthrough checks. The production UI and application code are unchanged.
- Added `.github/workflows/quality.yml`: separate frontend and backend jobs, read-only permissions, pinned action commits, lockfile installs, an isolated PostgreSQL 18 service, migrations, Pint and PHPUnit. No deployment or merge automation.
- Updated README and architecture/error/CI documentation. Composer lockfile and all migrations are unchanged. Existing npm package versions are unchanged; only the Next lint plugin and its dependencies were added.

## Verified versions

Node 24.15.0; npm 11.12.1; Next.js 16.4.0; React 19.3.0; TypeScript 5.9.3; Tailwind 4.3.3; ESLint 10.12.0; Next ESLint plugin 16.4.0; PHP 8.4.26; Composer 2.8.6; Laravel 13.36.0; PHPUnit 12.5.39; PostgreSQL 18.6. Runtime/framework versions were not upgraded.

## Local verification - 2026-10-20 (Asia/Karachi)

| Exact command/check | Result |
| --- | --- |
| `git fetch origin` / `git rev-list --left-right --count HEAD...origin/main` before branching | Clean baseline; 0 ahead / 0 behind |
| Baseline `php artisan test --colors=never` | 10 tests / 23 assertions passed |
| Final `php artisan test --colors=never` | 20 tests / 55 assertions passed |
| `php vendor/bin/pint` / `composer lint` | Passed |
| `composer validate --strict` | Passed |
| `composer audit --format=json` | No advisories or abandoned packages |
| `npm install --save-dev --save-exact @next/eslint-plugin-next@16.4.0 --strict-peer-deps --no-fund` | Installed without peer overrides/conflicts; audit findings below |
| `npm ci --strict-peer-deps --no-fund` | Clean lockfile install passed (195 packages); audit findings below |
| `npm ls --all --json` | No invalid or missing dependencies |
| `npm run lint` | Passed, zero warnings |
| `npm run typecheck` | Passed, route type generation and `tsc --noEmit` |
| `npm run build` | Passed, static `/` and `/_not-found` |
| In-memory ESLint `lintText` probe | Confirmed `@next/next/no-img-element` detects a raw image element; no source fixture retained |
| `npm audit --json` | Exit 1: four high findings in the development lint dependency chain |
| `npm audit --omit=dev --json` | Passed: zero production dependency findings |
| `pg_ctl -D .local/pgdata -l .local/postgres.log -w start` | Existing cluster started; automatic recovery completed |
| `php artisan migrate --no-interaction` | Passed: nothing to migrate |
| `php artisan migrate:status` | All three initial migrations remain applied, batch 1 |
| `php artisan serve --host=127.0.0.1 --port=8000` and `curl.exe --silent --show-error --fail-with-body -i http://127.0.0.1:8000/api/v1/health` | HTTP 200, unchanged `{"data":{"status":"ok"}}` |
| HTTP OPTIONS from an unlisted origin | HTTP 204 without Access-Control-Allow-Origin |
| Lockfile comparison against `main` | No previously installed package versions changed |
| `git diff --check` | Passed |

The initial migration check failed because the local PostgreSQL process was stopped; it passed after starting the existing cluster. One local lint run overlapped clean dependency installation and failed on a temporarily missing package file; the final checks above ran after installation completed and all passed. These initial failures are not counted as passes.

## Audit findings and compatibility limits

The baseline npm and Composer audits were clean. Adding the version-matched Next lint plugin introduces four high findings along one **development-only** chain: `@next/eslint-plugin-next -> fast-glob -> micromatch -> braces`. The underlying advisory is [GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): deeply nested brace patterns can exhaust the stack. The advisory lists no patched release; the registry's latest braces is 3.0.3. Next lint plugin 16.4.2 still depends on the same fast-glob version. npm's suggested fix downgrades the plugin to 14.2.35, so no force-fix, unrelated upgrade or dependency override was applied. This remains a review risk for development/CI tooling; production-only audit is clean. Current lint configuration uses repository-owned patterns, not runtime user input. Update the lint chain when a compatible patch is available.

`eslint-plugin-jsx-a11y` latest 6.10.2 declares support only through ESLint 9. Dedicated accessibility lint checks could not be added without a peer conflict, so they remain deferred. No forced install, duplicate ESLint major or custom accessibility-rule abstraction was introduced. Manual accessibility review is still needed for future UI work.

## Remote verification and handoff

GitHub repository access confirms push permission. Remote workflow results and the PR link will be recorded after the feature branch is pushed. Local results above do not imply a hosted Actions pass. Browser automation, production deployment and production optimized Composer packaging were not run; no changes in this phase require them.

## Changed files

- `.github/workflows/quality.yml`
- `backend/bootstrap/app.php`
- `backend/tests/Feature/ApiErrorTest.php`
- `backend/tests/Feature/HealthTest.php`
- `frontend/eslint.config.mjs`
- `frontend/tsconfig.json`
- `frontend/package.json`
- `frontend/package-lock.json`
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/PROJECT_STATUS.md`

Local tools, credentials, logs and audit output remain under ignored paths. Next step: review the Phase 0B pull request, especially the development-only audit tradeoff and deferred accessibility plugin. No later phase is started.
