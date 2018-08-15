import '@babel/polyfill'

import path from 'path'

import postgraphile from 'postgraphile'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'express-jwt'

import * as config from './services/config'
import * as auth from './services/auth'
import userRoutes from './routes/user'

const getPath = p => path.resolve(__dirname, p)

async function start() {
  const app = express()
  app.use(express.json())
  app.use(cors())
  app.use(cookieParser())

  // jwt

  app.use(
    jwt({
      secret: config.jwtSecret,
      credentialsRequired: false,
      getToken: auth.getTokenFromRequest,
      requestProperty: 'jwt'
    })
  )

  // custom routes

  app.use('/api/user', userRoutes)

  // postgraphile

  app.use(postgraphile(config.databaseUrl, 'stamina', { graphiql: config.isDevelopment }))

  // serving JS code

  if (config.isDevelopment) {
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const webpackHotServerMiddleware = require('webpack-hot-server-middleware')
    const webpackConfig = require('./webpackConfig')
    const compiler = webpack([
      webpackConfig({ server: false, dev: true }),
      webpackConfig({ server: true, dev: true })
    ])
    const clientCompiler = compiler.compilers.find(c => c.name === 'client')

    app.use(webpackDevMiddleware(compiler, { serverSideRender: true, publicPath: '/static' }))
    app.use(webpackHotMiddleware(clientCompiler))
    app.use(webpackHotServerMiddleware(compiler))
  } else {
    const renderServer = require('./webpack/server').default
    const clientStats = require('./webpack/static/stats.json')
    app.use('/static', express.static(getPath('./webpack/static')))
    app.use(renderServer({ clientStats }))
  }

  // rest

  app.listen(config.port, () => console.log(`Listening on port ${config.port}`))
}

start().catch(e => {
  console.error(e)
  process.exit(1)
})
