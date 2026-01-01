/* =========================
   TELEGRAM INIT
========================= */
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const API = {
  balance: "/api/history",   // يُستخدم لاستخراج الرصيد من آخر العمليات
  priceTON: "/api/price/bx-ton",
  priceUSDT: "/api/price/bx-usdt",
  history: "/api/history"
};

async function api(url, method = "GET", body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

/* =========================
   BALANCE
========================= */
async function loadBalance() {
  try {
    const h = await api(API.history);
    let bx = 0;
    h.forEach(x => {
      if (x.t === "buy") bx += x.a;
      if (x.t === "sell") bx -= x.a;
    });
    document.getElementById("balance").innerText = bx.toFixed(2) + " BX";
  } catch {
    document.getElementById("balance").innerText = "— BX";
  }
}

/* =========================
   PRICE (STON)
========================= */
async function loadPrice() {
  try {
    const p = await api(API.priceTON);
    document.getElementById("chart").innerText =
      `BX / TON: ${p.price ?? "—"}`;
  } catch {
    document.getElementById("chart").innerText = "Price unavailable";
  }
}

/* =========================
   HISTORY
========================= */
async function loadHistory() {
  try {
    const h = await api(API.history);
    const ul = document.getElementById("historyList");
    if (!ul) return;

    ul.innerHTML = h.map(x =>
      `<li>${x.t.toUpperCase()} • ${x.a} USD • ${new Date(x.d).toLocaleString()}</li>`
    ).join("");
  } catch {}
}

/* =========================
   INIT
========================= */
loadBalance();
loadPrice();
loadHistory();
