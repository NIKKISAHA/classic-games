const mazeSize = 15;
let currentLevel = 0;
let movesLeft = 100;
const MAX_LEVEL = 10;  

const levelDisplay = document.getElementById("level");
const movesDisplay = document.getElementById("movesLeft");
const mazeContainer = document.getElementById("maze");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalButton = document.getElementById("modal-button");
const levelOverlay = document.getElementById("level-display");
const displayLevel = document.getElementById("display-level");

let playerPos = {x:0, y:0};
let exitPos = {x: mazeSize-1, y: mazeSize-1};
let mazeData = [];
let enemies = [];

// Add this to the end of your MazeRunner.js

// Mobile buttons
document.getElementById("up").addEventListener("click", ()=>movePlayer(0,-1));
document.getElementById("down").addEventListener("click", ()=>movePlayer(0,1));
document.getElementById("left").addEventListener("click", ()=>movePlayer(-1,0));
document.getElementById("right").addEventListener("click", ()=>movePlayer(1,0));


// Maze generation same as before
function generateMaze() {
    mazeData = [];
    for(let y = 0; y < mazeSize; y++) {
        let row = [];
        for(let x = 0; x < mazeSize; x++) {
            if(Math.random() < 0.25 && !(x === 0 && y === 0) && !(x === mazeSize-1 && y === mazeSize-1)) {
                row.push(1);
            } else {
                row.push(0);
            }
        }
        mazeData.push(row);
    }
    enemies = [];
    for(let i=0; i<3; i++){
        let ex, ey;
        do {
            ex = Math.floor(Math.random()*mazeSize);
            ey = Math.floor(Math.random()*mazeSize);
        } while(mazeData[ey][ex] !== 0 || (ex === 0 && ey === 0) || (ex === mazeSize-1 && ey === mazeSize-1));
        enemies.push({x: ex, y: ey, dx: 1});
    }
}

function drawMaze() {
    mazeContainer.innerHTML = "";
    for(let y=0; y<mazeSize; y++){
        for(let x=0; x<mazeSize; x++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if(x===playerPos.x && y===playerPos.y){
                cell.classList.add("player");
            } else if(x===exitPos.x && y===exitPos.y){
                cell.classList.add("exit");
            } else if(enemies.some(e => e.x===x && e.y===y)){
                cell.classList.add("enemy");
            } else if(mazeData[y][x]===1){
                cell.classList.add("wall");
            } else {
                cell.classList.add("path");
            }
            mazeContainer.appendChild(cell);
        }
    }
}

function movePlayer(dx, dy){
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    if(newX>=0 && newX<mazeSize && newY>=0 && newY<mazeSize && mazeData[newY][newX]===0){
        playerPos.x = newX;
        playerPos.y = newY;
        movesLeft--;
        movesDisplay.textContent = movesLeft;
        checkCollision();
        checkWin();
        drawMaze();
    }
}

function moveEnemies(){
    enemies.forEach(e => {
        let newX = e.x + e.dx;
        if(newX<0 || newX>=mazeSize || mazeData[e.y][newX]===1){
            e.dx *= -1;
            newX = e.x + e.dx;
        }
        e.x = newX;
    });
    checkCollision();
    drawMaze();
}

function checkCollision(){
    if(enemies.some(e => e.x===playerPos.x && e.y===playerPos.y)){
        showModal("You Lose!", "💥 You hit an enemy!", true);
    }
    if(movesLeft<=0){
        showModal("You Lose!", "⏳ Out of moves!", true);
    }
}

function checkWin(){
    if(playerPos.x===exitPos.x && playerPos.y===exitPos.y){
        currentLevel++;
        if(currentLevel >= MAX_LEVEL){
            showModal("You Win!", "🏆 Congratulations! You finished all levels!", false);
        } else {
            showLevelOverlay(currentLevel+1);
            setTimeout(()=>startLevel(currentLevel), 1500);
        }
    }
}

function startLevel(level){
    movesLeft = 100 - level*10;
    movesDisplay.textContent = movesLeft;
    levelDisplay.textContent = level+1;
    generateMaze();
    playerPos = {x:0, y:0};
    exitPos = {x: mazeSize-1, y: mazeSize-1};
    drawMaze();
    mazeContainer.classList.remove("blur");
}

// Modal handling
function showModal(title, message, restart){
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalButton.textContent = restart ? "Restart Level" : "Restart Game";
    modal.classList.remove("hidden");
    mazeContainer.classList.add("blur");
    modalButton.onclick = ()=>{
        modal.classList.add("hidden");
        mazeContainer.classList.remove("blur");
        if(restart){
            startLevel(currentLevel);
        } else {
            currentLevel = 0;
            startLevel(currentLevel);
        }
    }
}

// Level overlay
function showLevelOverlay(level){
    displayLevel.textContent = level;
    levelOverlay.classList.remove("hidden");
    mazeContainer.classList.add("blur");
    setTimeout(()=>{
        levelOverlay.classList.add("hidden");
        mazeContainer.classList.remove("blur");
    }, 1200);
}

document.addEventListener("keydown", (e)=>{
    switch(e.key){
        case "ArrowUp": movePlayer(0,-1); break;
        case "ArrowDown": movePlayer(0,1); break;
        case "ArrowLeft": movePlayer(-1,0); break;
        case "ArrowRight": movePlayer(1,0); break;
    }
});

setInterval(moveEnemies, 800);

startLevel(currentLevel);
