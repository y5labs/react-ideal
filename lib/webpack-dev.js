const base = require('./webpack-base.js')
const { merge } = require('webpack-merge')
const { DefinePlugin } = require('webpack')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: 'errors-only',
  plugins: [
    new DefinePlugin({
      API_URL: JSON.stringify('http://localhost:8081')
    })
  ]
})
