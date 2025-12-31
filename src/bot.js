import dotenv from "dotenv";
dotenv.config();

import express from "express";
import TelegramBot from "node-telegram-bot-api";
import path from "path";
import { fileURLToPath } from "url";

import { pool } from "./db/pg.js";
import "./public/analytics.js";
import "./public/proof.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../app")));

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

/* ===== Telegram Bot ===== */
bot.onText(/\/start\s*(\w+)?/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "Welcome to Bloxio.\nPlay. Decide. Own BX.",
    {
      reply_markup: {
        inline_keyboard: [[
          { text: "🚀 Open App", web_app: { url: process.env.APP_URL } }
        ]]
      }
    }
  );
});

/* ===== Health ===== */
app.get("/health", (_, res) => res.send("OK"));

/* ===== Start Server ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
