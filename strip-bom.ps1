param(
    [string]$Path = $PWD
)

# CRITICAL: PowerShell's Set-Location does NOT change the .NET working
# directory. .NET file APIs (ReadAllBytes, etc.) use the .NET dir. Sync them.
[Environment]::CurrentDirectory = $Path
Set-Location $Path

Write-Host "Stripping BOM in: $Path" -ForegroundColor Cyan

$exts = @('.json','.css','.ts','.tsx','.js','.jsx','.mjs','.html','.md','.env','.env.local','.env.example')
$files = Get-ChildItem -Path $Path -Recurse -File -ErrorAction SilentlyContinue |
         Where-Object {
             $exts -contains $_.Extension.ToLower() -and
             $_.FullName -notmatch '\\node_modules\\|\\\.next\\|\\\.git\\'
         }

Write-Host "Scanned $($files.Count) candidate file(s)." -ForegroundColor Cyan

$fixed = 0
foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    # UTF-8 BOM = EF BB BF
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        [System.IO.File]::WriteAllBytes($file.FullName, $bytes[3..($bytes.Length - 1)])
        Write-Host "  Fixed: $($file.FullName.Substring($Path.Length))" -ForegroundColor Green
        $fixed++
    }
}

Write-Host ""
Write-Host "Done. Removed BOM from $fixed of $($files.Count) file(s)." -ForegroundColor Cyan
