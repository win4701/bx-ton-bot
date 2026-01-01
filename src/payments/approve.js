import { sendBX } from "../ton/send.js";

export async function approveOrder(order) {
  await sendBX(order.userWallet, order.amountBX);
  await markCompleted(order.id);
}
