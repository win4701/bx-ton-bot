import express from "express";
import { verifyWebhook } from "../../utils/verifyWebhook.js";
import binance from "./binance.js";
import redotpay from "./redotpay.js";
import internal from "./internal.js";

const r = express.Router();

// مهم: body raw قبل أي parsing
r.use(express.json({ verify:(req,res,buf)=>{ req.rawBody = buf.toString(); }}));

r.use(verifyWebhook);

r.use("/binance", binance);
r.use("/redotpay", redotpay);
r.use("/internal", internal);

export default r;
