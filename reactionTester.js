// --- ELEMENTS ---
const startBtn = document.getElementById("start-btn");
const gameArea = document.getElementById("game-area");
const scoreEl = document.getElementById("score");
const reactionEl = document.getElementById("reaction");
const infoEl = document.getElementById("info");

// --- CONFIG VARIABLES ---
const TOTAL_LEVELS = 10;           // Total levels
const START_ARROW_TIME = 2000;     // Arrow visible time in ms
const ARROW_TIME_DECREASE = 150;   // Arrow time decrease per level
const MIN_DELAY = 0;               // Min delay before next arrow
const MAX_DELAY = 300;             // Max delay before next arrow

// --- GAME STATE ---
let level = 1;
let arrowTime = START_ARROW_TIME;
let arrow;
let appearTime;
let reactionTimes = [];
let arrowTimeout;

// --- HELPERS ---
function randomPosition() {
  const x = Math.random() * (gameArea.clientWidth - 40);
  const y = Math.random() * (gameArea.clientHeight - 40);
  return { x, y };
}

function randomDelay() {
  return MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
}

// --- POPUP FOR WINNING ---
function showWinPopup(avgTime) {
  // Blur the game area
  gameArea.style.filter = "blur(5px)";
  startBtn.style.display = "none";

  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "999";
  document.body.appendChild(overlay);

  const popup = document.createElement("div");
  popup.id = "win-popup";
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.background = "#0b132b";
  popup.style.padding = "30px";
  popup.style.borderRadius = "10px";
  popup.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
  popup.style.textAlign = "center";
  popup.style.zIndex = "1000";
  popup.style.color = "#fff";

  popup.innerHTML = `
    <h2>🎉 You won the game! 🎉</h2>
    <p>Average Reaction Time: ${Math.round(avgTime)} ms</p>
    <button id="restart-btn">Restart Game</button>
  `;
  document.body.appendChild(popup);

  // Restart button
  document.getElementById("restart-btn").onclick = () => {
    popup.remove();
    overlay.remove();
    gameArea.style.filter = "none";
    startBtn.style.display = "inline-block";
    startBtn.disabled = false;

    // Option 1: restart on same page
    resetGame();

    // Option 2: go to start page
    // window.location.href = "start.html"; // uncomment if you have a start page
  };
}

// --- GAME LOGIC ---
function showArrow() {
  if (arrow) arrow.remove();

  const { x, y } = randomPosition();
  arrow = document.createElement("div");
  arrow.className = "arrow";
  arrow.textContent = "🦊";
  arrow.style.left = `${x}px`;
  arrow.style.top = `${y}px`;
  gameArea.appendChild(arrow);

  appearTime = Date.now();
  let clicked = false;

  // Click handler
  arrow.onclick = () => {
    if (clicked) return;
    clicked = true;
    clearTimeout(arrowTimeout);
    const reaction = Date.now() - appearTime;
    reactionTimes.push(reaction);
    scoreEl.textContent = `Level ${level} ✅`;
    reactionEl.textContent = `Reaction Time: ${reaction} ms`;
    arrow.remove();
    nextLevel();
  };

  // Timeout if not clicked
  arrowTimeout = setTimeout(() => {
    if (!clicked) {
      reactionTimes.push(arrowTime); // penalty
      infoEl.textContent = `⛔ You missed Level ${level}. Starting over!`;
      startBtn.disabled = false;
      startBtn.textContent = `Restart from Level 1`;
      resetGame();
      if (arrow) arrow.remove();
    }
  }, arrowTime);
}

function nextLevel() {
  level++;
  if (level > TOTAL_LEVELS) {
    // Player won
    const avg = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    showWinPopup(avg);
    return;
  }

  // Increase difficulty
  arrowTime = Math.max(200, arrowTime - ARROW_TIME_DECREASE);

  infoEl.textContent = `Level ${level} — Get ready!`;
  startBtn.disabled = true;

  setTimeout(showArrow, randomDelay());
}

// --- RESET GAME ---
function resetGame() {
  level = 1;
  arrowTime = START_ARROW_TIME;
  reactionTimes = [];
  scoreEl.textContent = `Level 0`;
  reactionEl.textContent = `Reaction Time: —`;
  infoEl.textContent = `Level ${level} — Get ready!`;
}

// --- START BUTTON ---
startBtn.onclick = () => {
  resetGame();
  startBtn.disabled = true;
  setTimeout(showArrow, 500); // small start delay
};
