// src/games/pvp.js
import { pool } from "../db/pg.js";

export async function resolvePvp(matchId){
  const { rows } = await pool.query(
    "SELECT * FROM pvp_matches WHERE id=$1 AND status='playing'",
    [matchId]
  );
  if(!rows.length) return;

  const m = rows[0];
  const winner = Math.random() < 0.5 ? m.player_a : m.player_b;

  await pool.query(
    `UPDATE pvp_matches
     SET winner=$1, status='finished'
     WHERE id=$2`,
    [winner, matchId]
  );

  // إضافة الربح (خصم Fee بسيط)
  await pool.query(
    "UPDATE users SET bx=bx+$1 WHERE id=$2",
    [m.bet_bx*1.9, winner]
  );
}
