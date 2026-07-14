$ErrorActionPreference = "Continue"

$Root = Get-Location
$Report = Join-Path $Root "Repository_Audit_Report.txt"

if(Test-Path $Report){
    Remove-Item $Report -Force
}

function Write-Report {
    param([string]$Text)
    Add-Content -Path $Report -Value $Text
}

Write-Report "==============================================================="
Write-Report "                WINGA APP REPOSITORY AUDIT"
Write-Report "==============================================================="
Write-Report ""
Write-Report "Generated: $(Get-Date)"
Write-Report "Root: $Root"
Write-Report ""

############################################################
# ROOT STRUCTURE
############################################################

Write-Report "================ ROOT ===================="

Get-ChildItem | Sort-Object Name | ForEach-Object {

    if($_.PSIsContainer){
        Write-Report "[DIR ] $($_.Name)"
    }
    else{
        Write-Report "[FILE] $($_.Name)"
    }

}

############################################################
# TREE
############################################################

Write-Report ""
Write-Report "================ FULL TREE ==============="

cmd /c tree /F >> $Report

############################################################
# APPS
############################################################

Write-Report ""
Write-Report "================ APPS ===================="

$Apps=@("web","admin","mobile")

foreach($App in $Apps){

    $Path="apps\$App"

    if(Test-Path $Path){

        Write-Report ""
        Write-Report "[OK] $Path"

        Get-ChildItem $Path -Recurse |
        Sort-Object FullName |
        ForEach-Object{

            if($_.PSIsContainer){
                Write-Report "   DIR  $($_.FullName.Replace($Root,''))"
            }
            else{
                Write-Report "   FILE $($_.FullName.Replace($Root,''))"
            }

        }

    }
    else{

        Write-Report "[MISSING] $Path"

    }

}

############################################################
# PACKAGES
############################################################

Write-Report ""
Write-Report "=============== PACKAGES ================="

$Packages=@(
"api",
"assets",
"auth",
"config",
"hooks",
"store",
"types",
"ui",
"utils",
"lib",
"components",
"styles"
)

foreach($Pkg in $Packages){

    $Path="packages\$Pkg"

    if(Test-Path $Path){

        $Count=(Get-ChildItem $Path -Recurse -File -ErrorAction SilentlyContinue).Count

        Write-Report ""
        Write-Report "$Pkg"
        Write-Report "Files: $Count"

        if($Count -eq 0){

            Write-Report "*** EMPTY PACKAGE ***"

        }

    }

}

############################################################
# DUPLICATES
############################################################

Write-Report ""
Write-Report "============= DUPLICATE CHECK ============"

$DuplicateFolders=@(
"customer-pwa",
"winga-pwa",
"admin-web-app",
"mobile-app",
"components",
"styles",
"lib"
)

foreach($Folder in $DuplicateFolders){

    if(Test-Path $Folder){

        Write-Report "[WARNING] Root duplicate: $Folder"

    }

    if(Test-Path "packages\$Folder"){

        Write-Report "[WARNING] Package duplicate: packages\$Folder"

    }

}

############################################################
# CONFIG FILES
############################################################

Write-Report ""
Write-Report "============= CONFIG FILES ==============="

$Configs=@(
"package.json",
"pnpm-workspace.yaml",
"turbo.json",
"docker-compose.yml",
"README.md",
".gitignore"
)

foreach($Cfg in $Configs){

    if(Test-Path $Cfg){

        Write-Report "[OK] $Cfg"

    }
    else{

        Write-Report "[MISSING] $Cfg"

    }

}

############################################################
# GIT
############################################################

Write-Report ""
Write-Report "================ GIT ====================="

git status >> $Report

############################################################
# SUMMARY
############################################################

Write-Report ""
Write-Report "================ SUMMARY ================="

$EmptyPackages = Get-ChildItem packages -Directory | Where-Object {
    (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue).Count -eq 0
}

Write-Report ""
Write-Report "Empty Packages:"

foreach($Pkg in $EmptyPackages){
    Write-Report " - $($Pkg.Name)"
}

Write-Report ""
Write-Report "Audit Completed Successfully."

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host " Repository Audit Complete" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Report generated:"
Write-Host $Report -ForegroundColor Cyan