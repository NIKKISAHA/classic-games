const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const resetBtn = document.getElementById("resetBtn");
const nextBtn = document.getElementById("nextBtn");
const levelDisplay = document.getElementById("levelDisplay");

// --- NEW POPUP ELEMENTS ---
const popupContainer = document.getElementById("popupContainer");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupNextBtn = document.getElementById("popupNextBtn");
const popupResetBtn = document.getElementById("popupResetBtn");

let drawing = false;
let path = [];
let gameOver = false;
let currentLevel = 0;

const levels = [
  // --- Level 1: Initial Warmup --- (Unchanged for consistency)
  {
    start: { x: 50, y: 400, r: 15 },
    goal: { x: 550, y: 50, r: 15 },
    obstacles: [
      { x: 150, y: 0, w: 40, h: 400 },
      { x: 300, y: 150, w: 40, h: 300 },
      { x: 450, y: 0, w: 40, h: 300 },
      { x: 50, y: 350, w: 100, h: 20 },
      { x: 500, y: 100, w: 80, h: 20 },
    ]
  },
  

//   // --- Level 2: Alternating Gaps & Density --- (Unchanged for consistency)
   {
    start: { x: 50, y: 225, r: 15 },
    goal: { x: 550, y: 225, r: 15 },
    obstacles: [
      { x: 100, y: 0, w: 30, h: 150 },
      { x: 100, y: 300, w: 30, h: 150 },
      { x: 200, y: 50, w: 30, h: 300 },
      { x: 300, y: 0, w: 30, h: 150 },
      { x: 300, y: 300, w: 30, h: 150 },
      { x: 400, y: 50, w: 30, h: 300 },
      { x: 500, y: 0, w: 30, h: 150 },
      { x: 500, y: 300, w: 30, h: 150 },
      { x: 250, y: 215, w: 100, h: 20 },
    ]
  },
  // --- Level 3: Dual-Chamber Vertical Maze (Significantly More Complex) ---
  {
    start: { x: 500, y: 420, r: 15 }, // Start bottom-center
    goal: { x: 400, y: 30, r: 15 }, // Goal top-center
    obstacles: [
      // Outer barrier dividing the left/right paths
      { x: 280, y: 50, w: 40, h: 320 },
      
      // Left chamber obstacles (requires vertical up/down movement)
      { x: 10, y: 400, w: 230, h: 20 },
      { x: 50, y: 200, w: 630, h: 20 },
      { x: 50, y: 300, w: 230, h: 20 },
      // Choke points at the top and bottom of the central divide
      { x: 280, y: 400, w: 40, h: 10 }, // Bottom exit gap
      { x: 280, y: 40, w: 40, h: 10 }, // Top entry gap
      
      // Small precision block to force a tight turn near the goal
      { x: 40, y: 10, w: 10, h: 160 },
    ]
  },
  // --- Level 4: The Serpentine Squeeze (Significantly More Complex) ---
 // --- Level 4: Winding Open Maze (FIXED to match image and be playable) ---
 {
    start: { x: 50, y: 50, r: 15 }, // Start top-left
    goal: { x: 550, y: 400, r: 15 }, // Goal bottom-right
    obstacles: [
      // Top horizontal wall segment
      { x: 40, y: 80, w: 800, h: 20 },
      
      // Vertical drop 1 (Left side)
      { x: 250, y: 100, w: 20, h: 100 },
      
      // Mid horizontal wall
      { x: 10, y: 180, w: 200, h: 20 },
      
      // Vertical drop 2 (Center)
      { x: 400, y: 100, w: 20, h: 240 },

      // Bottom horizontal wall segment
      { x: 40, y: 260, w: 500, h: 20 },
      
      // Final vertical wall leading to the goal turn
      { x: 250, y: 280, w: 20, h: 100 },
      
      // Block near the goal to define the path
      { x: 300, y: 380, w: 200, h: 120 },
    ]
  },
 // --- Level 5: Solvable Precision Gauntlet (FIXED & Playable) ---
  {
    start: { x: 30, y: 225, r: 15 },
    goal: { x: 570, y: 225, r: 15 },
    obstacles: [
      // Top/Bottom barriers (made narrower for solvability)
      { x: 0, y: 0, w: 600, h: 170 }, // Top Barrier (170 height, leaves 110 gap)
      { x: 0, y: 280, w: 600, h: 170 }, // Bottom Barrier (leaves 110 gap)
      
      // Tight gates in the central corridor (require precision drawing)
      { x: 100, y: 170, w: 20, h: 40 },
      { x: 100, y: 230, w: 20, h: 40 },
      { x: 300, y: 190, w: 20, h: 110 },
      { x: 400, y: 90, w: 20, h: 150 },
      
      // Alternating Choke near the goal
      { x: 500, y: 170, w: 10, h: 40 }, // Top choke
      { x: 500, y: 240, w: 10, h: 40 }, // Bottom choke
    ]
  },
  // --- Level 6: The Labyrinth of Crossings ---
  {
    start: { x: 550, y: 400, r: 15 }, 
    goal: { x: 50, y: 50, r: 15 }, 
    obstacles: [
      { x: 90, y: 0, w: 110, h: 120 },
      { x: 100, y: 200, w: 110, h: 120 },
      { x: 100, y: 300, w: 100, h: 20 },
      
      { x: 500, y: 50, w: 110, h: 100 },
      { x: 250, y: 20, w: 20, h: 200 },
      { x: 250, y: 250, w: 20, h: 100 },
      { x: 250, y: 350, w: 20, h: 100 },
      
      { x: 300, y: 100, w: 100, h: 20 },
      { x: 300, y: 200, w: 100, h: 20 },
      { x: 300, y: 300, w: 100, h: 20 },
      
      { x: 500, y: 200, w: 10, h: 240 },
    ]
  },
// --- NEW Level 7: Pinball Alley ---
  {
    start: { x: 50, y: 30, r: 15 },
    goal: { x: 570, y: 420, r: 15 },
    obstacles: [
      // Angled/diagonal blocks (simulated by vertical/horizontal arrangement)
      { x: 100, y: 50, w: 20, h: 300 },
      { x: 200, y: 50, w: 240, h: 20 },
      { x: 200, y: 10, w: 20, h: 120 },
      { x: 300, y: 50, w: 20, h: 100 },
      { x: 400, y: 105, w: 20, h: 290 },
      { x: 490, y: 10, w: 240, h: 100 },
    //   
      // Bottom path blocker
      { x: 100, y: 350, w: 300, h: 20 },
      
      // Tight exit funnel
      { x: 520, y: 150, w: 20, h: 250 },
      { x: 480, y: 350, w: 20, h: 100 },
    ]
  },
   // --- NEW Level 8: Quarter-Grid Trap ---
  {
    start: { x: 30, y: 420, r: 15 },
    goal: { x: 570, y: 330, r: 15 },
    obstacles: [
      // Forces path through a small opening in the center
      { x: 20, y: 220, w: 390, h: 20 }, // Left-Half horizontal
      { x: 460, y: 220, w: 280, h: 20 }, // Right-Half horizontal
      
      { x: 300, y: 20, w: 20, h: 200 }, // Top-Half vertical
      { x: 300, y: 240, w: 20, h: 210 }, // Bottom-Half vertical
      
      // Internal blocks making the path longer
      { x: 1, y: 300, w: 200, h: 20 },
      { x: 360, y: 100, w: 140, h: 20 },
    ]
  },
  // --- NEW Level 9: Winding Canyon ---
   {
    start: { x: 50, y: 225, r: 15 }, // Start at the right edge
    goal: {  x: 550, y: 225, r: 15}, // Goal at the left edge
    obstacles: [
      // Top/Bottom walls
      { x: 0, y: 0, w: 600, h: 80 },
      { x: 0, y: 370, w: 600, h: 80 },
      
      // Central winding path
      { x: 400, y: 80, w: 20, h: 250 },
      { x: 220, y: 220, w: 150, h: 20 },
      { x: 180, y: 140, w: 20, h: 330 },
      
      // Final tight curve blocker
      { x: 100, y: 50, w: 20, h: 280 },
    ]
  },
  // --- NEW Level 10: Ultimate Precision Check ---
  {
    start: { x: 30, y: 30, r: 15 },
    goal: { x: 570, y: 420, r: 15 },
    obstacles: Array.from({ length: 8 }, (_, i) => ({
      x: 80 + i * 50,
      y: (i % 2 === 0) ? 50 : 350,
      w: 20,
      h: 50,
    })).concat(
      Array.from({ length: 8 }, (_, i) => ({
        x: 80 + i * 50,
        y: (i % 2 === 0) ? 150 : 250,
        w: 20,
        h: 50,
      }))
    )
  }
];

