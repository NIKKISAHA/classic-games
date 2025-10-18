const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 8;
const cellSize = canvas.width / gridSize;

let lightSource = { x: 0, y: 4 };
let target = { x: 7, y: 4 };

// --- LEVEL DATA (10 levels) ---
const levels = [
  { mirrors: [{ x: 2, y: 2, type: "/", angle: 0 }, { x: 5, y: 5, type: "\\", angle: 0 }, { x: 3, y: 4, type: "/", angle: 0 }], target: { x: 7, y: 4 }, time: 15 },
  { mirrors: [{ x: 1, y: 1, type: "/", angle: 0 }, { x: 2, y: 2, type: "/", angle: 0 }, { x: 4, y: 1, type: "\\", angle: 0 }, { x: 5, y: 3, type: "/", angle: 0 }, { x: 3, y: 4, type: "/", angle: 0 }, { x: 5, y: 5, type: "\\", angle: 0 }], target: { x: 7, y: 6 }, time: 15 },
  { mirrors: [{ x: 1, y: 1, type: "/", angle: 0 }, { x: 2, y: 2, type: "/", angle: 0 }, { x: 4, y: 1, type: "\\", angle: 0 }, { x: 5, y: 3, type: "/", angle: 0 }, { x: 3, y: 4, type: "/", angle: 0 }, { x: 5, y: 5, type: "\\", angle: 0 }, { x: 6, y: 2, type: "\\", angle: 0 }, { x: 1, y: 5, type: "/", angle: 0 }], target: { x: 7, y: 0 }, time: 15 },
  { mirrors: [{ x: 2, y: 2, type: "\\", angle: 0 }, { x: 1, y: 2, type: "/", angle: 0 }, { x: 3, y: 1, type: "\\", angle: 0 }, { x: 4, y: 3, type: "/", angle: 0 }, { x: 2, y: 5, type: "\\", angle: 0 }, { x: 5, y: 2, type: "/", angle: 0 }, { x: 2, y: 4, type: "/", angle: 0 }], target: { x: 6, y: 5 }, time: 15 },
  { mirrors: [{ x: 0, y: 2, type: "/", angle: 0 }, { x: 1, y: 5, type: "\\", angle: 0 }, { x: 2, y: 1, type: "/", angle: 0 }, { x: 3, y: 4, type: "\\", angle: 0 }, { x: 4, y: 2, type: "/", angle: 0 }, { x: 5, y: 6, type: "\\", angle: 0 }, { x: 6, y: 3, type: "/", angle: 0 }], target: { x: 7, y: 0 }, time: 15 },
  { mirrors: [{ x: 1, y: 0, type: "/", angle: 0 }, { x: 2, y: 2, type: "\\", angle: 0 }, { x: 3, y: 1, type: "/", angle: 0 }, { x: 4, y: 3, type: "\\", angle: 0 }, { x: 5, y: 0, type: "/", angle: 0 }, { x: 6, y: 2, type: "\\", angle: 0 }, { x: 3, y: 5, type: "/", angle: 0 }, { x: 1, y: 4, type: "\\", angle: 0 }], target: { x: 7, y: 7 }, time: 15 },
  { mirrors: [{ x: 0, y: 1, type: "/", angle: 0 }, { x: 1, y: 3, type: "\\", angle: 0 }, { x: 2, y: 0, type: "/", angle: 0 }, { x: 3, y: 2, type: "\\", angle: 0 }, { x: 4, y: 4, type: "/", angle: 0 }, { x: 5, y: 1, type: "\\", angle: 0 }, { x: 6, y: 3, type: "/", angle: 0 }, { x: 2, y: 6, type: "\\", angle: 0 }], target: { x: 7, y: 0 }, time: 15 },
  { mirrors: [{ x: 1, y: 1, type: "/", angle: 0 }, { x: 2, y: 3, type: "\\", angle: 0 }, { x: 3, y: 2, type: "/", angle: 0 }, { x: 4, y: 5, type: "\\", angle: 0 }, { x: 5, y: 1, type: "/", angle: 0 }, { x: 6, y: 3, type: "\\", angle: 0 }, { x: 3, y: 6, type: "/", angle: 0 }, { x: 5, y: 5, type: "\\", angle: 0 }, { x: 3, y: 4, type: "/", angle: 0 }], target: { x: 7, y: 7 }, time: 15 },
  { mirrors: [{ x: 0, y: 1, type: "/", angle: 0 }, { x: 1, y: 3, type: "\\", angle: 0 }, { x: 2, y: 0, type: "/", angle: 0 }, { x: 3, y: 2, type: "\\", angle: 0 }, { x: 4, y: 4, type: "/", angle: 0 }, { x: 5, y: 1, type: "\\", angle: 0 }, { x: 6, y: 3, type: "/", angle: 0 }, { x: 2, y: 6, type: "\\", angle: 0 }, { x: 5, y: 5, type: "/", angle: 0 }, { x: 6, y: 6, type: "\\", angle: 0 }], target: { x: 7, y: 0 }, time: 15 }
];

let currentLevel = 0;
let mirrors = [];
let gameWon = false;
let timeLeft = 0;
let timerInterval;

// --- POPUP HANDLER ---
function showModal(message) {
  const modal = document.getElementById("gameModal");
  const modalMessage = document.getElementById("modalMessage");
  modalMessage.innerText = message;
  modal.style.display = "flex";
  clearInterval(timerInterval);
}

