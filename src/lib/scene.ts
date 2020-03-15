import * as map from './map'
import * as raycast from './raycast'

export function draw({ map, config, ctx, intersections }: {
  ctx: CanvasRenderingContext2D;
  map: map.Map;
  config: raycast.ScreenConfig;
  intersections: raycast.Intersection[];
}) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  const barWidth = ctx.canvas.width / intersections.length
  const projectionDistance = config.width / 2 / Math.tan(config.fov / 2)

  intersections.forEach(({ distance }, i) => {
    const barHeight = map.cellSize / distance * projectionDistance
    const color = 255 - distance
    ctx.fillStyle = `rgba(${color}, ${color}, ${color})`
    ctx.fillRect(i * barWidth, (config.height - barHeight) / 2, barWidth, barHeight)
  })
}
