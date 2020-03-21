import * as vec from './vec'
import fragment from './frag.glslx'
import vertex from './vert.glslx'

export function draw({ gl, player }: {
  gl: WebGL2RenderingContext;
  player: { pos: vec.Vec; angle: number };
}) {
  // ==============
  // Buffer
  // ==============

  const FOV = Math.PI / 3

  const RAYS_COUNT = 100
  const STEP = RAYS_COUNT / gl.canvas.width

  const _vertices: number[] = []

  for (let i = -1; i < 1; i += STEP) {
    _vertices.push(
      i, 1,
      i + STEP, 1,
      i + STEP, -1,
      i, 1,
      i, -1,
      i + STEP, -1,
    )
  }

  const vertices = new Float32Array(_vertices)

  const screenBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  // ==============
  // Vertex shader
  // ==============

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  if (!vertexShader) throw Error('Could not create a vertex shader')
  gl.shaderSource(vertexShader, vertex.sourceCode)
  gl.compileShader(vertexShader)

  // ==============
  // Fragment shader
  // ==============

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

  const MAP_WIDTH = 5
  const MAP_HEIGHT = 5

  const map = new Uint8Array([
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1,
  ].reduce((acc, el) => {
    acc.push(el, 0, 0, 1)
    return acc
  }, [] as number[]))

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // FIXME gl.ALPHA or gl.R8UI for internal format?
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, MAP_WIDTH, MAP_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, map)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

  const mapLoc = gl.getUniformLocation(program, 'u_map')
  gl.activeTexture(gl.TEXTURE0)
  gl.uniform1i(mapLoc, 0)

  // ==============
  // Player
  // ==============

  const playerPosLoc = gl.getUniformLocation(program, 'u_playerPos')
  gl.uniform2fv(playerPosLoc, [player.pos.x, player.pos.y])

  const playerAngleLoc = gl.getUniformLocation(program, 'u_playerAngle')
  gl.uniform1f(playerAngleLoc, player.angle)

  const projectionDistanceLoc = gl.getUniformLocation(program, 'u_projectionDistance')
  gl.uniform1f(projectionDistanceLoc, gl.canvas.width / 2 / Math.tan(FOV / 2))

  const screenHeightLoc = gl.getUniformLocation(program, 'u_screenHeight')
  gl.uniform1f(screenHeightLoc, gl.canvas.height)

  const screenWidthLoc = gl.getUniformLocation(program, 'u_screenWidth')
  gl.uniform1f(screenWidthLoc, gl.canvas.width)

  // ==============
  // Draw
  // ==============

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  ;(function render() {
    player.angle += 0.01
    gl.uniform1f(playerAngleLoc, player.angle)
    gl.uniform2f(playerPosLoc, player.pos.x, player.pos.y)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2)
    // requestAnimationFrame(render)
  }())
}
