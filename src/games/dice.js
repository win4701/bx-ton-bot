// src/games/dice.js
export async function rollDice(userId, bet){
  const roll = Math.floor(Math.random()*6)+1;
  const win = roll === 6;

  if(win){
    await pool.query(
      "UPDATE users SET bx=bx+$1 WHERE id=$2",
      [bet*5, userId]
    );
  }
  return { roll, win };
}
