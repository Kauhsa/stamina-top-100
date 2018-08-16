import PromiseRouter from 'express-promise-router'
import { OAuth2Client } from 'google-auth-library'

import * as db from '../services/db'
import * as config from '../services/config'
import * as auth from '../services/auth'

const router = new PromiseRouter()
const client = new OAuth2Client(config.googleClientId)

async function getVerifiedTokenPayload(idToken) {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: config.googleClientId
  })

  return ticket.getPayload()
}

router.post('/authenticate', async (req, res) => {
  const payload = await getVerifiedTokenPayload(req.body.idToken)
  const userId = await db.getUserIdByGoogleId(payload.sub)

  if (userId) {
    // user was found with this id, create session and return
    auth.createTokenCookie(res, userId)
    res.json({ userId })
  } else {
    // user was not found with this google id, tell client to create one
    res.status(404).json({ error: 'no-user-matching-token' })
  }
})

router.post('/create', async (req, res) => {
  const payload = await getVerifiedTokenPayload(req.body.idToken)

  const userId = await db.createUserAndGetId({
    googleId: payload.sub,
    email: payload.email,
    name: req.body.name
  })

  auth.createTokenCookie(res, userId)
  res.json({ userId })
})

router.post('/logout', async (req, res) => {
  auth.removeTokenCookie(res)
  res.sendStatus(201)
})

export default router
