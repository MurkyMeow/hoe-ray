import { Map } from '../lib/map'
import { Vec } from '../lib/vec'
import * as util from '../lib/util'

import fragment from './fragment.glslx'
import vertex from './vertex.glslx'

export function init(gl: WebGL2RenderingContext, { map, fov }: { map: Map; fov: number }) {
  // ==============
  // Buffer
  // ==============

  const RAYS_COUNT = gl.canvas.width / 2
  const STEP = 2 / RAYS_COUNT

  const vertices: number[] = [-1, -1]
  for (let i = -1; i < 1; i += STEP) vertices.push(i, 1, i + STEP, -1)
  vertices.push(1, 1)

  const trianglesCount = vertices.length / 2

  util.createScreenBuffer(gl, { vertices })

  // ==============
  // Program
  // ==============

  const program = util.createProgram(gl, {
    vertex: vertex.sourceCode,
    fragment: fragment.sourceCode,
  })

  const positionLoc = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

  // ==============
  // Map
  // ==============

  const mapWidth = map.values[0].length
  const mapHeight = map.values.length

  const mapData = new Uint8Array(map.values.flat().reduce((acc, el) => {
    acc.push(el * 255, 0, 0, 255)
    return acc
  }, [] as number[]))

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
  // FIXME gl.ALPHA or gl.R8UI for internal format?
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, mapWidth, mapHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, mapData)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.activeTexture(gl.TEXTURE0)
  gl.uniform1i(gl.getUniformLocation(program, 'u_map'), 0)

  // ==============
  // Uniforms
  // ==============

  gl.uniform1f(gl.getUniformLocation(program, 'u_halfFov'), fov / 2)
  gl.uniform2f(gl.getUniformLocation(program, 'u_mapSize'), map.cellSize * mapWidth, map.cellSize * mapHeight)
  gl.uniform1f(gl.getUniformLocation(program, 'u_screenHeight'), gl.canvas.height)

  const projectionDistance = gl.canvas.width / 2 / Math.tan(fov / 2)
  const wallScale = map.cellSize * projectionDistance / gl.canvas.height

  gl.uniform1f(gl.getUniformLocation(program, 'u_wallScale'), wallScale)

  const povLoc = gl.getUniformLocation(program, 'u_pov')
  const lookAngleLoc = gl.getUniformLocation(program, 'u_lookAngle')

  // ==============
  // Draw
  // ==============

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  return function draw(pov: { pos: Vec; angle: number }) {
    gl.uniform2f(povLoc, pov.pos.x, pov.pos.y)
    gl.uniform1f(lookAngleLoc, pov.angle)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, trianglesCount)
  }
}
