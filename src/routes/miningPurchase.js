// src/routes/miningPurchase.js
import express from "express";
import { PLAN_PRICES } from "../mining/pricing.js";
import { pool } from "../db/pg.js";
const r = express.Router();

r.post("/create", async (req,res)=>{
  const { plan, method } = req.body;
  const uid = req.user.id;
  if(!PLAN_PRICES[plan]) return res.sendStatus(400);

  await pool.query(
    `INSERT INTO plan_purchases(user_id,plan,method,amount_usd,status)
     VALUES($1,$2,$3,$4,'pending')`,
    [uid, plan, method, PLAN_PRICES[plan].usd]
  );

  res.json({ ok:true, pay_instructions:true });
});

export default r;
