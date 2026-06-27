import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadDotenv } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../../../');
for (const filename of ['.env.local', '.env']) {
  const path = resolve(repoRoot, filename);
  if (existsSync(path)) loadDotenv({ path, override: false });
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

async function main() {
  const sql = postgres(connectionString!, { max: 1, prepare: false });
  const db = drizzle(sql);
  console.log('Running migrations…');
  await migrate(db, { migrationsFolder: resolve(here, 'migrations') });
  console.log('Migrations complete.');
  await sql.end({ timeout: 5 });
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
