/**
 * Generate a strong WEBHOOK_SECRET
 * Usage:
 *   node scripts/generate-webhook-secret.js
 */

import crypto from "crypto";

const bytes = 32; // 256-bit
const secret = crypto.randomBytes(bytes).toString("hex");

console.log("WEBHOOK_SECRET=" + secret);
console.log("\n✔ Copy this value into your .env or hosting environment variables.");
