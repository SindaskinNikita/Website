import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'NiceDbPassword',
  port: 5432,
  ssl: false
}); 