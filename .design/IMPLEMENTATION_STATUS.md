# 3D Compare implementation status

## Shipped

3D Compare is a client-only React and R3F app with two persistent comparison worlds.

- Height mode has six procedural human identities, a 10-person cap, metric and imperial height editing, orbit controls, pointer-lock walk controls, a meter grid, and a 0 to 220 cm wall ruler.
- Feet mode has female and male foot models with partial lower legs, adult US and EU sizing, orbit controls, table-plane inspect controls, and a centimeter table grid.
- Both modes support add, select, resize, frame, reset, remove, responsive layouts, and `localStorage` persistence.

## Files owned

- `src/domain/**` owns branded millimeters, height and shoe specs, dual worlds, layout, navigation contracts, results, and persistence parsing.
- `src/app/**` owns `createCompareApp`, subscriptions, command handling, persistence hookup, and React store hooks.
- `src/catalog/humans.ts` owns the six human recipes.
- `src/catalog/feet.ts` owns the two foot recipes.
- `src/scene/draw.ts` derives labels, positions, and exact target-to-reference scale.
- `src/scene/standin/**` owns cached procedural human and foot meshes.
- `src/scene/height/**` owns the concrete studio, human figures, orbit controls, and walk controls.
- `src/scene/feet/**` owns the wood table, foot figures, orbit controls, and inspect controls.
- `src/scene/canvas.tsx` owns the shared R3F canvas.
- `src/ui/**` owns the responsive chrome, catalogs, inspector, lineup, mode controls, unit controls, navigation controls, and UI states.
- `scripts/verify-domain.mjs` checks domain conversions, charts, caps, commands, dual-world retention, and persistence.
- `scripts/verify-ui.mjs` drives the desktop and mobile compare flows in system Chrome and writes screenshots to `/tmp/3d-compare-verification`.

## Verify

```bash
npm install
npm run verify:domain
npm run lint
npm run build
npm run dev
curl -I http://127.0.0.1:43123/
npm run verify:ui
```

The development server binds to `127.0.0.1:43123`.

## Known gaps

- The app uses procedural stand-ins. It does not include commissioned GLB models, animation, or clothing controls.
- Human height uses uniform scaling. It does not solve body segments independently.
- Shoe charts cover adult US 4 to 16 for men, US 4 to 14 for women, and EU 34 to 50.
- Persistence is local to one browser. There is no account, cloud sync, or shareable URL.
- The production JavaScript bundle includes Three.js and is about 1.16 MB before gzip. Vite reports its default 500 kB chunk warning.
