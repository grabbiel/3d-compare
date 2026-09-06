import type { Sex } from '../domain/catalog.ts'
import type { FootLengthMm, HeightMm } from '../domain/measure.ts'
import { shoeRows, type ShoeSystem } from '../domain/shoe-charts.ts'

export type ImperialHeightFields = {
  feet: number
  inches: number
}

export function heightInCentimeters(value: HeightMm): number {
  return Math.round((value / 10) * 10) / 10
}

export function splitImperialHeight(value: HeightMm): ImperialHeightFields {
  const totalInches = value / 25.4
  let feet = Math.floor(totalInches / 12)
  let inches = Math.round((totalInches - feet * 12) * 10) / 10
  if (inches >= 12) {
    feet += 1
    inches = 0
  }

  return { feet, inches }
}

export function closestShoeSize(
  value: FootLengthMm,
  system: ShoeSystem,
  sex: Sex,
): number {
  return shoeRows(system, sex).reduce((best, row) =>
    Math.abs(row.mm - value) < Math.abs(best.mm - value) ? row : best,
  ).size
}
