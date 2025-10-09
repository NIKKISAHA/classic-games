// Rock-Paper-Scissors.js (Dual Mode)

const choiceButtons = document.querySelectorAll('.choice-btn');
const resetButton = document.getElementById('reset-button');
const modeSelector = document.getElementById('game-mode'); // NEW: Mode selector
const opponentLabel = document.getElementById('opponent-label'); // NEW: Opponent score label
const opponentChoiceLabel = document.getElementById('opponent-choice-label'); // NEW: Opponent choice result label

const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const gameMessage = document.getElementById('game-message');
const playerChoiceDisplay = document.getElementById('player-choice');
const computerChoiceDisplay = document.getElementById('computer-choice');

let playerScore = 0;
let opponentScore = 0; // Renamed 'computerScore' to 'opponentScore' for flexibility
let player1Choice = null; // Used only in Two-Player mode
let isPlayer1Turn = true; // Used only in Two-Player mode

const choices = ['rock', 'paper', 'scissors'];
const choiceEmojis = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

// --- Core Game Functions ---

const getComputerChoice = () => {
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
};

const determineWinner = (player, opponent) => {
    if (player === opponent) {
        return 'draw';
    } else if (
        (player === 'rock' && opponent === 'scissors') ||
        (player === 'paper' && opponent === 'rock') ||
        (player === 'scissors' && opponent === 'paper')
    ) {
        return 'win'; // Player wins
    } else {
        return 'lose'; // Opponent wins
    }
};

const updateChoiceDisplays = (player, opponent) => {
    playerChoiceDisplay.textContent = player ? choiceEmojis[player] : '...';
    computerChoiceDisplay.textContent = opponent ? choiceEmojis[opponent] : '...';
};

const updateScoreAndReset = (result) => {
    gameMessage.classList.remove('win', 'lose', 'draw');
    
    // Update Score
    if (result === 'win') {
        playerScore++;
        gameMessage.textContent = `You win this round! 🎉`;
        gameMessage.classList.add('win');
    } else if (result === 'lose') {
        opponentScore++;
        gameMessage.textContent = `${opponentLabel.textContent} wins this round! 🏆`;
        gameMessage.classList.add('lose');
    } else {
        gameMessage.textContent = `It's a draw! 🤝`;
        gameMessage.classList.add('draw');
    }
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = opponentScore;

    // Temporarily disable buttons until next round starts
    choiceButtons.forEach(btn => btn.disabled = true);

    // Reset state for the next round after a short delay
    setTimeout(() => {
        const mode = modeSelector.value;
        player1Choice = null;
        isPlayer1Turn = true;
        
        if (mode === 'computer') {
            gameMessage.textContent = 'Choose your move!';
        } else {
            gameMessage.textContent = 'Player 1, make your move!';
        }
        
        updateChoiceDisplays(null, null); // Clear choices
        choiceButtons.forEach(btn => btn.disabled = false); // Re-enable buttons
    }, 2000); 
};

// --- Mode-Specific Logic ---

const handleComputerMode = (playerChoice) => {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);
    updateChoiceDisplays(playerChoice, computerChoice);
    updateScoreAndReset(result);
};

const handleTwoPlayerMode = (choice) => {
    if (isPlayer1Turn) {
        // Player 1's Turn
        player1Choice = choice;
        isPlayer1Turn = false;
        
        playerChoiceDisplay.textContent = choiceEmojis[choice];
        computerChoiceDisplay.textContent = '❓'; // Hide P2's choice
        
        gameMessage.classList.remove('win', 'lose', 'draw');
        gameMessage.textContent = 'Player 2, make your move!';
        
    } else {
        // Player 2's Turn
        const player2Choice = choice;
        
        // Determine result
        const result = determineWinner(player1Choice, player2Choice);
        
        updateChoiceDisplays(player1Choice, player2Choice); 
        
        updateScoreAndReset(result);
    }
};

// --- Main Event Handler ---

const playRound = (playerChoice) => {
    const mode = modeSelector.value;

    if (mode === 'computer') {
        handleComputerMode(playerChoice);
    } else {
        handleTwoPlayerMode(playerChoice);
    }
};

const resetGame = () => {
    playerScore = 0;
    opponentScore = 0;
    player1Choice = null;
    isPlayer1Turn = true;

    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = opponentScore;
    gameMessage.classList.remove('win', 'lose', 'draw');
    
    // Set initial message based on current mode
    const mode = modeSelector.value;
    if (mode === 'computer') {
        gameMessage.textContent = 'Choose your move!';
    } else {
        gameMessage.textContent = 'Player 1, make your move!';
    }
    
    updateChoiceDisplays(null, null);
    choiceButtons.forEach(btn => btn.disabled = false);
};

// --- UI / Event Listeners ---

// Update labels and reset game when the mode changes
modeSelector.addEventListener('change', () => {
    const mode = modeSelector.value;
    if (mode === 'computer') {
        opponentLabel.textContent = 'Computer';
        opponentChoiceLabel.textContent = 'Computer';
    } else {
        opponentLabel.textContent = 'Player 2';
        opponentChoiceLabel.textContent = 'Player 2';
    }
    resetGame();
});

// Event listeners for player choice buttons
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = button.getAttribute('data-choice');
        playRound(playerChoice);
    });
});

// Event listener for the reset button
resetButton.addEventListener('click', resetGame);

// Initial setup
document.addEventListener('DOMContentLoaded', resetGame);