const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const resetBtn = document.getElementById("resetBtn");
const messageEl = document.getElementById("message");
const levelEl = document.getElementById("level");
const timerEl = document.getElementById("timer");
// New DOM element for the modal restart button
const modalRestartBtn = document.getElementById("modalRestartBtn");

let GRID_SIZE = 6;
let CELL_SIZE = 70;
let DOT_RADIUS = 15;

let grid = [];
let path = [];
let isDragging = false;
let whiteDots = [];

let currentLevel = 1;
let timer = 30;
let timerInterval;
let blueDotMoveInterval;

// --- Level settings (Extended to 12 levels) ---
const LEVELS = [
  // Levels 1-5: Basic progression
  { gridSize: 6, whiteDots: 6, blueDots: 8, time: 10 },
  { gridSize: 7, whiteDots: 7, blueDots: 12, time: 10 },
  { gridSize: 8, whiteDots: 8, blueDots: 16, time: 10 },
  { gridSize: 9, whiteDots: 9, blueDots: 20, time: 10 },
  { gridSize: 10, whiteDots: 10, blueDots: 25, time: 10 },
  
  // Levels 6-8: Max grid (12x12) & high density
  { gridSize: 10, whiteDots: 10, blueDots: 30, time: 10 },
  { gridSize: 12, whiteDots: 12, blueDots: 35, time: 10 },
  { gridSize: 12, whiteDots: 12, blueDots: 40, time: 10 },
  
  // --- NEW HARDER LEVELS (9-12) ---
  // Level 9: More white dots required
  { gridSize: 12, whiteDots: 13, blueDots: 45, time: 16 }, 
  
  // Level 10: Increased blue dot count (extreme density)
  { gridSize: 12, whiteDots: 14, blueDots: 50, time: 18 }, 
  
  // Level 11: Introduction of the largest grid (14x14)
  { gridSize: 14, whiteDots: 14, blueDots: 55, time: 20 },
  
  // Level 12 (Final): Largest grid, highest dot count, difficult time limit
  { gridSize: 14, whiteDots: 15, blueDots: 60, time: 18 } 
];

let whiteDotsNeeded = LEVELS[0].whiteDots;
let totalBlue = LEVELS[0].blueDots;

// --- Grid Generation ---
function generateGrid() {
  grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill("empty"));
  whiteDots = [];

  // Create guaranteed zigzag path
  let pathCells = [];
  let start = { r: 0, c: 0 };
  pathCells.push(start);
  grid[start.r][start.c] = "white";
  whiteDots.push(start);

  while (pathCells.length < whiteDotsNeeded) {
    const last = pathCells[pathCells.length - 1];
    const neighbors = getEmptyNeighbors(last.r, last.c);
    if (neighbors.length === 0) break;
    // Random zigzag preference: pick a neighbor not in same row or column
    const nextOptions = neighbors.filter(n => n.r !== last.r && n.c !== last.c);
    const next = nextOptions.length > 0 ? nextOptions[Math.floor(Math.random() * nextOptions.length)]
                                       : neighbors[Math.floor(Math.random() * neighbors.length)];
    pathCells.push(next);
    grid[next.r][next.c] = "white";
    whiteDots.push(next);
  }

  // Add random blue dots
  let added = 0;
  while (added < totalBlue) {
    let r = Math.floor(Math.random() * GRID_SIZE);
    let c = Math.floor(Math.random() * GRID_SIZE);
    if (grid[r][c] === "empty") {
      grid[r][c] = "blue";
      added++;
    }
  }
}

// --- Get empty neighbors for path ---
function getEmptyNeighbors(r, c) {
  const dirs = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 }
  ];
  return dirs
    .map(d => ({ r: r + d.dr, c: c + d.dc }))
    .filter(n => n.r >= 0 && n.r < GRID_SIZE && n.c >= 0 && n.c < GRID_SIZE && grid[n.r][n.c] === "empty");
}

// --- Draw grid and path ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw path line
  if (path.length > 0) {
    ctx.beginPath();
    ctx.strokeStyle = "#55aaff";
    ctx.lineWidth = 6;
    const first = path[0];
    ctx.moveTo(first.c * CELL_SIZE + CELL_SIZE / 2, first.r * CELL_SIZE + CELL_SIZE / 2);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].c * CELL_SIZE + CELL_SIZE / 2, path[i].r * CELL_SIZE + CELL_SIZE / 2);
    }
    ctx.stroke();
  }

  // Draw dots
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = grid[r][c];
      ctx.beginPath();
      if (cell === "empty") ctx.fillStyle = "#333";       // gray
      else if (cell === "white") ctx.fillStyle = "#fff"; // white
      else if (cell === "blue") ctx.fillStyle = "#55aaff"; // blue
      ctx.arc(c * CELL_SIZE + CELL_SIZE / 2, r * CELL_SIZE + CELL_SIZE / 2, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f0f4f8";
      ctx.stroke();
    }
  }
}

// --- Mouse Helpers ---
function getMouseCell(evt) {
  const rect = canvas.getBoundingClientRect();
  const x = evt.clientX - rect.left;
  const y = evt.clientY - rect.top;
  const c = Math.floor(x / CELL_SIZE);
  const r = Math.floor(y / CELL_SIZE);
  if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) return { r, c };
  return null;
}

function isAdjacentCell(a, b) {
  return (Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1);
}

// --- Mouse Events ---
canvas.addEventListener("mousedown", e => {
  const cell = getMouseCell(e);
  if (cell && grid[cell.r][cell.c] !== "blue") {
    // FIX: Clear the blue dot interval when player starts dragging
    clearInterval(blueDotMoveInterval); 
    isDragging = true;
    path = [cell];
    draw();
  }
});

