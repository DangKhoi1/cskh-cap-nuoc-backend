import { loadEnvFile } from 'node:process';
import { Pool } from 'pg';
import { getPostgresConfig } from '../../config/postgres.config.js';

loadEnvFile('.env');

const pool = new Pool(getPostgresConfig());

try {
  // One PostgreSQL statement batch: applied atomically and safe to run again.
  await pool.query(`
    ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phoneNumber" text;
    ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phoneNumberVerified" boolean NOT NULL DEFAULT false;
    CREATE UNIQUE INDEX IF NOT EXISTS "user_phoneNumber_unique" ON "user" ("phoneNumber");
  `);
  console.log(
    'Phone number columns are ready. Existing accounts are preserved.',
  );
} finally {
  await pool.end();
}
