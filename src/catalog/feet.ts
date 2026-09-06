import type {
  FigureAlignment,
  FootCatalogEntry,
  FootCatalogId,
} from '../domain/catalog.ts'
import { footLengthMm } from '../domain/measure.ts'

const ALIGNMENT: FigureAlignment = { up: 'y', forward: 'z', soleY: 0 }

export const FEET_CATALOG: readonly FootCatalogEntry[] = [
  {
    id: 'foot-female',
    label: 'Female foot',
    subtitle: 'Narrow last · lower calf',
    sex: 'female',
    referenceFootLengthMm: footLengthMm(240),
    alignment: ALIGNMENT,
    recipe: {
      sex: 'female',
      lastWidth: 'narrow',
      ankleWidth: 0.25,
      archHeight: 0.09,
      skinHex: '#c98f70',
      accentHex: '#a65d4e',
    },
  },
  {
    id: 'foot-male',
    label: 'Male foot',
    subtitle: 'Wide last · lower calf',
    sex: 'male',
    referenceFootLengthMm: footLengthMm(270),
    alignment: ALIGNMENT,
    recipe: {
      sex: 'male',
      lastWidth: 'wide',
      ankleWidth: 0.29,
      archHeight: 0.1,
      skinHex: '#9c6a51',
      accentHex: '#355863',
    },
  },
]

export function footEntry(id: FootCatalogId): FootCatalogEntry {
  const entry = FEET_CATALOG.find((candidate) => candidate.id === id)
  if (!entry) {
    throw new RangeError(`Unknown foot catalog id: ${id}`)
  }

  return entry
}
