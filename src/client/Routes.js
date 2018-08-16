import React from 'react'
import { Switch, Route } from 'react-router-dom'
import universal from 'react-universal-component'

const CreateUser = universal(props => import('./pages/CreateUser'))

const Routes = () => (
  <Switch>
    <Route exact path="/" component={() => <h1>Lusso</h1>} />
    <Route path="/createUser" component={CreateUser} />
  </Switch>
)

export default Routes
