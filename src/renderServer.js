import ReactDOMServer from 'react-dom/server'
import flushChunks from 'webpack-flush-chunks'
import { flushChunkNames } from 'react-universal-component/server'
import { stripIndent } from 'common-tags'

import App from './client/App'

const renderServer = ({ clientStats }) => (req, res) => {
  const app = ReactDOMServer.renderToString(App)

  const { js } = flushChunks(clientStats, {
    chunkNames: flushChunkNames()
  })

  res.send(stripIndent`
      <!doctype html>
      <html>
        <head>
        </head>
        <body>
          <div id="root">${app}</div>
          ${js}
        </body>
      </html>
    `)
}

export default renderServer
