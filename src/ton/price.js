import fetch from "node-fetch";

export async function getBxPrice() {
  const r = await fetch("https://api.ston.fi/v1/pools/BX-TON");
  const j = await r.json();
  return {
    price: j.price,
    change24h: j.change24h,
    liquidity: j.liquidity
  };
}
