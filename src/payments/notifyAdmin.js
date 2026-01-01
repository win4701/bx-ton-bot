export function notifyAdmin(bot, order) {
  bot.sendMessage(
    process.env.ADMIN_TELEGRAM_ID,
    `🟡 New Payment Pending
User: ${order.userId}
Method: ${order.method}`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: "✅ Approve", callback_data: `APPROVE_${order.id}` },
          { text: "❌ Reject", callback_data: `REJECT_${order.id}` }
        ]]
      }
    }
  );
}
