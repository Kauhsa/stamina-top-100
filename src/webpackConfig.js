/* eslint-disable import/no-commonjs */

const path = require('path')
const fs = require('fs')

const webpack = require('webpack')
const StatsPlugin = require('stats-webpack-plugin')

const babelConfig = require('../babel.config')

const getPath = p => path.resolve(__dirname, p)

const serverExternals = fs
  .readdirSync(getPath('../node_modules'))
  .filter(x => !/\.bin|react-universal-component|webpack-flush-chunks/.test(x))
  .reduce((externals, mod) => {
    externals[mod] = `commonjs ${mod}`
    return externals
  }, {})

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
      externals: serverExternals,
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

    plugins: [
      ...(prod ? [new StatsPlugin('stats.json')] : []),
      ...(dev ? [new webpack.HotModuleReplacementPlugin()] : []),
      ...(server
        ? [
            new webpack.optimize.LimitChunkCountPlugin({
              maxChunks: 1
            })
          ]
        : [])
    ]
  }
}

module.exports = webpackConfig
