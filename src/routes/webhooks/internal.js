import express from "express";
import { pool } from "../../db/pg.js";
const r = express.Router();

/*
 POST /webhook/internal/approve
 body: { user_id, plan, reference }
*/
r.post("/approve", async (req,res)=>{
  const { user_id, plan, reference } = req.body;

  await pool.query(
    `UPDATE plan_purchases
     SET status='paid', reference=$1
     WHERE user_id=$2 AND plan=$3`,
    [reference, user_id, plan]
  );

  await pool.query(
    `UPDATE mining_accounts SET plan=$1 WHERE user_id=$2`,
    [plan, user_id]
  );

  res.json({ ok:true });
});

export default r;
