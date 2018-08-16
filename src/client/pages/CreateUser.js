import React from 'react'
import { connect } from 'react-redux'

class CreateUser extends React.Component {
  state = {
    error: null,
    username: ''
  }

  handleCreateUser = async () => {
    await this.props.dispatch.user.create({ name: this.state.username })
    this.props.history.push('/')
  }

  handleNameChange = e => {
    this.setState({ username: e.target.value })
  }

  render() {
    const { username } = this.state

    return (
      <>
        <p>User linked to this Google account was not found. Want to create a new one?</p>
        <input value={username} onChange={this.handleNameChange} placeholder="Your username..." />
        <button onClick={this.handleCreateUser}>Create user</button>
      </>
    )
  }
}

export default connect(
  state => ({
    loggedUserId: state.user.loggedUserId
  }),
  dispatch => ({
    dispatch
  })
)(CreateUser)
