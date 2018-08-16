import { init } from '@rematch/core'
import { mapValues } from 'lodash'

import * as api from './api'
import history from './history'

const user = {
  state: {
    loggedUserId: null,
    notFoundUserIdToken: null
  },

  reducers: {
    setLoggedUser(state, userId) {
      return { ...state, loggedUserId: userId }
    },

    userNotFoundWithIdToken(state, idToken) {
      return { ...state, notFoundUserIdToken: idToken }
    }
  },

  effects: dispatch => ({
    async authenticate(idToken) {
      try {
        const { userId } = await api.authenticate(idToken)
        dispatch.user.setLoggedUser(userId)
      } catch (e) {
        if (e.response && e.response.data.error == 'no-user-matching-token') {
          dispatch.user.userNotFoundWithIdToken(idToken)
          history.push('/createUser')
        } else {
          throw e
        }
      }
    },

    async create(user, state) {
      const { userId } = await api.createUser({
        ...user,
        idToken: state.user.notFoundUserIdToken
      })

      dispatch.user.setLoggedUser(userId)
    },

    async logout() {
      await api.logout()
      dispatch.user.setLoggedUser(null)
    }
  })
}

const config = {
  state: {},

  reducers: {
    set(state, payload) {
      return payload
    }
  }
}

const createStore = (initialState = {}) => {
  const models = {
    user,
    config
  }

  const modelsWithOverridenState = mapValues(models, (model, modelName) => {
    const overrides = initialState[modelName] || {}
    return { ...model, state: { ...model.state, ...overrides } }
  })

  return init({
    models: modelsWithOverridenState
  })
}

export default createStore
