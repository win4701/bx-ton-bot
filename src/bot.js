import dotenv from "dotenv";
dotenv.config();

import express from "express";
import TelegramBot from "node-telegram-bot-api";
import path from "path";

import { registerMessages } from "./bot/messages.js";
import { registerCallbacks } from "./bot/callbacks.js";
import { stressAutoExit } from "./safety/stressAutoExit.js";

import airdropRoutes from "./routes/airdrop.js";
import buyRoutes from "./routes/buy.js";
import sellRoutes from "./routes/sell.js";
import priceRoutes from "./routes/price.js";
import historyRoutes from "./routes/history.js";
import monitorRoutes from "./routes/monitor.js";

const app = express();
app.use(express.json());

/* API */
app.use("/api/airdrop", airdropRoutes);
app.use("/api/buy", buyRoutes);
app.use("/api/sell", sellRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/history", historyRoutes);
app.use("/admin/monitor", monitorRoutes);

/* Mini App */
app.use("/app", express.static(path.join(process.cwd(), "app")));
app.use("/", express.static(path.join(process.cwd(), "public")));

/* Telegram Bot */
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
registerMessages(bot);
registerCallbacks(bot);

/* Stress Auto Exit */
setInterval(() => stressAutoExit(bot), 60_000);

/* Server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("BX Bot running on", PORT));
