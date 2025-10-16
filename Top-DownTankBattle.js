const gameArea = document.getElementById("gameArea");
const playerTank = document.getElementById("playerTank");

// Scoreboard elements
const winsEl = document.getElementById("wins");
const lossesEl = document.getElementById("losses");
const shotsEl = document.getElementById("shots");
const accuracyEl = document.getElementById("accuracy");
const timerEl = document.getElementById("timer");
const levelEl = document.getElementById("level");

// Modal
const modal = document.getElementById("resultModal");
const resultMessage = document.getElementById("resultMessage");
const scoreMessage = document.getElementById("scoreMessage");
const restartButton = document.getElementById("restartButton");
// --- Mobile Controls ---
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const shootBtn = document.getElementById("shootBtn");

if (leftBtn && rightBtn && shootBtn) {
  leftBtn.addEventListener("touchstart", () => { keys["ArrowLeft"] = true; });
  leftBtn.addEventListener("touchend", () => { keys["ArrowLeft"] = false; });

  rightBtn.addEventListener("touchstart", () => { keys["ArrowRight"] = true; });
  rightBtn.addEventListener("touchend", () => { keys["ArrowRight"] = false; });

  shootBtn.addEventListener("touchstart", () => { shootPlayer(); });
}

// Game variables
let player = { x: 275, y: 350, health: 3, shots: 0, hits: 0 };
let bullets = [];
let enemyBullets = [];
let enemies = [];
let score = { wins: 0, losses: 0 };
let level = 1;
let roundTime = 25; // total time for all levels
let timer = roundTime;
let gameOver = false;

// Level speed settings
const levelSpeeds = [
  { enemySpeed: 2, bulletSpeed: 1.5 }, // Level 1: gentle pace
  { enemySpeed: 2, bulletSpeed: 1.5 },   // Level 2: moderate
  { enemySpeed: 2, bulletSpeed: 1.5 }, // Level 3: faster but fair
];


// Key controls
let keys = {};
document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (e.key === " ") shootPlayer();
});
document.addEventListener("keyup", e => { keys[e.key] = false; });

// Initialize enemies for current level
function initEnemies() {
  enemies.forEach(e => e.div.remove());
  enemies = [];

  let numEnemies = level;
  let speedSettings = levelSpeeds[level - 1];
  let spacing = Math.floor((gameArea.offsetWidth - 100) / numEnemies);

  for (let i = 0; i < numEnemies; i++) {
    let enemyDiv = document.createElement("div");
    enemyDiv.classList.add("enemyTank");

    // Each enemy in its own horizontal lane
    let xPos = 50 + i * spacing;
    let yPos = 50;
    enemyDiv.style.left = xPos + "px";
    enemyDiv.style.top = yPos + "px";
    gameArea.appendChild(enemyDiv);

    enemies.push({
      div: enemyDiv,
      x: xPos,
      y: yPos,
      laneX: xPos, // store lane center
      health: 1,
      speed: speedSettings.enemySpeed,
      bulletSpeed: 2,
      direction: 1 // for horizontal patrol
    });
  }
}

// Update health bars
function updateHealthBars() {
  playerTank.innerHTML = `<div class="health-bar" style="width:${(player.health / 3) * 50}px"></div>`;
  enemies.forEach(e => {
    e.div.innerHTML = `<div class="health-bar" style="width:${(e.health / 3) * 50}px"></div>`;
  });
}

// Player shoot
function shootPlayer() {
  if (player.health <= 0 || gameOver) return;
  let b = document.createElement("div");
  b.classList.add("bullet");
  const tankWidth = playerTank.offsetWidth;
  b.x = player.x + tankWidth / 2 - 5;
  b.y = player.y - 10;
  b.vy = -6;
  b.style.left = b.x + "px";
  b.style.top = b.y + "px";
  gameArea.appendChild(b);
  bullets.push(b);
  player.shots++;
}

// Enemy shoot
function shootEnemy(enemy) {
  let b = document.createElement("div");
  b.classList.add("bullet");
  const tankWidth = enemy.div.offsetWidth;
  const tankHeight = enemy.div.offsetHeight;
  b.x = enemy.x + tankWidth / 2 - 5;
  b.y = enemy.y + tankHeight;
  b.vy = enemy.bulletSpeed;
  b.style.left = b.x + "px";
  b.style.top = b.y + "px";
  gameArea.appendChild(b);
  enemyBullets.push(b);
}

