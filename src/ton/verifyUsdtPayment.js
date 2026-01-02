import fetch from "node-fetch";
import { Address } from "@ton/core";
import {
  ADMIN_TON_WALLET,
  TON_RPC,
  TON_API_KEY,
} from "./constants.js";

// ضع عنوان Jetton Master الخاص بـ USDT على TON
export const USDT_JETTON_MASTER = Address.parse(
  process.env.USDT_JETTON_MASTER || ""
);

/**
 * يتحقق من تحويل USDT Jetton إلى محفظة الأدمن
 * @param {string} fromAddress
 * @param {number} amountUsdt
 * @param {number} sinceTs
 */
export async function verifyUsdtPayment({ fromAddress, amountUsdt, sinceTs }) {
  // نستخدم indexer/toncenter للـ jetton transfers
  const url = `${TON_RPC}/getJettonTransfers?owner=${ADMIN_TON_WALLET.toString()}&limit=20`;
  const res = await fetch(url, {
    headers: TON_API_KEY ? { "X-API-Key": TON_API_KEY } : {},
  });
  const data = await res.json();
  if (!data.ok) return { ok: false, reason: "RPC_ERROR" };

  const min = BigInt(Math.floor(amountUsdt * 1e6)); // USDT عادة 6 decimals
  const from = Address.parse(fromAddress).toString();

  for (const tr of data.result) {
    if (tr.utime < sinceTs) continue;
    if (tr.jetton_master !== USDT_JETTON_MASTER.toString()) continue;
    if (tr.source !== from) continue;

    const amount = BigInt(tr.amount);
    if (amount >= min) {
      return { ok: true, txHash: tr.tx_hash };
    }
  }
  return { ok: false, reason: "NOT_FOUND" };
}
