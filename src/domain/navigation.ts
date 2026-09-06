export type HeightNavMode = 'orbit' | 'walk'
export type FeetNavMode = 'orbit' | 'inspect'

export type HeightOrbitSnapshot = {
  kind: 'orbit'
  target: readonly [number, number, number]
  position: readonly [number, number, number]
}

export type HeightWalkSnapshot = {
  kind: 'walk'
  eye: readonly [number, number, number]
  yaw: number
  pitch: number
}

export type HeightNavSnapshot = HeightOrbitSnapshot | HeightWalkSnapshot

export type FeetOrbitSnapshot = {
  kind: 'orbit'
  target: readonly [number, number, number]
  position: readonly [number, number, number]
}

export type FeetInspectSnapshot = {
  kind: 'inspect'
  target: readonly [number, number, number]
  position: readonly [number, number, number]
}

export type FeetNavSnapshot = FeetOrbitSnapshot | FeetInspectSnapshot

export type HeightCameraIntent =
  | { kind: 'none' }
  | { kind: 'frame-selection' }
  | { kind: 'reset' }
  | { kind: 'restore'; snapshot: HeightNavSnapshot }

export type FeetCameraIntent =
  | { kind: 'none' }
  | { kind: 'frame-selection' }
  | { kind: 'reset' }
  | { kind: 'restore'; snapshot: FeetNavSnapshot }

export const DEFAULT_WALK_EYE_M = 1.65
