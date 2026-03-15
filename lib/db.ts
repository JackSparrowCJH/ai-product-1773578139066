import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DB_URL });

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function initDB() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      openid TEXT UNIQUE NOT NULL,
      nickname TEXT NOT NULL DEFAULT '匿名用户',
      avatar TEXT NOT NULL DEFAULT '',
      merit BIGINT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS friendships (
      user_openid TEXT NOT NULL,
      friend_openid TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_openid, friend_openid)
    )
  `);
}
