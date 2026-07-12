# Winga-App-V2 — Setup Fix Kit

Fix kit for the `customer-pwa` Next.js 16 app located at:
`C:\Users\DELL\Pictures\Winga\customer-pwa`

## Problems Fixed

1. **`tsconfig is not parseable: invalid JSON: Unexpected token`** at `tsconfig.json:1:1`
2. **`Parsing CSS source code failed — Invalid dangling combinator in selector`** at `globals.css:10`

Both caused by files saved as **UTF-8 with BOM** by a Windows editor.
Next.js 16 uses stricter JSON + Lightning CSS parsing that hard-fails on BOM.
The CSS error is also caused by a bare `> *` combinator without a parent selector.

## How to Use

### One-Shot Fix (recommended)

```powershell
# 1. Clone this repo somewhere convenient (once)
git clone https://github.com/MbazaCodes/Winga-App-V2.git C:\Users\DELL\Pictures\Winga\Winga-App-V2

# 2. Run the fix script from the cloned folder
cd C:\Users\DELL\Pictures\Winga\Winga-App-V2
powershell -ExecutionPolicy Bypass -File .\fix-all.ps1

# 3. Start the dev server
cd C:\Users\DELL\Pictures\Winga\customer-pwa
npm run dev
```

Then hard-refresh the browser: `Ctrl+Shift+R`

### Custom Project Path

If your project is in a different location:

```powershell
powershell -ExecutionPolicy Bypass -File .\fix-all.ps1 -Project "D:\MyOtherPath\customer-pwa"
```

## What the Fix Does (5 Steps)

| Step | Action |
|------|--------|
| 1 | Strip UTF-8 BOM from all `.json .css .ts .tsx .js .jsx .mjs .html .md .env` files |
| 2 | Copy clean BOM-free `tsconfig.json` from this repo into the project |
| 3 | Verify `tsconfig.json` is truly BOM-free (exits with error if not) |
| 4 | Patch `globals.css` — prefixes bare `> *` selectors with `:root` |
| 5 | Install `.vscode/settings.json` + delete stale `.next` cache |

## Files in This Repo

| File | Purpose |
|------|---------|
| `fix-all.ps1` | One-shot fix script — run this |
| `strip-bom.ps1` | BOM stripping logic (called by fix-all) |
| `tsconfig.json` | Clean, BOM-free, Next.js 16-ready config |
| `.vscode/settings.json` | Forces plain UTF-8 so VS Code stops re-adding BOM |

## Prevent BOM Coming Back

The included `.vscode/settings.json` sets `"files.encoding": "utf8"` for the workspace.
In VS Code, check the bottom-right status bar — if it says **"UTF-8 with BOM"**,
click it → **"Save without BOM"**.
