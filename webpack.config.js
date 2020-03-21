const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './src/index.ts',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
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
