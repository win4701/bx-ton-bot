import express from "express";
import binance from "./binance.js";
import redotpay from "./redotpay.js";
import internal from "./internal.js";

const r = express.Router();

// حماية عامة لكل الويبهوكات
r.use((req,res,next)=>{
  if (req.headers["x-webhook-secret"] !== process.env.WEBHOOK_SECRET) {
    return res.sendStatus(403);
  }
  next();
});

// مزوّدين
r.use("/binance", binance);
r.use("/redotpay", redotpay);
r.use("/internal", internal);

export default r;
