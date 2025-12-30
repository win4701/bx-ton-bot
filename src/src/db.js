import pkg from "pg";
const { Pool } = pkg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function initDb() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      telegram_id BIGINT PRIMARY KEY,
      wallet TEXT UNIQUE,
      referrer BIGINT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS claims (
      telegram_id BIGINT PRIMARY KEY,
      claimed_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS withdrawals (
      id SERIAL PRIMARY KEY,
      telegram_id BIGINT,
      amount BIGINT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

export async function getWallet(tid) {
  const r = await db.query("SELECT wallet FROM users WHERE telegram_id=$1",[tid]);
  return r.rowCount ? r.rows[0].wallet : null;
}

export async function saveWallet(tid, wallet, ref=null) {
  await db.query(
    `INSERT INTO users(telegram_id, wallet, referrer)
     VALUES($1,$2,$3)
     ON CONFLICT (telegram_id) DO UPDATE SET wallet=EXCLUDED.wallet`,
    [tid, wallet, ref]
  );
}

export async function hasClaimed(tid) {
  const r = await db.query("SELECT 1 FROM claims WHERE telegram_id=$1",[tid]);
  return r.rowCount>0;
}

export async function markClaimed(tid) {
  await db.query("INSERT INTO claims(telegram_id) VALUES($1)",[tid]);
}

export async function todayWithdrawn(tid) {
  const r = await db.query(
    `SELECT COALESCE(SUM(amount),0) s FROM withdrawals
     WHERE telegram_id=$1 AND created_at::date = CURRENT_DATE`,
    [tid]
  );
  return Number(r.rows[0].s);
}

export async function logWithdraw(tid, amount) {
  await db.query(
    "INSERT INTO withdrawals(telegram_id, amount) VALUES($1,$2)",
    [tid, amount]
  );
}
