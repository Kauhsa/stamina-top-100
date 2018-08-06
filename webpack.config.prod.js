/* eslint-disable import/no-commonjs */

const webpackConfig = require('./src/webpackConfig.js')

module.exports = [
  webpackConfig({ server: true, dev: false }),
  webpackConfig({ server: false, dev: false })
]
