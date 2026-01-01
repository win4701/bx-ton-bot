export function registerCallbacks(bot) {
  bot.on("callback_query", async (q) => {
    const id = q.message.chat.id;
    const a = q.data;

    if (a === "payments")
      return bot.sendMessage(id, "Choose payment method", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🟡 Binance / 🔵 RedotPay", web_app: { url: process.env.APP_URL + "#payments" } }],
            [{ text: "🔻 Sell BX", callback_data: "sell" }]
          ]
        }
      });

    if (a === "airdrop")
      return bot.sendMessage(id, "Complete tasks to earn BX", {
        reply_markup: { inline_keyboard: [[{ text: "Open Tasks", web_app: { url: process.env.APP_URL + "#airdrop" } }]] }
      });

    bot.answerCallbackQuery(q.id);
  });
}
