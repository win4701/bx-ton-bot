app.get("/public/stats", async (_, res) => {
  const users = await pool.query("SELECT COUNT(*) FROM users");
  const swaps = await pool.query("SELECT COUNT(*) FROM events WHERE type='swap'");
  const volume = await pool.query("SELECT SUM(amount) FROM swaps");

  res.json({
    users: users.rows[0].count,
    swaps: swaps.rows[0].count,
    volume: volume.rows[0].sum || 0
  });
});
