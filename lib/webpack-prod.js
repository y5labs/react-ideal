const base = require('./webpack-base.js')
const { merge } = require('webpack-merge')
const { DefinePlugin } = require('webpack')
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new DefinePlugin({
      API_URL: JSON.stringify('https://production.y5.nz')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015', css: true })]
  },
})
