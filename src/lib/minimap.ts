import * as map from './map'
import * as vec from './vec'

export function draw({ map, ctx, player, intersections }: {
  ctx: CanvasRenderingContext2D;
  map: map.Map;
  intersections: vec.Vec[];
  player: { pos: vec.Vec; angle: number };
}) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.strokeStyle = 'gray'

  for (let i = 0; i < map.values.length; i++) {
    const y = i * map.cellSize
    for (let j = 0; j < map.values[0].length; j++) {
      const x = j * map.cellSize
      ctx.fillStyle = map.values[i][j] ? 'black' : 'white'
      ctx.fillRect(x, y, map.cellSize, map.cellSize)
      ctx.strokeRect(x, y, map.cellSize, map.cellSize)
    }
  }

  ctx.fillStyle = 'red'
  ctx.ellipse(player.pos.x, player.pos.y, 8, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'red'
  intersections.forEach(intersection => {
    ctx.beginPath()
    ctx.moveTo(player.pos.x, player.pos.y)
    ctx.lineTo(intersection.x, intersection.y)
    ctx.stroke()
    ctx.closePath()
  })
}
