# Windows local tooling
# Dot-source from the repository root: . ./scripts/use-local-tools.ps1
$projectRoot = Split-Path $PSScriptRoot -Parent
$phpDirectory = Join-Path $projectRoot '.local/php'
$postgresDirectory = Join-Path $projectRoot '.local/postgresql/pgsql/bin'
if (-not (Test-Path (Join-Path $phpDirectory 'php.exe'))) {
    throw 'Local PHP is absent. Install PHP 8.3+ and use the standard README instructions.'
}
$env:PHPRC = Join-Path $phpDirectory 'php.ini'
$env:PATH = "$phpDirectory;$postgresDirectory;$env:PATH"
