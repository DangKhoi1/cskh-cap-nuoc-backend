import { betterAuth } from 'better-auth';
import { loadEnvFile } from 'node:process';
import { Pool } from 'pg';
import { getPostgresConfig } from '../../config/postgres.config.js';
import {
  authUserConfig,
  prepareUserForRegistration,
} from './infrastructure/auth-user.config.js';

loadEnvFile('.env');

export const authDatabase = new Pool(getPostgresConfig());

export const auth = betterAuth({
  database: authDatabase,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
  session: { cookieCache: { enabled: false } },
  user: authUserConfig,
  databaseHooks: {
    user: {
      create: { before: prepareUserForRegistration },
    },
  },
});
