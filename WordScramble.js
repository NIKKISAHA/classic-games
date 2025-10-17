// Dictionary of words for the game (Can be easily extended)
const WORD_LIST = [
    "people", "time", "year", "way", "day", "man", "thing", "woman", "life", "child",
    "world", "school", "state", "family", "group", "country", "problem", "hand", "part", "place",
    "case", "week", "company", "system", "area", "market", "government", "number", "point", "home",
    "service", "fact", "money", "power", "city", "business", "community", "name", "side", "friend",
    "water", "room", "court", "process", "idea", "head", "history", "party", "result", "job",
    "act", "office", "door", "health", "art", "war", "law", "light", "set", "change",
    "story", "nation", "level", "report", "food", "moment", "car", "kind", "sense", "mind",
    "parent", "face", "center", "value", "action", "age", "effort", "rate", "type", "line",
    "control", "music", "body", "book", "experience", "matter", "program", "word", "issue", "security",
    "future", "research", "street", "site", "project", "event", "paper", "image", "nature", "source",
    "figure", "sector", "unit", "success", "field", "view", "benefit", "growth", "cost", "range",
    "station", "design", "model", "term", "structure", "theory", "press", "stock", "plan", "product",
    "purpose", "response", "stage", "task", "tool", "culture", "income", "method", "operation", "speaker",
    "student", "teacher", "subject", "concept", "knowledge", "skill", "basis", "concern", "device", "fire",
    "front", "impact", "loss", "minute", "policy", "record", "sign", "space", "star", "street",
    "surface", "test", "trade", "traffic", "value", "vote", "window", "voice", "wood", "camera",
    "dream", "glass", "heart", "morning", "news", "note", "picture", "piece", "radio", "stone",
    "store", "train", "wall", "weather", "box", "card", "chair", "cup", "game", "key",
    "leg", "map", "mouth", "ring", "ship", "shoe", "song", "tree", "wheel", "baby",
    "bird", "cat", "dog", "fish", "horse", "animal", "flower", "fruit", "garden", "ocean",
    "sun", "wind", "snow", "rain", "earth", "metal", "stone", "cloth", "color", "sound",
    "taste", "smell", "touch", "feeling", "anger", "fear", "joy", "love", "hope", "faith",

    // --- Verbs (approx. 150) ---
    "be", "have", "do", "say", "go", "get", "make", "know", "think", "take",
    "see", "come", "want", "look", "give", "use", "find", "tell", "ask", "work",
    "seem", "feel", "try", "leave", "call", "need", "become", "mean", "put", "keep",
    "let", "begin", "help", "talk", "turn", "start", "show", "hear", "play", "run",
    "move", "like", "live", "believe", "hold", "bring", "happen", "write", "provide", "sit",
    "stand", "lose", "pay", "meet", "include", "continue", "set", "learn", "change", "lead",
    "understand", "watch", "follow", "stop", "create", "speak", "read", "allow", "add", "spend",
    "grow", "open", "walk", "win", "offer", "remember", "consider", "buy", "serve", "die",
    "send", "expect", "build", "stay", "fall", "cut", "reach", "kill", "raise", "pass",
    "sell", "return", "report", "wish", "suggest", "require", "wait", "develop", "receive", "agree",
    "carry", "attack", "claim", "deal", "exist", "fight", "fill", "force", "gain", "guess",
    "hit", "jump", "join", "manage", "note", "present", "pull", "push", "save", "seek",
    "shoot", "solve", "spend", "touch", "travel", "wave", "wear", "wake", "vote", "throw",
    "sing", "drive", "ride", "sleep", "eat", "drink", "cook", "clean", "wash", "study",
    "teach", "explain", "describe", "compare", "imagine", "finish", "prevent", "protect", "succeed", "fail",

    // --- Adjectives (approx. 150) ---
    "good", "new", "first", "last", "long", "great", "little", "own", "other", "old",
    "right", "big", "high", "different", "small", "large", "next", "early", "young", "important",
    "few", "public", "bad", "same", "able", "major", "social", "sure", "clear", "local",
    "easy", "full", "certain", "personal", "open", "ready", "real", "current", "simple", "hard",
    "private", "total", "main", "single", "short", "general", "common", "poor", "natural", "nice",
    "serious", "strong", "fine", "black", "white", "whole", "dark", "light", "true", "safe",
    "free", "final", "ready", "worth", "best", "heavy", "happy", "happy", "excited", "difficult",
    "sweet", "sour", "cold", "warm", "hot", "cool", "dry", "wet", "deep", "wide",
    "fast", "slow", "quiet", "loud", "busy", "empty", "quick", "slow", "soft", "sharp",
    "round", "square", "flat", "tall", "tiny", "huge", "modern", "ancient", "simple", "complex",
    "primary", "secondary", "special", "financial", "political", "economic", "medical", "legal", "scientific", "global",
    "perfect", "excellent", "terrible", "famous", "unknown", "popular", "necessary", "impossible", "amazing", "beautiful",
    "brave", "calm", "clever", "crazy", "eager", "friendly", "gentle", "honest", "innocent", "jealous",
    "lucky", "mad", "nervous", "proud", "rude", "selfish", "shy", "silly", "smart", "tired",
    "unhappy", "useful", "violent", "wise", "worried", "wrong", "yellow", "blue", "green", "red"
];


