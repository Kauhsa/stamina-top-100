import pgPromise from 'pg-promise'

import * as config from './config'

const db = pgPromise()(config.databaseUrl)

export async function getUserIdByGoogleId(googleId) {
  const row = await db.oneOrNone(
    `SELECT id
    FROM stamina_private.user
    WHERE stamina_private.user.google_id = $(googleId)`,
    { googleId }
  )

  return row ? row.id : null
}

export async function createUserAndGetId({ name, googleId, email }) {
  await db.tx(async t => {
    const { id } = await t.one(
      `INSERT INTO stamina.user (name)
      VALUES ($(name))
      RETURNING id`,
      { name }
    )

    await t.none(
      `INSERT INTO stamina_private.user (id, google_id, email)
      VALUES ($(id), $(googleId), $(email))`,
      { id, googleId, email }
    )

    return id
  })
}
