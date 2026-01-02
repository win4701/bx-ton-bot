/**
 * Alerts utility
 * Supports:
 * - Telegram alerts (admin)
 * - Console fallback
 */

import TelegramBot from "node-telegram-bot-api";

let bot = null;

// Initialize once (optional)
export function initAlerts(botToken) {
  if (!botToken) return;
  bot = new TelegramBot(botToken, { polling: false });
}

/**
 * Send alert to admin
 * @param {string} message
 * @param {object} opts { level: 'info'|'warn'|'error' }
 */
export async function alertAdmin(message, opts = {}) {
  const level = opts.level || "info";
  const prefix =
    level === "error" ? "🚨 ERROR" :
    level === "warn"  ? "⚠️ WARN"  :
                        "ℹ️ INFO";

  const text = `${prefix}\n${message}`;

  // Console fallback (always)
  if (level === "error") console.error(text);
  else if (level === "warn") console.warn(text);
  else console.log(text);

  // Telegram (if configured)
  try {
    if (!bot) return;
    if (!process.env.ADMIN_TELEGRAM_ID) return;

    await bot.sendMessage(process.env.ADMIN_TELEGRAM_ID, text);
  } catch {
    // swallow errors to avoid crash loops
  }
}

/**
 * Convenience helpers
 */
export const alertInfo  = (msg) => alertAdmin(msg, { level: "info" });
export const alertWarn  = (msg) => alertAdmin(msg, { level: "warn" });
export const alertError = (msg) => alertAdmin(msg, { level: "error" });
