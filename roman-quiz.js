/* ---------------------------
   Roman Numeral Quiz - JS
   --------------------------- */

/* --- Utilities: convert decimal -> Roman --- */
function toRoman(num){
  if (num <= 0 || num >= 4000) return '';
  const map = [
    [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
    [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
    [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
  ];
  let s = '';
  for (const [value,sym] of map){
    while (num >= value){
      s += sym;
      num -= value;
    }
  }
  return s;
}

/* --- Convert Roman -> decimal (for explanation & validation) --- */
function romanToDecimal(r){
  if (!r) return 0;
  const map = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
  let total = 0;
  for (let i=0;i<r.length;i++){
    const cur = map[r[i]] || 0;
    const nxt = map[r[i+1]] || 0;
    if (cur < nxt) total -= cur;
    else total += cur;
  }
  return total;
}

/* --- App state --- */
const state = {
  qIndex: 0,
  score: 0,
  streak: 0,
  correct: '',
  number: 0,
  difficulty: 'medium'
};

const el = {
  numberToConvert: document.getElementById('numberToConvert'),
  displayRoman: document.getElementById('displayRoman'),
  choices: document.getElementById('choices'),
  qIndex: document.getElementById('qIndex'),
  score: document.getElementById('score'),
  streak: document.getElementById('streak'),
  lastResult: document.getElementById('lastResult'),
  correctAnswer: document.getElementById('correctAnswer'),
  curDifficulty: document.getElementById('curDifficulty'),
  difficultySelect: document.getElementById('difficulty'),
  // toggleShow: document.getElementById('toggleShow'), <-- REMOVED
  explainArea: document.getElementById('explainArea'),
  explainBtn: document.getElementById('explainBtn'),
  skipBtn: document.getElementById('skipBtn'),
  newBtn: document.getElementById('newBtn'),
  resetBtn: document.getElementById('resetBtn'),
  lb: document.getElementById('leaderboard'),
  saveScore: document.getElementById('saveScore'),
  nameInput: document.getElementById('nameInput'),
  
  // MODAL ELEMENTS
  resetModalContainer: document.getElementById('reset-modal-container'),
  cancelReset: document.getElementById('cancelReset'),
  confirmReset: document.getElementById('confirmReset'),
  
  // Streak Modal Elements
  streakModalContainer: document.getElementById('streak-modal-container'),
  playAgainStreak: document.getElementById('playAgainStreak')
};

/* --- Difficulty ranges --- */
const ranges = {
  easy: [1,50],
  medium: [1,399],
  hard: [1,3999]
};

function randInt(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

/* --- Create plausible wrong options --- */
function makeDistractors(correctNum){
  const opts = new Set();
  while (opts.size < 3){
    const delta = [ -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1,2,3,4,5,6,7,8,9,10 ];
    const pick = delta[Math.floor(Math.random()*delta.length)];
    let n = correctNum + pick;
    const [min,max] = ranges[state.difficulty];
    if (n < min) n = correctNum + Math.abs(pick);
    if (n > max) n = correctNum - Math.abs(pick);
    if (n <= 0) n = Math.max(1, correctNum + Math.abs(pick));
    if (n === correctNum) continue;
    opts.add(toRoman(n));
  }
  return Array.from(opts);
}

/* --- Build a new question --- */
function generateQuestion(){
  state.qIndex += 1;
  const [min,max] = ranges[state.difficulty];
  const n = randInt(min,max);
  const correctRoman = toRoman(n);
  state.number = n;
  state.correct = correctRoman;
  const distractors = makeDistractors(n);
  const options = [correctRoman, ...distractors];
  shuffle(options);
  renderQuestion(n, options, correctRoman);
  saveStateToLocal();
}

/* --- Shuffle --- */
function shuffle(arr){
  for (let i = arr.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* --- Render question --- */
function renderQuestion(num, options, correctRoman){
  el.qIndex.textContent = state.qIndex;
  el.numberToConvert.textContent = num;
  // UPDATED: Always hide the Roman numeral in main display initially
  el.displayRoman.textContent = '—'; 
  el.choices.innerHTML = '';
  // HIDE ANSWER: Hide correct answer in sidebar initially
  el.correctAnswer.textContent = '—'; 
  el.curDifficulty.textContent = capitalize(state.difficulty);
  el.explainArea.style.display = 'none';
  el.lastResult.textContent = '—';
  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.setAttribute('role','button');
    btn.setAttribute('data-choice', opt);
    btn.setAttribute('data-index', idx+1);
    btn.innerHTML = `<div style="font-size:16px">${opt}</div><div style="font-size:12px;color:var(--muted)">(${idx+1})</div>`;
    btn.addEventListener('click', () => handleAnswer(btn, opt));
    el.choices.appendChild(btn);
  });
}

/* --- Handle answer click --- */
function handleAnswer(btn, selected){
  disableChoices(true);
  const correct = state.correct;
  if (selected === correct){
    btn.classList.add('correct');
    state.score += 10;
    state.streak += 1;
    el.lastResult.textContent = 'Correct ✅';
    
    // Check for streak of 10, 20, 30, etc.
    if (state.streak >= 10 && state.streak % 10 === 0) {
      setTimeout(() => {
        document.body.classList.add('modal-active');
        el.streakModalContainer.style.display = 'flex';
      }, 500); // Gives time for the correct answer highlight to display
    }
    
  } else {
    btn.classList.add('wrong');
    const nodes = el.choices.querySelectorAll('.choice');
    nodes.forEach(n => { if (n.dataset.choice === correct) n.classList.add('correct'); });
    state.score = Math.max(0, state.score - 5);
    state.streak = 0;
    el.lastResult.textContent = `Wrong — correct is ${correct}`;
  }
  // REVEAL: Show correct answer in sidebar after attempt
  el.correctAnswer.textContent = correct; 
  updateStats();
  showExplanation();
}

/* --- Explanation --- */
function showExplanation(){
  el.explainArea.style.display = 'block';
  const roman = state.correct;
  const dec = state.number;
  let breakdown = `${roman} → ${dec}\n\nBreakdown: `;
  
  // Use the decimal value of the Roman numeral letters (without subtraction logic) for the breakdown text
  const simpleMap = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
  for (let i=0;i<roman.length;i++){
    const ch = roman[i];
    const val = simpleMap[ch] || 0;
    
    // Check for subtractive pairs like IV, IX, XL, etc.
    const isSubtractive = (i < roman.length - 1) && ((simpleMap[ch] || 0) < (simpleMap[roman[i+1]] || 0));
    
    breakdown += `${ch}=${isSubtractive ? '(-' : ''}${val}${isSubtractive ? ')' : ''}`;
    
    if (i < roman.length - 1) {
        breakdown += ' + ';
    }
  }
  
  // Remove the trailing ' + ' if it exists
  breakdown = breakdown.replace(/ \+ $/, '');

  breakdown += `\n\nNote: The final calculated value is ${dec}. Subtractive pairs (like IV, IX, etc.) modify the total.`;
  
  el.explainArea.textContent = breakdown;
}

/* --- Update stats --- */
function updateStats(){
  el.score.textContent = state.score;
  el.streak.textContent = state.streak;
  // UPDATED: Always hide the Roman numeral in main display
  el.displayRoman.textContent = '—'; 
}

/* --- Enable/disable choices --- */
function disableChoices(disable){
  const nodes = el.choices.querySelectorAll('.choice');
  nodes.forEach(n => n.disabled = disable);
}

/* ---------------------------------
   --- Event handlers --- 
   --------------------------------- */

el.difficultySelect.addEventListener('change', (e) => {
  state.difficulty = e.target.value;
  state.qIndex = 0;
  generateQuestion();
});

// el.toggleShow.addEventListener('change', ...) <-- REMOVED

el.explainBtn.addEventListener('click', () => {
  el.explainArea.style.display = el.explainArea.style.display === 'none' ? 'block' : 'none';
});

el.skipBtn.addEventListener('click', () => {
  state.streak = 0;
  el.lastResult.textContent = 'Skipped — no points';
  // REVEAL: Show correct answer in sidebar after skip
  el.correctAnswer.textContent = state.correct; 
  updateStats();
  setTimeout(generateQuestion, 350);
});

// Show reset modal container and apply blur to body
el.resetBtn.addEventListener('click', () => {
  document.body.classList.add('modal-active'); // ADD blur class
  el.resetModalContainer.style.display = 'flex'; // Show modal container (using flex to center)
});

// Hide reset modal container and remove blur
el.cancelReset.addEventListener('click', () => {
  document.body.classList.remove('modal-active'); // REMOVE blur class
  el.resetModalContainer.style.display = 'none'; // Hide modal container
});

// Confirm reset, then hide modal and remove blur
el.confirmReset.addEventListener('click', () => {
  // Perform the reset logic
  state.score = 0;
  state.streak = 0;
  state.qIndex = 0;
  localStorage.removeItem('roman_quiz_lb');
  updateStats();
  renderLeaderboard();
  generateQuestion();
  
  document.body.classList.remove('modal-active'); // REMOVE blur class
  el.resetModalContainer.style.display = 'none'; // Hide modal container
});

el.newBtn.addEventListener('click', () => generateQuestion()); // Moved newBtn listener here

// Handle streak modal button - closes modal and starts next question
el.playAgainStreak.addEventListener('click', () => {
  document.body.classList.remove('modal-active'); // REMOVE blur class
  el.streakModalContainer.style.display = 'none'; // Hide modal
  generateQuestion(); // Immediately start the next question
});


/* --- Keyboard shortcuts 1-4 --- */
window.addEventListener('keydown', (e) => {
  if (['1','2','3','4'].includes(e.key)){
    const idx = parseInt(e.key,10) - 1;
    const btn = el.choices.children[idx];
    if (btn && !btn.disabled) btn.click();
  }
});

/* ---------------------------------
   --- Leaderboard & Persistence --- 
   --------------------------------- */

function getLeaderboard(){
  try {
    const raw = localStorage.getItem('roman_quiz_lb') || '[]';
    return JSON.parse(raw);
  } catch { return []; }
}
function saveLeaderboard(arr){ localStorage.setItem('roman_quiz_lb', JSON.stringify(arr.slice(0,10))); }
function renderLeaderboard(){
  const lb = getLeaderboard();
  el.lb.innerHTML = '';
  if (lb.length === 0){
    el.lb.innerHTML = '<div style="color:var(--muted)">No saved scores yet.</div>';
    return;
  }
  lb.forEach((row, idx) => {
    const r = document.createElement('div');
    r.className = 'lb-row';
    r.innerHTML = `<div>${idx+1}. ${escapeHtml(row.name)}</div><div>${row.score} pts</div>`;
    el.lb.appendChild(r);
  });
}
el.saveScore.addEventListener('click', () => {
  const name = (el.nameInput.value || 'Player').trim().slice(0,24);
  const lb = getLeaderboard();
  lb.push({name, score: state.score, date: Date.now()});
  lb.sort((a,b) => b.score - a.score);
  saveLeaderboard(lb);
  renderLeaderboard();
  el.nameInput.value = '';
});

/* --- Persistence --- */
function saveStateToLocal(){
  const s = {score: state.score, streak: state.streak, difficulty: state.difficulty, qIndex: state.qIndex};
  localStorage.setItem('roman_quiz_state', JSON.stringify(s));
}
function loadStateFromLocal(){
  try {
    const raw = localStorage.getItem('roman_quiz_state');
    if (!raw) return;
    const s = JSON.parse(raw);
    state.score = s.score || 0;
    state.streak = s.streak || 0;
    state.difficulty = s.difficulty || 'medium';
    state.qIndex = s.qIndex || 0;
    el.difficultySelect.value = state.difficulty;
  } catch {}
}

/* --- Helpers --- */
function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

/* --- Startup --- */
loadStateFromLocal();
renderLeaderboard();
generateQuestion();
updateStats();
saveStateToLocal();