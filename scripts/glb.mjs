// Minimal glTF binary reader for verification scripts. Enough to read vertex
// positions of named meshes without a browser or Three.js.
import { readFileSync } from 'node:fs'

const JSON_CHUNK = 0x4e4f534a
const BIN_CHUNK = 0x004e4942
const COMPONENT_BYTES = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 }
const TYPE_COUNT = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }

export function readGlb(path) {
  const buffer = readFileSync(path)
  if (buffer.readUInt32LE(0) !== 0x46546c67) {
    throw new Error(`${path} is not a GLB file.`)
  }

  const totalLength = buffer.readUInt32LE(8)
  let offset = 12
  let json = null
  let bin = null
  while (offset < totalLength) {
    const length = buffer.readUInt32LE(offset)
    const type = buffer.readUInt32LE(offset + 4)
    const chunk = buffer.subarray(offset + 8, offset + 8 + length)
    if (type === JSON_CHUNK) {
      json = JSON.parse(chunk.toString('utf8'))
    } else if (type === BIN_CHUNK) {
      bin = chunk
    }
    offset += 8 + length
  }

  if (!json || !bin) {
    throw new Error(`${path} is missing its JSON or binary chunk.`)
  }

  return { json, bin }
}

/** Positions of every vertex in the named mesh, as [x, y, z] in the file's own units. */
export function meshPositions(glb, meshName) {
  const mesh = glb.json.meshes.find((candidate) => candidate.name === meshName)
  if (!mesh) {
    throw new Error(`Mesh ${meshName} not found.`)
  }

  const points = []
  for (const primitive of mesh.primitives) {
    const accessor = glb.json.accessors[primitive.attributes.POSITION]
    const view = glb.json.bufferViews[accessor.bufferView]
    const stride = view.byteStride ?? COMPONENT_BYTES[accessor.componentType] * TYPE_COUNT[accessor.type]
    const base = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0)
    for (let index = 0; index < accessor.count; index += 1) {
      const at = base + index * stride
      points.push([glb.bin.readFloatLE(at), glb.bin.readFloatLE(at + 4), glb.bin.readFloatLE(at + 8)])
    }
  }

  return points
}

export function bounds(points) {
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (const point of points) {
    for (let axis = 0; axis < 3; axis += 1) {
      min[axis] = Math.min(min[axis], point[axis])
      max[axis] = Math.max(max[axis], point[axis])
    }
  }

  return { min, max }
}
