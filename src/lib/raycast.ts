import * as vec from './vec'
import * as map from './map'

export interface ScreenConfig {
  fov: number;
  width: number;
  height: number;
}

export interface Ray {
  origin: vec.Vec;
  angle: number;
}

export interface Intersection extends vec.Vec {
  distance: number;
}

export function getIntersections(config: ScreenConfig, map: map.Map, ray: Ray): Intersection[] {
  const result: Intersection[] = []

  const step = 1
  const angleStep = config.fov / config.width

  const dirSin = Math.sin(ray.angle)
  const dirCos = Math.cos(ray.angle)

  for (let i = ray.angle - config.fov / 2; i < ray.angle + config.fov / 2; i += angleStep) {
    const stepX = Math.cos(i) * step
    const stepY = Math.sin(i) * step

    let curX = ray.origin.x + stepX
    let curY = ray.origin.y + stepY

    while (true) {
      const mapX = Math.floor(curX / map.cellSize)
      const mapY = Math.floor(curY / map.cellSize)
      const row = map.values[mapY]
      if (!row) break
      const cell = row[mapX]
      if (cell > 0) {
        const distance = dirSin * (curY - ray.origin.y) + dirCos * (curX - ray.origin.x)
        result.push({ x: curX, y: curY, distance })
        break
      }
      curX += stepX
      curY += stepY
    }
  }

  return result
}
