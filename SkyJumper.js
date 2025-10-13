const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

// Overlay elements
const gameOverlay = document.getElementById("gameOverlay");
const messageEl = document.getElementById("message");
const finalScoreEl = document.getElementById("finalScore");
const restartBtnOverlay = document.getElementById("restartBtnOverlay");

// NEW: Mobile Control Buttons
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");

let player, platforms, coins, gameLoop, gravity, jumpPower, isJumping, score;
const PLAYER_SPEED = 5;
const WIN_SCORE = 10;

function resetGame() {
  gravity = 0.4;
  jumpPower = -9;
  isJumping = false;
  score = 0;
  coins = [];
  
  // Hide the overlay and initial start button
  gameOverlay.classList.add('hidden-overlay');
  startBtn.style.display = 'none';

  // Create initial platforms
  platforms = [];
  const gap = 100;
  
  // 1. Create the very first platform (the starting one)
  const startPlatform = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 50,
    width: 100,
    height: 10
  };
  platforms.push(startPlatform);

  // 2. Create the remaining platforms above the starting one
  for (let i = 1; i < 6; i++) {
    platforms.push({
      x: Math.random() * 300 + 20,
      y: startPlatform.y - i * gap,
      width: 100,
      height: 10
    });
  }

  // 3. Set player to START ON the first platform
  player = {
    x: startPlatform.x + startPlatform.width / 2 - 15,
    y: startPlatform.y - 30,
    width: 30,
    height: 30,
    dy: 0,
    dx: 0
  };
}

// --- Drawing Functions (unchanged) ---

function drawPlayer() {
  ctx.fillStyle = "#ffcc00";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = "#ff4d4d";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}

function drawCoins() {
  ctx.fillStyle = "#ffd700";
  coins.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x + c.size / 2, c.y + c.size / 2, c.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText(`Coins: ${score} / ${WIN_SCORE}`, 10, 20);
}

// --- Update Logic ---

function updatePlatforms() {
  // Check for Win condition before updating score/platforms
  if (score >= WIN_SCORE) {
      winGame();
      return;
  }
  
  // Move all elements down to simulate player climbing
  platforms.forEach(p => {
    p.y += 2;
  });
  coins.forEach(c => {
    c.y += 2;
  });

  // Generate new platform at the top
  if (platforms[0].y > 50) { 
    const topY = platforms[0].y - 100;
    const newPlatform = {
      x: Math.random() * 300 + 20,
      y: topY,
      width: 100,
      height: 10
    };
    platforms.unshift(newPlatform);
    
    // 30% chance to generate a coin on the new platform
    if (Math.random() < 0.3) { 
        coins.unshift({
            x: newPlatform.x + newPlatform.width / 2 - 5,
            y: newPlatform.y - 15,
            size: 10
        });
    }
  }

  // Remove elements that have scrolled off the bottom
  platforms = platforms.filter(p => p.y < canvas.height + 50);
  coins = coins.filter(c => c.y < canvas.height + 50);
}

function updatePlayer() {
  // Apply horizontal movement and wrapping
  player.x += player.dx;
  if (player.x > canvas.width) {
    player.x = -player.width;
  } else if (player.x < -player.width) {
    player.x = canvas.width;
  }

  // Apply gravity and vertical movement
  player.dy += gravity;
  player.y += player.dy;

  // Collision detection with platforms
  platforms.forEach(p => {
    if (
      player.x + player.width > p.x &&
      player.x < p.x + p.width &&
      player.y + player.height > p.y &&
      player.y + player.height < p.y + p.height + 5 &&
      player.dy > 0
    ) {
      player.dy = jumpPower;
      isJumping = false;
    }
  });

  // Check for coin collection
  coins.forEach((c, index) => {
      if (
        player.x < c.x + c.size &&
        player.x + player.width > c.x &&
        player.y < c.y + c.size &&
        player.y + player.height > c.y
      ) {
        score += 1;
        coins.splice(index, 1);
      }
  });

  // Game over if player falls below bottom
  if (player.y > canvas.height) {
    endGame();
  }
}

function jump() {
  // Check if game is not running (i.e., overlay is hidden)
  if(gameOverlay.classList.contains('hidden-overlay') === false) return; 

  if (player.dy > 0 || !isJumping) {
    player.dy = jumpPower;
    isJumping = true;
  }
}

// --- Game Control ---

function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#101b38"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height); 

  drawPlatforms();
  drawCoins();
  drawPlayer();
  drawScore();
  
  updatePlatforms();
  updatePlayer();
  
  // Use requestAnimationFrame for smooth loop
  gameLoop = requestAnimationFrame(game);
}

function startGame() {
  resetGame();
  cancelAnimationFrame(gameLoop);
  gameLoop = requestAnimationFrame(game);
}

function endGame() {
  cancelAnimationFrame(gameLoop);
  
  // Set content for the lose popup
  messageEl.textContent = "Game Over!";
  messageEl.style.color = "#ff4d4d";
  finalScoreEl.textContent = score;
  
  // Display the overlay
  gameOverlay.classList.remove('hidden-overlay');
}

function winGame() {
    cancelAnimationFrame(gameLoop);

    // Set content for the win popup
    messageEl.textContent = "You Win!";
    messageEl.style.color = "#ffcc00";
    finalScoreEl.textContent = score;

    // Display the overlay
    gameOverlay.classList.remove('hidden-overlay');
}

startBtn.addEventListener("click", startGame);
restartBtnOverlay.addEventListener("click", startGame); 

// --- Input Handlers for Desktop (Keyboard) ---
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    jump();
  }
  if (e.code === "ArrowLeft") {
    player.dx = -PLAYER_SPEED;
  }
  if (e.code === "ArrowRight") {
    player.dx = PLAYER_SPEED;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
    player.dx = 0;
  }
});

// --- NEW Input Handlers for Mobile (Buttons) ---

// Jump Button
jumpBtn.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevents default browser actions like scrolling
    jump();
});
jumpBtn.addEventListener("mousedown", jump); // For touch simulation on desktop

// Left Button
function startLeftMove(e) {
    if (e.cancelable) e.preventDefault();
    player.dx = -PLAYER_SPEED;
}
function stopMove() {
    player.dx = 0;
}
leftBtn.addEventListener("touchstart", startLeftMove);
leftBtn.addEventListener("mousedown", startLeftMove);
leftBtn.addEventListener("touchend", stopMove);
leftBtn.addEventListener("mouseup", stopMove);

// Right Button
function startRightMove(e) {
    if (e.cancelable) e.preventDefault();
    player.dx = PLAYER_SPEED;
}
rightBtn.addEventListener("touchstart", startRightMove);
rightBtn.addEventListener("mousedown", startRightMove);
rightBtn.addEventListener("touchend", stopMove);
rightBtn.addEventListener("mouseup", stopMove);