import React from 'react'
import { connect } from 'react-redux'
import { GoogleLogin } from 'react-google-login'

import * as api from './api'

class Login extends React.Component {
  state = {
    noUserFound: false,
    tokenId: null,
    error: null,
    username: ''
  }

  handleSuccess = async ({ tokenId }) => {
    try {
      const { userId } = await api.authenticate(tokenId)
      this.props.dispatch.user.setLoggedUser(userId)
    } catch (e) {
      if (e.response && e.response.data.error == 'no-user-matching-token') {
        this.setState({ noUserFound: true, tokenId: tokenId })
      } else {
        this.setState({ e })
      }
    }
  }

  handleCreateUser = async () => {
    const { userId } = await api.createUser({
      idToken: this.state.tokenId,
      name: this.state.username
    })
    this.props.dispatch.user.setLoggedUser(userId)
  }

  handleFailure = e => {
    this.setState({ e })
  }

  handleNameChange = e => {
    this.setState({ username: e.target.value })
  }

  render() {
    const { googleClientId } = this.props
    const { noUserFound, username } = this.state

    return (
      <>
        {!!noUserFound && (
          <>
            <p>User linked to this Google account was not found. Want to create a new one?</p>
            <input
              value={username}
              onChange={this.handleNameChange}
              placeholder="Your username..."
            />
            <button onClick={this.handleCreateUser}>Create user</button>
          </>
        )}
        {!noUserFound && (
          <GoogleLogin
            clientId={googleClientId}
            onSuccess={this.handleSuccess}
            onFailure={this.handleError}
            scope="email"
            fetchBasicProfile={false}
          />
        )}
      </>
    )
  }
}

export default connect(
  state => ({
    googleClientId: state.config.googleClientId
  }),
  dispatch => ({
    dispatch
  })
)(Login)
