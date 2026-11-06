import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { loadEnvFile } from 'node:process';

loadEnvFile('.env');

export const authDatabase = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const auth = betterAuth({
  database: authDatabase,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  session: { cookieCache: { enabled: false } },
  emailAndPassword: {
    enabled: true,
  },
});
