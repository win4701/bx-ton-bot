let running=false, m=1.0, crashAt=0, startTs=0;
const RTP=0.97; // تحكم العائد

export function startCrash(){
  running=true; m=1.0; startTs=Date.now();
  crashAt = (Math.random()*(3/RTP)+1).toFixed(2); // توزيع عادل
  loop();
}
function loop(){
  if(!running) return;
  m += 0.008;
  document.getElementById("mult").innerText = m.toFixed(2)+"x";
  if(m>=crashAt){ running=false; onCrash(); return; }
  requestAnimationFrame(loop);
}
export function cashout(){
  if(!running) return;
  running=false;
  fetch("/api/games/crash/cashout",{method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({mult:m, startedAt:startTs})
  });
}
function onCrash(){ document.body.classList.add("crash"); }
