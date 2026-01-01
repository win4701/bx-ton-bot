import express from "express";
import { pool } from "../../db/pg.js";

const r = express.Router();

/*
  Webhook for payment confirmation
  Used for:
  - Mining plan purchase
  - Buy BX confirmation
*/
r.post("/confirm", async (req, res) => {
  const { secret, user_id, plan, reference } = req.body;

  // 🔐 حماية بسيطة
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.sendStatus(403);
  }

  // تأكيد عملية الشراء
  await pool.query(
    `UPDATE plan_purchases
     SET status='paid', reference=$1
     WHERE user_id=$2 AND plan=$3 AND status='pending'`,
    [reference, user_id, plan]
  );

  // تفعيل الخطة
  await pool.query(
    `UPDATE mining_accounts
     SET plan=$1
     WHERE user_id=$2`,
    [plan, user_id]
  );

  res.json({ ok: true });
});

export default r;
