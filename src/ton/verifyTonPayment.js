import fetch from "node-fetch";
import { Address } from "@ton/core";
import {
  ADMIN_TON_WALLET,
  TON_RPC,
  TON_API_KEY,
} from "./constants.js";

/**
 * يتحقق من وصول TON إلى محفظة الأدمن
 * @param {string} fromAddress - عنوان المرسل
 * @param {number} amountTon - المبلغ المطلوب (TON)
 * @param {number} sinceTs - وقت بدء البحث (unix seconds)
 */
export async function verifyTonPayment({ fromAddress, amountTon, sinceTs }) {
  const url = `${TON_RPC}/getTransactions?address=${ADMIN_TON_WALLET.toString()}&limit=20`;
  const res = await fetch(url, {
    headers: TON_API_KEY ? { "X-API-Key": TON_API_KEY } : {},
  });
  const data = await res.json();
  if (!data.ok) return { ok: false, reason: "RPC_ERROR" };

  const minNano = BigInt(Math.floor(amountTon * 1e9));
  const from = Address.parse(fromAddress).toString();

  for (const tx of data.result) {
    if (tx.utime < sinceTs) continue;
    if (!tx.in_msg) continue;

    const value = BigInt(tx.in_msg.value || 0);
    const src = tx.in_msg.source;

    if (value >= minNano && src === from) {
      return { ok: true, txHash: tx.transaction_id.hash };
    }
  }
  return { ok: false, reason: "NOT_FOUND" };
}
