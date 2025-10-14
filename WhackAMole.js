const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('startBtn');

const modal = document.getElementById('gameModal');
const modalTitle = document.getElementById('modalTitle');
const modalScore = document.getElementById('modalScore');
const restartBtn = document.getElementById('restartBtn');

let lastHole;
let timeUp = false;
let score = 0;
let gameTime = 15; // seconds
let timerInterval;
const WIN_SCORE = 5; // set your win condition here

// ---------------------
// Utility Functions
// ---------------------
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) return randomHole(holes);
  lastHole = hole;
  return hole;
}

// ---------------------
// Mole logic
// ---------------------
function peep() {
  if (timeUp) return;
  const time = randomTime(500, 1500);
  const hole = randomHole(holes);
  const mole = document.createElement('div');
  mole.classList.add('mole');
  hole.appendChild(mole);

  mole.addEventListener('click', whack);

  setTimeout(() => {
    if (hole.contains(mole)) hole.removeChild(mole);
    peep();
  }, time);
}

function whack(e) {
  score++;
  scoreBoard.textContent = score;

  // Check win condition
  if (score >= WIN_SCORE) {
    endGame(true);
  }

  e.target.remove();
}

// ---------------------
// Game Start
// ---------------------
function startGame() {
  score = 0;
  scoreBoard.textContent = score;
  timeUp = false;
  gameTime = 15;
  timeDisplay.textContent = gameTime;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    gameTime--;
    timeDisplay.textContent = gameTime;
    if (gameTime <= 0) {
      endGame(false); // time's up
    }
  }, 1000);

  peep();
}

// ---------------------
// Game End & Modal
// ---------------------
function endGame(won) {
  timeUp = true;
  clearInterval(timerInterval);
  removeAllMoles();

  if (won) {
    modalTitle.textContent = '🎉 You Win!';
  } else {
    modalTitle.textContent = '⏰ Game Over!';
  }
  modalScore.textContent = `Score: ${score}`;
  modal.style.display = 'flex';
}

function removeAllMoles() {
  holes.forEach(hole => {
    const mole = hole.querySelector('.mole');
    if (mole) hole.removeChild(mole);
  });
}

// ---------------------
// Restart Button
// ---------------------
restartBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  startGame();
});

// ---------------------
// Start Button
// ---------------------
startBtn.addEventListener('click', startGame);

