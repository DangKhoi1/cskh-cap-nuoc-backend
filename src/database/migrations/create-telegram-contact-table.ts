import { loadEnvFile } from 'node:process';
import { Pool } from 'pg';
import { getPostgresConfig } from '../../config/postgres.config.js';

loadEnvFile('.env');

const pool = new Pool(getPostgresConfig());

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "telegram_contact" (
      "phoneNumber" text PRIMARY KEY,
      "telegramUserId" text NOT NULL UNIQUE,
      "chatId" text NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now()
    );
  `);
  console.log('Table telegram_contact is ready.');
} finally {
  await pool.end();
}

