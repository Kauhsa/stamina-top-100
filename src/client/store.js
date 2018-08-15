import { init } from '@rematch/core'
import { mapValues } from 'lodash'

const user = {
  state: {
    loggedUserId: null
  },

  reducers: {
    setLoggedUser(state, userId) {
      return { ...state, loggedUserId: userId }
    },

    clearLoggedUser(state, payload) {
      return { ...state, loggedUserId: null }
    }
  }
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