let start, goal, obstacles;

function loadLevel(index) {
  // Hide the pop-up if it's visible
  if (popupContainer) {
    popupContainer.classList.add('hidden');
  }
  
  // Ensure the Next Level button in the popup is visible for the next attempt
  if (popupNextBtn) {
      popupNextBtn.classList.remove('hidden');
  }
  
  const level = levels[index];
  start = level.start;
  goal = level.goal;
  obstacles = level.obstacles;
  drawing = false;
  path = [];
  gameOver = false;
  nextBtn.disabled = true; 
  levelDisplay.textContent = `Level ${index + 1} / ${levels.length}`;
  draw();
}

// --- FUNCTION TO SHOW WIN POPUP ---
function showWinPopup() {
  const isLastLevel = currentLevel === levels.length - 1;
  
  // Ensure Next Level button is visible for a win
  popupNextBtn.classList.remove('hidden');

  popupTitle.textContent = isLastLevel ? "🏆 Congratulations! Game Complete!" : `🎉 Level ${currentLevel + 1} Complete!`;
  popupMessage.textContent = isLastLevel ? "You finished all levels!" : "You nailed that one! Ready for the next challenge?";
  
  // Show the popup
  popupContainer.classList.remove('hidden');

  // Disable 'Next Level' button if it's the last level
  popupNextBtn.disabled = isLastLevel;

  // Set up button actions 
  popupNextBtn.onclick = () => {
    // Only proceed if it's not the last level
    if (!isLastLevel) {
      currentLevel++;
    }
    loadLevel(currentLevel);
  };
  
  // MODIFIED: Reset to Level 1
  popupResetBtn.onclick = () => {
    currentLevel = 0; // Set level to 1 (index 0)
    loadLevel(currentLevel);
  };
}
// --- END WIN FUNCTION ---

