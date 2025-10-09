// snake_ladder.js (Complete and Corrected Logic)

// --- Game Configuration ---
const BOARD_SIZE = 10; 
const NUM_SQUARES = BOARD_SIZE * BOARD_SIZE;
const NUM_PLAYERS = 2; // Default to 2 players

// Define Snakes and Ladders (start_square: end_square)
const SNAKES_LADDERS = {
    // Ladders
    4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91,
    // Snakes
    17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78
};

// --- DOM Elements ---
const gameBoard = document.getElementById('game-board');
const currentPlayerSpan = document.getElementById('current-player');
const diceRollSpan = document.getElementById('dice-roll');
const rollDiceBtn = document.getElementById('roll-dice');
const resetGameBtn = document.getElementById('reset-game');
const winnerMessage = document.getElementById('winner-message');
const winnerNameSpan = document.getElementById('winner-name');
const playAgainBtn = document.getElementById('play-again');
const gameMessage = document.getElementById('game-message'); 

// --- Game State Variables ---
let playerPositions = []; 
let currentPlayer = 0; 
let isGameOver = false;

// --- Board Generation ---
function createBoard() {
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;
    gameBoard.innerHTML = ''; 

    const squares = [];
    for (let i = 0; i < NUM_SQUARES; i++) {
        squares.push(document.createElement('div'));
    }

    // Map to quickly find the end points of snakes/ladders
    const endSquares = {};
    for (const [start, end] of Object.entries(SNAKES_LADDERS)) {
        endSquares[end] = parseInt(start); 
    }

    for (let row = 0; row < BOARD_SIZE; row++) {
        const absoluteRow = BOARD_SIZE - 1 - row; 

        for (let col = 0; col < BOARD_SIZE; col++) {
            let squareNumber;

            // Snake and Ladder numbering pattern (alternating rows)
            if (absoluteRow % 2 === 0) { 
                squareNumber = absoluteRow * BOARD_SIZE + col + 1;
            } else { 
                squareNumber = (absoluteRow * BOARD_SIZE) + (BOARD_SIZE - col);
            }

            const squareDiv = squares[squareNumber - 1]; 
            squareDiv.classList.add('square');
            squareDiv.dataset.squareNum = squareNumber;
            
            // Alternating square styling
            if ((absoluteRow % 2 === 0 && col % 2 === 0) || (absoluteRow % 2 !== 0 && col % 2 !== 0)) {
                squareDiv.classList.add('odd-square');
            } else {
                squareDiv.classList.add('even-square');
            }

            squareDiv.textContent = squareNumber;

            // Apply visual cues for snakes and ladders
            const destination = SNAKES_LADDERS[squareNumber];
            const source = endSquares[squareNumber];

            if (destination) {
                if (destination > squareNumber) {
                    squareDiv.classList.add('ladder-start');
                    squareDiv.title = `Ladder: Up to ${destination}`; 
                } else {
                    squareDiv.classList.add('snake-head');
                    squareDiv.title = `Snake: Down to ${destination}`;
                }
            }
            
            if (source) {
                if (source > squareNumber) {
                    squareDiv.classList.add('snake-tail');
                    squareDiv.title = `Snake Tail from ${source}`;
                } else {
                    squareDiv.classList.add('ladder-end');
                    squareDiv.title = `Ladder End from ${source}`;
                }
            }
        }
    }
    squares.forEach(sq => gameBoard.appendChild(sq));
}


// --- Player Token Management ---
function createPlayerTokens() {
    // Fill all positions with 0 (off-board, before square 1)
    playerPositions = Array(NUM_PLAYERS).fill(0); 
    for (let i = 0; i < NUM_PLAYERS; i++) {
        const token = document.createElement('div');
        token.classList.add('player-token', `p${i}`);
        token.id = `player-token-${i}`;
        token.textContent = `${i + 1}`; 
        gameBoard.appendChild(token);
        updatePlayerTokenPosition(i); 
    }
}

function getSquareCoordinates(squareNum) {
    const squareElement = document.querySelector(`[data-square-num="${squareNum}"]`);
    if (!squareElement) {
        // Position token off-board for square 0
        if (squareNum === 0) {
            const firstSquare = document.querySelector('[data-square-num="1"]');
            if (firstSquare) {
                const { left, top, width, height } = firstSquare.getBoundingClientRect();
                const boardRect = gameBoard.getBoundingClientRect();
                return {
                    x: (left - boardRect.left) + (width / 2) - width, 
                    y: (top - boardRect.top) + (height / 2) + height / 2
                };
            }
        }
        return { x: 0, y: 0 }; 
    }
    const { left, top, width, height } = squareElement.getBoundingClientRect();
    const boardRect = gameBoard.getBoundingClientRect();

    return {
        x: (left - boardRect.left) + (width / 2),
        y: (top - boardRect.top) + (height / 2)
    };
}


function updatePlayerTokenPosition(playerIndex) {
    const token = document.getElementById(`player-token-${playerIndex}`);
    const currentPosition = playerPositions[playerIndex];
    
    const { x, y } = getSquareCoordinates(currentPosition);

    // Set absolute position (CSS handles token stacking offset)
    token.style.left = `${x}px`;
    token.style.top = `${y}px`;

    if (playerIndex === currentPlayer) {
        const tokenElement = document.getElementById(`player-token-${currentPlayer}`);
        if (tokenElement) {
            currentPlayerSpan.style.color = getComputedStyle(tokenElement).backgroundColor;
        }
    }
}


