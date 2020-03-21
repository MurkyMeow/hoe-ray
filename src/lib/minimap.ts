// import * as map from './map'
// import * as vec from './vec'

// export function draw({ map, gl, player, intersections }: {
//   gl: WebGL2RenderingContext;
//   map: map.Map;
//   intersections: vec.Vec[];
//   player: { pos: vec.Vec; angle: number };
// }) {
//   gl.clearColor(0, 0, 0, 1)
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

//   ctx.strokeStyle = 'gray'

//   for (let i = 0; i < map.values.length; i++) {
//     const y = i * map.cellSize
//     for (let j = 0; j < map.values[0].length; j++) {
//       const x = j * map.cellSize
//       ctx.fillStyle = map.values[i][j] ? 'black' : 'white'
//       ctx.fillRect(x, y, map.cellSize, map.cellSize)
//       ctx.strokeRect(x, y, map.cellSize, map.cellSize)
//     }
//   }

//   ctx.fillStyle = 'red'
//   ctx.ellipse(player.pos.x, player.pos.y, 8, 8, 0, 0, Math.PI * 2)
//   ctx.fill()

//   ctx.strokeStyle = 'red'
//   intersections.forEach(intersection => {
//     ctx.beginPath()
//     ctx.moveTo(player.pos.x, player.pos.y)
//     ctx.lineTo(intersection.x, intersection.y)
//     ctx.stroke()
//     ctx.closePath()
//   })
// }
