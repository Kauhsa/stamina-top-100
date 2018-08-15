import React from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

import Login from './Login'
import User from './User'
import createStore from './store'

const isSSR = typeof window === 'undefined'

class App extends React.Component {
  store = createStore(isSSR ? this.props.initialState : window.__INITIAL_STATE__)

  apolloClient = isSSR
    ? this.props.apolloClient
    : new ApolloClient({ cache: new InMemoryCache().restore(window.__APOLLO_STATE__) })

  render() {
    return (
      <Provider store={this.store}>
        <ApolloProvider client={this.apolloClient}>
          <>
            <User />
            <Login />
          </>
        </ApolloProvider>
      </Provider>
    )
  }
}

export default hot(module)(App)
