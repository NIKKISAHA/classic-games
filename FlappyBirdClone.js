const game = document.getElementById("game");
const bird = document.getElementById("bird");
const scoreDiv = document.getElementById("score");
const jumpBtn = document.getElementById("jumpButton");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");
const restartBtn = document.getElementById("restartBtn");

let birdTop = 250;
let birdVelocity = 0;
let gravity = 0.5;
let flapPower = -8;
let pipes = [];
let coins = [];
let pipeSpeed = 2;
let spawnInterval = 3000; 
let score = 0;
let coinsCollected = 0;
let coinsToWin = 5;
let gameOver = false;

// Flap function
function flap() {
    if(!gameOver) birdVelocity = flapPower;
}

// Input
document.addEventListener("keydown", (e) => {
    if(e.code === "Space") flap();
});
document.addEventListener("click", flap);
jumpBtn.addEventListener("click", flap);

// Restart
restartBtn.addEventListener("click", () => {
    location.reload();
});

// Create pipes and coins
function createPipe() {
    const gameHeight = game.offsetHeight;          // Get current game container height
    const pipeGap = gameHeight * 0.3;             // 30% of game height
    const topHeight = Math.floor(Math.random() * (gameHeight - pipeGap - 100)) + 50;
    const bottomHeight = gameHeight - topHeight - pipeGap;

    // Top pipe
    const topPipe = document.createElement("div");
    topPipe.className = "pipe";
    topPipe.style.height = `${topHeight}px`;
    topPipe.style.top = "0px";
    topPipe.style.left = `${game.offsetWidth}px`;
    game.appendChild(topPipe);

    // Bottom pipe
    const bottomPipe = document.createElement("div");
    bottomPipe.className = "pipe";
    bottomPipe.style.height = `${bottomHeight}px`;
    bottomPipe.style.bottom = "0px";
    bottomPipe.style.left = `${game.offsetWidth}px`;
    game.appendChild(bottomPipe);

    pipes.push({top: topPipe, bottom: bottomPipe, passed: false});

    // 50% chance to spawn coin in the middle
    if(Math.random() > 0.5) {
        const coin = document.createElement("div");
        coin.className = "coin";
        coin.style.left = `${game.offsetWidth}px`;
        coin.style.top = `${topHeight + pipeGap / 2 - 10}px`;
        game.appendChild(coin);
        coins.push(coin);
    }
}


// Game loop
function update() {
    if(gameOver) return;

    birdVelocity += gravity;
    birdTop += birdVelocity;
    if(birdTop < 0) birdTop = 0;
    if(birdTop > 570) loseGame();
    bird.style.top = birdTop + "px";

    pipes.forEach(pipe => {
        let left = parseInt(pipe.top.style.left);
        left -= pipeSpeed;
        pipe.top.style.left = left + "px";
        pipe.bottom.style.left = left + "px";

        if(!pipe.passed && left + 60 < 50) {
            score++;
            pipe.passed = true;
            scoreDiv.textContent = `Score: ${score} | Coins: ${coinsCollected}`;
        }

        const birdRect = bird.getBoundingClientRect();
        const topRect = pipe.top.getBoundingClientRect();
        const bottomRect = pipe.bottom.getBoundingClientRect();

        if(birdRect.left < topRect.right && birdRect.right > topRect.left &&
           (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top)) {
            loseGame();
        }
    });

    coins.forEach((coin, index) => {
        let left = parseInt(coin.style.left);
        left -= pipeSpeed;
        coin.style.left = left + "px";

        const birdRect = bird.getBoundingClientRect();
        const coinRect = coin.getBoundingClientRect();

        if(birdRect.left < coinRect.right && birdRect.right > coinRect.left &&
           birdRect.top < coinRect.bottom && birdRect.bottom > coinRect.top) {
            coinsCollected++;
            coin.remove();
            coins.splice(index, 1);
            scoreDiv.textContent = `Score: ${score} | Coins: ${coinsCollected}`;
            if(coinsCollected >= coinsToWin) winGame();
        }
    });

    pipes = pipes.filter(pipe => {
        if(parseInt(pipe.top.style.left) < -60) {
            pipe.top.remove();
            pipe.bottom.remove();
            return false;
        }
        return true;
    });

    coins = coins.filter(coin => parseInt(coin.style.left) > -20);

    requestAnimationFrame(update);
}

// Win / Lose
function winGame() {
    gameOver = true;
    popupMessage.textContent = `🎉 You Win!\nScore: ${score}, Coins: ${coinsCollected}`;
    popup.classList.remove("hidden");
}

function loseGame() {
    gameOver = true;
    popupMessage.textContent = `💀 You Lose!\nScore: ${score}, Coins: ${coinsCollected}`;
    popup.classList.remove("hidden");
}

// Spawn pipes
setInterval(() => {
    if(!gameOver) createPipe();
}, spawnInterval);

// Start loop
update();