canvas.addEventListener("mousemove", e => {
  if (!isDragging) return;
  const cell = getMouseCell(e);
  if (!cell) return;
  const last = path[path.length - 1];

  // Only process adjacent moves
  if (isAdjacentCell(last, cell) && !path.some(p => p.r === cell.r && p.c === cell.c)) {
    // Check collision with blue dot
    if (grid[cell.r][cell.c] === "blue") {
      isDragging = false;
      checkLoss("collision");
      return;
    }
    path.push(cell);
    draw();
  }
});

canvas.addEventListener("mouseup", e => {
  if (isDragging) {
    isDragging = false;
    // FIX: Restart the blue dot interval when player releases drag
    blueDotMoveInterval = setInterval(moveBlueDots, 1000);
    checkWin();
  }
});

canvas.addEventListener("mouseleave", e => {
  if (isDragging) {
    isDragging = false;
    // FIX: Restart the blue dot interval when player leaves canvas
    blueDotMoveInterval = setInterval(moveBlueDots, 1000);
    checkWin();
  }
});

// --- Check Win/Loss ---
function checkWin() {
  const connectedWhite = path.filter(p => grid[p.r][p.c] === "white");
  const uniqueWhite = [...new Set(connectedWhite.map(p => `${p.r},${p.c}`))];

  // Safety: if path accidentally touches blue
  if (path.some(p => grid[p.r][p.c] === "blue")) {
    checkLoss("collision");
    return;
  }

  if (uniqueWhite.length === whiteDots.length) {
    clearInterval(timerInterval);
    clearInterval(blueDotMoveInterval);
    if (currentLevel < LEVELS.length) {
      messageEl.textContent = `🎉 Level ${currentLevel} completed!`;
      currentLevel++;
      setTimeout(() => startLevel(currentLevel), 1500);
    } else {
      // Logic for winning the final level (New)
      messageEl.textContent = "🏆 Congratulations! You completed all levels!";
      document.getElementById('winModal').style.display = 'block'; // Show popup
      currentLevel = 1;
    }
  }
}

function checkLoss(reason = "timeout") {
  clearInterval(timerInterval);
  clearInterval(blueDotMoveInterval);
  if (reason === "timeout") messageEl.textContent = "⏰ Time's up! Back to Level 1!";
  else messageEl.textContent = "💥 You hit a blue dot! Back to Level 1!";
  currentLevel = 1;
  setTimeout(() => startLevel(currentLevel), 1500);
}

// --- Timer ---
function startTimer() {
  clearInterval(timerInterval);
  timerEl.textContent = `Time: ${timer}s`;
  timerInterval = setInterval(() => {
    timer--;
    timerEl.textContent = `Time: ${timer}s`;
    if (timer <= 0) checkLoss("timeout");
  }, 1000);
}

// --- Move blue dots ---
function moveBlueDots() {
  const blueDotPositions = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === "blue") blueDotPositions.push({ r, c });
    }
  }

  blueDotPositions.forEach(dot => {
    if (grid[dot.r][dot.c] !== "blue") return;
    const dirs = [
      { dr: -1, dc: 0 }, { dr: 1, dc: 0 },
      { dr: 0, dc: -1 }, { dr: 0, dc: 1 }
    ];
    const validMoves = dirs.map(d => ({ r: dot.r + d.dr, c: dot.c + d.dc }))
      .filter(n => n.r >= 0 && n.r < GRID_SIZE && n.c >= 0 && n.c < GRID_SIZE && grid[n.r][n.c] === "empty");
    if (validMoves.length > 0) {
      const move = validMoves[Math.floor(Math.random() * validMoves.length)];
      // Check collision with current path
      if (path.some(p => p.r === move.r && p.c === move.c)) {
        checkLoss("collision");
        return;
      }
      grid[move.r][move.c] = "blue";
      grid[dot.r][dot.c] = "empty";
    }
  });

  draw();
}

// --- Start Level ---
function startLevel(level) {
  clearInterval(timerInterval);
  clearInterval(blueDotMoveInterval);

  // FIX 1: Dynamic Canvas Sizing for responsiveness
  const maxCanvasSize = 480;
  // Use 90% of the minimum of viewport width/height for square canvas
  const viewportSize = Math.min(window.innerWidth, window.innerHeight); 
  const newCanvasSize = Math.min(maxCanvasSize, viewportSize * 0.9); 

  canvas.width = newCanvasSize;
  canvas.height = newCanvasSize;
  
  const settings = LEVELS[level - 1];
  GRID_SIZE = settings.gridSize;
  CELL_SIZE = canvas.width / GRID_SIZE;
  // Adjusted dot radius for larger 14x14 grid
  DOT_RADIUS = settings.gridSize >= 14 ? 10 : (settings.gridSize <= 6 ? 15 : 12);
  timer = settings.time;
  whiteDotsNeeded = settings.whiteDots;
  totalBlue = settings.blueDots;

  generateGrid();
  path = [];
  draw();
  messageEl.textContent = "Connect all white dots without touching blue dots!";
  levelEl.textContent = `Level: ${currentLevel}`;

  startTimer();
  blueDotMoveInterval = setInterval(moveBlueDots, 1000);
}

// --- Reset Button ---
resetBtn.addEventListener("click", () => {
  currentLevel = 1;
  document.getElementById('winModal').style.display = 'none'; // Hide modal if open
  startLevel(currentLevel);
});

// --- Modal Restart Button (New) ---
modalRestartBtn.addEventListener("click", () => {
    document.getElementById('winModal').style.display = 'none';
    currentLevel = 1;
    startLevel(currentLevel);
});

// --- Init ---
startLevel(currentLevel);