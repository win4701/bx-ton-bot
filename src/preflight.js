import { pool } from "./db/pg.js";

/*
  Pre-flight checks before server start
*/
export async function preflightCheck() {
  console.log("🔎 Pre-flight check started...");

  // 1) ENV checks
  const requiredEnv = [
    "BOT_TOKEN",
    "DATABASE_URL",
    "ADMIN_TON_WALLET",
    "WEBHOOK_SECRET"
  ];

  for (const k of requiredEnv) {
    if (!process.env[k]) {
      throw new Error(`❌ Missing ENV: ${k}`);
    }
  }
  console.log("✅ ENV OK");

  // 2) DB connectivity
  await pool.query("SELECT 1");
  console.log("✅ Database connected");

  // 3) Required tables
  const tables = [
    "users",
    "bx_purchases",
    "admin_logs",
    "mining_plans",
    "mining_accounts",
    "game_bets",
    "tournaments"
  ];

  for (const t of tables) {
    const q = await pool.query(
      `SELECT to_regclass($1) as exists`,
      [t]
    );
    if (!q.rows[0].exists) {
      throw new Error(`❌ Missing table: ${t}`);
    }
  }
  console.log("✅ Tables OK");

  // 4) Required columns
  const columns = [
    { table: "bx_purchases", column: "approved_at" },
    { table: "bx_purchases", column: "user_ton_address" }
  ];

  for (const c of columns) {
    const q = await pool.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_name=$1 AND column_name=$2`,
      [c.table, c.column]
    );
    if (!q.rowCount) {
      throw new Error(`❌ Missing column: ${c.table}.${c.column}`);
    }
  }
  console.log("✅ Columns OK");

  console.log("🚀 Pre-flight check PASSED");
}
