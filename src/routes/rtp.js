// src/routes/rtp.js
r.get("/:game", async (req,res)=>{
  const g = req.params.game;
  const q = await pool.query(
    `SELECT SUM(bet_bx) bet, SUM(payout_bx) pay
     FROM game_bets WHERE game=$1`,[g]
  );
  const { bet=0, pay=0 } = q.rows[0];
  res.json({ rtp: bet ? +(pay/bet*100).toFixed(2) : 0 });
});
