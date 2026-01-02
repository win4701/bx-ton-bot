import crypto from "crypto";

export function verifyWebhook(req,res,next){
  const sig = req.headers["x-webhook-signature"];
  const ts  = req.headers["x-webhook-timestamp"];
  const body = JSON.stringify(req.body);

  const expected = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET)
    .update(ts + body)
    .digest("hex");

  if(sig !== expected) return res.sendStatus(403);
  next();
}
