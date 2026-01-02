let balance = 0;

const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");

function playGame(type){
  clickSound.play();
  const win = Math.random() > 0.5;
  if(win){
    balance += 2;
    winSound.play();
  }
  document.getElementById("balance").innerText = balance;
}

function openAirdrop(){
  alert("Complete tasks in Telegram bot");
}

function buyBX(type){
  alert("Redirecting to admin payment: " + type);
}
