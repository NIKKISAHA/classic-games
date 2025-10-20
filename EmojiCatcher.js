const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score"); // Used for temporary level pass messages

// --- Game Status & Modal ---
const modal = document.getElementById("game-status-modal");
const modalMessage = document.getElementById("modal-message");
const restartBtn = document.getElementById("restart-btn");
let gameActive = true; // New flag to pause the game logic

const catcher = {
  x: 170,
  y: 450,
  w: 60,
  h: 20,
  speed: 5
};

let emojis = [];
const emojiList = ["🍎","🍌","🍇","🍒","🍉","🍍"];
let score = 0;

// --- Level system ---
let level = 1;
const maxLevels = 5;
let levelTime = 15; // seconds per level
let timeLeft = levelTime;
let emojisCaughtThisLevel = 0;

// --- Control catcher ---
// const keys = {};
// document.addEventListener("keydown", e => keys[e.key] = true);
// document.addEventListener("keyup", e => keys[e.key] = false);
// --- Control catcher ---
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// --- START MOBILE CONTROL LOGIC ADDITION ---

const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");

// Helper function to handle touchstart/touchend and mousedown/mouseup events
function handleButtonInput(button, key, isDown) {
    if (button) {
        // Touch events (for mobile)
        button.addEventListener(isDown ? 'touchstart' : 'touchend', (e) => { e.preventDefault(); keys[key] = isDown; });
        
        // Mouse/Click events (for desktop touch or click)
        button.addEventListener(isDown ? 'mousedown' : 'mouseup', () => keys[key] = isDown);
    }
}

// Connect the left button to ArrowLeft key
handleButtonInput(leftBtn, "ArrowLeft", true);
handleButtonInput(leftBtn, "ArrowLeft", false);

// Connect the right button to ArrowRight key
handleButtonInput(rightBtn, "ArrowRight", true);
handleButtonInput(rightBtn, "ArrowRight", false);

// --- END MOBILE CONTROL LOGIC ADDITION ---

// --- Spawn emojis with speed based on level ---
function spawnEmoji() {
  const emoji = {
    x: Math.random() * (canvas.width - 30),
    y: -30,
    char: emojiList[Math.floor(Math.random() * emojiList.length)],
    speed: 2 + level * 0.8 + Math.random() * 1.5
  };
  emojis.push(emoji);
}

// --- Display Temporary Level Pass Message ---
function showLevelPassMessage(message) {
    scoreEl.innerHTML = `<span style="color: #007bff; font-size: 24px;">${message}</span>`;
    setTimeout(() => {
        // Reset the score element back to its original instruction text
        scoreEl.innerHTML = `To clear each level, you have to catch 10 emojis.`;
    }, 3000); // Display message for 3 seconds
}

// --- Modal Handlers (Used only for final win/loss) ---
function showModal(message, isFinal = false) {
    gameActive = false; // Pause the update/draw loop
    clearInterval(emojiInterval); // Stop spawning emojis
    modalMessage.textContent = message;
    
    // Customize button text for final win/loss
    restartBtn.textContent = isFinal ? "Restart Game (Level 1)" : "Try Again";
    
    modal.style.display = "block";
}

function hideModal() {
    modal.style.display = "none";
    gameActive = true; // Resume the update/draw loop
    if (level <= maxLevels) {
        // Only restart spawner if we are playing a level
        emojiInterval = setInterval(spawnEmoji, 1000);
    }
}

// --- Update ---
function update() {
  // Move catcher
  if (keys["ArrowLeft"] && catcher.x > 0) catcher.x -= catcher.speed;
  if (keys["ArrowRight"] && catcher.x + catcher.w < canvas.width) catcher.x += catcher.speed;

  // Move emojis
  for (let i = emojis.length - 1; i >= 0; i--) {
    emojis[i].y += emojis[i].speed;

    // Check catch
    if (
      emojis[i].y + 20 >= catcher.y &&
      emojis[i].x + 20 >= catcher.x &&
      emojis[i].x <= catcher.x + catcher.w
    ) {
      score += 1;
      emojisCaughtThisLevel += 1;
      emojis.splice(i,1);
    } 
    // Remove if missed
    else if (emojis[i].y > canvas.height) {
      emojis.splice(i,1);
    }
  }

  // Timer countdown
  if (frameCount % 60 === 0 && timeLeft > 0) { // approx 1 second
    timeLeft--;
  }

  // Level completion (MODIFIED)
  if (timeLeft <= 0) {
    clearInterval(emojiInterval); // Stop spawning immediately when time runs out
    
    if (emojisCaughtThisLevel >= 10) {
        if (level === maxLevels) {
            // FINAL WIN: Show modal
            showModal("🎉 You Completed All Levels! You Win! 🎉", true);
        } else {
            // REGULAR LEVEL PASS: Show text message and advance level
            showLevelPassMessage(`Level ${level} Complete! Advancing to Level ${level + 1}...`);
            level++; 
            startLevel(level); // Immediately start the next level
        }
    } else {
        // LEVEL FAIL: Show modal
        showModal(`Level ${level} Failed! You caught ${emojisCaughtThisLevel} of 10.`, false);
        // Level remains the same, the button click will retry this level
    }
  }
}

// --- Draw ---
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Draw basket catcher (trapezoid)
  ctx.fillStyle = "#8b5a2b";
  ctx.beginPath();
  ctx.moveTo(catcher.x, catcher.y); 
  ctx.lineTo(catcher.x + catcher.w, catcher.y); 
  ctx.lineTo(catcher.x + catcher.w - 10, catcher.y + catcher.h); 
  ctx.lineTo(catcher.x + 10, catcher.y + catcher.h); 
  ctx.closePath();
  ctx.fill();

  // Basket rim
  ctx.strokeStyle = "#654321";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(catcher.x, catcher.y);
  ctx.lineTo(catcher.x + catcher.w, catcher.y);
  ctx.stroke();

  // Draw emojis
  ctx.font = "25px Arial";
  emojis.forEach(e => {
    ctx.fillText(e.char, e.x, e.y);
  });

  // Draw score and level
  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Level: ${level}`, 10, 40);
  ctx.fillText(`Time Left: ${timeLeft}s`, 10, 60);
}

// --- Game loop ---
let frameCount = 0;
function loop() {
  if (!gameActive) {
    requestAnimationFrame(loop);
    return;
  }
  
  frameCount++;
  update();
  draw();
  requestAnimationFrame(loop);
}

// --- Start level ---
function startLevel(lv) {
  emojis = [];
  emojisCaughtThisLevel = 0;
  timeLeft = levelTime;
  gameActive = true;
  // Restart the spawner when starting a new level
  if (emojiInterval) clearInterval(emojiInterval); 
  emojiInterval = setInterval(spawnEmoji, 1000); 
}

// --- Reset game ---
function resetGame() {
  level = 1;
  score = 0;
  startLevel(level);
}

// Spawn emoji every 1 second (Changed to use a mutable variable)
let emojiInterval = setInterval(spawnEmoji, 1000);

// --- Restart Button Logic ---
restartBtn.addEventListener('click', () => {
    // if (level > maxLevels) {
    //     resetGame(); // Final win: restart from level 1
    // } else {
    //     // Level failure: retry the current level
    //     startLevel(level); 
    // }
    level = 1;
  score = 0;
  startLevel(level);
    hideModal();
});

// Initial call to start the game
startLevel(level); 
loop();