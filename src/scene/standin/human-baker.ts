import * as THREE from 'three'
import type { BodyRecipe } from '../../domain/catalog.ts'

const templates = new WeakMap<BodyRecipe, THREE.Group>()

function material(color: THREE.ColorRepresentation, roughness = 0.72): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0.02,
  })
}

function mesh(
  geometry: THREE.BufferGeometry,
  surface: THREE.Material,
  position: readonly [number, number, number],
  scale: readonly [number, number, number] = [1, 1, 1],
  rotation: readonly [number, number, number] = [0, 0, 0],
): THREE.Mesh {
  const node = new THREE.Mesh(geometry, surface)
  node.position.set(...position)
  node.scale.set(...scale)
  node.rotation.set(...rotation)
  node.castShadow = true
  node.receiveShadow = true
  return node
}

function capsule(height: number, radius: number): THREE.CapsuleGeometry {
  return new THREE.CapsuleGeometry(radius, Math.max(0.001, height - radius * 2), 5, 12)
}

function addHair(
  group: THREE.Group,
  recipe: BodyRecipe,
  hair: THREE.MeshStandardMaterial,
  headY: number,
  headHeight: number,
): void {
  const capY = headY + headHeight * 0.2
  const cap = mesh(
    new THREE.SphereGeometry(1, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.62),
    hair,
    [0, capY, -0.006],
    [headHeight * 0.57, headHeight * 0.58, headHeight * 0.54],
  )
  group.add(cap)

  if (recipe.hair === 'bob' || recipe.hair === 'wave') {
    const length = recipe.hair === 'wave' ? headHeight * 0.9 : headHeight * 0.62
    group.add(
      mesh(
        new THREE.SphereGeometry(1, 16, 12),
        hair,
        [0, headY - headHeight * 0.12, -headHeight * 0.24],
        [headHeight * 0.61, length, headHeight * 0.48],
      ),
    )
  }

  if (recipe.hair === 'bun') {
    group.add(
      mesh(
        new THREE.SphereGeometry(1, 16, 12),
        hair,
        [0, headY + headHeight * 0.59, -headHeight * 0.32],
        [headHeight * 0.33, headHeight * 0.33, headHeight * 0.33],
      ),
    )
  }

  if (recipe.hair === 'fade') {
    cap.scale.x *= 0.92
    cap.scale.z *= 0.92
  }

  if (recipe.hair === 'close') {
    cap.scale.y *= 0.45
    cap.position.y -= headHeight * 0.02
  }
}