// --- Game Logic ---
function rollDice() {
    if (isGameOver || rollDiceBtn.disabled) return;

    rollDiceBtn.disabled = true; // 1. Disable button immediately

    const roll = Math.floor(Math.random() * 6) + 1;
    diceRollSpan.textContent = roll;

    let newPosition = playerPositions[currentPlayer] + roll;
    
    gameMessage.textContent = `Player ${currentPlayer + 1} rolled a ${roll}.`;

    // Dice roll animation (optional)
    let animationCount = 0;
    const animateDice = setInterval(() => {
        diceRollSpan.textContent = Math.floor(Math.random() * 6) + 1;
        animationCount++;
        if (animationCount > 10) { 
            clearInterval(animateDice);
            diceRollSpan.textContent = roll; 
            movePlayer(newPosition);
        }
    }, 100);
}

function movePlayer(newPosition) {
    // Handle overshooting 100
    if (newPosition > NUM_SQUARES) {
        newPosition = playerPositions[currentPlayer];
    }
    
    playerPositions[currentPlayer] = newPosition;
    updatePlayerTokenPosition(currentPlayer); // Move token to the rolled square

    if (newPosition === NUM_SQUARES) {
        endGame();
        return;
    }

    // Check for Snakes and Ladders after a brief pause
    setTimeout(() => { 
        const snakeOrLadderEnd = SNAKES_LADDERS[newPosition];

        if (snakeOrLadderEnd) {
            
            const isLadder = snakeOrLadderEnd > newPosition;
            if (isLadder) {
                gameMessage.textContent = `Player ${currentPlayer + 1} found a ladder! Climbing to ${snakeOrLadderEnd}!`;
            } else {
                gameMessage.textContent = `Player ${currentPlayer + 1} hit a snake! Slid down to ${snakeOrLadderEnd}...`;
            }

            // Execute the snake/ladder move
            setTimeout(() => {
                playerPositions[currentPlayer] = snakeOrLadderEnd;
                updatePlayerTokenPosition(currentPlayer);
                
                if (playerPositions[currentPlayer] === NUM_SQUARES) {
                    endGame();
                    return;
                }
                
                nextPlayer();
            }, 700); 
            
        } else {
            // No snake or ladder
            nextPlayer();
        }
        
    }, 600); 
}

function nextPlayer() {
    currentPlayer = (currentPlayer + 1) % NUM_PLAYERS;
    currentPlayerSpan.textContent = `Player ${currentPlayer + 1}`;
    
    const tokenElement = document.getElementById(`player-token-${currentPlayer}`);
    if (tokenElement) {
        currentPlayerSpan.style.color = getComputedStyle(tokenElement).backgroundColor;
    }
    
    diceRollSpan.textContent = ''; 
    gameMessage.textContent = `Player ${currentPlayer + 1}, roll the dice!`;
    
    // 🔥 CRITICAL FIX: Re-enable the button!
    rollDiceBtn.disabled = false; 
}


function endGame() {
    isGameOver = true;
    winnerNameSpan.textContent = `Player ${currentPlayer + 1}`;
    winnerMessage.classList.remove('hidden');
    rollDiceBtn.disabled = true;
    resetGameBtn.disabled = true;
    gameMessage.textContent = `Game Over!`;
}

function resetGame() {
    isGameOver = false;
    playerPositions = Array(NUM_PLAYERS).fill(0);
    currentPlayer = 0;
    diceRollSpan.textContent = '';
    winnerMessage.classList.add('hidden');
    rollDiceBtn.disabled = false;
    resetGameBtn.disabled = false;
    gameMessage.textContent = `Player 1, roll the dice!`;
    currentPlayerSpan.textContent = 'Player 1';

    for (let i = 0; i < NUM_PLAYERS; i++) {
        updatePlayerTokenPosition(i);
    }
    const tokenElement = document.getElementById(`player-token-0`);
    if (tokenElement) {
        currentPlayerSpan.style.color = getComputedStyle(tokenElement).backgroundColor;
    }
}

// --- Event Listeners ---
rollDiceBtn.addEventListener('click', rollDice);
resetGameBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);

// --- Initialization ---
function initializeGame() {
    createBoard();
    createPlayerTokens();
    resetGame(); 
}

initializeGame();
// snake_ladder.js - THEME TOGGLE LOGIC

const themeToggleBtn = document.getElementById('theme-toggle');

function toggleTheme() {
    // Toggle the 'dark-mode' class on the body
    document.body.classList.toggle('dark-mode');
    
    // Update button text
    if (document.body.classList.contains('dark-mode')) {
        themeToggleBtn.textContent = 'Switch to Light Mode ☀️';
    } else {
        themeToggleBtn.textContent = 'Switch to Dark Mode 🌙';
    }
    
    // Optional: Save preference to localStorage (not strictly required here)
}

// Event listener for the new toggle button
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
    // Set initial button text based on default (light) state
    themeToggleBtn.textContent = 'Switch to Dark Mode 🌙';
}