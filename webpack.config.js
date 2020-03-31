const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

const production = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './src/index.ts',
  mode: production ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bootstrap.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.glslx$/,
        use: {
          loader: 'webpack-glsl-minify',
          options: {
            disableMangle: !production,
            preserveUniforms: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.glslx'],
  },
  plugins: [
    new CopyPlugin(['src/index.html']),
  ],
}
