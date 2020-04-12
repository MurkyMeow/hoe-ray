import { Map } from '../lib/map'
import { Vec } from '../lib/vec'
import * as util from '../lib/util'

import fragment from './fragment.glslx'
import vertex from './vertex.glslx'

export function init(gl: WebGL2RenderingContext, { map, fov }: { map: Map; fov: number }) {
  // just a rectangle covering the full canvas
  const vertices = [
    -1, -1,
    -1, 1,
    1, -1,
    1, 1,
  ]

  const trianglesCount = vertices.length / 2

  util.createScreenBuffer(gl, { vertices })

  const program = util.createProgram(gl, {
    vertex: vertex.sourceCode,
    fragment: fragment.sourceCode,
  })

  const positionLoc = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

  // ===============
  // Map
  // ===============

  const mapWidth = map.values[0].length
  const mapHeight = map.values.length

  const mapData = new Uint8Array(map.values.flat().reduce((acc, el) => {
    acc.push(0, 0, 0, el * 255)
    return acc
  }, [] as number[]))

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, mapWidth, mapHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, mapData)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.activeTexture(gl.TEXTURE0)
  gl.uniform1i(gl.getUniformLocation(program, 'u_map'), 0)

  // ===============
  // POV
  // ===============

  const povLoc = gl.getUniformLocation(program, 'u_pov')
  const lookAngleLoc = gl.getUniformLocation(program, 'u_lookAngle')

  gl.uniform1f(gl.getUniformLocation(program, 'u_halfFov'), fov / 2)

  // ===============
  // Draw
  // ===============

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  return function draw({ pos, angle }: { pos: Vec; angle: number }) {
    gl.uniform2f(povLoc, pos.x / mapWidth, pos.y / mapHeight)
    gl.uniform1f(lookAngleLoc, angle)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, trianglesCount)
  }
}
