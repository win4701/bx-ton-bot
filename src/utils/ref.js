import { makeRef } from "./utils/ref.js";

async function startUsdtBuy(bot, chatId, userId, platform) {
  const ref = makeRef(userId);
  const payId = platform === "BINANCE"
    ? process.env.BINANCE_PAY_ID
    : process.env.REDOTPAY_ID;

  await bot.sendMessage(chatId,
`🧾 USDT Purchase (${platform})
Pay to ID: ${payId}
Reference: ${ref}

After payment, send proof (TxID or screenshot).`);

  // خزّن الطلب
  await db.query(
    `INSERT INTO usdt_orders (user_id, platform, usdt_amount, bx_amount, reference)
     VALUES ($1,$2,0,0,$3)`,
    [userId, platform, ref]
  );
}
