// --- Element Data (unchanged) ---
const ELEMENTS = [
  { name: "Hydrogen", symbol: "H" },
  { name: "Helium", symbol: "He" },
  { name: "Lithium", symbol: "Li" },
  { name: "Beryllium", symbol: "Be" },
  { name: "Boron", symbol: "B" },
  { name: "Carbon", symbol: "C" },
  { name: "Nitrogen", symbol: "N" },
  { name: "Oxygen", symbol: "O" },
  { name: "Fluorine", symbol: "F" },
  { name: "Neon", symbol: "Ne" },
  { name: "Sodium", symbol: "Na" },
  { name: "Magnesium", symbol: "Mg" },
  { name: "Aluminum", symbol: "Al" },
  { name: "Silicon", symbol: "Si" },
  { name: "Phosphorus", symbol: "P" },
  { name: "Sulfur", symbol: "S" },
  { name: "Chlorine", symbol: "Cl" },
  { name: "Argon", symbol: "Ar" },
  { name: "Potassium", symbol: "K" },
  { name: "Calcium", symbol: "Ca" },
  { name: "Scandium", symbol: "Sc" },
  { name: "Titanium", symbol: "Ti" },
  { name: "Vanadium", symbol: "V" },
  { name: "Chromium", symbol: "Cr" },
  { name: "Manganese", symbol: "Mn" },
  { name: "Iron", symbol: "Fe" },
  { name: "Cobalt", symbol: "Co" },
  { name: "Nickel", symbol: "Ni" },
  { name: "Copper", symbol: "Cu" },
  { name: "Zinc", symbol: "Zn" },
  { name: "Gallium", symbol: "Ga" },
  { name: "Germanium", symbol: "Ge" },
  { name: "Arsenic", symbol: "As" },
  { name: "Selenium", symbol: "Se" },
  { name: "Bromine", symbol: "Br" },
  { name: "Krypton", symbol: "Kr" },
  { name: "Rubidium", symbol: "Rb" },
  { name: "Strontium", symbol: "Sr" },
  { name: "Yttrium", symbol: "Y" },
  { name: "Zirconium", symbol: "Zr" },
  { name: "Niobium", symbol: "Nb" },
  { name: "Molybdenum", symbol: "Mo" },
  { name: "Technetium", symbol: "Tc" },
  { name: "Ruthenium", symbol: "Ru" },
  { name: "Rhodium", symbol: "Rh" },
  { name: "Palladium", symbol: "Pd" },
  { name: "Silver", symbol: "Ag" },
  { name: "Cadmium", symbol: "Cd" },
  { name: "Indium", symbol: "In" },
  { name: "Tin", symbol: "Sn" },
  { name: "Antimony", symbol: "Sb" },
  { name: "Tellurium", symbol: "Te" },
  { name: "Iodine", symbol: "I" },
  { name: "Xenon", symbol: "Xe" },
  { name: "Cesium", symbol: "Cs" },
  { name: "Barium", symbol: "Ba" },
  { name: "Lanthanum", symbol: "La" },
  { name: "Cerium", symbol: "Ce" },
  { name: "Praseodymium", symbol: "Pr" },
  { name: "Neodymium", symbol: "Nd" },
  { name: "Promethium", symbol: "Pm" },
  { name: "Samarium", symbol: "Sm" },
  { name: "Europium", symbol: "Eu" },
  { name: "Gadolinium", symbol: "Gd" },
  { name: "Terbium", symbol: "Tb" },
  { name: "Dysprosium", symbol: "Dy" },
  { name: "Holmium", symbol: "Ho" },
  { name: "Erbium", symbol: "Er" },
  { name: "Thulium", symbol: "Tm" },
  { name: "Ytterbium", symbol: "Yb" },
  { name: "Lutetium", symbol: "Lu" },
  { name: "Hafnium", symbol: "Hf" },
  { name: "Tantalum", symbol: "Ta" },
  { name: "Tungsten", symbol: "W" },
  { name: "Rhenium", symbol: "Re" },
  { name: "Osmium", symbol: "Os" },
  { name: "Iridium", symbol: "Ir" },
  { name: "Platinum", symbol: "Pt" },
  { name: "Gold", symbol: "Au" },
  { name: "Mercury", symbol: "Hg" },
  { name: "Thallium", symbol: "Tl" },
  { name: "Lead", symbol: "Pb" },
  { name: "Bismuth", symbol: "Bi" },
  { name: "Polonium", symbol: "Po" },
  { name: "Astatine", symbol: "At" },
  { name: "Radon", symbol: "Rn" },
  { name: "Francium", symbol: "Fr" },
  { name: "Radium", symbol: "Ra" },
  { name: "Actinium", symbol: "Ac" },
  { name: "Thorium", symbol: "Th" },
  { name: "Protactinium", symbol: "Pa" },
  { name: "Uranium", symbol: "U" },
  { name: "Neptunium", symbol: "Np" },
  { name: "Plutonium", symbol: "Pu" },
  { name: "Americium", symbol: "Am" },
  { name: "Curium", symbol: "Cm" },
  { name: "Berkelium", symbol: "Bk" },
  { name: "Californium", symbol: "Cf" },
  { name: "Einsteinium", symbol: "Es" },
  { name: "Fermium", symbol: "Fm" },
  { name: "Mendelevium", symbol: "Md" },
  { name: "Nobelium", symbol: "No" },
  { name: "Lawrencium", symbol: "Lr" },
  { name: "Rutherfordium", symbol: "Rf" },
  { name: "Dubnium", symbol: "Db" },
  { name: "Seaborgium", symbol: "Sg" },
  { name: "Bohrium", symbol: "Bh" },
  { name: "Hassium", symbol: "Hs" },
  { name: "Meitnerium", symbol: "Mt" },
  { name: "Darmstadtium", symbol: "Ds" },
  { name: "Roentgenium", symbol: "Rg" },
  { name: "Copernicium", symbol: "Cn" },
  { name: "Nihonium", symbol: "Nh" },
  { name: "Flerovium", symbol: "Fl" },
  { name: "Moscovium", symbol: "Mc" },
  { name: "Livermorium", symbol: "Lv" },
  { name: "Tennessine", symbol: "Ts" },
  { name: "Oganesson", symbol: "Og" }
];

