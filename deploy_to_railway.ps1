# PowerShell script to deploy Prisma migrations to production (Railway) and seed roles/admin
# Run from project root: pwsh .\deploy_to_railway.ps1

# Ensure script runs from repository root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

Write-Host "== Deploy Prisma migrations to Railway/Postgres and seed roles/admin ==" -ForegroundColor Cyan

# Read DATABASE_URL securely
$secure = Read-Host "Enter DATABASE_URL (Railway Postgres). Input is hidden" -AsSecureString
$ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$DATABASE_URL = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)

if ([string]::IsNullOrWhiteSpace($DATABASE_URL)) {
  Write-Error "DATABASE_URL cannot be empty. Exiting."
  exit 1
}

Write-Host "You entered a DATABASE_URL with length $($DATABASE_URL.Length) characters (value hidden)." -ForegroundColor Yellow
$confirm = Read-Host "Proceed to run migrations on this database? (y/N)"
if ($confirm.ToLower() -ne 'y') {
  Write-Host "Aborted by user." -ForegroundColor Red
  exit 1
}

# Export env var for the current process
$env:DATABASE_URL = $DATABASE_URL

# Optional: set SHADOW_DATABASE_URL if you use one
# $env:SHADOW_DATABASE_URL = <your_shadow_database_url>

# 1) Deploy migrations
Write-Host "\n== Running: prisma migrate deploy ==" -ForegroundColor Cyan
$proc = Start-Process -NoNewWindow -Wait -FilePath "npx" -ArgumentList "prisma migrate deploy --schema prisma/schema.prisma" -PassThru
if ($proc.ExitCode -ne 0) { Write-Error "prisma migrate deploy failed with exit code $($proc.ExitCode)"; exit $proc.ExitCode }

# 2) Generate Prisma client
Write-Host "\n== Running: prisma generate ==" -ForegroundColor Cyan
$proc = Start-Process -NoNewWindow -Wait -FilePath "npx" -ArgumentList "prisma generate" -PassThru
if ($proc.ExitCode -ne 0) { Write-Error "prisma generate failed with exit code $($proc.ExitCode)"; exit $proc.ExitCode }

# 3) Run seeds / upserts
Write-Host "\n== Seeding roles (create_roles.cjs) ==" -ForegroundColor Cyan
$proc = Start-Process -NoNewWindow -Wait -FilePath "node" -ArgumentList "create_roles.cjs" -PassThru
if ($proc.ExitCode -ne 0) { Write-Error "create_roles.cjs failed with exit code $($proc.ExitCode)"; exit $proc.ExitCode }

Write-Host "\n== Creating admin (create_admin.cjs) ==" -ForegroundColor Cyan
$proc = Start-Process -NoNewWindow -Wait -FilePath "node" -ArgumentList "create_admin.cjs" -PassThru
if ($proc.ExitCode -ne 0) { Write-Error "create_admin.cjs failed with exit code $($proc.ExitCode)"; exit $proc.ExitCode }

# 4) Verify roles
Write-Host "\n== Verifying roles (check_roles.cjs) ==" -ForegroundColor Cyan
$proc = Start-Process -NoNewWindow -Wait -FilePath "node" -ArgumentList "check_roles.cjs" -PassThru
if ($proc.ExitCode -ne 0) { Write-Error "check_roles.cjs failed with exit code $($proc.ExitCode)"; exit $proc.ExitCode }

Write-Host "\nAll steps completed successfully." -ForegroundColor Green
Write-Host "Remember to unset DATABASE_URL from environment if needed." -ForegroundColor Yellow

# Cleanup: unset env var in this process
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
