import fetch from "node-fetch";

const API = "https://api.ston.fi/v1";

export async function getRoute({ from, to, amount }) {
  const r = await fetch(
    `${API}/swap/route?from=${from}&to=${to}&amount=${amount}`
  );
  if (!r.ok) throw new Error("STON_ROUTE_FAILED");
  return r.json();
}
