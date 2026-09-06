import type { FootLengthMm, HeightMm } from './measure.ts'

export type Sex = 'female' | 'male'
export type BodyBuild = 'slim' | 'athletic' | 'heavy'
export type HairStyle = 'bob' | 'crop' | 'bun' | 'fade' | 'wave' | 'close'

export const HUMAN_CATALOG_IDS = [
  'female-slim',
  'female-athletic',
  'female-heavy',
  'male-slim',
  'male-athletic',
  'male-heavy',
] as const
export type HumanCatalogId = (typeof HUMAN_CATALOG_IDS)[number]

export const FOOT_CATALOG_IDS = ['foot-female', 'foot-male'] as const
export type FootCatalogId = (typeof FOOT_CATALOG_IDS)[number]

export type BodyRecipe = {
  sex: Sex
  build: BodyBuild
  shoulderWidth: number
  hipWidth: number
  torsoDepth: number
  inseamRatio: number
  headRatio: number
  stance: number
  hair: HairStyle
  skinHex: string
  clothingHex: string
  accentHex: string
  hairHex: string
}

export type FootRecipe = {
  sex: Sex
  lastWidth: 'narrow' | 'wide'
  ankleWidth: number
  archHeight: number
  skinHex: string
  accentHex: string
}

export type FigureAlignment = {
  up: 'y'
  forward: 'z'
  soleY: 0
}

export type HumanCatalogEntry = {
  id: HumanCatalogId
  label: string
  subtitle: string
  sex: Sex
  recipe: BodyRecipe
  referenceHeightMm: HeightMm
  alignment: FigureAlignment
}

export type FootCatalogEntry = {
  id: FootCatalogId
  label: string
  subtitle: string
  sex: Sex
  recipe: FootRecipe
  referenceFootLengthMm: FootLengthMm
  alignment: FigureAlignment
}
