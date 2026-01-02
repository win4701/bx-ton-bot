import { Address, beginCell } from "@ton/core";
import { TonClient } from "@ton/ton";
import {
  ADMIN_TON_WALLET,
  ADMIN_PRIVATE_KEY,
  BX_JETTON_MASTER,
  BX_DECIMALS,
  TON_RPC,
} from "./constants.js";
import { verifyTonPayment } from "./verifyTonPayment.js";
import { verifyUsdtPayment } from "./verifyUsdtPayment.js";

/**
 * إرسال BX Jetton إلى المستخدم بعد تأكيد الدفع
 * @param {Object} p
 * @param {"TON"|"USDT"} p.payAsset
 * @param {string} p.fromAddress
 * @param {string} p.toUserAddress
 * @param {number} p.payAmount
 * @param {number} p.bxAmount
 * @param {number} p.sinceTs
 */
export async function sendBxAfterPayment(p) {
  // 1) تأكيد الدفع
  const check =
    p.payAsset === "TON"
      ? await verifyTonPayment({
          fromAddress: p.fromAddress,
          amountTon: p.payAmount,
          sinceTs: p.sinceTs,
        })
      : await verifyUsdtPayment({
          fromAddress: p.fromAddress,
          amountUsdt: p.payAmount,
          sinceTs: p.sinceTs,
        });

  if (!check.ok) {
    return { ok: false, reason: "PAYMENT_NOT_CONFIRMED" };
  }

  // 2) إرسال BX
  const client = new TonClient({ endpoint: TON_RPC });

  const amountBX = BigInt(Math.floor(p.bxAmount * 10 ** BX_DECIMALS));
  const toAddr = Address.parse(p.toUserAddress);

  // رسالة تحويل Jetton قياسية
  const body = beginCell()
    .storeUint(0x0f8a7ea5, 32) // transfer op
    .storeUint(0, 64)          // query id
    .storeCoins(amountBX)
    .storeAddress(toAddr)
    .storeAddress(ADMIN_TON_WALLET)
    .storeBit(false)
    .storeCoins(0n)
    .storeBit(false)
    .endCell();

  // ملاحظة: هنا يلزم WalletContract + مفتاح الأدمن
  // يختلف حسب مكتبتك (ton/ton, tonweb)
  // هذا pseudo-call يوضح الفكرة:
  await client.sendExternalMessage({
    to: BX_JETTON_MASTER,
    body,
    secretKey: ADMIN_PRIVATE_KEY,
  });

  return { ok: true, payTx: check.txHash };
}