// Enemy AI with patrol motion and avoidance
function enemyAI(enemy, index) {
  const tankWidth = enemy.div.offsetWidth;

  // Simple patrol within a small lane area
  let laneWidth = (gameArea.offsetWidth - 100) / level;
  let laneStart = 50 + index * laneWidth;
  let laneEnd = laneStart + laneWidth - tankWidth;

  enemy.x += enemy.speed * enemy.direction;

  if (enemy.x <= laneStart || enemy.x >= laneEnd) {
    enemy.direction *= -1; // change direction when hitting lane border
  }

  enemy.div.style.left = enemy.x + "px";

  // Occasional shooting
  if (Math.random() < 0.002 + level * 0.001) {
  shootEnemy(enemy);
}
}

// Collisions
function checkCollisions() {
  bullets.forEach((b, i) => {
    b.y += b.vy;
    b.style.top = b.y + "px";
    enemies.forEach((e, j) => {
      if (b.y <= e.y + e.div.offsetHeight && b.x + 10 > e.x && b.x < e.x + e.div.offsetWidth) {
        e.health--;
        player.hits++;
        updateHealthBars();
        b.remove();
        bullets.splice(i, 1);
        if (e.health <= 0) {
          e.div.remove();
          enemies.splice(j, 1);
          if (enemies.length === 0) nextLevel();
        }
      }
    });
    if (b.y < 0) { b.remove(); bullets.splice(i, 1); }
  });

  enemyBullets.forEach((b, i) => {
    b.y += b.vy;
    b.style.top = b.y + "px";
    const playerWidth = playerTank.offsetWidth;
    if (b.y + 10 >= player.y && b.x + 10 > player.x && b.x < player.x + playerWidth) {
      player.health--;
      updateHealthBars();
      b.remove();
      enemyBullets.splice(i, 1);
      if (player.health <= 0) endGame("lose");
    }
    if (b.y > gameArea.offsetHeight) { b.remove(); enemyBullets.splice(i, 1); }
  });
}

// Timer (continuous)
function updateTimer() {
  timerEl.innerText = `Time: ${timer.toFixed(1)}`;
  if (gameOver) return;
  if (timer <= 0 && enemies.length > 0) {
    endGame("lose");
  }
}

// Next level
function nextLevel() {
  if (level >= 3) {
    endGame("win", true);
    return;
  }
  level++;
  levelEl.innerText = `Level: ${level}`;
  initEnemies();
  updateHealthBars();
}

// End game
function endGame(result, final = false) {
  if (gameOver) return;
  gameOver = true;
  modal.style.display = "flex";

  if (result === "win") {
    resultMessage.innerText = final ? "You beat all levels!" : "You Win!";
    score.wins++;
  } else if (result === "lose") {
    resultMessage.innerText = "You Lose!";
    score.losses++;
  }

  let acc = Math.round((player.hits / player.shots) * 100 || 0);
  scoreMessage.innerText = `Shots Fired: ${player.shots}, Accuracy: ${acc}%`;
  winsEl.innerText = `Wins: ${score.wins}`;
  lossesEl.innerText = `Losses: ${score.losses}`;
}

// Restart
restartButton.addEventListener("click", () => {
  modal.style.display = "none";
  resetGame();
});

// Reset game
function resetGame() {
  gameOver = false;
  bullets.forEach(b => b.remove());
  enemyBullets.forEach(b => b.remove());
  enemies.forEach(e => e.div.remove());
  bullets = [];
  enemyBullets = [];
  player = { x: 275, y: 350, health: 3, shots: 0, hits: 0 };
  level = 1;
  levelEl.innerText = `Level: ${level}`;
  timer = roundTime;
  initEnemies();
  updateHealthBars();
  update();
}

// Game loop
function update() {
  if (gameOver) return;
  if (keys["ArrowLeft"]) player.x -= 5;
  if (keys["ArrowRight"]) player.x += 5;
  player.x = Math.max(0, Math.min(gameArea.offsetWidth - playerTank.offsetWidth, player.x));
  playerTank.style.left = player.x + "px";
  enemies.forEach((e, i) => enemyAI(e, i));
  checkCollisions();
  shotsEl.innerText = `Shots Fired: ${player.shots}`;
  let acc = Math.round((player.hits / player.shots) * 100 || 0);
  accuracyEl.innerText = `Accuracy: ${acc}%`;
  requestAnimationFrame(update);
}

// Continuous timer countdown
setInterval(() => {
  if (gameOver) return;
  if (timer > 0) {
    timer -= 0.1;
    updateTimer();
  } else if (!gameOver) {
    endGame("lose");
  }
}, 100);

// Initialize
initEnemies();
updateHealthBars();
update();
