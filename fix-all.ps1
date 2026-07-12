# ===================================================================
# Winga customer-pwa — ONE-SHOT fix v2 (absolute paths + .NET dir sync)
# ===================================================================

$ErrorActionPreference = "Stop"
$Project = "C:\Users\DELL\Pictures\Winga\customer-pwa"

if (-not (Test-Path (Join-Path $Project "package.json"))) {
    Write-Host "ERROR: package.json not found in $Project" -ForegroundColor Red
    return
}

# CRITICAL: Set-Location changes PowerShell $PWD but NOT the .NET working
# directory. .NET file APIs (ReadAllBytes, etc.) use the .NET dir. Sync them.
Set-Location $Project
[Environment]::CurrentDirectory = $Project
Write-Host "Working dir:  $PWD" -ForegroundColor Cyan
Write-Host ".NET dir:     $([Environment]::CurrentDirectory)" -ForegroundColor Cyan

# Absolute paths for everything
$stripScript = Join-Path $Project "strip-bom.ps1"
$tsconfigNew = Join-Path $Project "tsconfig.json.new"
$tsconfig    = Join-Path $Project "tsconfig.json"
$vscodeDir   = Join-Path $Project ".vscode"
$vscodeSet   = Join-Path $vscodeDir "settings.json"
$nextDir     = Join-Path $Project ".next"

# 1) Download fix files from GitHub (absolute -OutFile paths)
Write-Host "`n[1/5] Downloading fix files from GitHub..." -ForegroundColor Cyan
$raw = "https://raw.githubusercontent.com/MbazaCodes/Winga-App-V2/main"
New-Item -ItemType Directory -Force $vscodeDir | Out-Null
Invoke-WebRequest "$raw/strip-bom.ps1" -OutFile $stripScript
Invoke-WebRequest "$raw/tsconfig.json" -OutFile $tsconfigNew
Invoke-WebRequest "$raw/.vscode/settings.json" -OutFile $vscodeSet
Write-Host "  Downloaded to $Project" -ForegroundColor Green

# 2) Strip BOM — pass explicit -Path so the script scans the right folder
Write-Host "`n[2/5] Stripping BOM (with explicit project path)..." -ForegroundColor Cyan
& powershell -ExecutionPolicy Bypass -File $stripScript -Path $Project

# 3) Overwrite tsconfig.json with the clean BOM-free one
Write-Host "`n[3/5] Installing clean tsconfig.json..." -ForegroundColor Cyan
Move-Item -Force $tsconfigNew $tsconfig
Write-Host "  Installed." -ForegroundColor Green

# 4) Verify NO BOM remains (use ABSOLUTE path for the .NET API)
Write-Host "`n[4/5] Verifying tsconfig.json is BOM-free..." -ForegroundColor Cyan
$bytes = [System.IO.File]::ReadAllBytes($tsconfig)
if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "  STILL HAS BOM. Close the file in VS Code and re-run this script." -ForegroundColor Red
} else {
    Write-Host "  tsconfig.json is clean. First bytes: $($bytes[0]) $($bytes[1]) $($bytes[2]) (expected NOT 239 187 191)" -ForegroundColor Green
}

# 5) Nuke the stale Next.js cache
Write-Host "`n[5/5] Clearing .next cache..." -ForegroundColor Cyan
if (Test-Path $nextDir) { Remove-Item -Recurse -Force $nextDir }
Write-Host "  Done." -ForegroundColor Green

# Clean up stray files the v1 script may have dropped in the home folder
$homeStrays = @(
    (Join-Path $env:USERPROFILE "strip-bom.ps1"),
    (Join-Path $env:USERPROFILE "tsconfig.json.new"),
    (Join-Path $env:USERPROFILE ".vscode\settings.json")
)
foreach ($s in $homeStrays) {
    if (Test-Path $s) {
        Remove-Item -Force $s -ErrorAction SilentlyContinue
        Write-Host "  Cleaned stray: $s" -ForegroundColor DarkGray
    }
}

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  ALL DONE. Now run:" -ForegroundColor Yellow
Write-Host "    cd $Project" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host "  Then hard-refresh browser: Ctrl+Shift+R" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow
