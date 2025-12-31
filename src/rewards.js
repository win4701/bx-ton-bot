import { pool } from "./db/pg.js";

export async function recordReward(userId, amount, txHash) {
  await pool.query(
    "INSERT INTO rewards(user_id,amount,tx_hash) VALUES($1,$2,$3)",
    [userId, amount, txHash]
  );
}
