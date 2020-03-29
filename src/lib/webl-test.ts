import { Map } from './map'
import { Vec } from './vec'

import fragment from './frag.glslx'
import vertex from './vert.glslx'

export function init({ gl, map, fov }: {
  gl: WebGL2RenderingContext;
  map: Map;
  fov: number;
}) {
  // ==============
  // Buffer
  // ==============

  const RAYS_COUNT = 100
  const STEP = 2 / RAYS_COUNT

  const _vertices: number[] = [-1, -1]

  for (let i = -1; i < 1; i += STEP) {
    _vertices.push(i, 1, i + STEP, -1)
  }

  _vertices.push(1, 1)

  const vertices = new Float32Array(_vertices)
  const trianglesCount = vertices.length / 2

  const screenBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  // ==============
  // Shader
  // ==============

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  if (!vertexShader) throw Error('Could not create a vertex shader')
  gl.shaderSource(vertexShader, vertex.sourceCode)
  gl.compileShader(vertexShader)

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  if (!fragmentShader) throw Error('Could not create a fragment shader')
  gl.shaderSource(fragmentShader, fragment.sourceCode)
  gl.compileShader(fragmentShader)

  // ==============
  // Program
  // ==============

  const program = gl.createProgram()
  if (!program) throw Error('Could not create a program')
  gl.attachShader(program, fragmentShader)
  gl.attachShader(program, vertexShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  // ==============
  // Attributes
  // ==============

  const positionLoc = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

  // ==============
  // Map
  // ==============

  const mapWidth = map.values[0].length
  const mapHeight = map.values.length

  const mapData = new Uint8Array(map.values.flat().reduce((acc, el) => {
    acc.push(el * 255, 0, 0, 1)
    return acc
  }, [] as number[]))

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // FIXME gl.ALPHA or gl.R8UI for internal format?
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, mapWidth, mapHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, mapData)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

  gl.activeTexture(gl.TEXTURE0)
  gl.uniform1i(gl.getUniformLocation(program, 'u_map'), 0)

  // ==============
  // Player
  // ==============

  gl.uniform1f(gl.getUniformLocation(program, 'u_halfFov'), fov / 2)
  gl.uniform1f(gl.getUniformLocation(program, 'u_projectionDistance'), gl.canvas.width / 2 / Math.tan(fov / 2))
  gl.uniform1f(gl.getUniformLocation(program, 'u_cellSize'), map.cellSize)
  gl.uniform2f(gl.getUniformLocation(program, 'u_mapSize'), mapWidth, mapHeight)
  gl.uniform1f(gl.getUniformLocation(program, 'u_screenHeight'), gl.canvas.height)

  const playerPosLoc = gl.getUniformLocation(program, 'u_playerPos')
  const playerAngleLoc = gl.getUniformLocation(program, 'u_playerAngle')

  // ==============
  // Draw
  // ==============

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  return function draw(pov: { pos: Vec; angle: number }) {
    gl.uniform2f(playerPosLoc, pov.pos.x, pov.pos.y)
    gl.uniform1f(playerAngleLoc, pov.angle)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, trianglesCount)
  }
}
