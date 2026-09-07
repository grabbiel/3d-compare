# 3D Compare

3D Compare is a browser tool for seeing size differences at true relative scale. Build a lineup of people by height, or compare adult foot lengths by shoe size.

## Requirements

- Node.js 22.12 or newer. The toolchain (Vite 8 on Rolldown, oxlint, and the built-in TypeScript type stripping the verification scripts use) does not run on Node.js 18 or 20.
- npm 10 or newer.

`.nvmrc` pins the major version, so `nvm install 22 && nvm use` selects a supported release. `.npmrc` sets `engine-strict=true`, so `npm install` on an unsupported Node.js stops with an "Unsupported engine" error instead of installing packages that fail later. The `dev`, `build`, `preview`, and `verify:*` scripts run the same check before starting.

If you see this when starting the dev server, your shell is on an old Node.js:

```
SyntaxError: The requested module 'node:util' does not provide an export named 'styleText'
```

Switch to Node.js 22, delete `node_modules`, and run `npm install` again.

## Run the app

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Comparison modes

### Height

Add up to 10 textured human models to a calibrated concrete studio. Choose among three female and three male people with different skin tones and outfits. Set each height in feet and inches or centimeters. Everyone stands on one line so perspective does not bias the comparison.

Use **Orbit** to rotate, pan, and zoom around the lineup. Use **Walk** to look with the pointer and move with W, A, S, and D.

### Feet

Place pairs of female and male feet, cut at mid-shin, on a centimeter table. Choose an adult US or EU shoe size. 3D Compare maps the size to foot length before scaling the pair.

Use **Orbit** to rotate around the table. Use **Inspect** for table-plane panning and close zoom.

## 3D models

The eight models in `public/models` are CC0 glTF binaries adapted from MakeHuman Community assets. `public/models/ASSET_LICENSES.md` records the provenance and `public/models/manifest.json` describes each file. They are static meshes in meters, Y up, facing +Z, with embedded textures, and they total about 34 MB on disk.

Scale is exact by construction. Each human is scaled uniformly from the stature of its authored mesh, measured from sole to skull top with hair excluded, and each pair of feet from the heel-to-toe length of its sole. `src/catalog` holds those reference sizes and `npm run verify:models` re-measures the GLB files to catch drift.

Models load on demand and are cached per file, so ten copies of one person download it once. Each human decodes to roughly 40 MB of GPU textures, so a full lineup of all six people uses about 240 MB of graphics memory.

## Local data only

The app has no backend, account, Go service, or AWS resource. The static catalogs and models ship with the client. Your two comparison lineups persist in browser `localStorage`.

## Verify a change

```bash
npm run verify:domain
npm run verify:models
npm run lint
npm run build
```

With the development server running, exercise the complete compare flow in a headless browser:

```bash
npm run verify:ui
```

The script launches the system Google Chrome through Playwright on macOS, Windows, and Linux. Point `CHROME_BIN` at a Chrome or Chromium binary to use a different browser build. Screenshots land in `/tmp/3d-compare-verification`.
