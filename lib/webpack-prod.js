const base = require('./webpack-base.js')
const { merge } = require('webpack-merge')
const { DefinePlugin } = require('webpack')
const { ESBuildMinifyPlugin } = require('esbuild-loader')

module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new DefinePlugin({
      API_URL: JSON.stringify('https://production.y5.nz')
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin()
    ]
  },
})