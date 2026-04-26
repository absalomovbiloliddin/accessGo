import { Pool } from 'pg';
import env from '../config/env.js';

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL topilmadi. .env faylni to'ldiring.");
}

const pool = new Pool({
  connectionString: env.databaseUrl
});

export default pool;
