const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');
const easyBtn = document.getElementById('easyBtn');
const mediumBtn = document.getElementById('mediumBtn');
const hardBtn = document.getElementById('hardBtn');
const wallModeBtn = document.getElementById('wallModeBtn');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const gameOverRestartBtn = document.getElementById('gameOverRestartBtn');
const finalScoreDisplay = document.getElementById('finalScore');


const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let score = 0;
let direction = { x: 0, y: 0 };
let gameInterval;
let isGameOver = false;
let wallMode = false;

// Define speeds for each difficulty level (in milliseconds)
const speeds = {
    easy: 150,
    medium: 100,
    hard: 60
};
let currentSpeed = speeds.medium;

// Function to generate food at a random location
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

// Function to draw the game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#55aaff';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = '#ff6347';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Function to update the game state
function update() {
    if (isGameOver) {
        return;
    }

    let newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    if (wallMode) {
        if (newHead.x < 0 || newHead.x >= canvas.width / gridSize || newHead.y < 0 || newHead.y >= canvas.height / gridSize) {
            endGame();
            return;
        }
    } else {
        if (newHead.x < 0) {
            newHead.x = canvas.width / gridSize - 1;
        } else if (newHead.x >= canvas.width / gridSize) {
            newHead.x = 0;
        }
        if (newHead.y < 0) {
            newHead.y = canvas.height / gridSize - 1;
        } else if (newHead.y >= canvas.height / gridSize) {
            newHead.y = 0;
        }
    }

    snake.unshift(newHead);

    for (let i = 1; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            endGame();
            return;
        }
    }

    if (newHead.x === food.x && newHead.y === food.y) {
        score += 100;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

// Function to handle user input
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y !== 1) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y !== -1) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x !== 1) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x !== -1) direction = { x: 1, y: 0 };
            break;
    }
});

function startGame() {
    snake = [{ x: 10, y: 10 }];
    score = 0;
    scoreDisplay.textContent = score;
    direction = { x: 1, y: 0 };
    isGameOver = false;
    clearInterval(gameInterval);
    generateFood();
    gameOverOverlay.style.display = 'none'; // Hide the game over message
    gameInterval = setInterval(update, currentSpeed);
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = `Your score is: ${score}`;
    gameOverOverlay.style.display = 'flex'; // Show the game over message
}

// Event listeners for difficulty buttons
easyBtn.addEventListener('click', () => {
    currentSpeed = speeds.easy;
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    easyBtn.classList.add('active');
    startGame();
});

mediumBtn.addEventListener('click', () => {
    currentSpeed = speeds.medium;
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    mediumBtn.classList.add('active');
    startGame();
});

hardBtn.addEventListener('click', () => {
    currentSpeed = speeds.hard;
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    hardBtn.classList.add('active');
    startGame();
});

// Event listener for wall mode toggle
wallModeBtn.addEventListener('click', () => {
    wallMode = !wallMode;
    wallModeBtn.classList.toggle('active');
    wallModeBtn.textContent = wallMode ? 'Walls: ON' : 'Walls: OFF';
    startGame();
});

// Event listeners for restart buttons
restartBtn.addEventListener('click', startGame);
gameOverRestartBtn.addEventListener('click', startGame);

startGame();