// const dino = document.getElementById('dino');
// const cactus = document.getElementById('cactus');
// const scoreDisplay = document.getElementById('score');
// const gameOverScreen = document.getElementById('game-over');
// let score = 0;
// let isAlive = true;

// // --- Jump Functionality ---
// // Function to handle the player jump
// function jump() {
//     if (!dino.classList.contains('jump') && isAlive) {
//         dino.classList.add('jump');
//         // Remove the 'jump' class after the animation is complete (0.5s)
//         setTimeout(function() {
//             dino.classList.remove('jump');
//         }, 500);
//     }
// }

// // Listen for the spacebar press to trigger a jump
// document.addEventListener('keydown', function(event) {
//     if (event.code === 'Space') {
//         if (!isAlive) {
//             // Restart the game if dead
//             restartGame();
//         } else {
//             // Jump if alive
//             jump();
//         }
//     }
// });

// // --- Scoring and Game Loop ---
// function updateScore() {
//     if (isAlive) {
//         score++;
//         scoreDisplay.innerHTML = `Score: ${score}`;
//     }
// }

// // Increase the score every 100ms
// let scoreInterval = setInterval(updateScore, 100);

// // Collision Detection (The main game loop)
// let checkCollision = setInterval(function() {
//     if (!isAlive) return;

//     // Get current position of player and obstacle
//     const dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
//     const cactusRight = parseInt(window.getComputedStyle(cactus).getPropertyValue('right'));

//     // Collision condition:
//     // 1. Cactus is horizontally between the dino (right edge of cactus is > 50px AND < 70px)
//     // 2. Dino is at ground level (bottom is 0px)
//     if (cactusRight > 570 && cactusRight < 615 && dinoTop <= 0) {
//         // Collision detected!
//         isAlive = false;
//         clearInterval(checkCollision);
//         clearInterval(scoreInterval);

//         // Stop the cactus movement animation
//         cactus.style.animation = 'none';
        
//         // Show game over message
//         gameOverScreen.style.display = 'block';
//     }
// }, 10); // Check for collision 100 times per second

// // --- Restart Functionality ---
// function restartGame() {
//     isAlive = true;
//     score = 0;
//     scoreDisplay.innerHTML = `Score: 0`;
//     gameOverScreen.style.display = 'none';

//     // Restart the cactus animation
//     cactus.style.animation = 'cactus-move 1.5s linear infinite';

//     // Restart the intervals
//     scoreInterval = setInterval(updateScore, 100);
//     checkCollision = setInterval(function() {
//         // Re-run the main collision check logic here
//         const dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
//         const cactusRight = parseInt(window.getComputedStyle(cactus).getPropertyValue('right'));

//         if (cactusRight > 570 && cactusRight < 615 && dinoTop <= 0) {
//             isAlive = false;
//             clearInterval(checkCollision);
//             clearInterval(scoreInterval);
//             cactus.style.animation = 'none';
//             gameOverScreen.style.display = 'block';
//         }
//     }, 10);
// }

// // **Optional: Adjusting speed for challenge**
// // You could modify the `cactus-move` animation duration in CSS,
// // or use JavaScript to change `cactus.style.animationDuration` based on the score.
const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreDisplay = document.getElementById('score');

// Get new elements from HTML
const gameOverModal = document.getElementById('game-over-modal'); 
const finalScoreDisplay = document.getElementById('final-score'); 
const gameArea = document.getElementById('game');
const pauseBtn = document.getElementById('pause-btn');
const restartBottomBtn = document.getElementById('restart-btn-bottom');
const restartModalBtn = document.getElementById('restart-btn-modal');

let score = 0;
let isAlive = true;
let isPaused = false;
let scoreInterval;
let checkCollision;

// --- Pause/Resume Functions ---
function pauseGame() {
    if (!isAlive || isPaused) return;

    isPaused = true;
    clearInterval(scoreInterval);
    clearInterval(checkCollision);
    
    // Pause CSS animations 
    dino.classList.add('paused');
    cactus.classList.add('paused');
    pauseBtn.textContent = 'Resume';
}

function resumeGame() {
    if (!isAlive || !isPaused) return;

    isPaused = false;
    
    // Resume CSS animations
    dino.classList.remove('paused');
    cactus.classList.remove('paused');
    pauseBtn.textContent = 'Pause';
    
    // Restart intervals
    scoreInterval = setInterval(updateScore, 100);
    startGameLoopIntervals();
}

