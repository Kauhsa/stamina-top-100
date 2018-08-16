/* eslint-disable import/no-commonjs */

const presets = [['@babel/env', { loose: true, shippedProposals: true }], ['@babel/react']]

const plugins = [
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  '@babel/plugin-proposal-function-sent',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-proposal-numeric-separator',
  '@babel/plugin-proposal-throw-expressions',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-syntax-import-meta',
  ['@babel/plugin-proposal-class-properties', { loose: false }],
  '@babel/plugin-proposal-json-strings',
  'universal-import',
  'react-hot-loader/babel',
  'babel-plugin-emotion'
]

module.exports = { presets, plugins }
