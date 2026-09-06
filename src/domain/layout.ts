export type FloorPose = {
  space: 'floor'
  x: number
  z: number
  yaw: number
}

export type SurfacePose = {
  space: 'table'
  x: number
  z: number
  yaw: number
}

export type PlanarDelta = {
  x: number
  z: number
  yaw?: number
}

export const HUMAN_SPACING_M = 0.82
export const FOOT_SPACING_M = 0.22

function centeredSlot(index: number): number {
  if (index === 0) {
    return 0
  }

  const distance = Math.ceil(index / 2)
  return index % 2 === 1 ? -distance : distance
}

export function nextHumanPose(count: number): FloorPose {
  return {
    space: 'floor',
    x: centeredSlot(count) * HUMAN_SPACING_M,
    z: Math.abs(centeredSlot(count)) > 3 ? 0.55 : 0,
    yaw: 0,
  }
}

export function nextFootPose(count: number): SurfacePose {
  const column = count % 5
  const row = Math.floor(count / 5)
  return {
    space: 'table',
    x: centeredSlot(column) * FOOT_SPACING_M,
    z: row === 0 ? -0.14 : 0.14,
    yaw: 0,
  }
}
