# ===================================================================
# Winga customer-pwa — ONE-SHOT fix (paste into PowerShell)
# Downloads fix files from GitHub, strips BOM, clears cache.
# ===================================================================

$ErrorActionPreference = "Stop"
Set-Location "C:\Users\DELL\Pictures\Winga\customer-pwa"
Write-Host "Working dir: $PWD" -ForegroundColor Cyan

if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found here. Is this the customer-pwa folder?" -ForegroundColor Red
    return
}

# 1) Download the BOM-stripping script + clean tsconfig from GitHub
Write-Host "`n[1/5] Downloading fix files from GitHub..." -ForegroundColor Cyan
$raw = "https://raw.githubusercontent.com/MbazaCodes/Winga-App-V2/main"
Invoke-WebRequest "$raw/strip-bom.ps1" -OutFile ".\strip-bom.ps1"
Invoke-WebRequest "$raw/tsconfig.json" -OutFile ".\tsconfig.json.new"
New-Item -ItemType Directory -Force ".vscode" | Out-Null
Invoke-WebRequest "$raw/.vscode/settings.json" -OutFile ".\.vscode\settings.json"
Write-Host "  Downloaded." -ForegroundColor Green

# 2) Strip BOM from EVERY file first (so the overwrite below isn't re-corrupted
#    by an editor auto-saving with BOM)
Write-Host "`n[2/5] Stripping BOM from all source/config files..." -ForegroundColor Cyan
powershell -ExecutionPolicy Bypass -File ".\strip-bom.ps1"

# 3) Overwrite tsconfig.json with the clean BOM-free one
Write-Host "`n[3/5] Installing clean tsconfig.json..." -ForegroundColor Cyan
Move-Item -Force ".\tsconfig.json.new" ".\tsconfig.json"

# 4) Verify NO BOM remains in tsconfig.json (the #1 error trigger)
Write-Host "`n[4/5] Verifying tsconfig.json is BOM-free..." -ForegroundColor Cyan
$bytes = [System.IO.File]::ReadAllBytes(".\tsconfig.json")
if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "  STILL HAS BOM — something re-added it. Close the file in VS Code and re-run." -ForegroundColor Red
} else {
    Write-Host "  tsconfig.json is clean (no BOM)." -ForegroundColor Green
}

# 5) Nuke the stale Next.js cache
Write-Host "`n[5/5] Clearing .next cache..." -ForegroundColor Cyan
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
Write-Host "  Done." -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  ALL DONE. Now run:" -ForegroundColor Yellow
Write-Host "    npm run dev" -ForegroundColor White
Write-Host "  Then hard-refresh browser: Ctrl+Shift+R" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow
