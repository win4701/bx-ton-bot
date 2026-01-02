let currentCrashRound = null;
let currentChickenGame = null;

function openScreen(id) {
  document.querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ===== Crash =====
async function startCrash() {
  const bet = document.getElementById("crashBet").value;
  const res = await fetch("/api/crash/start", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ bet })
  });
  const data = await res.json();
  currentCrashRound = data.roundId;
  document.getElementById("crashStatus").innerText = "Running...";
}

async function cashoutCrash() {
  await fetch("/api/crash/cashout", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ roundId: currentCrashRound })
  });
  document.getElementById("crashStatus").innerText = "Cashed!";
}

// ===== Chicken =====
async function startChicken() {
  const bet = document.getElementById("chickenBet").value;
  const res = await fetch("/api/chicken/start", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ bet })
  });
  const data = await res.json();
  currentChickenGame = data.gameId;
  document.getElementById("chickenStatus").innerText = "Started";
}

async function stepChicken() {
  const res = await fetch("/api/chicken/step", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ gameId: currentChickenGame })
  });
  const data = await res.json();
  document.getElementById("chickenStatus").innerText =
    data.alive ? "Safe!" : "💥 Lost";
}

async function cashoutChicken() {
  await fetch("/api/chicken/cashout", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ gameId: currentChickenGame })
  });
  document.getElementById("chickenStatus").innerText = "Cashed!";
}