function buildHuman(recipe: BodyRecipe): THREE.Group {
  const group = new THREE.Group()
  const skin = material(recipe.skinHex, 0.68)
  const clothing = material(recipe.clothingHex, 0.8)
  const accent = material(recipe.accentHex, 0.76)
  const hair = material(recipe.hairHex, 0.9)
  const shoeColor = new THREE.Color(recipe.clothingHex).multiplyScalar(0.38)
  const shoes = material(shoeColor, 0.58)
  const eyes = material('#f2eee6', 0.45)
  const pupils = material('#171b1d', 0.5)

  const buildFactor =
    recipe.build === 'slim' ? 0.9 : recipe.build === 'athletic' ? 1.04 : 1.18
  const hipY = recipe.inseamRatio
  const kneeY = 0.245
  const ankleY = 0.058
  const legRadius = 0.034 * buildFactor
  const thighRadius = legRadius * 1.28
  const shoeWidth = legRadius * 2.25
  const leftX = -recipe.stance / 2
  const rightX = recipe.stance / 2

  for (const x of [leftX, rightX]) {
    group.add(
      mesh(
        new THREE.SphereGeometry(1, 16, 10),
        shoes,
        [x, 0.027, 0.025],
        [shoeWidth, 0.027, shoeWidth * 1.72],
      ),
      mesh(
        capsule(kneeY - ankleY, legRadius),
        accent,
        [x, (kneeY + ankleY) / 2, 0],
      ),
      mesh(
        new THREE.SphereGeometry(1, 14, 10),
        accent,
        [x, kneeY, 0],
        [legRadius * 1.05, legRadius * 1.05, legRadius * 1.05],
      ),
      mesh(
        capsule(hipY - kneeY, thighRadius),
        accent,
        [x, (hipY + kneeY) / 2, 0],
      ),
    )
  }

  const hipHeight = recipe.build === 'heavy' ? 0.13 : 0.105
  group.add(
    mesh(
      new THREE.SphereGeometry(1, 22, 14),
      accent,
      [0, hipY + hipHeight * 0.22, 0],
      [recipe.hipWidth / 2, hipHeight, recipe.torsoDepth * 0.54],
    ),
  )

  const shoulderY = 0.79
  const torsoBottom = hipY + hipHeight * 0.35
  const torsoHeight = shoulderY - torsoBottom
  const torsoWidth = (recipe.shoulderWidth + recipe.hipWidth) / 4
  group.add(
    mesh(
      new THREE.SphereGeometry(1, 24, 16),
      clothing,
      [0, torsoBottom + torsoHeight / 2, 0],
      [torsoWidth, torsoHeight / 2, recipe.torsoDepth / 2],
    ),
    mesh(
      new THREE.TorusGeometry(recipe.hipWidth * 0.39, 0.009, 8, 28),
      shoes,
      [0, torsoBottom + 0.01, 0],
      [1, 1, 0.7],
      [Math.PI / 2, 0, 0],
    ),
  )

  const shoulderRadius = 0.043 * buildFactor
  const armRadius = shoulderRadius * 0.82
  const shoulderX = recipe.shoulderWidth / 2
  const elbowY = 0.61
  const wristY = 0.445
  const armTilt = recipe.sex === 'female' ? 0.07 : 0.095

  for (const side of [-1, 1]) {
    const sign = side
    group.add(
      mesh(
        new THREE.SphereGeometry(1, 14, 10),
        clothing,
        [sign * shoulderX, shoulderY - 0.015, 0],
        [shoulderRadius, shoulderRadius, shoulderRadius],
      ),
      mesh(
        capsule(shoulderY - elbowY, armRadius),
        clothing,
        [sign * (shoulderX + armTilt * 0.42), (shoulderY + elbowY) / 2, 0],
        [1, 1, 1],
        [0, 0, -sign * armTilt],
      ),
      mesh(
        new THREE.SphereGeometry(1, 12, 8),
        skin,
        [sign * (shoulderX + armTilt * 0.8), elbowY, 0],
        [armRadius * 0.94, armRadius * 0.94, armRadius * 0.94],
      ),
      mesh(
        capsule(elbowY - wristY, armRadius * 0.86),
        skin,
        [sign * (shoulderX + armTilt), (elbowY + wristY) / 2, 0.012],
        [1, 1, 1],
        [0, 0, -sign * armTilt * 0.35],
      ),
      mesh(
        new THREE.CapsuleGeometry(armRadius * 0.88, 0.018, 4, 10),
        skin,
        [sign * (shoulderX + armTilt * 1.05), wristY - 0.035, 0.018],
        [0.82, 1, 0.72],
      ),
    )
  }

  const neckY = 0.825
  const headHeight = recipe.headRatio
  const headY = 1 - headHeight / 2 - 0.006
  const headWidth = headHeight * (recipe.sex === 'female' ? 0.54 : 0.57)
  group.add(
    mesh(
      new THREE.CylinderGeometry(0.034 * buildFactor, 0.039 * buildFactor, 0.07, 14),
      skin,
      [0, neckY, 0],
    ),
    mesh(
      new THREE.SphereGeometry(1, 24, 18),
      skin,
      [0, headY, 0.002],
      [headWidth, headHeight / 2, headHeight * 0.47],
    ),
    mesh(
      new THREE.ConeGeometry(headHeight * 0.09, headHeight * 0.16, 10),
      skin,
      [0, headY - headHeight * 0.015, headHeight * 0.49],
      [1, 1, 0.72],
      [Math.PI / 2, 0, 0],
    ),
  )

  const eyeY = headY + headHeight * 0.08
  for (const x of [-headWidth * 0.36, headWidth * 0.36]) {
    group.add(
      mesh(
        new THREE.SphereGeometry(headHeight * 0.075, 12, 8),
        eyes,
        [x, eyeY, headHeight * 0.445],
        [1.15, 0.75, 0.5],
      ),
      mesh(
        new THREE.SphereGeometry(headHeight * 0.032, 10, 8),
        pupils,
        [x, eyeY, headHeight * 0.49],
        [1, 1, 0.45],
      ),
    )
  }

  for (const x of [-headWidth * 1.02, headWidth * 1.02]) {
    group.add(
      mesh(
        new THREE.SphereGeometry(headHeight * 0.11, 10, 8),
        skin,
        [x, headY, 0],
        [0.42, 1, 0.62],
      ),
    )
  }

  addHair(group, recipe, hair, headY, headHeight)
  group.name = `${recipe.sex}-${recipe.build}-standin`
  return group
}

export function bakeHumanStandIn(recipe: BodyRecipe): THREE.Group {
  let template = templates.get(recipe)
  if (!template) {
    template = buildHuman(recipe)
    templates.set(recipe, template)
  }

  return template.clone(true)
}
