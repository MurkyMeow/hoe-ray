export function createCanvas(args: { width: number; height: number }): WebGL2RenderingContext {
  const ctx = document.body
    .appendChild(document.createElement('canvas'))
    .getContext('webgl2')

  if (!ctx) throw new Error('Could not get a rendering context')

  ctx.canvas.width = args.width
  ctx.canvas.height = args.height

  return ctx
}

export function createScreenBuffer(gl: WebGL2RenderingContext, args: { vertices: number[] }): WebGLBuffer {
  const screenBuffer = gl.createBuffer()
  if (!screenBuffer) throw Error('Could not create a buffer')
  gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(args.vertices), gl.STATIC_DRAW)
  return screenBuffer
}

export function createProgram(gl: WebGL2RenderingContext, args: { vertex: string; fragment: string; }): WebGLProgram {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  if (!vertexShader) throw Error('Could not create a vertex shader')
  gl.shaderSource(vertexShader, args.vertex)
  gl.compileShader(vertexShader)

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  if (!fragmentShader) throw Error('Could not create a fragment shader')
  gl.shaderSource(fragmentShader, args.fragment)
  gl.compileShader(fragmentShader)

  const program = gl.createProgram()
  if (!program) throw Error('Could not create a program')
  gl.attachShader(program, fragmentShader)
  gl.attachShader(program, vertexShader)
  gl.linkProgram(program)
  gl.useProgram(program)
  
  return program
}

export function loadTexture(gl: WebGL2RenderingContext, args: { url: string }): Promise<WebGLTexture | null> {
  const texture = gl.createTexture()

  return new Promise(resolve => {
    const image = new Image()
    image.src = args.url

    image.onload = () => {
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      resolve(texture)
    }

    image.onerror = () => {
      resolve(null)
    }
  })
}
