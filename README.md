# Football Boots Store

Phase 0A bootstrap and Phase 0B engineering foundation for a Pakistan-based store selling original imported pre-owned football boots. No storefront, catalogue, checkout, payments or authentication is implemented.

## Requirements

- Node.js 24 LTS (tested: 24.15.0), npm 11 (tested: 11.12.1).
- PHP 8.3–8.5; a current PHP 8.4 patch is recommended (tested: 8.4.26).
- Composer 2 (tested: 2.8.6).
- PostgreSQL 18 with `psql`, `createuser` and `createdb` tools.
- Git (tested: 2.49.0).
- PHP extensions: ctype, curl, dom, fileinfo, filter, hash, mbstring, openssl, pcre, PDO, pdo_pgsql, session, tokenizer, xml, xmlwriter; zip is recommended for Composer.

Dependency versions are pinned by `frontend/package-lock.json` and `backend/composer.lock`. Use `npm ci` and `composer install` on subsequent checkouts. Next.js requires Node >=20.9; this repository standardizes on Node 24 LTS. Laravel 13 requires PHP >=8.3. Do not use this machine's old PHP 8.3.0 installation for production.

Development uses standard Composer autoloading to keep installs fast on Windows. Production packaging should explicitly use `composer install --no-dev --optimize-autoloader`.

## Setup

Commands below use PowerShell; on macOS/Linux use `cp` instead of `Copy-Item`.

### PostgreSQL

Install PostgreSQL from the [official download page](https://www.postgresql.org/download/). Start it bound to loopback for local development and require password authentication (`scram-sha-256`). Create a dedicated application role and database using a PostgreSQL administrator:

```sh
createuser -h 127.0.0.1 -U postgres --pwprompt football_boots_app
createdb -h 127.0.0.1 -U postgres --owner=football_boots_app football_boots_store
```

Enter a unique local password when prompted. The application role must not have superuser, CREATEDB or CREATEROLE privileges. Never put passwords in command arguments or commit them.

### Backend

```powershell
cd backend
Copy-Item .env.example .env
composer install
php artisan key:generate
```

Edit ignored `backend/.env` with your PostgreSQL host, port, database, username and password. Preserve `DB_CONNECTION=pgsql`. Then:

```sh
php artisan migrate
php artisan migrate:status
php artisan test
```

Initial migrations create only Laravel's standard users/password-reset/session, cache and queue infrastructure. No business tables or sample users are seeded. These framework tables do not enable authentication.

### Frontend

In another terminal, from the repository root:

```powershell
cd frontend
Copy-Item .env.example .env.local
npm ci
```

`NEXT_PUBLIC_API_BASE_URL` is a public URL reserved for future API integration. The placeholder does not fetch from the backend. Never put credentials in `NEXT_PUBLIC_*` variables.

## Run locally

Backend terminal, in `backend/`:

```sh
php artisan serve --host=127.0.0.1 --port=8000
```

Frontend terminal, in `frontend/`:

```sh
npm run dev -- --hostname 127.0.0.1
```

Open http://127.0.0.1:3000. API health:

```sh
curl http://127.0.0.1:8000/api/v1/health
```

Expected HTTP 200: `{"data":{"status":"ok"}}`. This is a liveness check, not a database readiness check. Migrations verify database access separately.

CORS reads `CORS_ALLOWED_ORIGINS` as a comma-separated exact allowlist. The example permits only `http://localhost:3000` and `http://127.0.0.1:3000`, with GET/OPTIONS and no credentials. An unset allowlist allows no cross-origin requests. Deployed APIs must explicitly list their HTTPS frontend origins; do not use wildcards. Authentication and credentialed CORS are deferred.

`APP_DEBUG=false` is the safe default, including the local example. API errors return stable error codes and generic messages; validation failures additionally preserve client-safe field messages. Exception details and submitted input are never echoed. See the [error contract](docs/ARCHITECTURE.md#api-error-contract-phase-0b). Diagnostics remain in ignored `backend/storage/logs/laravel.log`. Production must use `APP_ENV=production`, `APP_DEBUG=false`, a unique app key, protected logs and deployment-managed secrets. Development servers are for local use only.

## Checks

In `frontend/`:

```sh
npm run lint
npm run typecheck
npm run build
```

In `backend/`:

```sh
composer validate --strict
composer check-platform-reqs
php artisan test
php vendor/bin/pint --test
php artisan migrate:status
```

HTTP tests do not touch the database. PHPUnit names a separate `football_boots_store_test` PostgreSQL database as a safeguard for future database tests. Provision that database before introducing tests that migrate or write data; never target development data with destructive test helpers.

## This Windows workspace

Portable tooling and data live under ignored `.local/`; they are machine-local conveniences, not repository dependencies. No global PATH or existing Laragon configuration was changed. Before backend commands in a fresh PowerShell terminal, from the repository root:

```powershell
. ./scripts/use-local-tools.ps1
```

The local PostgreSQL cluster is `.local/pgdata`, listens on `127.0.0.1:5432`, and is not a Windows service. From the repository root after activating local tools:

```powershell
pg_ctl -D .local/pgdata -l .local/postgres.log start
pg_ctl -D .local/pgdata stop -m fast
```

The app password is in ignored `backend/.env`. A separate administrator password is in ignored `.local/postgres-admin-password.txt`; protect that file. The cluster was initialized with SCRAM authentication and a dedicated non-superuser application role.

See [project status](docs/PROJECT_STATUS.md) for local PostgreSQL installation and verification results. On fresh checkouts, install the prerequisites above: `.local/` and credentials are deliberately absent. Do not overwrite a configured `.env` with its example.

See [architecture](docs/ARCHITECTURE.md) and [current verification/audit findings](docs/PROJECT_STATUS.md). Stop at Phase 0B; subsequent phases require approval.
