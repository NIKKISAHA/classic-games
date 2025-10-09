const board = document.getElementById('board');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const modal = document.getElementById('gameOverModal');
const modalTitle = document.getElementById('modal-title');
const finalScoreEl = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

const ROWS = 20;
const COLS = 10;
// Note: CELL_SIZE is now determined by CSS (36px), so this variable is no longer needed for rendering.

let cells = [];
let score = 0;
let level = 1;
let isGameOver = false;

// Game timing variables
let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000; // Initial drop speed in ms (1 second)
let dropTimer = null; // To hold the loop function


// --- Initialization ---

// Create the visual board cells and initialize the game data array (cells)
for(let r=0;r<ROWS;r++){
  cells[r]=[];
  for(let c=0;c<COLS;c++){
    const div = document.createElement('div');
    div.classList.add('cell');
    board.appendChild(div);
    cells[r][c] = 0; // 0 means empty
  }
}

// Tetromino shapes
const SHAPES = [
  [[1,1,1,1]], // I (4x4 array needed for rotation, simplified here)
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1],[0,0,0]], // T
  [[0,1,1],[1,1,0],[0,0,0]], // S
  [[1,1,0],[0,1,1],[0,0,0]], // Z
  [[1,0,0],[1,1,1],[0,0,0]], // J
  [[0,0,1],[1,1,1],[0,0,0]]  // L
];

const COLORS = ['#6ef3ff','#ff7b7b','#7fff7f','#ffb84d','#ff66ff','#ffd56e','#66b3ff'];

let current = randomTetromino();

// --- Game Logic Functions ---

function randomTetromino(){
  const idx = Math.floor(Math.random()*SHAPES.length);
  return {x:3,y:0,shape:SHAPES[idx],color:COLORS[idx]};
}

function draw(){
  // 1. Redraw the static board (cells array)
  board.childNodes.forEach((div,i)=>{
    const r = Math.floor(i/COLS);
    const c = i%COLS;
    // Set background based on the 'cells' array (static blocks)
    div.style.background = cells[r][c] ? cells[r][c] : '#333';
  });

  // 2. Draw the current falling tetromino
  current.shape.forEach((row,dy)=>{
    row.forEach((val,dx)=>{
      if(val){
        const r = current.y+dy;
        const c = current.x+dx;
        // Only draw if within bounds
        if(r>=0 && r<ROWS && c>=0 && c<COLS) {
          board.childNodes[r*COLS+c].style.background = current.color;
        }
      }
    });
  });
}

function canMove(dx,dy,shape){
  for(let y=0;y<shape.length;y++){
    for(let x=0;x<shape[y].length;x++){
      if(shape[y][x]){
        let nx = current.x + x + dx;
        let ny = current.y + y + dy;

        // Check horizontal bounds and floor collision
        if(nx < 0 || nx >= COLS || ny >= ROWS) return false;
        
        // Check collision with static blocks (if within vertical bounds)
        if(ny >= 0 && cells[ny][nx]) return false;
      }
    }
  }
  return true;
}

function merge(){
  current.shape.forEach((row,dy)=>{
    row.forEach((val,dx)=>{
      if(val){
        let r = current.y+dy;
        let c = current.x+dx;
        if(r>=0) cells[r][c] = current.color;
      }
    });
  });
}

function rotate(shape){
  // Simple square matrix rotation (90 degrees clockwise)
  const N = shape.length;
  let ret = Array.from({length:N},()=>Array(N).fill(0));
  for(let y=0;y<N;y++){
    for(let x=0;x<N;x++){
      ret[x][N-1-y] = shape[y][x];
    }
  }
  return ret;
}

function removeFullRows(){
  let linesCleared = 0;
  for(let y=ROWS-1;y>=0;y--){
    if(cells[y].every(c=>c)){
      cells.splice(y,1); // Remove the full row
      cells.unshift(Array(COLS).fill(0)); // Add a new empty row at the top
      score += 10;
      linesCleared++;
      y++; // Re-check the current row index, as all rows have shifted down
    }
  }
  
  // Update level based on score/lines
  if(linesCleared > 0){
    level = Math.floor(score/100) + 1; // Increase level every 10 lines (100 score)
    dropInterval = 1000 / level; // Increase speed
    scoreEl.textContent = score;
    levelEl.textContent = level;
  }
}

// --- Game Loop and Dropping ---

function drop(){
  if(isGameOver) return;
  
  if(canMove(0,1,current.shape)){
    current.y++;
  }else{
    // Lock the piece
    merge();
    removeFullRows();
    
    // Spawn new piece
    current = randomTetromino();
    
    // Check for Game Over condition
    if(!canMove(0,0,current.shape)){
      isGameOver = true;
      showGameOver(); // Show the modal instead of alert()
      return;
    }
  }
  draw();
}

// Main game loop using requestAnimationFrame
function update(time = 0) {
    if (isGameOver) return;
    
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    // The drop interval decreases as the level increases
    if (dropCounter > dropInterval / level) {
        drop();
        dropCounter = 0;
    }

    // This ensures smooth animation and consistent timing
    dropTimer = requestAnimationFrame(update);
}

// --- Movement and Rotation Handlers ---

function move(dx){
  if(isGameOver) return;
  if(canMove(dx,0,current.shape)) current.x += dx;
  draw();
}

function rotateCurrent(){
  if(isGameOver) return;
  const originalShape = current.shape;
  const rotated = rotate(originalShape);
  
  // Basic wall kick check (if rotation causes collision, try to nudge it)
  if(!canMove(0,0,rotated)) {
    if(canMove(1,0,rotated)) current.x += 1;
    else if(canMove(-1,0,rotated)) current.x -= 1;
    else return; // If it still can't move, don't rotate
  }
  
  current.shape = rotated;
  draw();
}

// --- Game Over / Restart ---

function showGameOver() {
  cancelAnimationFrame(dropTimer); // Stop the game loop
  finalScoreEl.textContent = score;
  modal.classList.remove('hidden');
}

function resetGame() {
  // Reset all game state
  isGameOver = false;
  score = 0;
  level = 1;
  cells = Array.from({length:ROWS},()=>Array(COLS).fill(0));

  // Reset UI
  scoreEl.textContent = score;
  levelEl.textContent = level;
  modal.classList.add('hidden');
  
  // Start the game loop again
  current = randomTetromino();
  draw();
  update();
}

// --- Event Listeners ---

document.addEventListener('keydown',e=>{
  if(isGameOver) return;
  if(e.code==='ArrowLeft') move(-1);
  else if(e.code==='ArrowRight') move(1);
  else if(e.code==='ArrowUp') rotateCurrent();
  else if(e.code==='ArrowDown') {
      drop(); // Fast drop (only drops one step per keypress)
      dropCounter = 0; // Reset counter for immediate drop
  }
});

restartButton.addEventListener('click', resetGame);

// Start the game initially
draw();
update();