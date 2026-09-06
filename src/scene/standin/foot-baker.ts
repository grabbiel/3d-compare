import * as THREE from 'three'
import type { FootRecipe } from '../../domain/catalog.ts'

const templates = new WeakMap<FootRecipe, THREE.Group>()

function material(
  color: THREE.ColorRepresentation,
  roughness: number,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.01 })
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

function buildFoot(recipe: FootRecipe): THREE.Group {
  const group = new THREE.Group()
  const skin = material(recipe.skinHex, 0.7)
  const skinShadow = material(new THREE.Color(recipe.skinHex).multiplyScalar(0.82), 0.75)
  const accent = material(recipe.accentHex, 0.64)
  const nail = material('#ead8c9', 0.48)
  const width = recipe.lastWidth === 'wide' ? 0.39 : 0.34

  group.add(
    mesh(
      new THREE.SphereGeometry(1, 28, 16),
      skinShadow,
      [0, 0.045, -0.06],
      [width / 2, 0.045, 0.44],
    ),
    mesh(
      new THREE.SphereGeometry(1, 28, 16),
      skin,
      [0, 0.12 + recipe.archHeight * 0.18, 0.02],
      [width * 0.48, 0.13, 0.36],
      [-0.08, 0, 0],
    ),
    mesh(
      new THREE.SphereGeometry(1, 20, 14),
      skin,
      [0, 0.1, -0.39],
      [width * 0.47, 0.12, 0.13],
    ),
  )

  const toeWidths = [0.087, 0.074, 0.066, 0.056, 0.047]
  const toeOffsets = [-0.1, -0.045, 0.012, 0.067, 0.112]
  const toeDepths = [0.455, 0.47, 0.456, 0.43, 0.4]
  for (let index = 0; index < toeWidths.length; index += 1) {
    const toeWidth = toeWidths[index] * (width / 0.36)
    const toe = mesh(
      new THREE.SphereGeometry(1, 18, 12),
      skin,
      [toeOffsets[index] * (width / 0.36), 0.105, toeDepths[index]],
      [toeWidth / 2, 0.065 - index * 0.004, toeWidth * 0.72],
    )
    const toenail = mesh(
      new THREE.SphereGeometry(1, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.48),
      nail,
      [
        toeOffsets[index] * (width / 0.36),
        0.148 - index * 0.004,
        toeDepths[index] + toeWidth * 0.38,
      ],
      [toeWidth * 0.28, toeWidth * 0.09, toeWidth * 0.34],
      [-0.2, 0, 0],
    )
    group.add(toe, toenail)
  }

  const ankleY = 0.35
  group.add(
    mesh(
      new THREE.CylinderGeometry(
        recipe.ankleWidth * 0.42,
        recipe.ankleWidth * 0.48,
        0.42,
        20,
      ),
      skin,
      [0, ankleY, -0.22],
    ),
    mesh(
      new THREE.CapsuleGeometry(recipe.ankleWidth * 0.49, 0.38, 6, 18),
      skin,
      [0, 0.7, -0.215],
      [1.06, 1, 0.92],
    ),
    mesh(
      new THREE.SphereGeometry(1, 16, 12),
      skinShadow,
      [-recipe.ankleWidth * 0.49, 0.29, -0.22],
      [0.035, 0.045, 0.035],
    ),
    mesh(
      new THREE.SphereGeometry(1, 16, 12),
      skinShadow,
      [recipe.ankleWidth * 0.49, 0.305, -0.22],
      [0.03, 0.04, 0.03],
    ),
    mesh(
      new THREE.TorusGeometry(width * 0.37, 0.012, 8, 32),
      accent,
      [0, 0.46, -0.22],
      [1, 1, 0.82],
      [Math.PI / 2, 0, 0],
    ),
  )

  group.name = `${recipe.sex}-${recipe.lastWidth}-foot-standin`
  return group
}

export function bakeFootStandIn(recipe: FootRecipe): THREE.Group {
  let template = templates.get(recipe)
  if (!template) {
    template = buildFoot(recipe)
    templates.set(recipe, template)
  }

  return template.clone(true)
}
