const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

let upPressed = false;
let downPressed = false;
const AI_SPEED = 3;
const PLAYER_SPEED = 7;
const BALL_SPEED_START = 4;
const BALL_SPEED_MAX = 7;
const WIN_SCORE = 5;

let gameOver = false;

// Overlay & restart elements
const overlay = document.getElementById("overlay");
const gameResult = document.getElementById("game-result");
const playerScoreText = document.getElementById("player-score");
const restartBtn = document.getElementById("restart-btn");

// Player & AI
const player = { x:0, y:canvas.height/2 - paddleHeight/2, width:paddleWidth, height:paddleHeight, score:0 };
const ai = { x:canvas.width - paddleWidth, y:canvas.height/2 - paddleHeight/2, width:paddleWidth, height:paddleHeight, score:0 };
const ball = { x:canvas.width/2, y:canvas.height/2, radius:ballRadius, speed:BALL_SPEED_START, dx:BALL_SPEED_START, dy:BALL_SPEED_START };

// Mobile buttons
const upBtn = document.getElementById("up-btn");
const downBtn = document.getElementById("down-btn");

// Keyboard controls
document.addEventListener("keydown", e => {
    if(e.key === "ArrowUp") upPressed = true;
    if(e.key === "ArrowDown") downPressed = true;
});
document.addEventListener("keyup", e => {
    if(e.key === "ArrowUp") upPressed = false;
    if(e.key === "ArrowDown") downPressed = false;
});

// Mobile touch controls
function addTouchControls(btn, direction) {
    if(!btn) return;

    btn.addEventListener("touchstart", e => {
        e.preventDefault();
        if(direction==="up") upPressed = true;
        if(direction==="down") downPressed = true;
    }, {passive:false});

    btn.addEventListener("touchend", e => {
        e.preventDefault();
        if(direction==="up") upPressed = false;
        if(direction==="down") downPressed = false;
    }, {passive:false});
}

addTouchControls(upBtn,"up");
addTouchControls(downBtn,"down");

// Reset ball
function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = BALL_SPEED_START;
    ball.dx = BALL_SPEED_START * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED_START * (Math.random() > 0.5 ? 1 : -1);
}

// Restart game
function restartGame() {
    player.score = 0;
    ai.score = 0;
    resetBall();
    gameOver = false;
    if(overlay) overlay.style.display = "none";
    if(canvas) canvas.style.filter = "none";
}

// Restart button click
if(restartBtn) restartBtn.addEventListener("click", restartGame);

// Draw functions
function drawRect(x,y,w,h,color){ ctx.fillStyle=color; ctx.fillRect(x,y,w,h); }
function drawCircle(x,y,r,color){ ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2,false); ctx.closePath(); ctx.fill(); }
function drawText(text,x,y,color="#55aaff",size=32){ ctx.fillStyle=color; ctx.font=`${size}px Arial`; ctx.fillText(text,x,y); }

// Update game
function update(){
    if(gameOver) return;

    // Player movement
    if(upPressed && player.y>0) player.y -= PLAYER_SPEED;
    if(downPressed && player.y<canvas.height-player.height) player.y += PLAYER_SPEED;

    // AI movement
    const aiCenter = ai.y + ai.height/2;
    if(aiCenter < ball.y - 20) ai.y += AI_SPEED;
    if(aiCenter > ball.y + 20) ai.y -= AI_SPEED;
    ai.y = Math.max(0, Math.min(ai.y, canvas.height - ai.height));

    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) ball.dy = -ball.dy;

    // Paddle collision
    let paddle = (ball.x < canvas.width/2) ? player : ai;
    if(ball.x - ball.radius < paddle.x + paddle.width && 
       ball.x + ball.radius > paddle.x &&
       ball.y + ball.radius > paddle.y && 
       ball.y - ball.radius < paddle.y + paddle.height)
    {
        ball.dx = -ball.dx;
        ball.speed = Math.min(ball.speed + 0.5, BALL_SPEED_MAX);
        ball.dx = (ball.dx>0 ? 1 : -1) * ball.speed;
        ball.dy = (ball.dy>0 ? 1 : -1) * ball.speed;
    }

    // Score
    if(ball.x - ball.radius < 0){ ai.score++; resetBall(); }
    if(ball.x + ball.radius > canvas.width){ player.score++; resetBall(); }

    // Game over
    if(player.score >= WIN_SCORE || ai.score >= WIN_SCORE){
        gameOver = true;
        if(overlay) overlay.style.display = "flex";
        if(canvas) canvas.style.filter = "blur(4px)";
        if(gameResult) gameResult.innerText = (player.score >= WIN_SCORE ? "🎉 You Win!" : "💀 You Lose!");
        if(playerScoreText) playerScoreText.innerText = `Your Score: ${player.score}`;
    }
}

// Render
function render(){
    drawRect(0,0,canvas.width,canvas.height,"#000");
    drawRect(player.x,player.y,player.width,player.height,"#12e82eff");
    drawRect(ai.x,ai.y,ai.width,ai.height,"#bd39faff");
    drawCircle(ball.x,ball.y,ball.radius,"#fafa2bff");
    drawText(player.score,canvas.width/4,50);
    drawText(ai.score,3*canvas.width/4,50);
}

// Game loop
function gameLoop(){
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start
resetBall();
gameLoop();
