import { bot } from "./bot.js";
import { sendBx } from "../ton/sendBx.js";

export async function handleCallback(q) {
  const chatId = q.message.chat.id;

  if (q.data.startsWith("APPROVE")) {
    const [, userId, amount] = q.data.split(":");
    await sendBx(userId, amount);
    bot.sendMessage(chatId, "✅ Approved & sent");
  }

  if (q.data.startsWith("REJECT")) {
    bot.sendMessage(chatId, "❌ Rejected");
  }
}
