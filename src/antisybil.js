export async function checkSybil(userId, wallet, fp) {
  const r = await pool.query(
    "SELECT 1 FROM users WHERE device_fp=$1 OR wallet=$2",
    [fp, wallet]
  );
  return r.rowCount === 0;
}
