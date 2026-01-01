export function stressPolicy(cfg){
  if (cfg.MODE !== "stress") return cfg;

  return {
    autoApproveBuyUSD: 20,   // بدل 50
    autoApproveSellUSD: 10,  // بدل 20
    maxTxPerHour: 4,         // تشديد
    fraudBoost: 1.25         // رفع حساسية Fraud Score
  };
}
