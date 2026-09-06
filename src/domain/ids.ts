declare const placementIdBrand: unique symbol
export type PlacementId = string & { readonly [placementIdBrand]: 'PlacementId' }

export function placementId(value: string): PlacementId {
  if (value.length === 0) {
    throw new RangeError('Placement id cannot be empty.')
  }

  return value as PlacementId
}

export function mintPlacementId(): PlacementId {
  return placementId(`placement-${globalThis.crypto.randomUUID()}`)
}
