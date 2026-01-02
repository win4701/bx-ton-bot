export function registerMessages(bot) {
  bot.onText(/\/start\s?(.*)?/, async (msg, match) => {
    bot.sendMessage(msg.chat.id,
`Welcome to Bloxio (BX)

• Buy / Sell BX
• Games & Tournaments
• Cloud Mining`,
{
  reply_markup:{
    inline_keyboard:[
      [{ text:"💳 Buy BX", callback_data:"buy_bx" }],
      [{ text:"🔄 Sell BX", callback_data:"sell_bx" }],
      [{ text:"⛏️ Cloud Mining", callback_data:"mining" }],
      [{ text:"🚀 Open App", web_app:{ url:process.env.APP_URL }}]
    ]
  }
});
  });
}
