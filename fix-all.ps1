# ===================================================================
# Winga customer-pwa — ONE-SHOT fix v3
# Run this from anywhere — it uses absolute paths throughout.
# ===================================================================

param(
    [string]$Project = "C:\Users\DELL\Pictures\Winga\customer-pwa"
)

$ErrorActionPreference = "Stop"

# Resolve where THIS script lives (so sibling files can be found)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Winga App V2 — Fix Script v3" -ForegroundColor Cyan
Write-Host "  Project: $Project" -ForegroundColor Cyan
Write-Host "  Script dir: $ScriptDir" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 0) Sanity check
if (-not (Test-Path (Join-Path $Project "package.json"))) {
    Write-Host "ERROR: package.json not found in $Project" -ForegroundColor Red
    Write-Host "Are you sure the path is correct? Edit the -Project parameter." -ForegroundColor Yellow
    exit 1
}

# Sync .NET working dir (PowerShell Set-Location alone doesn't change .NET dir)
Set-Location $Project
[Environment]::CurrentDirectory = $Project

# Paths
$stripScript  = Join-Path $ScriptDir  "strip-bom.ps1"
$tsconfigSrc  = Join-Path $ScriptDir  "tsconfig.json"
$vscodeSrc    = Join-Path $ScriptDir  ".vscode\settings.json"
$tsconfig     = Join-Path $Project    "tsconfig.json"
$vscodeDir    = Join-Path $Project    ".vscode"
$vscodeSet    = Join-Path $vscodeDir  "settings.json"
$nextDir      = Join-Path $Project    ".next"
$globalsCss   = Join-Path $Project    "app\globals.css"

# ── STEP 1: Strip BOM from all source files ──────────────────────────────────
Write-Host "[1/5] Stripping UTF-8 BOM from source files..." -ForegroundColor Cyan
if (-not (Test-Path $stripScript)) {
    Write-Host "  ERROR: strip-bom.ps1 not found at $stripScript" -ForegroundColor Red
    exit 1
}
& powershell -ExecutionPolicy Bypass -File $stripScript -Path $Project
Write-Host "  BOM stripping complete." -ForegroundColor Green

# ── STEP 2: Install clean BOM-free tsconfig.json ─────────────────────────────
Write-Host ""
Write-Host "[2/5] Installing clean tsconfig.json..." -ForegroundColor Cyan
if (-not (Test-Path $tsconfigSrc)) {
    Write-Host "  ERROR: tsconfig.json not found at $tsconfigSrc" -ForegroundColor Red
    exit 1
}
Copy-Item -Force $tsconfigSrc $tsconfig
Write-Host "  Installed: $tsconfig" -ForegroundColor Green

# ── STEP 3: Verify tsconfig.json is truly BOM-free ───────────────────────────
Write-Host ""
Write-Host "[3/5] Verifying tsconfig.json is BOM-free..." -ForegroundColor Cyan
$bytes = [System.IO.File]::ReadAllBytes($tsconfig)
if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "  STILL HAS BOM — close the file in VS Code and re-run." -ForegroundColor Red
    exit 1
} else {
    Write-Host "  Clean. First bytes: $($bytes[0]) $($bytes[1]) $($bytes[2])" -ForegroundColor Green
}

# ── STEP 4: Fix globals.css dangling combinator ──────────────────────────────
Write-Host ""
Write-Host "[4/5] Fixing globals.css CSS selector error..." -ForegroundColor Cyan
if (Test-Path $globalsCss) {
    $css = Get-Content $globalsCss -Raw -Encoding UTF8

    # Pattern: Lightning CSS rejects bare ">" combinators at line/rule start,
    # e.g.  "> *" or ">*" used as a top-level selector without a parent.
    # The fix wraps or removes the dangling combinator:
    #   :root > *  { ... }   is valid — prefix with :root if missing
    $before = $css

    # Fix 1: standalone "> *" selector (no parent) → ":root > *"
    $css = $css -replace '(?m)^(\s*)>\s*\*', '$1:root > *'

    # Fix 2: standalone ">" selector lines (catch-all for other dangling cases)
    $css = $css -replace '(?m)^(\s*)>\s*([^\s{])', '$1:root > $2'

    if ($css -ne $before) {
        [System.IO.File]::WriteAllText($globalsCss, $css, [System.Text.Encoding]::UTF8)
        Write-Host "  Fixed dangling combinator in globals.css" -ForegroundColor Green
    } else {
        Write-Host "  No dangling combinator found — globals.css looks clean." -ForegroundColor DarkGray
    }
} else {
    Write-Host "  globals.css not found at expected path ($globalsCss)" -ForegroundColor Yellow
    Write-Host "  Skipping — if your CSS file is elsewhere, fix manually." -ForegroundColor Yellow
}

# ── STEP 5: Install VS Code settings + nuke .next cache ──────────────────────
Write-Host ""
Write-Host "[5/5] Installing VS Code settings and clearing .next cache..." -ForegroundColor Cyan

if (Test-Path $vscodeSrc) {
    New-Item -ItemType Directory -Force $vscodeDir | Out-Null
    Copy-Item -Force $vscodeSrc $vscodeSet
    Write-Host "  VS Code settings installed." -ForegroundColor Green
} else {
    Write-Host "  .vscode/settings.json not found in repo — skipping." -ForegroundColor Yellow
}

if (Test-Path $nextDir) {
    Remove-Item -Recurse -Force $nextDir
    Write-Host "  .next cache cleared." -ForegroundColor Green
} else {
    Write-Host "  No .next cache found — nothing to clear." -ForegroundColor DarkGray
}

# ── Done ──────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  ALL DONE. Now run:" -ForegroundColor Yellow
Write-Host "    cd `"$Project`"" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host "  Then hard-refresh: Ctrl+Shift+R" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
