
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 8;
const cellSize = canvas.width / gridSize;

let player = { x: 0, y: 0 };
let enemies = [];
let treasures = [];
let score = 0;
let level = 1;
let gameOver = false;
let enemySpeed = 700; // initial enemy move interval in ms
let enemyIntervals = [];
const maxLevel = 2; // maximum levels

// Initialize game for current level
function initGame() {
  treasures = [];
  const treasureCount = 5 + (level - 1) * 2; // increase treasures per level
  for (let i = 0; i < treasureCount; i++) {
    treasures.push({
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    });
  }

  // Initialize enemies
  enemies = [];
  clearIntervalAllEnemies();
  const enemyCount = level; // number of enemies = current level
  for (let i = 0; i < enemyCount; i++) {
    let enemyX, enemyY;
    // Ensure enemy does not spawn on the player or overlap another enemy
    do {
      enemyX = Math.floor(Math.random() * gridSize);
      enemyY = Math.floor(Math.random() * gridSize);
    } while ((enemyX === 0 && enemyY === 0) || enemies.some(e => e.x === enemyX && e.y === enemyY));
    enemies.push({ x: enemyX, y: enemyY });
    enemyIntervals.push(setInterval(() => moveEnemy(i), enemySpeed));
  }

  player = { x: 0, y: 0 };
  gameOver = false;
  
  // FIX: Ensure the popup is hidden when the game initializes
  hidePopup(); 

  document.getElementById("info").innerText = `Level ${level}: Collect all treasures!`;
  draw();
}

// Clear all enemy intervals
function clearIntervalAllEnemies() {
  enemyIntervals.forEach(interval => clearInterval(interval));
  enemyIntervals = [];
}

// Draw grid, player, treasures, and enemies
function draw() {
  ctx.fillStyle = "#16243a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "#2e3a4f";
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  // Draw treasures
  for (const t of treasures) {
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(t.x * cellSize + cellSize / 2, t.y * cellSize + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw player
  ctx.fillStyle = "#4ade80";
  ctx.fillRect(player.x * cellSize + 6, player.y * cellSize + 6, cellSize - 12, cellSize - 12);

  // Draw enemies
  ctx.fillStyle = "#ef476f";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x * cellSize + cellSize / 2, e.y * cellSize + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Score and level
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Level: ${level}`, 380, 20);
}

// Move player
function move(dir) {
  if (gameOver) return;

  switch (dir) {
    case "up": if (player.y > 0) player.y--; break;
    case "down": if (player.y < gridSize - 1) player.y++; break;
    case "left": if (player.x > 0) player.x--; break;
    case "right": if (player.x < gridSize - 1) player.x++; break;
  }

  checkTreasure();
  checkCollision();
  draw();
}

// Check treasure collection
function checkTreasure() {
  treasures = treasures.filter(t => {
    if (t.x === player.x && t.y === player.y) {
      score++;
      return false;
    }
    return true;
  });

  if (treasures.length === 0) {
    clearIntervalAllEnemies();
    if (level >= maxLevel) {
      showPopup("🏆 You Win!");
      gameOver = true;
    } else {
      document.getElementById("info").innerText = `🎉 Level ${level} cleared! Click Next Level ⏭️ or Restart 🔄`;
    }
  }
}

// Move enemy randomly
function moveEnemy(index) {
  if (gameOver) return;

  const e = enemies[index];
  const moves = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  const move = moves[Math.floor(Math.random() * moves.length)];

  e.x = Math.min(Math.max(0, e.x + move.x), gridSize - 1);
  e.y = Math.min(Math.max(0, e.y + move.y), gridSize - 1);

  checkCollision();
  draw();
}

// Check collision with any enemy
function checkCollision() {
  enemies.forEach(e => {
    if (player.x === e.x && player.y === e.y) {
      showPopup("💀 You Lose!");
      gameOver = true;
      clearIntervalAllEnemies();
    }
  });
}

// Restart game (level 1)
function restartGame() {
  level = 1;
  enemySpeed = 700;
  score = 0;
  initGame();
}

// Next level
function nextLevel() {
  if (treasures.length === 0 && level < maxLevel) {
    level++;
    enemySpeed = Math.max(150, enemySpeed * 0.85);
    initGame();
  } else if (level >= maxLevel && treasures.length === 0) {
    showPopup("🏆 You already won!");
  } else {
    document.getElementById("info").innerText = "⚠️ Collect all treasures before going to the next level!";
  }
}

// New function to explicitly hide the popup
function hidePopup() {
  document.getElementById("popup").style.display = "none";
}

// Popup functions
function showPopup(message) {
  const popup = document.getElementById("popup");
  document.getElementById("popupMessage").innerText = message;
  document.getElementById("popupScore").innerText = `Score: ${score}`;
  popup.style.display = "flex";
}

function closePopup() {
  hidePopup(); // Use the new function to hide the popup
  restartGame();
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case "arrowup":
    case "w": move("up"); break;
    case "arrowdown":
    case "s": move("down"); break;
    case "arrowleft":
    case "a": move("left"); break;
    case "arrowright":
    case "d": move("right"); break;
  }
});

// Initialize first level
initGame();
