import jwt from 'jsonwebtoken'

import * as config from './config'

export const tokenCookieName = 'stamina-auth-token'

export const createTokenCookie = (res, userId) => {
  const token = jwt.sign({ userId }, config.jwtSecret, { expiresIn: '1y' })

  res.cookie(tokenCookieName, token, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // a year, in milliseconds
    httpOnly: true,
    secure: !config.isDevelopment,
    sameSite: 'strict'
  })
}

export const getTokenFromRequest = res => res.cookies[tokenCookieName] || null
