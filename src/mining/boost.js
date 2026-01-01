// src/mining/boost.js
export function calcBoost(activeRefs){
  if (activeRefs >= 10) return 0.25;
  if (activeRefs >= 5) return 0.15;
  if (activeRefs >= 2) return 0.07;
  return 0;
}
