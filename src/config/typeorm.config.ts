import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { fileURLToPath } from 'node:url';

const entitiesRoot = fileURLToPath(new URL('../', import.meta.url)).replace(
  /\\/g,
  '/',
);

export const getTypeOrmConfig = (
  ConfigService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: ConfigService.get<string>('DB_HOST', 'localhost'),
  port: ConfigService.get<number>('DB_PORT', 5432),
  username: ConfigService.get<string>('DB_USERNAME', 'postgres'),
  password: ConfigService.get<string>('DB_PASSWORD'),
  database: ConfigService.get<string>('DB_NAME', 'cskh_cap_nuoc_db'),
  entities: [entitiesRoot + '**/*.entity{.ts,.js}'],
  synchronize: ConfigService.get<boolean>('DB_SYNCHRONIZE', false),
});
