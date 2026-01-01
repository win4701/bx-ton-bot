// src/bot/messages.js

export function registerMessages(bot) {

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(
      chatId,
      `Welcome to *Bloxio (BX)*

• Earn BX via tasks
• Buy BX with TON / USDT
• Transparent pricing (STON)
• Public analytics`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🎁 Airdrop Tasks", callback_data: "airdrop" }],
            [{ text: "💱 Buy / Sell BX", callback_data: "buy" }],
            [{ text: "📈 BX Price", callback_data: "price" }],
            [{ text: "🧭 BX Ecosystem", callback_data: "portfolio" }],
            [{ text: "🚀 Open Mini App", web_app: { url: process.env.APP_URL } }]
          ]
        }
      }
    );
  });

  bot.onText(/\/help/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      `Available commands:
/start - Main menu
/help - Help & info`
    );
  });

}
