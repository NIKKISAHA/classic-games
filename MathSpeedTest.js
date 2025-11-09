const WINNING_STREAK = 10;
const QUESTION_TIME = 7; // seconds per question (less time)

const questionTextEl = document.getElementById("question-text");
const optionsContainerEl = document.getElementById("options-container");
const feedbackMessageEl = document.getElementById("feedback-message");
const currentScoreEl = document.getElementById("current-score");
const totalQuestionsEl = document.getElementById("total-questions");
const currentStreakEl = document.getElementById("current-streak");
const nextBtn = document.getElementById("next-btn");
const resetGameBtn = document.getElementById("reset-game-btn");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const timeLeftEl = document.getElementById("time-left");

let score = 0;
let totalQuestions = 0;
let streak = 0;
let quizOver = false;
let timer;
let timeLeft;
let correctAnswer = null; // global answer

// --- Theme Toggle ---
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  themeToggleBtn.textContent = document.body.classList.contains("light-theme")
    ? "🌙"
    : "☀️";
});

// --- Utility ---
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Question Generator (Medium Difficulty) ---
function generateMediumQuestion() {
  const types = ["basic", "multi", "percent", "power", "missing"];
  const type = types[randomInt(0, types.length - 1)];

  let question, answer;

  switch (type) {
    // 🔹 Basic +, -, ×, ÷ with smaller numbers
    case "basic": {
      const a = randomInt(5, 40); // smaller range
      const b = randomInt(5, 20); // smaller range
      const ops = ["+", "-", "×", "÷"];
      const op = ops[randomInt(0, ops.length - 1)];

      if (op === "+") {
        answer = a + b;
        question = `${a} + ${b}`;
      } else if (op === "-") {
        // Ensure result is not excessively negative
        const num1 = Math.max(a, b);
        const num2 = Math.min(a, b);
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
      } else if (op === "×") {
        answer = a * b;
        question = `${a} × ${b}`;
      } else { // ÷ - simple integer division
        const divisor = randomInt(2, 9);
        const quotient = randomInt(3, 15);
        const dividend = divisor * quotient;
        answer = quotient;
        question = `${dividend} ÷ ${divisor}`;
      }
      break;
    }

    // 🔹 Multi-step expressions (Simplified)
    case "multi": {
      const a = randomInt(2, 15);
      const b = randomInt(2, 10);
      const c = randomInt(1, 5);
      const ops = ["+", "×"]; // Only use + and × for simpler multi-step
      const op1 = ops[randomInt(0, ops.length - 1)];
      const op2 = ops[randomInt(0, ops.length - 1)];
      
      const expr = `(${a} ${op1.replace('×','*') } ${b}) ${op2.replace('×','*')} ${c}`;
      answer = Math.round(eval(expr));
      question = `(${a} ${op1} ${b}) ${op2} ${c}`;
      break;
    }

    // 🔹 Percentages (Simplified)
    case "percent": {
      const base = randomInt(50, 250); // smaller base
      const percent = randomInt(10, 50);
      // Ensure the percent is a multiple of 10 for simpler calculation (10%, 20%, 30%...)
      const simplePercent = Math.floor(percent / 10) * 10;
      answer = Math.round((base * simplePercent) / 100);
      question = `${simplePercent}% of ${base}`;
      break;
    }

    // 🔹 Powers / Roots (Simplified)
    case "power": {
      if (Math.random() > 0.5) {
        const base = randomInt(2, 8); // smaller base
        const exp = randomInt(2, 3); // max power of 3
        answer = Math.pow(base, exp);
        question = `${base}^${exp}`;
      } else {
        const squares = [4, 9, 16, 25, 36, 49, 64, 81]; // simpler squares
        const num = squares[randomInt(0, squares.length - 1)];
        answer = Math.sqrt(num);
        question = `√${num}`;
      }
      break;
    }

    // 🔹 Missing value (Simplified)
    case "missing": {
      const a = randomInt(2, 15); // smaller factors
      const b = randomInt(2, 10);
      const product = a * b;
      question = `${a} × ? = ${product}`;
      answer = b;
      break;
    }
  }

  // --- IMPORTANT: set the global correctAnswer (fixes the bug) ---
  correctAnswer = Number(answer);

  // Generate distinct incorrect options
  const incorrect = new Set();
  while (incorrect.size < 3) {
    // produce reasonable distractors, using a smaller delta for smaller numbers
    const delta = randomInt(1, Math.max(2, Math.floor(Math.abs(correctAnswer) * 0.1)));
    const sign = Math.random() > 0.5 ? 1 : -1;
    const fake = Number(correctAnswer) + sign * delta;
    if (fake > 0 && fake !== correctAnswer) incorrect.add(fake);
  }

  const options = shuffleArray([correctAnswer, ...Array.from(incorrect)]);
  displayQuestion(question, options);
  startTimer();
}

