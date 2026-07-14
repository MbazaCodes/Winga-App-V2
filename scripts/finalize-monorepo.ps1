$Root = "C:\Dev\Winga-App-V2"

Set-Location $Root

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host " WINGA FINAL MONOREPO CLEANUP"
Write-Host "===================================" -ForegroundColor Cyan

#-----------------------------------------
# Remove node_modules
#-----------------------------------------

Write-Host ""
Write-Host "Removing local node_modules..."

$targets = @(
"apps\admin\node_modules",
"apps\web\node_modules"
)

foreach($t in $targets){
    if(Test-Path $t){
        Remove-Item $t -Recurse -Force
        Write-Host "Removed $t"
    }
}

#-----------------------------------------
# Remove package-lock
#-----------------------------------------

Get-ChildItem apps -Recurse -Filter package-lock.json |
Remove-Item -Force -ErrorAction SilentlyContinue

#-----------------------------------------
# Rename styles -> theme
#-----------------------------------------

if(Test-Path "packages\styles"){

    if(!(Test-Path "packages\theme")){
        Rename-Item packages\styles theme
        Write-Host "styles renamed to theme"
    }
}

#-----------------------------------------
# Create shared packages
#-----------------------------------------

$folders=@(
"packages\database",
"packages\supabase",
"packages\auth",
"packages\api",
"packages\utils",
"packages\hooks",
"packages\store",
"packages\config",
"packages\types",
"packages\assets",
"packages\theme"
)

foreach($f in $folders){

    if(!(Test-Path $f)){
        New-Item -ItemType Directory $f | Out-Null
    }
}

#-----------------------------------------
# Flatten components/apps/web/components/*
#-----------------------------------------

$Old="packages\components\apps\web\components"

if(Test-Path $Old){

Get-ChildItem $Old -Directory | ForEach-Object{

$target="packages\ui\$($_.Name)"

if(!(Test-Path $target)){
New-Item -ItemType Directory $target | Out-Null
}

Get-ChildItem $_.FullName |
Move-Item -Destination $target -Force

}

Remove-Item "packages\components\apps" -Recurse -Force

Write-Host "Flattened packages/components"
}

#-----------------------------------------
# Remove old lib package
#-----------------------------------------

if(Test-Path packages\lib){

Remove-Item packages\lib -Recurse -Force

Write-Host "Removed packages/lib"

}

#-----------------------------------------
# Remove empty folders
#-----------------------------------------

Get-ChildItem packages -Directory | ForEach-Object{

if((Get-ChildItem $_.FullName -Force).Count -eq 0){

Write-Host "Empty folder:" $_.Name

}

}

#-----------------------------------------
# Root package.json
#-----------------------------------------

if(!(Test-Path package.json)){

@'
{
  "name":"winga-platform",
  "private":true,

  "workspaces":[
    "apps/*",
    "packages/*"
  ],

  "scripts":{

    "dev:web":"npm --workspace apps/web run dev",

    "dev:admin":"npm --workspace apps/admin run dev",

    "build":"npm run build --workspaces",

    "lint":"npm run lint --workspaces"

  }

}
'@ | Out-File package.json -Encoding utf8

Write-Host "Created root package.json"

}

#-----------------------------------------
# tsconfig base
#-----------------------------------------

if(!(Test-Path tsconfig.base.json)){

@'
{
 "compilerOptions":{

  "baseUrl":".",

  "paths":{

   "@ui/*":["packages/ui/*"],

   "@utils/*":["packages/utils/*"],

   "@hooks/*":["packages/hooks/*"],

   "@store/*":["packages/store/*"],

   "@types/*":["packages/types/*"],

   "@config/*":["packages/config/*"],

   "@database/*":["packages/database/*"],

   "@supabase/*":["packages/supabase/*"]

 }

}
}
'@ | Out-File tsconfig.base.json -Encoding utf8

}

#-----------------------------------------
# Print tree
#-----------------------------------------

Write-Host ""
Write-Host "Generating repository tree..."

tree /F > Repository_Final_Structure.txt

Write-Host ""
Write-Host "Repository_Final_Structure.txt generated"

Write-Host ""
Write-Host "=================================="
Write-Host " CLEANUP COMPLETE"
Write-Host "=================================="