(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d', {alpha:true});
  let W = canvas.width, H = canvas.height;

  // UI elements (Keeping your existing UI references)
  const scoreEl = document.getElementById('score');
  const highEl = document.getElementById('highScore');
  const multEl = document.getElementById('mult');
  const comboEl = document.getElementById('combo');
  const timeEl = document.getElementById('time');
  const bubbleCountEl = document.getElementById('bubbleCount');
  const levelEl = document.getElementById('level');
  const startBtn = document.getElementById('startBtn');
  const startBtn2 = document.getElementById('startBtn2');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const centerCard = document.getElementById('centerCard');

  // Game state
  let bubbles = [], particles = [];
  let running = false, paused = false;
  let score = 0, highScore = Number(localStorage.getItem('bp_high') || 0);
  let timeLeft = 20, spawnTimer = 0, spawnInterval = 800;
  let lastStamp = 0;
  let combo = 0, comboTimer = 0, comboWindow = 1200;
  let multiplier = 1;
  let level = 1;
  let bubblesPoppedThisLevel = 0;
  let totalPopped = 0;

  const TOTAL_LEVELS = 10;
  const BUBBLES_TO_POP_PER_LEVEL = 10;
  const TIME_PER_LEVEL = 20;
  
  // Mobile Optimization: Increase touch target size on small screens
  // Note: 768px is a good threshold for most tablets/mobiles
  const TOUCH_TARGET_FACTOR = window.innerWidth <= 768 ? 1.5 : 1; 

  highEl.textContent = highScore;

  // --- Unified Resize Logic for Responsiveness and High-DPI ---
  function resizeCanvas(){
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set actual canvas resolution high for crisp drawing
    canvas.width = Math.max(320, Math.floor(rect.width * ratio));
    canvas.height = Math.max(240, Math.floor(rect.height * ratio));
    
    // Scale context back so game logic uses CSS pixel dimensions (W, H)
    ctx.setTransform(ratio,0,0,ratio,0,0);
    
    W = rect.width; // Use CSS width/height for game coordinates
    H = rect.height;
  }
  
  // Initial call and event listener
  resizeCanvas(); 
  window.addEventListener('resize', resizeCanvas); 
  // ------------------------------------------------------------------

  function rand(min,max){return Math.random()*(max-min)+min}
  function distance(a,b,c,d){return Math.hypot(a-c,b-d)}

  class Bubble {
    constructor(x,y,r,vx,vy,color,scoreVal){
      this.x=x; this.y=y; this.r=r; this.vx=vx; this.vy=vy;
      this.color=color; this.scoreVal=scoreVal; this.birth=Date.now();
    }
    update(dt){
      this.x += this.vx*dt; this.y += this.vy*dt;
      if(this.x < -this.r) this.x = W + this.r;
      if(this.x > W + this.r) this.x = -this.r;
    }
    draw(ctx){
      ctx.save();
      ctx.beginPath();
      const grad = ctx.createRadialGradient(this.x - this.r*0.3, this.y - this.r*0.3, this.r*0.1, this.x, this.y, this.r);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.12, this.color);
      grad.addColorStop(0.7, 'rgba(255,255,255,0.04)');
      grad.addColorStop(1, 'rgba(255,255,255,0.02)');
      ctx.fillStyle = grad;
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.ellipse(this.x - this.r*0.35, this.y - this.r*0.45, this.r*0.25, this.r*0.15, Math.PI/6, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Particle {
    constructor(x,y,color){
      this.x=x; this.y=y; this.vx=rand(-150,150); this.vy=rand(-120,180);
      this.life=0; this.ttl=rand(400,800); this.color=color; this.size=rand(2,6);
    }
    update(dt){ this.life += dt*1000; this.x += this.vx*dt; this.y += this.vy*dt; this.vy += 200*dt; }
    draw(ctx){
      const t = 1 - Math.min(1,this.life/this.ttl);
      ctx.globalAlpha = t;
      ctx.fillStyle = this.color;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.size*t,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Consolidated and cleaned up spawnBubble
  function spawnBubble(){
    // Minor difficulty/size scaling, adjusted to use the canvas W/H
    const r = Math.round(rand(14, 48) * (1 - Math.min(0.6, level*0.02)));
    const x = rand(r, W - r);
    const y = H + r + rand(10, 100);
    const vy = -rand(20, 80) - level*4;
    const vx = rand(-20,20);
    const hue = Math.floor(rand(160,320));
    const color = `hsla(${hue},75%,60%,0.9)`;
    const scoreVal = Math.round(10 + (60 - r)*0.4);
    bubbles.push(new Bubble(x,y,r,vx,vy,color,scoreVal));
  }

  function popBubble(i){
    const b = bubbles[i];
    if(!b) return;
    for(let p=0;p<12;p++) particles.push(new Particle(b.x + rand(-6,6), b.y + rand(-6,6), b.color));

    const now = Date.now();
    if(now - comboTimer <= comboWindow) combo++; else combo = 1;
    comboTimer = now;
    multiplier = 1 + Math.floor(combo/5) * 0.5;

    score += Math.round(b.scoreVal * multiplier);
    bubbles.splice(i,1);
    flashAlpha = Math.min(0.6, flashAlpha + 0.12);

    totalPopped++;
    bubblesPoppedThisLevel++;

    updateUI();

    // Level up if enough bubbles popped
    if(bubblesPoppedThisLevel >= BUBBLES_TO_POP_PER_LEVEL){
      if(level < TOTAL_LEVELS){
        level++;
        bubblesPoppedThisLevel = 0;
        timeLeft = TIME_PER_LEVEL;
        showLevelCleared();
      } else {
        // All levels cleared
        endGame(true);
      }
    }
  }

  function showLevelCleared(){
    running = false;
    centerCard.innerHTML = `<div style="font-weight:800;font-size:22px">Level ${level-1} Cleared!</div>
      <div style="margin-top:10px"><button id="nextLevel">Next Level</button></div>`;
    centerCard.style.display='block';
    document.getElementById('nextLevel').addEventListener('click', ()=>{
      running = true;
      centerCard.style.display='none';
      timeLeft = TIME_PER_LEVEL;
    });
  }

  function updateUI(){
    scoreEl.textContent = score;
    multEl.textContent = 'x' + Number(multiplier.toFixed(2));
    comboEl.textContent = combo;
    bubbleCountEl.textContent = bubbles.length;
    levelEl.textContent = level;
    timeEl.textContent = Math.ceil(timeLeft);
  }

  function handlePointer(evt){
    if(!running || paused) return;
    const rect = canvas.getBoundingClientRect();
    const x = (evt.clientX || (evt.touches && evt.touches[0].clientX)) - rect.left;
    const y = (evt.clientY || (evt.touches && evt.touches[0].clientY)) - rect.top;
    
    // **CRITICAL: Use TOUCH_TARGET_FACTOR for touch/mobile devices**
    for(let i=bubbles.length -1; i>=0; i--){
      if(distance(bubbles[i].x,bubbles[i].y,x,y) <= bubbles[i].r * TOUCH_TARGET_FACTOR){
        popBubble(i);
        return;
      }
    }
  }
  canvas.addEventListener('click', handlePointer);
  canvas.addEventListener('touchstart', e=>{ e.preventDefault(); handlePointer(e); }, {passive:false});

  let flashAlpha = 0;

  function loop(ts){
    if(!lastStamp) lastStamp = ts;
    const dt = Math.min(40, ts - lastStamp)/1000;
    lastStamp = ts;

    if(running && !paused){
      timeLeft -= dt;

      // Lose check
      if(timeLeft <= 0){
        endGame(false);
        return;
      }

      spawnTimer += dt*1000;
      const currentInterval = Math.max(240, spawnInterval - level*20);
      if(spawnTimer > currentInterval){ spawnTimer = 0; spawnBubble(); }

      for(let i=bubbles.length-1;i>=0;i--){
        bubbles[i].update(dt);
        if(bubbles[i].y + bubbles[i].r < -80) bubbles.splice(i,1);
      }
      for(let i=particles.length-1;i>=0;i--){
        particles[i].update(dt);
        if(particles[i].life > particles[i].ttl) particles.splice(i,1);
      }

      if(Date.now() - comboTimer > comboWindow) { combo = 0; multiplier = 1; }

      updateUI();
    }

    // Use W and H which are set by resizeCanvas to the CSS dimensions
    ctx.clearRect(0,0,W,H); 
    ctx.save();
    for(const b of bubbles) b.draw(ctx);
    for(const p of particles) p.draw(ctx);
    if(flashAlpha > 0){ ctx.fillStyle = `rgba(255,255,255,${flashAlpha*0.08})`; ctx.fillRect(0,0,W,H); flashAlpha *= 0.92; if(flashAlpha<0.01) flashAlpha=0; }
    ctx.restore();

    if(!running){ centerCard.style.display='block'; } else { centerCard.style.display='none'; }

    requestAnimationFrame(loop);
  }

  function startGame(){
    running=true; paused=false;
    score=0; timeLeft=TIME_PER_LEVEL; bubbles=[]; particles=[]; spawnTimer=0; combo=0; multiplier=1;
    flashAlpha=0; level=1; totalPopped=0; bubblesPoppedThisLevel=0;
    updateUI();
    lastStamp=0;
    requestAnimationFrame(loop);
  }

  function pauseGame(){ paused=!paused; pauseBtn.textContent = paused?'Resume':'Pause'; }
  function resetGame(){ running=false; paused=false; bubbles=[]; particles=[]; score=0; timeLeft=TIME_PER_LEVEL; totalPopped=0; bubblesPoppedThisLevel=0; updateUI(); }

  function endGame(won){
    running=false; paused=false;
    if(score>highScore){ highScore=score; localStorage.setItem('bp_high',highScore); highEl.textContent=highScore; }
    const msg = won?'You Win!':'Game Over!';
    centerCard.innerHTML = `<div style="font-weight:800;font-size:20px">${msg}</div>
      <div class="small" style="margin-top:8px">Score: ${score} — High: ${highScore}</div>
      <div style="margin-top:12px"><button id='playAgain'>Play Again</button></div>`;
    centerCard.style.display='block';
    document.getElementById('playAgain').addEventListener('click', startGame);
  }

  startBtn.addEventListener('click', startGame);
  startBtn2.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', ()=>{ if(!running) return; pauseGame(); });
  resetBtn.addEventListener('click', resetGame);

  window.addEventListener('keydown', e=>{
    if(e.key==='p') pauseGame();
    if(e.key==='r') resetGame();
    if(e.key===' ' && !running) startGame();
  });

  requestAnimationFrame(loop);
})();