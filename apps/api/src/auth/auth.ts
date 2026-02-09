import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

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
