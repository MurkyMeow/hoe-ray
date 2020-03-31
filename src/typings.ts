declare module '*.glslx' {
  import { GlslShader } from 'webpack-glsl-minify'
  const shader: GlslShader
  export default shader
}
