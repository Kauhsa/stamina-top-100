import React from 'react'
import { connect } from 'react-redux'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import GoogleLogin from 'react-google-login'

const LoggedUserName = ({ loggedUserId }) => (
  <Query
    query={gql`
      query UserNameQuery($userId: UUID!) {
        userById(id: $userId) {
          name
        }
      }
    `}
    variables={{ userId: loggedUserId }}
  >
    {({ loading, error, data }) => {
      if (loading || error || !data.userById) return ''
      return data.userById.name
    }}
  </Query>
)

class Sidebar extends React.Component {
  handleSuccess = ({ tokenId }) => {
    this.props.dispatch.user.authenticate(tokenId)
  }

  handleFailure = () => {
    // TODO
  }

  render() {
    const { loggedUserId, googleClientId, dispatch } = this.props

    return (
      <>
        {loggedUserId ? (
          <>
            <LoggedUserName loggedUserId={loggedUserId} />
            <button onClick={dispatch.user.logout}>Logout</button>
          </>
        ) : (
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
    loggedUserId: state.user.loggedUserId,
    googleClientId: state.config.googleClientId
  }),
  dispatch => ({
    dispatch
  })
)(Sidebar)
