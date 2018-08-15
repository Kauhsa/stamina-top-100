import axios from 'axios'

const client = axios.create({
  baseURL: '/api'
})

export const authenticate = async idToken => {
  const res = await client.post('/user/authenticate', { idToken })
  return res.data
}

export const createUser = async ({ name, idToken }) => {
  const res = await client.post('/user/create', { name, idToken })
  return res.data
}