// --- FUNCTION TO SHOW LOSE POPUP ---
function showLosePopup() {
    popupTitle.textContent = "💥 Game Over!";
    popupMessage.textContent = "You hit an obstacle! Click 'Restart' to try again.";
    
    // Hide 'Next Level' button for a loss, only show 'Restart'
    popupNextBtn.classList.add('hidden'); 
    
    // Show the popup
    popupContainer.classList.remove('hidden');

    // MODIFIED: Reset to Level 1
    popupResetBtn.onclick = () => {
        currentLevel = 0; // Set level to 1 (index 0)
        loadLevel(currentLevel);
    };
}
// --- END LOSE FUNCTION ---

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // start
  ctx.fillStyle = "limegreen";
  ctx.beginPath();
  ctx.arc(start.x, start.y, start.r, 0, Math.PI * 2);
  ctx.fill();

  // goal
  ctx.fillStyle = "crimson";
  ctx.beginPath();
  ctx.arc(goal.x, goal.y, goal.r, 0, Math.PI * 2);
  ctx.fill();

  // obstacles
  ctx.fillStyle = "black";
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));

  // path
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i < path.length - 1; i++) {
    ctx.moveTo(path[i].x, path[i].y);
    ctx.lineTo(path[i + 1].x, path[i + 1].y);
  }
  ctx.stroke();
}

function checkCollision(x, y) {
  for (let o of obstacles) {
    if (x > o.x && x < o.x + o.w && y > o.y && y < o.y + o.h) return true;
  }
  return false;
}

function checkWin(x, y) {
  const dx = x - goal.x, dy = y - goal.y;
  return Math.sqrt(dx * dx + dy * dy) < goal.r;
}

canvas.addEventListener("mousedown", (e) => {
  if (gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const dx = mx - start.x;
  const dy = my - start.y;
  if (Math.sqrt(dx * dx + dy * dy) < start.r + 5) {
    drawing = true;
    path = [{ x: mx, y: my }];
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing || gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  path.push({ x: mx, y: my });

  if (checkCollision(mx, my)) {
    gameOver = true;
    showLosePopup(); // Custom "Game Over" pop-up called here
  }
  if (checkWin(mx, my)) {
    gameOver = true;
    showWinPopup();
  }
  draw();
});

canvas.addEventListener("mouseup", () => (drawing = false));

// MODIFIED: Main Reset button also resets to Level 1
resetBtn.addEventListener("click", () => {
    currentLevel = 0; // Set level to 1 (index 0)
    loadLevel(currentLevel);
});

// The main Next Level button is now secondary, the pop-up buttons handle primary flow.
nextBtn.addEventListener("click", () => {
  if (currentLevel < levels.length - 1) {
    currentLevel++;
    loadLevel(currentLevel);
  } else {
    // Only used if they click the main UI button after the last level
    alert("🏆 You finished all advanced levels!");
  }
});

loadLevel(currentLevel);