function displayQuestion(question, options) {
  questionTextEl.textContent = question;
  optionsContainerEl.innerHTML = "";
  feedbackMessageEl.textContent = "";

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = opt;
    // pass numeric value to checkAnswer
    btn.addEventListener("click", () => checkAnswer(btn, Number(opt)));
    optionsContainerEl.appendChild(btn);
  });

  nextBtn.style.display = "none";
}

// compare numbers (avoid type mismatch)
function checkAnswer(btn, selected) {
  clearInterval(timer);
  totalQuestions++;

  Array.from(optionsContainerEl.children).forEach((b) => (b.disabled = true));

  if (Number(selected) === Number(correctAnswer)) {
    btn.classList.add("correct-answer");
    feedbackMessageEl.textContent = "✅ Correct!";
    score++;
    streak++;
  } else {
    btn.classList.add("incorrect-answer");
    // highlight correct button if present
    const correctBtn = Array.from(optionsContainerEl.children).find(b => Number(b.textContent) === Number(correctAnswer));
    if (correctBtn) correctBtn.classList.add('correct-answer');
    feedbackMessageEl.textContent = `❌ Wrong! Correct answer was ${correctAnswer}.`;
    streak = 0;
  }

  updateDisplay();

  if (streak >= WINNING_STREAK) {
    endGame(true);
  } else {
    nextBtn.style.display = "block";
  }
}

function startTimer() {
  timeLeft = QUESTION_TIME;
  timeLeftEl.textContent = timeLeft;

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  totalQuestions++;
  feedbackMessageEl.textContent = `⏰ Time's up! The correct answer was ${correctAnswer}.`;
  Array.from(optionsContainerEl.children).forEach((btn) => (btn.disabled = true));
  streak = 0;
  updateDisplay();
  nextBtn.style.display = "block";
}

function updateDisplay() {
  currentScoreEl.textContent = score;
  totalQuestionsEl.textContent = totalQuestions;
  currentStreakEl.textContent = streak;
}

function nextQuestion() {
  if (quizOver) return;
  generateMediumQuestion(); // *** USING MEDIUM QUESTION ***
}

function resetGame() {
  score = 0;
  totalQuestions = 0;
  streak = 0;
  quizOver = false;
  resetGameBtn.style.display = "none";
  updateDisplay();
  generateMediumQuestion(); // *** USING MEDIUM QUESTION ***
}

function endGame(won) {
  quizOver = true;
  clearInterval(timer);
  nextBtn.style.display = "none";
  resetGameBtn.style.display = "block";

  if (won) {
    questionTextEl.textContent = "🏆 Genius Mode Complete 🏆";
    feedbackMessageEl.textContent = `You got ${WINNING_STREAK} in a row!`;
  } else {
    feedbackMessageEl.textContent += " Game Over.";
  }
}

nextBtn.addEventListener("click", nextQuestion);
resetGameBtn.addEventListener("click", resetGame);

// Initialize
resetGame();