const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const popupRestartBtn = document.getElementById('popup-restart-btn'); // New
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer'); // New
const statusMessage = document.getElementById('status-message'); // New
const popup = document.getElementById('popup'); // New
const popupTitle = document.getElementById('popup-title'); // New
const popupScore = document.getElementById('popup-score'); // New

// Card values (8 unique values, will be extended for later levels)
const FRUIT_EMOJIS = ['🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍑', '🍍', '🥝', '🥥', '🍒', '🥭']; 

// --- Game Configuration ---
const levelConfig = [
    { grid: '4x4', size: 8, time: 60, title: 'Level 1' }, // 8 pairs (16 cards)
    { grid: '5x4', size: 10, time: 60, title: 'Level 2' }, // 10 pairs (20 cards)
    { grid: '6x4', size: 12, time: 60, title: 'Level 3' }  // 12 pairs (24 cards)
];
let currentLevel = 0;
let gameCards = [];
let matchedPairs = 0;
let timeLeft = 0;
let timerInterval;

// --- State Tracking ---
let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;

/** Shuffles an array in place (Fisher-Yates) */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Timer Functions ---

function startTimer() {
    clearInterval(timerInterval);
    const config = levelConfig[currentLevel];
    timeLeft = config.time;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false); // Player loses
        }
    }, 1000);
}

// --- Board Creation and Game Flow ---

function createBoard() {
    const config = levelConfig[currentLevel];
    
    // Check if player has finished all levels
    if (!config) {
        endGame(true, 'victory');
        return;
    }
    
    // Setup board for the current level
    statusMessage.textContent = config.title;
    gameBoard.style.gridTemplateColumns = `repeat(${config.grid.split('x')[0]}, 1fr)`;

    // Slice the full emoji array to get the required number of pairs
    const currentEmojis = FRUIT_EMOJIS.slice(0, config.size); 
    gameCards = [...currentEmojis, ...currentEmojis];
    shuffle(gameCards);
    
    gameBoard.innerHTML = '';
    matchedPairs = 0;
    scoreDisplay.textContent = `Pairs Found: 0`;

    gameCards.forEach((value, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = value;
        cardElement.addEventListener('click', flipCard);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = '❓';

        const cardFace = document.createElement('div');
        cardFace.classList.add('card-face');
        cardFace.textContent = value;
        cardFace.style.fontSize = '2.5em'; 

        cardElement.appendChild(cardBack);
        cardElement.appendChild(cardFace);
        gameBoard.appendChild(cardElement);
    });

    // Start the timer only for the first card flip
    clearInterval(timerInterval);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains('match')) return; // Ignore matched cards

    this.classList.add('flip');
    
    // Start timer on the very first flip of the level
    if (firstCard === null && secondCard === null && matchedPairs === 0) {
        startTimer();
    }

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    // Visually mark as matched
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    
    // Remove event listeners
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs++;
    scoreDisplay.textContent = `Pairs Found: ${matchedPairs}`;

    const totalPairs = levelConfig[currentLevel].size;
    if (matchedPairs === totalPairs) {
        // Level cleared!
        clearInterval(timerInterval);
        
        if (currentLevel < levelConfig.length - 1) {
            // Move to next level after a brief pause
            statusMessage.textContent = `${levelConfig[currentLevel].title} CLEARED! ✅`;
            currentLevel++;
            setTimeout(createBoard, 2000); // Wait 2 seconds before loading next level
        } else {
            // Game Won!
            endGame(true, 'win');
        }
    }
    
    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// --- Game Over Popup Logic ---

function endGame(didWin, finalState = '') {
    clearInterval(timerInterval);
    popup.classList.remove('hidden');

    if (didWin && finalState === 'win') {
        popupTitle.textContent = "🏆 YOU WIN THE GAME!";
    } else if (didWin && finalState === 'victory') {
        popupTitle.textContent = "✨ ALL LEVELS CLEARED!";
    } else {
        popupTitle.textContent = "⏰ TIME OUT! YOU LOSE.";
    }
    
    popupScore.textContent = `Total Pairs Found: ${matchedPairs} across all levels.`;
    popupRestartBtn.textContent = 'Play Again';
}

function restartGame() {
    currentLevel = 0;
    matchedPairs = 0; // Reset total score for the new run
    popup.classList.add('hidden');
    createBoard();
}

// --- Event Listeners and Initialization ---

restartBtn.addEventListener('click', restartGame);
popupRestartBtn.addEventListener('click', restartGame);

// Initialize the game on load
createBoard();