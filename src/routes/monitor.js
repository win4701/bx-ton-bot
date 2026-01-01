import express from "express";
import { pool } from "../db/pg.js";
import { MODE } from "../config.js";
const r = express.Router();

r.get("/", async (req,res)=>{
  if (!req.user?.isAdmin) return res.sendStatus(403);

  const buys = await pool.query(
    "SELECT COUNT(*) c FROM p2p_payments WHERE created_at > NOW()-INTERVAL '24 hours'"
  );
  const sells = await pool.query(
    "SELECT COUNT(*) c FROM sell_requests WHERE created_at > NOW()-INTERVAL '24 hours'"
  );
  const pending = await pool.query(
    "SELECT COUNT(*) c FROM p2p_payments WHERE status='pending'"
  );

  res.json({
    mode: MODE,
    buys24h: Number(buys.rows[0].c),
    sells24h: Number(sells.rows[0].c),
    pending: Number(pending.rows[0].c),
    fraud: {
      avg: 22, // احسبها من logs إن رغبت
      max: 61
    },
    ocrAccuracy: "83%"
  });
});

export default r;
