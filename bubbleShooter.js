const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- CONSTANTS ---
const COLORS = ["#ff4b5c", "#fddb3a", "#3ae374", "#17c0eb", "#9b59b6"];
const RADIUS = 20;
const ROWS = 12;
const COLS = 10;
const BUBBLE_DIAMETER = RADIUS * 2;
const V_SPACING_FACTOR = Math.sqrt(3);
const SHOOTER_Y = canvas.height - 30;
const GAME_OVER_ROW = ROWS - 1;

let grid = [];
let shooter = { x: canvas.width / 2, y: SHOOTER_Y, angle: -Math.PI / 2 };
let currentBubble;
let gameLoopId;
let score = 0;
let isGameOver = false;

// --- Neighbor Map for Hex Grid ---
const NEIGHBORS = [
  [
    { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
    { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
    { dr: 1, dc: 0 }, { dr: 1, dc: 1 }
  ],
  [
    { dr: -1, dc: -1 }, { dr: -1, dc: 0 },
    { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
    { dr: 1, dc: -1 }, { dr: 1, dc: 0 }
  ]
];

// -------------------- Grid Setup --------------------
function initGrid() {
  if (gameLoopId) cancelAnimationFrame(gameLoopId);
  score = 0;
  isGameOver = false;

  grid = [];
  for (let row = 0; row < ROWS; row++) {
    grid[row] = [];
    let colsInRow = COLS - (row % 2);
    for (let col = 0; col < colsInRow; col++) {
      if (row < 5) {
        grid[row][col] = { color: randomColor(), active: true };
      } else {
        grid[row][col] = null;
      }
    }
  }
  spawnBubble();
  gameLoopId = requestAnimationFrame(update);
}

// -------------------- Bubble Utilities --------------------
function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function spawnBubble() {
  currentBubble = {
    x: shooter.x,
    y: shooter.y,
    dx: 0,
    dy: 0,
    color: randomColor(),
    moving: false
  };
}

function getBubblePosition(r, c) {
  const xOffset = r % 2 === 1 ? RADIUS : 0;
  const x = RADIUS + c * BUBBLE_DIAMETER + xOffset;
  const y = RADIUS + r * RADIUS * V_SPACING_FACTOR;
  return { x, y };
}

// -------------------- Drawing --------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Game Over Line
  const { y: gameOverY } = getBubblePosition(GAME_OVER_ROW, 0);
  ctx.beginPath();
  ctx.moveTo(0, gameOverY - RADIUS);
  ctx.lineTo(canvas.width, gameOverY - RADIUS);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw grid bubbles
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const b = grid[r][c];
      if (b) {
        const { x, y } = getBubblePosition(r, c);
        drawBubble(x, y, b.color);
      }
    }
  }

  // Draw shooter and current bubble
  drawShooter();
  drawBubble(currentBubble.x, currentBubble.y, currentBubble.color);

  // Draw score
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 25);

  // Draw game over overlay
  if (isGameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText(score, canvas.width / 2, canvas.height /1.5);
    ctx.font = "20px Arial";
    ctx.fillText("Click here to restart", canvas.width / 2, canvas.height / 2);
  }
}

function drawBubble(x, y, color) {
  ctx.beginPath();
  ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.stroke();
}

function drawShooter() {
  ctx.beginPath();
  ctx.moveTo(shooter.x, shooter.y);
  ctx.lineTo(shooter.x + Math.cos(shooter.angle) * 80, shooter.y + Math.sin(shooter.angle) * 80);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(shooter.x, shooter.y, 12, 0, Math.PI * 2);
  ctx.fillStyle = currentBubble.color;
  ctx.fill();
}

// -------------------- Game Logic --------------------
function update() {
  if (currentBubble.moving) {
    currentBubble.x += currentBubble.dx;
    currentBubble.y += currentBubble.dy;

    // Wall bounce
    if (currentBubble.x - RADIUS < 0 || currentBubble.x + RADIUS > canvas.width) {
      currentBubble.dx *= -1;
    }

    // Top wall collision
    if (currentBubble.y - RADIUS < 0) {
      stopBubble();
    }

    // Collision with grid bubbles
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const b = grid[r][c];
        if (b) {
          const { x: bx, y: by } = getBubblePosition(r, c);
          if (distance(currentBubble.x, currentBubble.y, bx, by) < BUBBLE_DIAMETER - 1) {
            stopBubble();
            r = ROWS;
            break;
          }
        }
      }
    }
  }

  draw();
  if (!isGameOver) {
    gameLoopId = requestAnimationFrame(update);
  }
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

// -------------------- Place Bubble --------------------
function stopBubble() {
  currentBubble.moving = false;

  const rApprox = Math.round((currentBubble.y - RADIUS) / (RADIUS * V_SPACING_FACTOR));
  const r = Math.max(0, Math.min(rApprox, ROWS - 1));
  const xOffset = r % 2 === 1 ? RADIUS : 0;
  const cApprox = Math.round((currentBubble.x - RADIUS - xOffset) / BUBBLE_DIAMETER);
  const c = Math.max(0, Math.min(cApprox, grid[r].length - 1));

  const { x: snappedX, y: snappedY } = getBubblePosition(r, c);
  currentBubble.x = snappedX;
  currentBubble.y = snappedY;

  grid[r][c] = { color: currentBubble.color, active: true };

  // Match check
  const matched = getMatchingBubbles(r, c, currentBubble.color);
  if (matched.length >= 3) {
    for (const m of matched) {
      grid[m.row][m.col] = null;
      score += 10; // increment score
    }
    checkWin();
  }

  checkGameOver();
  if (!isGameOver) spawnBubble();
}

// -------------------- Matching Logic --------------------
function getMatchingBubbles(row, col, color) {
  const visited = {};
  const toCheck = [{ row, col }];
  const matched = [];
  const neighborDirs = NEIGHBORS[row % 2];

  while (toCheck.length > 0) {
    const { row: r, col: c } = toCheck.pop();
    const key = `${r},${c}`;
    if (visited[key]) continue;
    visited[key] = true;

    if (grid[r] && grid[r][c] && grid[r][c].color === color) {
      matched.push({ row: r, col: c });

      for (const { dr, dc } of neighborDirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < grid[nr].length && grid[nr][nc]) {
          toCheck.push({ row: nr, col: nc });
        }
      }
    }
  }
  return matched;
}

// -------------------- Mouse Control --------------------
canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  if (my > shooter.y) return;
  shooter.angle = Math.atan2(my - shooter.y, mx - shooter.x);
});

canvas.addEventListener("click", e => {
  if (isGameOver) {
    initGrid();
  } else if (!currentBubble.moving) {
    const speed = 10;
    currentBubble.dx = Math.cos(shooter.angle) * speed;
    currentBubble.dy = Math.sin(shooter.angle) * speed;
    currentBubble.moving = true;
  }
});

// -------------------- Game State Checks --------------------
function checkGameOver() {
  for (let r = GAME_OVER_ROW; r < ROWS; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== null) {
        isGameOver = true;
        return true;
      }
    }
  }
  return false;
}

function checkWin() {
  let bubblesLeft = false;
  for (let r = 0; r < ROWS; r++) {
    if (grid[r].some(b => b !== null)) {
      bubblesLeft = true;
      break;
    }
  }
  if (!bubblesLeft) {
    isGameOver = true;
  }
}

// -------------------- Start Game --------------------
initGrid();
