export function canBuyBX(amountTon) {
  const MAX_TON_PER_DAY = 500;
  return amountTon <= MAX_TON_PER_DAY;
}