const WINNING_STREAK = 1;

// --- DOM Elements ---
const elementNameEl = document.getElementById('element-name');
const optionsContainerEl = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const resetGameBtn = document.getElementById('reset-game-btn');
const feedbackMessageEl = document.getElementById('feedback-message');
const currentScoreEl = document.getElementById('current-score');
const totalQuestionsEl = document.getElementById('total-questions');
const currentStreakEl = document.getElementById('current-streak');
const themeToggleBtn = document.getElementById('theme-toggle-btn'); // New element

// --- Game State (unchanged) ---
let currentElement = null;
let score = 0;
let totalQuestionsAsked = 0;
let consecutiveCorrect = 0;
let quizOver = false;

// --- Utility Functions (unchanged) ---

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Theme Toggle Logic ---
themeToggleBtn.addEventListener('click', toggleTheme);

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    
    // Update button text and icon
    if (document.body.classList.contains('light-theme')) {
        themeToggleBtn.textContent = '🌙 ';
    } else {
        themeToggleBtn.textContent = '☀️ ';
    }
}

// --- Event Listeners (updated to include theme toggle) ---
nextBtn.addEventListener('click', nextQuestion);
resetGameBtn.addEventListener('click', initGame);

// --- Initialization ---
function initGame() {
    score = 0;
    totalQuestionsAsked = 0;
    consecutiveCorrect = 0;
    quizOver = false;
    
    // Reset displays
    feedbackMessageEl.textContent = '';
    resetGameBtn.style.display = 'none';
    currentStreakEl.textContent = consecutiveCorrect;
    
    // Initialize theme state (if needed, this ensures the button text is correct)
    toggleTheme(); // Calling it once here sets it to the opposite of the default HTML state
    
    startQuiz();
}

