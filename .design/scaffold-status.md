# Scaffold status

## Environment

- cwd: `/workspace`
- Node: `v22.14.0`
- npm: `10.9.7`

## Steps

1. Ran `npm create vite@latest 3d-compare-scaffold -- --template react-ts` in `/tmp` (`create-vite@9.2.0`).
2. Moved every generated file, including hidden files, into `/workspace`. Skipped `.git`. Left the existing `/workspace/.design` directory in place.
3. Ran `npm install` in `/workspace`.
4. Ran `npm install three @types/three @react-three/fiber @react-three/drei`.
5. Ran `npm install -D tailwindcss @tailwindcss/vite`.
6. Added `tailwindcss()` next to `react()` in `vite.config.ts`.
7. Added `@import "tailwindcss";` at the top of `src/index.css`.
8. Set `package.json` scripts to bind Vite to `127.0.0.1:43123` for `dev` and `preview`. Left `build` as `tsc -b && vite build`.

## Install result

All three `npm install` commands exited 0. `npm audit` reported 0 vulnerabilities.

Resolved versions after install:

- `vite` `^8.2.2`
- `react` / `react-dom` `^19.2.8`
- `three` `^0.185.1`
- `@types/three` `^0.185.4`
- `@react-three/fiber` `^9.7.0`
- `@react-three/drei` `^10.7.8`
- `tailwindcss` / `@tailwindcss/vite` `^4.3.3`

## Files at repo root

Vite template files now live at `/workspace`, not in a nested app directory. `/workspace/.git` and `/workspace/.design` were not replaced.

## Errors

None during create, move, or install.
