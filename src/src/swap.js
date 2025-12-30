/**
 * STON.fi Swap helper (Non-custodial)
 * Uses official STON.fi swap page
 */

const STON_SWAP_URL = "https://app.ston.fi/swap";

// BX Jetton Master (Mainnet)
export const BX_JETTON =
  "EQCRYlkaR6GlssLRrQlBH3HOPJSMk_vzfAAyyuhnriX-7a_a";

/**
 * Build STON.fi swap URL
 * @param {string} fromToken - "TON" or Jetton address
 * @param {string} toToken   - "TON" or Jetton address
 */
export function buildSwapUrl(fromToken, toToken) {
  const params = new URLSearchParams({
    ft: fromToken,
    tt: toToken
  });
  return `${STON_SWAP_URL}?${params.toString()}`;
}

/**
 * Preset swaps
 */
export function tonToBX() {
  return buildSwapUrl("TON", BX_JETTON);
}

export function bxToTON() {
  return buildSwapUrl(BX_JETTON, "TON");
}
