import React from 'react'
import { connect } from 'react-redux'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const QUERY = gql`
  query User($userId: UUID!) {
    userById(id: $userId) {
      name
    }
  }
`

const User = ({ loggedUserId }) => (
  <>
    {loggedUserId ? (
      <Query query={QUERY} variables={{ userId: loggedUserId }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...'
          if (error) return 'Error :('
          return data.userById.name
        }}
      </Query>
    ) : (
      'Not logged in!'
    )}
  </>
)

export default connect(state => ({ loggedUserId: state.user.loggedUserId }))(User)
