import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema'

// Use Vercel Postgres
export const db = drizzle(sql, { schema })

// For development with local Postgres
// export const db = drizzle(process.env.DATABASE_URL!, { schema })