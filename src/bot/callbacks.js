import { pool } from "../db/pg.js";
import { sendBxAfterApproval } from "../ton/sendBx.js";

const ADMIN_IDS = [
  Number(process.env.ADMIN_TELEGRAM_ID)
];

export async function handleAdminCommands(bot, msg) {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (!ADMIN_IDS.includes(msg.from.id)) return;

  // /approve_123
  if (text.startsWith("/approve_")) {
    const orderId = Number(text.split("_")[1]);

    const { rows } = await pool.query(
      `SELECT * FROM usdt_orders
       WHERE id=$1 AND status='PENDING'`,
      [orderId]
    );
    if (!rows.length) return;

    const o = rows[0];

    await sendBxAfterApproval({
      toUserId: o.user_id,
      bxAmount: o.bx_amount
    });

    await pool.query(
      `UPDATE usdt_orders
       SET status='APPROVED', approved_at=NOW()
       WHERE id=$1`,
      [orderId]
    );

    await bot.sendMessage(chatId, `✅ Order #${orderId} approved`);
  }

  // /reject_123
  if (text.startsWith("/reject_")) {
    const orderId = Number(text.split("_")[1]);

    await pool.query(
      `UPDATE usdt_orders
       SET status='REJECTED', approved_at=NOW()
       WHERE id=$1`,
      [orderId]
    );

    await bot.sendMessage(chatId, `❌ Order #${orderId} rejected`);
  }
}
