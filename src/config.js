import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'development') {
  dotenv.config()
}

function getEnv(name, required = true) {
  if (process.env[name]) {
    return process.env[name]
  }

  if (required) {
    throw new Error(`Environment variable ${name} is required!`)
  }

  return undefined
}

export const isDevelopment = getEnv('NODE_ENV') === 'development'
export const databaseUrl = getEnv('DATABASE_URL')
export const port = getEnv('PORT')
