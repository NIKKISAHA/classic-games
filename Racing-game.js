(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const scoreEl = document.getElementById('score');
  const highEl = document.getElementById('highscore');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const modal = document.getElementById('endModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalScore = document.getElementById('modalScore');
  const modalRestart = document.getElementById('modalRestart');

  // --- ADDED: Mobile Control Elements ---
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  // ---------------------------------------

  // FIX: Explicitly set the internal drawing resolution here.
  // This allows the CSS to control the *visual* size while the JS maintains the *game* size.
  canvas.width = 400; 
  canvas.height = 600; 
  
  const W = canvas.width; // W is now 400
  const H = canvas.height; // H is now 600

  // Player car
  const player = {
    w: 40,
    h: 70,
    x: W/2 - 20,
    y: H - 90,
    speed: 6,
    color: '#4ae0a6'
  };

  // Game state
  let obstacles = [];
  let frames = 0;
  let score = 0;
  let highscore = Number(localStorage.getItem('car_high') || 0);
  let running = false;
  let paused = false;
  let gameOver = false;
  let spawnRate = 90;
  let obstacleSpeed = 3;

  // Level system
  let level = 1;
  const levelThresholds = [200, 400 , 800 , 1200 , 1500]; 
  let nextLevelScore = levelThresholds[0];
  let showPopup = false;
  let popupTimer = 0;

  highEl.textContent = highscore;

  // Input
  const keys = { left: false, right: false };
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keys.right = true;
    if (e.code === 'Space') togglePause();
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keys.right = false;
  });

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', resetAndStart);

  // --- ADDED: Mobile Button Event Listeners ---

  // Helper to toggle 'left' key state on press/release (for mobile buttons)
  function handleLeftControl(state) {
    if (running && !gameOver) keys.left = state;
  }
  // Helper to toggle 'right' key state on press/release
  function handleRightControl(state) {
    if (running && !gameOver) keys.right = state;
  }

  // Left Button Listeners (for mouse and touch)
  leftBtn.addEventListener('mousedown', () => handleLeftControl(true));
  leftBtn.addEventListener('mouseup', () => handleLeftControl(false));
  leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleLeftControl(true); });
  leftBtn.addEventListener('touchend', () => handleLeftControl(false));

  // Right Button Listeners (for mouse and touch)
  rightBtn.addEventListener('mousedown', () => handleRightControl(true));
  rightBtn.addEventListener('mouseup', () => handleRightControl(false));
  rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleRightControl(true); });
  rightBtn.addEventListener('touchend', () => handleRightControl(false));

  // Pause Button Listener
  pauseBtn.addEventListener('click', togglePause);
  // ----------------------------------------------


  function startGame(){
    if (running) return;
    running = true;
    paused = false;
    gameOver = false;
    startBtn.disabled = true;
    restartBtn.disabled = false;
    // Enable the pause button on start
    pauseBtn.disabled = false;
    pauseBtn.textContent = '⏸️';
    resetGame();
    loop();
  }

  function resetAndStart(){
    running = false;
    setTimeout(() => {
      running = true;
      paused = false;
      gameOver = false;
      // Enable the pause button on restart
      pauseBtn.disabled = false;
      pauseBtn.textContent = '⏸️';
      resetGame();
      loop();
    }, 60);
  }

  function resetGame(){
    obstacles = [];
    frames = 0;
    score = 0;
    scoreEl.textContent = score;
    player.x = W/2 - player.w/2;
    spawnRate = 90;
    obstacleSpeed = 3;
    level = 1;
    nextLevelScore = levelThresholds[0];
  }

  function togglePause(){
    if (!running || gameOver) return;
    paused = !paused;
    
    // --- UPDATED: Manage button text/icon ---
    if (pauseBtn) {
        pauseBtn.textContent = paused ? '▶️' : '⏸️';
    }
    // ----------------------------------------
    
    if (!paused) loop();
  }

  function spawnObstacle() {
    const lanePadding = 30;
    const minW = 40, maxW = 80;
    const w = Math.floor(Math.random()*(maxW-minW)) + minW;
    const x = Math.floor(Math.random() * (W - lanePadding*2 - w)) + lanePadding;
    obstacles.push({
      x,
      y: -120,
      w,
      h: 70,
      color: getRandomColor(),
      speed: obstacleSpeed
    });
  }

  function getRandomColor(){
    const colors = ['#ff6b6b','#feca57','#48dbfb','#1dd1a1','#ff9ff3','#54a0ff'];
    return colors[Math.floor(Math.random()*colors.length)];
  }

  function update(){
    if (!running || paused || gameOver) return;
    frames++;

    // move player
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;
    player.x = Math.max(6, Math.min(W - player.w - 6, player.x));

    // spawn obstacles
    if (frames % Math.floor(spawnRate) === 0) spawnObstacle();

    // update obstacles
    for (let i = obstacles.length-1; i >= 0; i--) {
      const o = obstacles[i];
      o.y += o.speed;

      if (collides(player, o)) {
        endGame();
        return;
      }

      if (o.y > H + 100) {
        obstacles.splice(i, 1);
        score += 10;
        scoreEl.textContent = score;
      }
    }

    // Level system
    if (score >= nextLevelScore) {
      level++;
      showLevelPopup(level);
      obstacleSpeed += 1.2;
      spawnRate = Math.max(40, spawnRate - 10);
      nextLevelScore = levelThresholds[level - 1] || (nextLevelScore + 300);
    }

    // hide popup
    if (showPopup) {
      popupTimer--;
      if (popupTimer <= 0) showPopup = false;
    }

    // win condition
    if (level > levelThresholds.length) {
      endGame(true);
    }
  }

  function collides(a,b){
    return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
  }

  function draw(){
    ctx.clearRect(0,0,W,H);

    // road
    ctx.fillStyle = '#2f2f2f';
    const margin = 30;
    ctx.fillRect(margin, 0, W - margin*2, H);

    // center dashed line
    ctx.fillStyle = '#e6e6e6';
    const stripeW = 8, stripeH = 40;
    for (let y = (frames*4)%60 - 60; y < H; y += 60)
      ctx.fillRect(W/2 - stripeW/2, y, stripeW, stripeH);

    // draw player
    drawCar(player.x, player.y, player.w, player.h, player.color, true);

    // draw obstacles
    for (const o of obstacles)
      drawCar(o.x, o.y, o.w, o.h, o.color, false);

    // HUD
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(6,6,180,28);
    ctx.fillStyle = '#fff';
    ctx.font = '14px system-ui';
    ctx.fillText(`Score: ${score} | Level: ${level}`, 12, 26);

    // popup
    if (showPopup) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, H/2 - 60, W, 120);
      ctx.fillStyle = '#4ae0a6';
      ctx.font = '28px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`Level ${level} Unlocked!`, W/2, H/2 + 8);
      ctx.textAlign = 'start';
    }
  }

  // Modern car design
  function drawCar(x, y, w, h, color, isPlayer) {
    // body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + w*0.1, y + h*0.9);
    ctx.lineTo(x + w*0.9, y + h*0.9);
    ctx.quadraticCurveTo(x + w, y + h*0.6, x + w*0.85, y + h*0.1);
    ctx.lineTo(x + w*0.15, y + h*0.1);
    ctx.quadraticCurveTo(x, y + h*0.6, x + w*0.1, y + h*0.9);
    ctx.closePath();
    ctx.fill();

    // windows
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.moveTo(x + w*0.18, y + h*0.15);
    ctx.lineTo(x + w*0.82, y + h*0.15);
    ctx.lineTo(x + w*0.72, y + h*0.5);
    ctx.lineTo(x + w*0.28, y + h*0.5);
    ctx.closePath();
    ctx.fill();

    // spoiler
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x + w*0.2, y + h*0.85, w*0.6, 6);

    // wheels
    const wheelW = w*0.2;
    const wheelH = h*0.15;
    const tireColor = '#222';
    const rimColor = '#555';

    // front wheel
    ctx.fillStyle = tireColor;
    ctx.beginPath();
    ctx.ellipse(x + w*0.25, y + h*0.75, wheelW/2, wheelH/2, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = rimColor;
    ctx.beginPath();
    ctx.ellipse(x + w*0.75, y + h*0.75, wheelW/2, wheelH/2, 0, 0, Math.PI*2);
    ctx.fill();

    // highlight
    if (isPlayer) {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.moveTo(x + w*0.2, y + h*0.2);
      ctx.lineTo(x + w*0.5, y + h*0.2);
      ctx.lineTo(x + w*0.45, y + h*0.35);
      ctx.lineTo(x + w*0.2, y + h*0.35);
      ctx.closePath();
      ctx.fill();
    }
  }

  function loop(){
    if (!running) return;
    update();
    draw();
    if (!gameOver && !paused) requestAnimationFrame(loop);
  }

  function showLevelPopup(lvl){
    showPopup = true;
    popupTimer = 90;
  }

  function endGame(won=false){
  gameOver = true;
  running = false;
  startBtn.disabled = false;
  restartBtn.disabled = false;
  pauseBtn.disabled = true;

  if (score > highscore) {
    highscore = score;
    localStorage.setItem('car_high', highscore);
    highEl.textContent = highscore;
  }

  // show modal
  modal.classList.remove('hidden');
  modalTitle.textContent = won ? '🎉 You Won!' : '💥 Game Over 💥';
  modalScore.textContent = `Score: ${score} `;
  
  // blur background
  document.querySelector('.game-area').style.filter = 'blur(4px)';
}
modalRestart.addEventListener('click', () => {
  modal.classList.add('hidden');
  document.querySelector('.game-area').style.filter = 'none';
  resetAndStart();
});


  // REMOVED THE fixDPI() FUNCTION to avoid conflicts, as the CSS handles visual scaling
  // and the JS now handles internal resolution.
  
  draw();
})();