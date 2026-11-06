import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/domain/entities/user.entity.js';
import { createMockUsers } from '../../modules/users/testing/mock-users.js';

// The npm command loads .env before executing this script.
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'cskh_cap_nuoc_db',
  entities: [User],
  synchronize: false,
  migrationsRun: false,
});

try {
  await dataSource.initialize();
  const inserted: unknown[] = await dataSource.transaction(async (manager) => {
    const result = await manager
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(createMockUsers())
      // PostgreSQL ON CONFLICT DO NOTHING: preserve existing IDs/phone numbers.
      .orIgnore()
      .returning(['userId', 'userName', 'phoneNumber', 'phoneNumberVerified'])
      .execute();
    return result.raw as unknown[];
  });
  console.log(
    `Inserted ${inserted.length} demo users; skipped ${3 - inserted.length} existing/conflicting users.`,
  );
  if (inserted.length) console.table(inserted);
} catch (error) {
  const code = (error as { driverError?: { code?: string } }).driverError?.code;
  if (code === '42P01') {
    console.error(
      'Table users does not exist. Create the schema before running seed:users.',
    );
  } else {
    console.error(
      'User seed failed:',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
  process.exitCode = 1;
} finally {
  if (dataSource.isInitialized) await dataSource.destroy();
}
