// app/dice.js
async function roll(bet){
  const r = await fetch("/api/dice/roll",{method:"POST",
    body:JSON.stringify({bet})}).then(r=>r.json());
  alert(r.win ? "WIN 🎉" : "LOSE ❌");
}
