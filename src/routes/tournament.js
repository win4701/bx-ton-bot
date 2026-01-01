// src/routes/tournament.js
import express from "express";
import { pool } from "../db/pg.js";
const r = express.Router();

r.get("/leaderboard", async (_,res)=>{
  const q = await pool.query(`
    SELECT user_id, points
    FROM tournament_scores
    ORDER BY points DESC
    LIMIT 20
  `);
  res.json(q.rows);
});

export default r;
