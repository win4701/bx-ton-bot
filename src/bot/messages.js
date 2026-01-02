import { pool } from "../db/pg.js";

export async function handleProof(bot, msg) {
  if (!msg.photo && !msg.document) return;

  const userId = msg.from.id;

  const fileId =
    msg.photo?.slice(-1)[0]?.file_id ||
    msg.document?.file_id;

  if (!fileId) return;

  const file = await bot.getFile(fileId);
  const proofUrl =
    `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

  await pool.query(
    `UPDATE usdt_orders
     SET proof_url=$1
     WHERE user_id=$2 AND status='PENDING'
     ORDER BY created_at DESC
     LIMIT 1`,
    [proofUrl, userId]
  );

  await bot.sendMessage(
    userId,
    "✅ Proof received. Awaiting admin approval."
  );
}
