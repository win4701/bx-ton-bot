export async function snapshotReserve(balance, supply) {
  const hash = crypto
    .createHash("sha256")
    .update(balance + supply + Date.now())
    .digest("hex");

  await pool.query(
    "INSERT INTO reserves(balance,supply,hash) VALUES($1,$2,$3)",
    [balance, supply, hash]
  );

  return hash;
}
