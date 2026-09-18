import path from 'node:path';
import process from 'node:process';
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config({ path: path.resolve(__dirname, '.env') });

const {
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  DB_HOST = 'localhost',
} = process.env;
const url = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url },
});
