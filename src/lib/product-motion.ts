export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/**
 * Cuánto se hunde un producto en la plataforma (0 = de pie, 1 = del todo hundido).
 * `distance` es la separación, en productos, entre él y el que está en foco: el que sale
 * baja primero (0.12 → 0.5) y el que entra sube después (0.5 → 0.12), sin solaparse.
 */
export const sunk = (distance: number) => smoothstep(0.12, 0.5, Math.abs(distance))
