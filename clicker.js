const emojisEls = document.querySelectorAll('.emoji');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const targetDisplay = document.getElementById('targetEmoji');
const startBtn = document.getElementById('startBtn');

const modal = document.getElementById('gameModal');
const modalTitle = document.getElementById('modalTitle');
const modalScore = document.getElementById('modalScore');
const restartBtn = document.getElementById('restartBtn');

let score = 0;
let roundTime = 3;
let timerInterval;
let targetEmoji;
let winwin = 3;

// 20 emojis
const emojis = ['🐹','🐱','🐶','🦊','🐼','🐸','🦁','🐵','🐔','🐧','🦉','🦄','🐷','🐰','🐻','🐨','🐯','🐙','🦀','🐌'];

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  startGame();
});

function startGame() {
  score = 0;
  scoreDisplay.textContent = score;
  nextRound();
}

function nextRound() {
  targetEmoji = getRandomEmoji();
  targetDisplay.textContent = targetEmoji;

  shuffleEmojis();

  clearInterval(timerInterval);
  roundTime = 3;
  timeDisplay.textContent = roundTime;

  timerInterval = setInterval(() => {
    roundTime--;
    timeDisplay.textContent = roundTime;
    if (roundTime <= 0) {
      endGame(false); // time's up → game over
    }
  }, 1000);
}

function shuffleEmojis() {
  // Pick a random index where the target emoji will appear
  const targetIndex = Math.floor(Math.random() * emojisEls.length);

  emojisEls.forEach((el, i) => {
    if (i === targetIndex) {
      el.textContent = targetEmoji; // ensure target emoji is present
    } else {
      el.textContent = getRandomEmoji();
    }
    el.removeEventListener('click', checkEmoji);
    el.addEventListener('click', checkEmoji);
  });
}

function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function checkEmoji(e) {
  const chosen = e.currentTarget.textContent;
  if (chosen === targetEmoji) {
    score++;
    scoreDisplay.textContent = score;

    if (score >= winwin) {
      endGame(true); // win at winwin points
    } else {
      shuffleEmojis(); // reshuffle immediately
      targetEmoji = getRandomEmoji(); // new target emoji
      targetDisplay.textContent = targetEmoji;
      roundTime = 3; // reset timer
    }
  } else {
    endGame(false); // clicked wrong emoji
  }
}

function endGame(won) {
  clearInterval(timerInterval);
  emojisEls.forEach(el => el.removeEventListener('click', checkEmoji));

  modalTitle.textContent = won ? '🎉 You Win!' : '⏰ Game Over!';
  modalScore.textContent = `Score: ${score}`;
  modal.style.display = 'flex';
}