function startQuiz() {
    updateScoreDisplay();
    nextQuestion();
}

// --- All other quiz functions (getRandomElement, generateOptions, nextQuestion, 
// handleAnswerClick, endGame, updateScoreDisplay) remain the SAME as the previous version. ---

function getRandomElement(excludeElement = null) {
    let element;
    do {
        const randomIndex = Math.floor(Math.random() * ELEMENTS.length);
        element = ELEMENTS[randomIndex];
    } while (element === excludeElement);
    return element;
}

function generateOptions() {
    const correctAnswer = currentElement.symbol;
    const allSymbols = ELEMENTS.map(e => e.symbol).filter(s => s !== correctAnswer);
    
    const shuffledIncorrect = shuffleArray(allSymbols);
    const incorrectOptions = shuffledIncorrect.slice(0, 3);
    
    let options = [...incorrectOptions, correctAnswer];
    options = shuffleArray(options);
    
    optionsContainerEl.innerHTML = '';
    
    options.forEach(symbol => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = symbol;
        button.dataset.symbol = symbol;
        button.addEventListener('click', handleAnswerClick);
        optionsContainerEl.appendChild(button);
    });
    
    nextBtn.style.display = 'none';
}

function nextQuestion() {
    if (quizOver) return;

    feedbackMessageEl.textContent = '';
    
    currentElement = getRandomElement(currentElement);
    elementNameEl.textContent = currentElement.name;
    
    generateOptions();
}

function handleAnswerClick(event) {
    if (quizOver) return;

    const selectedButton = event.target;
    const userAnswer = selectedButton.dataset.symbol;
    const correctAnswer = currentElement.symbol;
    
    totalQuestionsAsked++;
    
    Array.from(optionsContainerEl.children).forEach(btn => btn.disabled = true);

    if (userAnswer === correctAnswer) {
        selectedButton.classList.add('correct-answer');
        score++;
        consecutiveCorrect++;
        feedbackMessageEl.textContent = `✅ Correct! ${currentElement.name} is ${correctAnswer}.`;
        
        if (consecutiveCorrect >= WINNING_STREAK) {
            endGame(true);
            return;
        }

    } else {
        selectedButton.classList.add('incorrect-answer');
        consecutiveCorrect = 0;
        feedbackMessageEl.textContent = `❌ Incorrect. ${currentElement.name} is ${correctAnswer}.`;
        
        const correctButton = Array.from(optionsContainerEl.children).find(btn => btn.dataset.symbol === correctAnswer);
        if (correctButton) {
            correctButton.classList.add('correct-answer');
        }
    }

    updateScoreDisplay();
    nextBtn.style.display = 'block';
}

function endGame(didWin) {
    quizOver = true;
    nextBtn.style.display = 'none';
    resetGameBtn.style.display = 'block';

    if (didWin) {
        elementNameEl.textContent = "🏆 WINNER! 🏆";
        feedbackMessageEl.innerHTML = `<span class="correct-answer">You correctly guessed ${WINNING_STREAK} in a row!</span>`;
    } else {
        feedbackMessageEl.textContent += " Game Over. Start a new game.";
    }

    Array.from(optionsContainerEl.children).forEach(btn => btn.disabled = true);
}

function updateScoreDisplay() {
    currentScoreEl.textContent = score;
    totalQuestionsEl.textContent = totalQuestionsAsked;
    currentStreakEl.textContent = consecutiveCorrect;
}

// Start the game when the script loads
// NOTE: I've added a call to toggleTheme() inside initGame() to ensure 
// the button label starts correct.
initGame();