// Fails fast with a readable message when the running Node.js is older than the
// floor declared in package.json "engines.node".
//
// Keep this file free of newer syntax and of imports beyond the Node.js core so
// that an old Node.js can still parse it. The point is to replace an opaque
// SyntaxError from deep inside node_modules with an explanation.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const range = manifest.engines && manifest.engines.node
const floor = typeof range === 'string' ? /^>=\s*v?(\d+)\.(\d+)\.(\d+)$/.exec(range.trim()) : null

if (!floor) {
  // Unknown or absent range. Leave enforcement to npm's engine-strict setting.
  process.exit(0)
}

const required = [Number(floor[1]), Number(floor[2]), Number(floor[3])]
const current = process.versions.node.split('.').map(Number)

function isOlder(candidate, reference) {
  for (let index = 0; index < 3; index += 1) {
    if (candidate[index] < reference[index]) {
      return true
    }
    if (candidate[index] > reference[index]) {
      return false
    }
  }
  return false
}

if (isOlder(current, required)) {
  const lines = [
    '',
    `3D Compare needs Node.js ${range}, but this shell runs Node.js v${process.versions.node}.`,
    '',
    'The build tooling (Vite 8 and Rolldown) imports util.styleText, which only',
    'exists in Node.js 20.12 and newer, and the verification scripts rely on',
    'built-in TypeScript type stripping from Node.js 22.',
    '',
    'Install a supported release, then reinstall dependencies:',
    '',
    '  nvm install 22 && nvm use      # .nvmrc pins the major version',
    '  rm -rf node_modules && npm install',
    '',
  ]
  console.error(lines.join('\n'))
  process.exit(1)
}
