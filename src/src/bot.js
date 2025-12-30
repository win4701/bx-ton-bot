import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { initDb, getWallet, saveWallet } from "./db.js";
import { getBalance, claimBX, withdrawBX } from "./ton.js";
import { canWithdraw } from "./antifraud.js";

dotenv.config();
await initDb();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start(?:\s+(\w+))?/, async (msg, m) => {
  // Optional referral code in m[1]
  bot.sendMessage(msg.chat.id, "Welcome to Bloxio (BX) TON Bot.");
});

bot.onText(/\/wallet/, async (msg) => {
  const projectWallet = "EQD_PROJECT_WALLET_ADDRESS";
  const link = `ton://transfer/${projectWallet}?amount=0&text=BX_CONNECT`;
  bot.sendMessage(msg.chat.id, "Connect your TON wallet:", {
    reply_markup: { inline_keyboard: [[{ text:"🔗 Connect TON Wallet", url: link }]] }
  });
});

bot.onText(/\/balance/, async (msg) => {
  const w = await getWallet(msg.from.id);
  if (!w) return bot.sendMessage(msg.chat.id,"No wallet connected.");
  const b = await getBalance(w);
  bot.sendMessage(msg.chat.id, `Your balance: ${b} BX`);
});

bot.onText(/\/claim/, async (msg) => {
  try {
    const w = await getWallet(msg.from.id);
    if (!w) throw new Error("Connect wallet first");
    await claimBX(msg.from.id, w);
    bot.sendMessage(msg.chat.id,"✅ Claim successful");
  } catch (e) {
    bot.sendMessage(msg.chat.id, `❌ ${e.message}`);
  }
});

bot.onText(/\/withdraw\s+(\d+)/, async (msg, m) => {
  try {
    const amount = Number(m[1]);
    const w = await getWallet(msg.from.id);
    if (!w) throw new Error("Connect wallet first");
    if (!(await canWithdraw(msg.from.id, amount))) throw new Error("Limit reached");
    await withdrawBX(msg.from.id, w, amount);
    bot.sendMessage(msg.chat.id,"✅ Withdrawal sent");
  } catch (e) {
    bot.sendMessage(msg.chat.id, `❌ ${e.message}`);
  }
});