// --- Jump Functionality ---
function jump() {
    if (!dino.classList.contains('jump') && isAlive && !isPaused) {
        dino.classList.add('jump');
        setTimeout(function() {
            dino.classList.remove('jump');
        }, 500);
    }
}

// Listen for the spacebar press
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (!isAlive) {
            restartGame();
        } else if (isPaused) {
            resumeGame();
        } else {
            jump();
        }
    }
});


// --- Scoring and Game Loop (Collision) ---
function updateScore() {
    if (isAlive && !isPaused) {
        score++;
        scoreDisplay.innerHTML = `Score: ${score}`;
        
        // **NEW WIN CONDITION CHECK**
        if (score >= 500) {
            gameWon();
        }
    }
}

function startGameLoopIntervals() {
    // Collision Detection (The main game loop)
    checkCollision = setInterval(function() {
        if (!isAlive || isPaused) return;

        // Get current position of player and obstacle
        const dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
        const cactusRight = parseInt(window.getComputedStyle(cactus).getPropertyValue('right'));

        // Collision condition (Your original logic):
        if (cactusRight > 570 && cactusRight < 615 && dinoTop <= 0) {
            // Collision detected!
            gameOver();
        }
    }, 10); // Check for collision 100 times per second
}


// --- Game Won Function (NEW) ---
function gameWon() {
    isAlive = false;
    isPaused = true; // Pause the game
    clearInterval(checkCollision);
    clearInterval(scoreInterval);

    // Stop animation by setting to 'none'
    cactus.style.animation = 'none';
    
    // Update the modal content for the win message
    const modalTitle = gameOverModal.querySelector('h2');
    if (modalTitle) {
        modalTitle.textContent = 'You Won the Game!';
        // Optional: Change color to green for a win message
        modalTitle.style.color = '#2ecc71'; 
    }

    if (finalScoreDisplay) {
        finalScoreDisplay.textContent = `Final Score: ${score}`;
    }
    
    // Show modal and apply blur effect
    gameOverModal.style.display = 'flex';
    gameArea.classList.add('game-area-blur');
    pauseBtn.disabled = true;
}


// --- Game Over Function (Modified to ensure win message is reset) ---
function gameOver() {
    isAlive = false;
    clearInterval(checkCollision);
    clearInterval(scoreInterval);

    // Stop animation by setting to 'none'
    cactus.style.animation = 'none';

    // Reset modal title and color for 'Game Over' state
    const modalTitle = gameOverModal.querySelector('h2');
    if (modalTitle) {
        modalTitle.textContent = 'Game Over!';
        modalTitle.style.color = '#2e93f8ff'; // Red for loss
    }
    
    if (finalScoreDisplay) {
        finalScoreDisplay.textContent = `Final Score: ${score}`;
    }
    
    // Show modal and apply blur effect
    gameOverModal.style.display = 'flex';
    gameArea.classList.add('game-area-blur');
    pauseBtn.disabled = true;
}


// --- Restart Functionality ---
function restartGame() {
    isAlive = true;
    isPaused = false;
    score = 0;
    scoreDisplay.innerHTML = `Score: 0`;
    
    // Reset modal title and color back to Game Over default
    const modalTitle = gameOverModal.querySelector('h2');
    if (modalTitle) {
        modalTitle.textContent = 'Game Over!';
        modalTitle.style.color = '#ff4444'; 
    }

    // Hide modal and remove blur
    gameOverModal.style.display = 'none';
    gameArea.classList.remove('game-area-blur');
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Pause';

    // FIX for animation restart: Clear the animation, force reflow, then re-apply it.
    cactus.style.animation = 'none';
    cactus.offsetHeight; 
    cactus.style.animation = 'cactus-move 1.5s linear infinite';

    // Restart the intervals
    scoreInterval = setInterval(updateScore, 100);
    startGameLoopIntervals();
}

// --- Event Listeners for Buttons ---
pauseBtn.addEventListener('click', () => {
    if (isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
});

restartBottomBtn.addEventListener('click', restartGame);
restartModalBtn.addEventListener('click', restartGame);


// Start the game initially
scoreInterval = setInterval(updateScore, 100);
startGameLoopIntervals();
gameOverModal.style.display = 'none'; // Ensure modal is hidden on initial load