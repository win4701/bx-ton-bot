const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

function show(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(page).classList.add("active");
}

window.App = {
  go: show,

  buyBX() {
    tg.sendData(JSON.stringify({ action: "BUY_BX" }));
  },

  sellBX() {
    tg.sendData(JSON.stringify({ action: "SELL_BX" }));
  },

  openProof() {
    tg.sendData(JSON.stringify({ action: "OPEN_PROOF" }));
  }
};

show("home");
