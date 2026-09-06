import assert from 'node:assert/strict'
import { createCompareApp } from '../src/app/compare-app.ts'
import { HUMAN_CATALOG } from '../src/catalog/humans.ts'
import { FEET_CATALOG } from '../src/catalog/feet.ts'
import { parseDocumentJson, serializeDocument } from '../src/domain/persist.ts'
import {
  footLengthMm,
  footScale,
  heightMm,
  heightScale,
  parseHeightSpec,
} from '../src/domain/measure.ts'
import { parseShoeSpec } from '../src/domain/shoe-charts.ts'

assert.equal(HUMAN_CATALOG.length, 6)
assert.equal(new Set(HUMAN_CATALOG.map((entry) => entry.id)).size, 6)
assert.equal(FEET_CATALOG.length, 2)

const centimeters = parseHeightSpec({ unit: 'cm', value: 180 })
const imperial = parseHeightSpec({ unit: 'ftin', feet: 5, inches: 10.866 })
assert.equal(centimeters.ok && centimeters.value, heightMm(1800))
assert.equal(imperial.ok && imperial.value, heightMm(1800))
assert.equal(parseHeightSpec({ unit: 'cm', value: 240 }).ok, false)
assert.equal(heightScale(heightMm(1800), heightMm(1980)), 1.1)
assert.equal(footScale(footLengthMm(240), footLengthMm(264)), 1.1)

const womensEight = parseShoeSpec({ system: 'US', size: 8 }, 'female')
const mensEight = parseShoeSpec({ system: 'US', size: 8 }, 'male')
assert.equal(womensEight.ok && womensEight.value, footLengthMm(242))
assert.equal(mensEight.ok && mensEight.value, footLengthMm(255))

const app = createCompareApp()
for (let index = 0; index < 10; index += 1) {
  assert.equal(app.placeHuman(HUMAN_CATALOG[index % HUMAN_CATALOG.length].id).ok, true)
}
const beforeCap = app.getState()
assert.deepEqual(app.placeHuman('female-slim'), { ok: false, reason: 'cap-reached' })
assert.equal(app.getState(), beforeCap)

const firstHuman = app.getState().height.placements[0]
assert.deepEqual(app.updateHumanHeight(firstHuman.id, { unit: 'cm', value: 205 }), {
  ok: true,
})
assert.equal(app.getState().height.placements[0].heightMm, heightMm(2050))
assert.deepEqual(app.updateHumanHeight(firstHuman.id, { unit: 'cm', value: 20 }), {
  ok: false,
  reason: 'out-of-range',
})

app.setMode('feet')
const footResult = app.placeFoot('foot-female')
assert.equal(footResult.ok, true)
if (!footResult.ok) {
  throw new Error('Expected a placed foot.')
}
assert.deepEqual(app.updateFootSize(footResult.id, { system: 'EU', size: 40 }), {
  ok: true,
})
assert.equal(app.getState().feet.placements[0].footLengthMm, footLengthMm(257))
app.setMode('height')
assert.equal(app.getState().height.placements.length, 10)
assert.equal(app.getState().feet.placements.length, 1)

const persisted = parseDocumentJson(serializeDocument(app.getState()))
assert.equal(persisted.ok, true)
assert.equal(persisted.ok && persisted.value.height.placements.length, 10)
assert.equal(persisted.ok && persisted.value.feet.placements.length, 1)
assert.equal(parseDocumentJson('{"version":1,"height":[]}').ok, false)

console.log('Domain verification passed: units, charts, cap, dual worlds, updates, and persistence.')
