import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is required. '
    + 'See .env.example for the expected format.',
  )
}

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: true,
  },
})

export type Auth = typeof auth
