# ===================================================================
# Winga customer-pwa — Setup Fix Script
# Strips UTF-8 BOM (Byte Order Mark) from all config/CSS/TS files.
# Run this in PowerShell from inside:  C:\Users\DELL\Pictures\Winga\customer-pwa
# ===================================================================

Write-Host "Stripping BOM from project files..." -ForegroundColor Cyan

$extensions = @('*.json','*.css','*.ts','*.tsx','*.js','*.jsx','*.mjs','*.html','*.md')
$files = Get-ChildItem -Recurse -File -Include $extensions |
         Where-Object { $_.FullName -notmatch '\\node_modules\\|\\\.next\\|\\\.git\\' }

$count = 0
foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    # UTF-8 BOM = EF BB BF
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        [System.IO.File]::WriteAllBytes($file.FullName, $bytes[3..($bytes.Length - 1)])
        Write-Host "  Fixed: $($file.FullName.Substring($PWD.Path.Length))" -ForegroundColor Green
        $count++
    }
}

Write-Host ""
Write-Host "Done. Removed BOM from $count file(s)." -ForegroundColor Cyan
Write-Host "Now clear the Next.js cache and restart the dev server:" -ForegroundColor Yellow
Write-Host "  Stop the dev server (Ctrl+C)" -ForegroundColor White
Write-Host "  Remove-Item -Recurse -Force .next" -ForegroundColor White
Write-Host "  npm run dev   (or: bun run dev / pnpm dev / yarn dev)" -ForegroundColor White
