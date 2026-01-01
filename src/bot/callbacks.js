// src/bot/callbacks.js

export function registerCallbacks(bot) {

  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const action = query.data;

    if (action === "airdrop") {
      return bot.sendMessage(
        chatId,
        `🎁 *Airdrop Tasks*

Complete tasks to earn BX.
Rewards are limited.`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{
                text: "Open Tasks",
                web_app: { url: process.env.APP_URL + "#airdrop" }
              }]
            ]
          }
        }
      );
    }

    if (action === "buy") {
      return bot.sendMessage(
        chatId,
        `💱 *Buy BX*

Buy BX using TON or USDT.
Liquidity is managed transparently.`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{
                text: "Buy BX",
                web_app: { url: process.env.APP_URL + "#buy" }
              }]
            ]
          }
        }
      );
    }

    if (action === "price") {
      return bot.sendMessage(
        chatId,
        `📈 *BX Market Price*

Prices are sourced from STON.fi.`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{
                text: "View Chart",
                web_app: { url: process.env.APP_URL + "#chart" }
              }]
            ]
          }
        }
      );
    }

    if (action === "portfolio") {
      return bot.sendMessage(
        chatId,
        `🧭 *BX Ecosystem*

See listings, roadmap, and trust info.`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{
                text: "Open Portfolio",
                web_app: { url: process.env.APP_URL + "#portfolio" }
              }]
            ]
          }
        }
      );
    }

    // إزالة علامة التحميل من الزر
    bot.answerCallbackQuery(query.id);
  });

}
