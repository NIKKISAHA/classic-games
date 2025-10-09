(()=>{
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  let W = canvas.width; let H = canvas.height;

  // UI refs
  const scoreEl = document.getElementById('score');
  const livesEl = document.getElementById('lives');
  const waveEl = document.getElementById('wave');
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');

  // Game state
  let keys = {};
  let running = false;
  let paused = false;
  let lastTime = 0;
  let dt = 0;
  let waveCompleted = false; // <-- NEW: State for showing wave cleared message
  let finalWin = false;      // <-- NEW: State for final victory

  // Player
  const player = {
    w:48, h:18, x: W/2 - 24, y: H - 60, speed: 280,
    color: getComputedStyle(document.documentElement).getPropertyValue('--ship').trim() || '#6ef3ff',
    cooldown:0
  };

  // Entities
  let bullets = [];
  let enemies = [];
  let enemyBullets = [];

  // Game params
  let score = 0;
  let lives = 3;
  let wave = 1;
  const MAX_WAVES = 3; // Game ends after clearing this wave

  function reset(){
    bullets = [];
    enemies = [];
    enemyBullets = [];
    score = 0; lives = 3; wave = 1; running = true; paused = false;
    waveCompleted = false; // <-- Reset new states
    finalWin = false;      // <-- Reset new states
    spawnWave(wave);
    updateHUD();
  }

  function spawnWave(n){
    enemies = [];
    const rows = Math.min(4 + Math.floor(n/2), 6);
    const cols = 10;
    const spacingX = 56;
    const spacingY = 42;
    const offsetX = (W - (cols-1)*spacingX)/2;
    const offsetY = 60;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        enemies.push({
          x: offsetX + c*spacingX,
          y: offsetY + r*spacingY,
          w:36, h:20,
          alive:true,
          row:r, col:c
        });
      }
    }
    enemyState.dx = 1;
    enemyState.speed = 30 + n*10;
    enemyState.drop = 18;
  }

  const enemyState = {dx:1,speed:30,drop:18};

  function updateHUD(){scoreEl.textContent = score; livesEl.textContent = lives; waveEl.textContent = wave}

  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

  // input
  window.addEventListener('keydown',e=>{keys[e.code]=true; if(e.code==='KeyP'){paused=!paused; pauseBtn.textContent = paused ? 'Resume (P)' : 'Pause (P)'} if(e.code==='Space'){e.preventDefault()} });
  window.addEventListener('keyup',e=>{keys[e.code]=false});

  // touch controls
  document.getElementById('left-touch').addEventListener('touchstart',()=>{keys['ArrowLeft']=true});
  document.getElementById('left-touch').addEventListener('touchend',()=>{keys['ArrowLeft']=false});
  document.getElementById('right-touch').addEventListener('touchstart',()=>{keys['ArrowRight']=true});
  document.getElementById('right-touch').addEventListener('touchend',()=>{keys['ArrowRight']=false});
  document.getElementById('shoot-touch').addEventListener('touchstart',()=>{shoot();});

  startBtn.addEventListener('click',()=>{reset(); lastTime = performance.now(); loop(lastTime)});
  pauseBtn.addEventListener('click',()=>{paused=!paused; pauseBtn.textContent = paused ? 'Resume (P)' : 'Pause (P)'});

  function shoot(){
    if(player.cooldown<=0){
      bullets.push({x: player.x + player.w/2 -3, y: player.y -8, w:6, h:12, vy:-420});
      player.cooldown = 0.28;
    }
  }

  function enemyFire(){
    if(enemies.length===0) return;
    const alive = enemies.filter(e=>e.alive);
    if(!alive.length) return;
    const shooter = alive[Math.floor(Math.random()*alive.length)];
    enemyBullets.push({x: shooter.x + shooter.w/2 -3, y: shooter.y + shooter.h + 6, w:6, h:12, vy: 160 + wave*10});
  }

  function rectsCollide(a,b){return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h)}

  function update(dt){
    if(!running || paused || waveCompleted) return; // <-- Check for waveCompleted state
    
    let dir = 0;
    if(keys['ArrowLeft']||keys['KeyA']) dir -=1;
    if(keys['ArrowRight']||keys['KeyD']) dir +=1;
    player.x += dir * player.speed * dt;
    player.x = clamp(player.x, 6, W - player.w - 6);
    if(keys['Space'] || keys['KeyW'] || keys['ArrowUp']) shoot();
    if(player.cooldown>0) player.cooldown -= dt;

    bullets.forEach(b=>b.y += b.vy * dt);
    bullets = bullets.filter(b=>b.y + b.h > -10);

    enemyBullets.forEach(b=>b.y += b.vy * dt);
    enemyBullets = enemyBullets.filter(b=>b.y < H + 20);

    const alive = enemies.filter(e=>e.alive);
    if(alive.length){
      let minX = Math.min(...alive.map(e=>e.x));
      let maxX = Math.max(...alive.map(e=>e.x + e.w));
      const step = enemyState.speed * dt * enemyState.dx;
      alive.forEach(e=>e.x += step);
      if(minX < 6 && enemyState.dx < 0){ enemyState.dx = 1; alive.forEach(e=>e.y += enemyState.drop); }
      if(maxX > W - 6 && enemyState.dx > 0){ enemyState.dx = -1; alive.forEach(e=>e.y += enemyState.drop); }
    }

    if(Math.random() < 0.01 + wave*0.002) enemyFire();

    bullets.forEach(b=>{
      enemies.forEach(en=>{
        if(en.alive && rectsCollide(b,en)){
          en.alive = false;
          b.dead = true;
          score += 10;
        }
      });
    });
    bullets = bullets.filter(b=>!b.dead);

    enemyBullets.forEach(b=>{
      if(rectsCollide(b, player)){
        b.dead = true;
        lives -= 1;
        player.x = W/2 - player.w/2;
        if(lives <= 0){running = false}
      }
    });
    enemyBullets = enemyBullets.filter(b=>!b.dead);

    enemies.forEach(en=>{
      if(en.alive && en.y + en.h >= player.y){running = false;}
    });

    // --- NEW WAVE CLEAR / WIN LOGIC ---
    if(enemies.every(e=>!e.alive)){
      if (wave < MAX_WAVES) { 
        waveCompleted = true; // Pause game and show message
        setTimeout(() => {
          waveCompleted = false;
          wave += 1;
          spawnWave(wave);
        }, 1500); // Display "Wave Cleared" for 1.5 seconds
      } else {
        running = false; // Game over, final win!
        finalWin = true; // Set final win state
      }
    }
    // --- END NEW LOGIC ---

    updateHUD();
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    drawStars();
    drawShip(player.x, player.y, player.w, player.h);
    bullets.forEach(b=>{
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bullet').trim() || '#fff';
      roundRect(ctx, b.x, b.y, b.w, b.h, 3, true);
    });
    enemyBullets.forEach(b=>{
      ctx.fillStyle = 'rgba(255,180,100,0.95)';
      roundRect(ctx, b.x, b.y, b.w, b.h, 3, true);
    });
    enemies.forEach(en=>{if(!en.alive) return; drawEnemy(en.x, en.y, en.w, en.h);});

    // --- MODIFIED GAME OVER / WIN SCREEN ---
    if(!running){
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, H/2 - 60, W, 120);
      ctx.fillStyle = '#fff'; 
      ctx.textAlign = 'center'; 
      ctx.font = '28px system-ui';

      if (finalWin) {
        ctx.fillText('YOU WIN! Final Score: ' + score, W/2, H/2 - 6);
        ctx.font = '16px system-ui';
        ctx.fillText('Congratulations, Earth is safe!', W/2, H/2 + 22);
      } else {
        ctx.fillText('Game Over', W/2, H/2 - 6);
        ctx.font = '16px system-ui'; 
        ctx.fillText('Click Start / Restart to play again', W/2, H/2 + 22);
      }
    }
    // --- END MODIFIED LOGIC ---

    // --- NEW WAVE CLEARED MESSAGE ---
    if(waveCompleted){
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(0,0,W,H);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7fff7f'; 
        ctx.textAlign='center'; 
        ctx.font='40px system-ui';
        ctx.fillText(`WAVE ${wave} CLEARED!`, W/2, H/2);
    }
    // --- END NEW LOGIC ---
    
    if(paused){
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#fff'; ctx.textAlign='center'; ctx.font='32px system-ui';
      ctx.fillText('Paused', W/2, H/2);
    }
  }

  let stars = [];
  for(let i=0;i<80;i++){stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+0.3})}
  function drawStars(){
    stars.forEach(s=>{s.x += 6*0.016; if(s.x>W) s.x = 0; ctx.fillStyle = 'rgba(255,255,255,'+(0.2+Math.random()*0.8)+')'; ctx.fillRect(s.x,s.y,s.r,s.r)});
  }

  function drawShip(x,y,w,h){
    ctx.save();
    ctx.translate(x,y);
    ctx.beginPath();
    ctx.moveTo(w/2,0);
    ctx.lineTo(w, h);
    ctx.lineTo(0,h);
    ctx.closePath();
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(w/2 - 6, h/2 - 2, 12, 6);
    ctx.restore();
  }

  function drawEnemy(x,y,w,h){
    ctx.save();
    ctx.translate(x,y);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--enemy').trim() || '#ff7b7b';
    roundRect(ctx, 0, 0, w, h, 4, true);
    ctx.fillStyle = '#111';
    ctx.fillRect(8,6,4,4);
    ctx.fillRect(w-12,6,4,4);
    for(let k=0;k<3;k++) ctx.fillRect(6 + k*10, h - 6, 6, 4);
    ctx.restore();
  }

  function roundRect(ctx,x,y,w,h,r,fill){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
    if(fill) ctx.fill(); else ctx.stroke();
  }

  function loop(t){
    dt = Math.min(0.04, (t - lastTime)/1000);
    lastTime = t;
    
    // Only update game logic if not paused AND not showing the win screen
    if (!waveCompleted) { 
        update(dt);
    }
    
    draw();
    if(running || paused || waveCompleted) requestAnimationFrame(loop);
  }

  function fitCanvas(){
    const containerW = Math.min(900, window.innerWidth - 32);
    canvas.style.width = containerW + 'px';
  }
  window.addEventListener('resize', fitCanvas);
  fitCanvas();

  window.addEventListener('keydown', e=>{ if(e.code==='Space'){shoot();} if(e.code==='KeyR'){ reset(); } });

  (function init(){
    spawnWave(wave);
    updateHUD();
    draw();
  })();
})();