// --- RESTART BUTTON ---
document.getElementById("restartBtn").addEventListener("click", () => {
  clearInterval(timerInterval);
  document.getElementById("gameModal").style.display = "none";
  document.getElementById("modalMessage").innerText = "";
  currentLevel = 0; // Restart from Level 1
  setTimeout(() => loadLevel(currentLevel), 100);
});

// --- LOAD LEVEL ---
function loadLevel(level) {
  clearInterval(timerInterval);
  document.getElementById("gameModal").style.display = "none";

  mirrors = JSON.parse(JSON.stringify(levels[level].mirrors));
  target = { ...levels[level].target };
  timeLeft = levels[level].time;
  gameWon = false;

  document.getElementById("info").innerText = `Level ${level + 1}: Rotate mirrors to hit the target!`;
  document.getElementById("nextLevelBtn").disabled = true;

  startTimer();
}

// --- TIMER ---
function startTimer() {
  document.getElementById("timer").innerText = `Time left: ${timeLeft}s`;
  timerInterval = setInterval(() => {
    if (!gameWon) {
      timeLeft--;
      document.getElementById("timer").innerText = `Time left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (!gameWon) showModal("⏰ Time's up! You lose.");
      }
    }
  }, 1000);
}

// --- DRAW GRID ---
function drawGrid() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#444";
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }
}

// --- DRAW ELEMENTS ---
function drawElements() {
  ctx.fillStyle = "#ffd700";
  ctx.beginPath();
  ctx.arc(lightSource.x * cellSize + cellSize / 2, lightSource.y * cellSize + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#00ff00";
  ctx.fillRect(target.x * cellSize + cellSize / 4, target.y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);

  ctx.strokeStyle = "#55aaff";
  ctx.lineWidth = 4;
  mirrors.forEach(m => {
    ctx.save();
    ctx.translate(m.x * cellSize + cellSize / 2, m.y * cellSize + cellSize / 2);
    ctx.rotate(m.angle);
    if (m.type === "/") {
      ctx.beginPath();
      ctx.moveTo(-cellSize / 4, cellSize / 4);
      ctx.lineTo(cellSize / 4, -cellSize / 4);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-cellSize / 4, -cellSize / 4);
      ctx.lineTo(cellSize / 4, cellSize / 4);
      ctx.stroke();
    }
    ctx.restore();
  });
}

// Add this function to LightReflectionPuzzle.js
function resetGame() {
  clearInterval(timerInterval);
  document.getElementById("gameModal").style.display = "none";
  document.getElementById("modalMessage").innerText = "";
  currentLevel = 0; // Set level to 0 (Level 1)
  setTimeout(() => loadLevel(currentLevel), 100);
}
// --- RESTART BUTTON ---
document.getElementById("restartBtn").addEventListener("click", () => {
  clearInterval(timerInterval);
  document.getElementById("gameModal").style.display = "none";
  document.getElementById("modalMessage").innerText = "";
  currentLevel = 0; // Restart from Level 1
  setTimeout(() => loadLevel(currentLevel), 100);
});
// --- DRAW LIGHT + WIN LOGIC ---
function drawLight() {
  let x = lightSource.x + 0.5;
  let y = lightSource.y + 0.5;
  let vx = 1, vy = 0;

  ctx.strokeStyle = "#ffff00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x * cellSize, y * cellSize);

  let maxSteps = 1000;
  gameWon = false;

  while (maxSteps-- > 0 && timeLeft > 0) {
    const cx = Math.floor(x);
    const cy = Math.floor(y);
    const mirror = mirrors.find(m => m.x === cx && m.y === cy);

    if (mirror) {
      let normalAngle = mirror.angle + (mirror.type === "/" ? Math.PI / 4 : -Math.PI / 4);
      let nx = Math.cos(normalAngle);
      let ny = Math.sin(normalAngle);
      let dot = vx * nx + vy * ny;
      vx = vx - 2 * dot * nx;
      vy = vy - 2 * dot * ny;
    }

    x += vx * 0.1;
    y += vy * 0.1;
    ctx.lineTo(x * cellSize, y * cellSize);

    if (x < 0 || x > gridSize || y < 0 || y > gridSize) break;

    if (Math.floor(x) === target.x && Math.floor(y) === target.y) {
      gameWon = true;
      clearInterval(timerInterval);

      if (currentLevel < levels.length - 1) {
        document.getElementById("info").innerText = `🎉 Level ${currentLevel + 1} complete! Click Next Level to continue.`;
        document.getElementById("nextLevelBtn").disabled = false;
      } else {
        showModal("🏆 CONGRATULATIONS! You solved all the puzzles!");
      }
      break;
    }
  }
  ctx.stroke();

  if (!gameWon && timeLeft > 0 && document.getElementById("nextLevelBtn").disabled) {
    document.getElementById("info").innerText = `Level ${currentLevel + 1}: Rotate mirrors to hit the target!`;
  }
}

// --- DRAW EVERYTHING ---
function draw() {
  drawGrid();
  drawElements();
  drawLight();
}

// --- ROTATE MIRRORS ---
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;

  const gx = Math.floor(mx / cellSize);
  const gy = Math.floor(my / cellSize);

  mirrors.forEach(m => {
    if (m.x === gx && m.y === gy) {
      m.angle += 15 * Math.PI / 180;
      draw();
    }
  });
});

// --- NEXT LEVEL ---
function nextLevel() {
  if (currentLevel < levels.length - 1) {
    currentLevel++;
    loadLevel(currentLevel);
  }
}

// --- GAME LOOP ---
function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

// --- START GAME ---
loadLevel(currentLevel);
gameLoop();
