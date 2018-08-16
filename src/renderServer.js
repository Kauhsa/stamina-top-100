import React from 'react'
import ReactDOMServer from 'react-dom/server'
import flushChunks from 'webpack-flush-chunks'
import { flushChunkNames, clearChunks } from 'react-universal-component/server'
import fetch from 'node-fetch'
import ApolloClient from 'apollo-boost'
import { getDataFromTree } from 'react-apollo'
import { renderStylesToString } from 'emotion-server'
import { StaticRouter } from 'react-router'

import * as config from './services/config'
import App from './client/App'
import createStore from './client/store'

const stringifyToScriptTag = val => JSON.stringify(val).replace(/</g, '\\u003c')

const getInitialState = req => {
  const store = createStore()

  // set configuration
  store.dispatch.config.set({
    googleClientId: config.googleClientId
  })

  // set logged in user
  if (req.jwt) {
    store.dispatch.user.setLoggedUser(req.jwt.userId)
  }

  return store.getState()
}

const getServerApolloClient = req =>
  new ApolloClient({
    uri: `http://127.0.0.1:${config.port}/graphql`,
    fetch
  })

const renderServer = ({ clientStats }) => async (req, res, next) => {
  try {
    const initialState = getInitialState(req)
    const serverApolloClient = getServerApolloClient(req)

    const app = (
      <StaticRouter location={req.url} context={{}}>
        <App initialState={initialState} apolloClient={serverApolloClient} />
      </StaticRouter>
    )

    await getDataFromTree(app)
    const apolloInitialState = serverApolloClient.cache.extract()
    clearChunks()

    const content = renderStylesToString(ReactDOMServer.renderToString(app))

    const { js } = flushChunks(clientStats, {
      chunkNames: flushChunkNames()
    })

    res.send(`
      <!doctype html>
      <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="root">${content}</div>
        <script>
          window.__INITIAL_STATE__ = ${stringifyToScriptTag(initialState)};
          window.__APOLLO_STATE__ = ${stringifyToScriptTag(apolloInitialState)};
        </script>
        ${js}
      </body>
      </html>
    `)
  } catch (e) {
    next(e)
  }
}

export default renderServer
