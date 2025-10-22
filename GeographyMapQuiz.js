const flagDisplay = document.getElementById("flag-display");
const optionsContainer = document.getElementById("options");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");
const messageEl = document.getElementById("message"); // new element for feedback
const gameContainer = document.querySelector(".container"); // Get the main game box

let score = 0;
let currentIndex = 0;
const targetScore = 10; // number of correct answers to win
let shuffledFlagQuiz = []; // <-- NEW: This array will hold the randomized questions

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Flag data: ISO country code + correct country + options
const flagQuiz = [
  // European Flags (Known to work or highly likely)
  { code: "fr", answer: "France", options: ["France", "Germany", "Italy"] },
  { code: "de", answer: "Germany", options: ["Spain", "Germany", "Italy"] },
  { code: "it", answer: "Italy", options: ["Italy", "France", "Germany"] },
  { code: "es", answer: "Spain", options: ["Spain", "Portugal", "Mexico"] },
  { code: "gb", answer: "United Kingdom", options: ["Ireland", "United Kingdom", "Australia"] },
  { code: "ru", answer: "Russia", options: ["Russia", "Poland", "Slovenia"] },
  { code: "gr", answer: "Greece", options: ["Finland", "Greece", "Israel"] },
  { code: "pt", answer: "Portugal", options: ["Brazil", "Portugal", "Argentina"] },
  { code: "nl", answer: "Netherlands", options: ["Luxembourg", "Netherlands", "Russia"] },
  { code: "se", answer: "Sweden", options: ["Finland", "Sweden", "Norway"] },
  { code: "pl", answer: "Poland", options: ["Monaco", "Poland", "Indonesia"] },

  // Asian Flags (Known to work or highly likely)
  { code: "jp", answer: "Japan", options: ["Japan", "China", "South Korea"] },
  { code: "cn", answer: "China", options: ["China", "Japan", "India"] },
  { code: "in", answer: "India", options: ["Pakistan", "India", "Bangladesh"] },
  { code: "kr", answer: "South Korea", options: ["North Korea", "South Korea", "Taiwan"] },
  { code: "th", answer: "Thailand", options: ["Cambodia", "Thailand", "Laos"] },
  { code: "id", answer: "Indonesia", options: ["Monaco", "Poland", "Indonesia"] },
  
  // The Americas
  { code: "us", answer: "United States", options: ["Canada", "United States", "Cuba"] },
  { code: "ca", answer: "Canada", options: ["Canada", "Peru", "Chile"] },
  { code: "br", answer: "Brazil", options: ["Argentina", "Brazil", "Colombia"] },
  { code: "mx", answer: "Mexico", options: ["Venezuela", "Ecuador", "Mexico"] },
  { code: "ar", answer: "Argentina", options: ["Uruguay", "Argentina", "Honduras"] },
  
  // Africa
  { code: "za", answer: "South Africa", options: ["South Africa", "Ghana", "Senegal"] },
  { code: "eg", answer: "Egypt", options: ["Sudan", "Yemen", "Egypt"] },
  { code: "ng", answer: "Nigeria", options: ["Niger", "Nigeria", "Mali"] },

  // Oceania
  { code: "au", answer: "Australia", options: ["New Zealand", "Australia", "Jamaica"] },
  { code: "nz", answer: "New Zealand", options: ["Australia", "New Zealand", "Fiji"] },
];

// Show current flag and options
function showQuestion() {
  // *** CHANGE: Use the shuffled array for game logic ***
  if(currentIndex >= shuffledFlagQuiz.length) currentIndex = 0; // loop questions if needed
  const current = shuffledFlagQuiz[currentIndex];
  
  // Show flag image (using library classes)
  flagDisplay.className = `flag-icon flag-icon-${current.code}`;
  
  // Clear previous options
  optionsContainer.innerHTML = "";
  messageEl.textContent = ""; // clear previous message

  // Get a SHUFFLED copy of the options array (randomizes button order)
  const shuffledOptions = shuffleArray([...current.options]);

  shuffledOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(btn);
  });
}

// Check answer
function checkAnswer(selected) {
  // *** CHANGE: Use the shuffled array for current question's answer ***
  const correct = shuffledFlagQuiz[currentIndex].answer;

  if (selected === correct) {
    // Handle Correct Answer
    messageEl.textContent = "✅ Correct!";
    score++;
    scoreEl.textContent = `Score: ${score}`;

    currentIndex++; // Move to the next question

    // Check win condition
    if (score >= targetScore) {
      showWinPopup();
      return;
    }
    
    // Delay before showing next question
    setTimeout(showQuestion, 800);

  } else {
    // Handle Wrong Answer (Failure)
    messageEl.textContent = `❌ You Failed! The correct answer was: ${correct}. Starting over.`;
    
    // Disable options to prevent multiple clicks and let user read the message
    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
    
    // Restart game after a 2-second delay
    setTimeout(restartGame, 2000);
  }
}

// Show winning popup
function showWinPopup() {
  // Blur the game container only, not the body, so the popup stays sharp
  gameContainer.style.filter = "blur(5px)";
  
  const popup = document.createElement("div");
  popup.id = "win-popup";
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.background = "#1a2235";
  popup.style.padding = "30px";
  popup.style.borderRadius = "15px";
  popup.style.textAlign = "center";
  popup.style.boxShadow = "0 0 20px rgba(85, 170, 255, 0.8)";
  popup.style.zIndex = "9000";
  popup.innerHTML = `
    <h2>🎉 You Win! 🎉</h2>
    <p>Your score: ${score}</p>
    <button id="restart-win-btn" class="styled-button">Restart</button>
  `;
  document.body.appendChild(popup);

  document.getElementById("restart-win-btn").onclick = () => {
    popup.remove();
    gameContainer.style.filter = "none"; // Remove blur from container
    restartGame();
  };
}

// Restart game
function restartGame() {
  score = 0;
  currentIndex = 0;
  
  // *** KEY CHANGE: Shuffle the entire question array on restart ***
  shuffledFlagQuiz = shuffleArray([...flagQuiz]); 
  
  scoreEl.textContent = `Score: ${score}`;
  showQuestion();
}

// Initialize
// *** CHANGE: Start the game by calling restartGame to ensure it is shuffled immediately ***
restartGame();