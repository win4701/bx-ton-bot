export function fraudScore(ctx){
  let score = 0;
  if (ctx.txPerHour > 6) score += 30;
  if (ctx.amountMismatch) score += 25;
  if (ctx.duplicateRef) score += 40;
  if (ctx.failedAttempts > 2) score += 20;
  if (ctx.accountAgeDays < 2) score += 10;
  return Math.min(score, 100);
}

export function fraudDecision(score){
  if (score >= 70) return "block";
  if (score >= 40) return "review";
  return "allow";
}