const WIN_SCORE = 5;
const START_TIME = 20; 

let currentWord = ""; 
let score = 0;
let timeLeft = START_TIME;
let gameInterval = null;
let gameActive = false;

// --- Theme Toggle Functions ---

/**
 * Toggles between light and dark mode and saves preference to local storage.
 */
function toggleTheme() {
    const body = document.body;
    const toggleButton = document.getElementById('themeToggle');
    
    // Toggle the 'dark-mode' class on the body
    body.classList.toggle('dark-mode');
    
    const isDarkMode = body.classList.contains('dark-mode');
    
    // Update button text and save preference
    if (isDarkMode) {
        toggleButton.textContent = '🌙 Dark Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        toggleButton.textContent = '☀️ Light Mode';
        localStorage.setItem('theme', 'light');
    }
}

/**
 * Applies the saved theme preference on page load.
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    
    // Default to dark mode if no preference is saved (common for dark themes) or if specifically saved as 'dark'
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    } else {
        // If savedTheme is 'light' or undefined, stay in light mode
        body.classList.remove('dark-mode');
    }
    // Update button text based on the loaded state
    // We call toggleTheme() but immediately revert the class change to only update the text correctly
    const isCurrentlyDark = body.classList.contains('dark-mode');
    const toggleButton = document.getElementById('themeToggle');
    if (isCurrentlyDark) {
        toggleButton.textContent = '🌙 Dark Mode';
    } else {
        toggleButton.textContent = '☀️ Light Mode';
    }
}


// --- Utility Functions ---

/**
 * Shuffles the letters of a word.
 */
function scrambleWord(word) {
    const chars = word.split('');
    let n = chars.length;
    let scrambled = "";
    
    do {
        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]]; 
        }
        scrambled = chars.join('');
    } while (scrambled === word);

    return scrambled;
}

// --- Game Logic Functions ---

/**
 * Updates the timer every second.
 */
function updateTimer() {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;

    // Use CSS variable for color control
    if (timeLeft <= 10) {
        document.getElementById('timer').style.color = 'var(--incorrect-color)';
    } else {
        document.getElementById('timer').style.color = 'var(--incorrect-color)'; 
    }

    if (timeLeft <= 0) {
        clearInterval(gameInterval);
        gameOver(false); 
    }
}

/**
 * Starts a new word round.
 */
