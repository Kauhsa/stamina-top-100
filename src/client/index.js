import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'

import App from './App'
import history from './history'

ReactDOM.hydrate(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root')
)
