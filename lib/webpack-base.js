const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const esbuild_std_options = {
  target: 'es2015'
}

module.exports = {
  entry: './index.js',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      // Use esbuild as a Babel alternative
      {
        test: /\.js$/,
        loader: 'esbuild-loader',
        options: esbuild_std_options
      },
      {
        test: /\.jsx$/,
        loader: 'esbuild-loader',
        options: {
          ...esbuild_std_options, loader: 'jsx' }
      },
      {
        test: /\.ts?$/,
        loader: 'esbuild-loader',
        options: esbuild_std_options
      },
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          ...esbuild_std_options, loader: 'tsx' }
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: { esModule: false }
          },
          'css-loader',
          'stylus-loader'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new ProvidePlugin({ React: 'react' })
  ],

  resolve: {
    extensions: ['.js', '.jsx'],
  }
}