function newWordRound() {
    if (!gameActive) return; 

    // 1. Pick a random word
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    currentWord = WORD_LIST[randomIndex];

    // 2. Scramble and display
    const scrambled = scrambleWord(currentWord);
    document.getElementById('scrambledWord').textContent = scrambled.toUpperCase();

    // 3. Reset input/message
    document.getElementById('guessInput').value = '';
    document.getElementById('message').textContent = '';
    
    // 4. Reset Timer for the new word
    if (gameInterval) clearInterval(gameInterval);
    timeLeft = START_TIME;
    document.getElementById('timer').textContent = timeLeft;
    
    // Ensure timer color is reset to default
    document.getElementById('timer').style.color = 'var(--incorrect-color)'; 
    
    gameInterval = setInterval(updateTimer, 1000);
}

/**
 * Main function to start or continue the game.
 */
function startGame() {
    gameActive = true;
    score = 0; 
    document.getElementById('score').textContent = score;

    // Enable controls
    document.getElementById('guessInput').disabled = false;
    document.getElementById('guessButton').disabled = false;
    document.getElementById('mainControlButton').style.display = 'none';

    newWordRound();
    document.getElementById('guessInput').focus();
}

/**
 * Checks the player's guess.
 */
function checkGuess() {
    if (!gameActive) return;

    const guessInput = document.getElementById('guessInput');
    const messageP = document.getElementById('message');
    const userGuess = guessInput.value.toLowerCase().trim();
    
    if (userGuess.length === 0) {
        messageP.textContent = 'Please enter a guess!';
        messageP.className = 'incorrect';
        return;
    }

    if (userGuess === currentWord) {
        // --- CORRECT GUESS ---
        clearInterval(gameInterval);
        score++;
        document.getElementById('score').textContent = score;

        messageP.textContent = `Correct! The word was "${currentWord.toUpperCase()}"!`;
        messageP.className = 'correct';
        
        // Check for win condition
        if (score >= WIN_SCORE) {
            gameOver(true); // Player wins!
        } else {
            // Start the next round immediately
            setTimeout(newWordRound, 1500); 
        }
    } else {
        // --- INCORRECT GUESS ---
        messageP.textContent = 'Incorrect. Try again!';
        messageP.className = 'incorrect';
        guessInput.value = ''; 
        guessInput.focus();
    }
}

/**
 * Handles the game end state (Win or Lose).
 */
function gameOver(won) {
    gameActive = false;
    clearInterval(gameInterval);
    
    // Disable inputs
    document.getElementById('guessInput').disabled = true;
    document.getElementById('guessButton').disabled = true;

    const modal = document.getElementById('gameOverModal');
    const modalMessage = document.getElementById('modalMessage');
    const finalScore = document.getElementById('finalScore');
    
    if (won) {
        modalMessage.textContent = "CONGRATULATIONS! YOU WIN!";
        modalMessage.style.color = 'var(--correct-color)';
        finalScore.textContent = `You guessed ${WIN_SCORE} words in time!`;
    } else {
        modalMessage.textContent = "GAME OVER!";
        modalMessage.style.color = 'var(--incorrect-color)';
        finalScore.textContent = `You scored ${score} out of ${WIN_SCORE} required. Better luck next time!`;
    }

    modal.style.display = 'block';
}

/**
 * Resets the game state and starts over.
 */
function restartGame() {
    document.getElementById('gameOverModal').style.display = 'none';
    score = 0;
    timeLeft = START_TIME;
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timeLeft;
    document.getElementById('timer').style.color = 'var(--incorrect-color)'; 

    document.getElementById('scrambledWord').textContent = 'Click Start to Play!';
    document.getElementById('mainControlButton').textContent = 'Start Game';
    document.getElementById('mainControlButton').style.display = 'block';

    document.getElementById('guessInput').disabled = true;
    document.getElementById('guessButton').disabled = true;
    document.getElementById('message').textContent = '';
    
    if (gameInterval) clearInterval(gameInterval); 
}

// Optional: Allow the player to submit the guess with the Enter key
document.getElementById('guessInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && gameActive) {
        checkGuess();
    }
});

// Initialize the game state AND load the theme when the page loads
window.onload = function() {
    loadTheme();
    restartGame();
};