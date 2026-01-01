export const MODE = process.env.MODE || "production";
export const STRESS_END_AT = process.env.STRESS_END_AT
  ? Number(process.env.STRESS_END_AT)
  : null;
