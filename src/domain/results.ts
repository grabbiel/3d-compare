import type { PlacementId } from './ids.ts'

export type PlaceResult =
  | { ok: true; id: PlacementId }
  | { ok: false; reason: 'cap-reached' }

export type UpdateResult =
  | { ok: true }
  | { ok: false; reason: 'not-found' | 'out-of-range' }
