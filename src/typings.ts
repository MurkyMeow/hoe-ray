declare module '*.glslx' {
  import { GlslShader } from 'webpack-glsl-minify'
  const shader: GlslShader
  export default shader
}

declare module '*.jpg' {
  const source: string
  export default source
}

declare module '*.png' {
  const source: string
  export default source
}
