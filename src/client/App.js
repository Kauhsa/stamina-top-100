import React from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { injectGlobal } from 'emotion'
import cssWipe from 'css-wipe/js'

import createStore from './store'
import { RootContainer, Content } from './components/Layout'
import Sidebar from './components/Sidebar'
import Routes from './Routes'

const isSSR = typeof window === 'undefined'

injectGlobal`
  ${cssWipe}

  @import url('https://fonts.googleapis.com/css?family=Exo+2:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i');

  :root {
    font-size: 16px;
    font-family: 'Exo 2';
  }
`

class App extends React.Component {
  store = createStore(isSSR ? this.props.initialState : window.__INITIAL_STATE__)

  apolloClient = isSSR
    ? this.props.apolloClient
    : new ApolloClient({ cache: new InMemoryCache().restore(window.__APOLLO_STATE__) })

  render() {
    return (
      <Provider store={this.store}>
        <ApolloProvider client={this.apolloClient}>
          <RootContainer>
            <Sidebar />
            <Content>
              <Routes />
            </Content>
          </RootContainer>
        </ApolloProvider>
      </Provider>
    )
  }
}

export default hot(module)(App)
