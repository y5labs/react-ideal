const base = require('./webpack-base.js')
const { merge } = require('webpack-merge')
const { DefinePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: 'errors-only',
  plugins: [
    new DefinePlugin({
      API_URL: JSON.stringify('http://localhost:8081')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
})
