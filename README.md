# 3D Compare

3D Compare is a browser tool for seeing size differences at true relative scale. Build a lineup of people by height, or compare adult foot lengths by shoe size.

## Run the app

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Comparison modes

### Height

Add up to 10 procedural human models to a calibrated concrete studio. Choose among three female and three male silhouettes. Set each height in feet and inches or centimeters.

Use **Orbit** to rotate, pan, and zoom around the lineup. Use **Walk** to look with the pointer and move with W, A, S, and D.

### Feet

Place female and male foot models with partial lower legs on a centimeter table. Choose an adult US or EU shoe size. 3D Compare maps the size to foot length before scaling the model.

Use **Orbit** to rotate around the table. Use **Inspect** for table-plane panning and close zoom.

## Local data only

The app has no backend, account, Go service, or AWS resource. The static catalogs ship with the client. Your two comparison lineups persist in browser `localStorage`.

## Verify a change

```bash
npm run verify:domain
npm run lint
npm run build
```

With the development server and system Chrome running, exercise the complete compare flow:

```bash
npm run verify:ui
```
