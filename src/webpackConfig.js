/* eslint-disable import/no-commonjs */

const path = require('path')

const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StatsPlugin = require('stats-webpack-plugin')

const babelConfig = require('../babel.config')

const getPath = p => path.resolve(__dirname, p)

function webpackConfig({ server, dev }) {
  const client = !server
  const prod = !dev

  return {
    name: client ? 'client' : 'server',
    mode: dev ? 'development' : 'production',

    ...(client && {
      entry: [
        '@babel/polyfill',
        getPath('./client/index.js'),
        ...(dev ? ['webpack-hot-middleware/client'] : [])
      ]
    }),

    ...(server && {
      entry: ['@babel/polyfill', getPath('./renderServer.js')],
      target: 'node',
      externals: [nodeExternals()],
      node: {
        __dirname: false
      }
    }),

    output: {
      ...(client && {
        publicPath: '/static/',
        path: getPath('../build/webpack/static')
      }),

      ...(server && {
        libraryTarget: 'commonjs2',
        path: getPath('../build/webpack'),
        filename: 'server.js'
      })
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [getPath('../node_modules')],
          use: {
            loader: 'babel-loader',
            options: babelConfig
          }
        }
      ]
    },

    ...(prod && {
      plugins: [new StatsPlugin('stats.json')]
    }),

    ...(dev && { plugins: [new webpack.HotModuleReplacementPlugin()] })
  }
}

module.exports = webpackConfig
