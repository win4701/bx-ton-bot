import express from "express";
import paypal from "@paypal/checkout-server-sdk";
import { paypalClient } from "../paypal.js";
import { creditBX } from "../db/credits.js";

const router = express.Router();

const BX_RATE = 100; // مثال: 1 USD = 100 BX

router.post("/create-order", async (req, res) => {
  const { usd } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code: "USD",
        value: usd.toFixed(2)
      }
    }]
  });

  const order = await paypalClient.execute(request);
  res.json({ id: order.result.id });
});

router.post("/capture-order", async (req, res) => {
  const { orderID, telegramId } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  const capture = await paypalClient.execute(request);

  if (capture.result.status === "COMPLETED") {
    const usd = parseFloat(
      capture.result.purchase_units[0].payments.captures[0].amount.value
    );

    const bxAmount = usd * BX_RATE;
    await creditBX(telegramId, bxAmount, "paypal");

    res.json({ success: true, bx: bxAmount });
  } else {
    res.status(400).json({ error: "Payment not completed" });
  }
});

export default router;
