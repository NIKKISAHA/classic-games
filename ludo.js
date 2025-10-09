/* Working Ludo prototype
   - Circular 52-track positions
   - Per-player home path (6 steps)
   - Roll dice -> highlights movable tokens -> click token to move
   - Capture opponents (send back to base) unless landing on a safe cell (start squares)
   - Extra turn on 6
   - Win when all 4 tokens finish
*/

const TRACK_LENGTH = 52;
const HOME_LENGTH = 6; // per-player home path count (last index is finish)
const PLAYERS = [
  { id: "red", name: "Red", start: 29, pathStart: 27 },
  { id: "green", name: "Green", start: 43, pathStart: 41},
  { id: "yellow", name: "Yellow", start: 1, pathStart: 51 },
  { id: "blue", name: "Blue", start: 15, pathStart: 13 }
];
const SAFE_GLOBAL_INDICES = PLAYERS.map(p => p.start); // starts are safe in this game

// DOM refs
const board = document.getElementById("board");
const rollBtn = document.getElementById("rollBtn");
const diceEl = document.getElementById("dice");
const diceValueEl = document.getElementById("diceValue");
const currentPlayerEl = document.getElementById("currentPlayer");
const msgEl = document.getElementById("msg");

// state
let mainCells = [];        // {el, x, y, globalIndex}
let playerHomeCells = {};  // playerId -> [el,...] (length HOME_LENGTH)
let tokens = {};           // playerId -> [tokenData,...] (length 4)
let currentDice = null;
let rolled = false;
let currentPlayerIndex = 0;

const BOARD_SIZE = 640;
const CELL_SIZE = 40;
const TOKEN_SIZE = 28;

// game coords mapping (pre-calculated based on a 15x15 grid layout)
const mainTrackCoords = [
  { row: 6, col: 1 }, { row: 6, col: 2 }, { row: 6, col: 3 }, { row: 6, col: 4 }, { row: 6, col: 5 }, { row: 5, col: 6 },
  { row: 4, col: 6 }, { row: 3, col: 6 }, { row: 2, col: 6 }, { row: 1, col: 6 }, { row: 0, col: 6 }, { row: 0, col: 7 },
  { row: 0, col: 8 }, { row: 1, col: 8 }, { row: 2, col: 8 }, { row: 3, col: 8 }, { row: 4, col: 8 }, { row: 5, col: 8 },
  { row: 6, col: 8 }, { row: 6, col: 9 }, { row: 6, col: 10 }, { row: 6, col: 11 }, { row: 6, col: 12 }, { row: 6, col: 13 },
  { row: 6, col: 14 }, { row: 7, col: 14 }, { row: 8, col: 14 }, { row: 8, col: 13 }, { row: 8, col: 12 }, { row: 8, col: 11 },
  { row: 8, col: 10 }, { row: 8, col: 9 }, { row: 8, col: 8 }, { row: 9, col: 8 }, { row: 10, col: 8 }, { row: 11, col: 8 },
  { row: 12, col: 8 }, { row: 13, col: 8 }, { row: 14, col: 8 }, { row: 14, col: 7 }, { row: 14, col: 6 }, { row: 13, col: 6 },
  { row: 12, col: 6 }, { row: 11, col: 6 }, { row: 10, col: 6 }, { row: 9, col: 6 }, { row: 8, col: 6 }, { row: 8, col: 5 },
  { row: 8, col: 4 }, { row: 8, col: 3 }, { row: 8, col: 2 }, { row: 8, col: 1 }, { row: 8, col: 0 }, { row: 7, col: 0 }
];

const homePathsCoords = {
  yellow: [
    { row: 7, col: 1 }, { row: 7, col: 2 }, { row: 7, col: 3 }, { row: 7, col: 4 }, { row: 7, col: 5 }, { row: 7, col: 6 }
  ],
  blue: [
    { row: 1, col: 7 }, { row: 2, col: 7 }, { row: 3, col: 7 }, { row: 4, col: 7 }, { row: 5, col: 7 }, { row: 6, col: 7 }
  ],
  red: [
    { row: 7, col: 13 }, { row: 7, col: 12 }, { row: 7, col: 11 }, { row: 7, col: 10 }, { row: 7, col: 9 }, { row: 7, col: 8 }
  ],
  green: [
    { row: 13, col: 7 }, { row: 12, col: 7 }, { row: 11, col: 7 }, { row: 10, col: 7 }, { row: 9, col: 7 }, { row: 8, col: 7 }
  ],
};

const homeBaseCoords = {
  green: [{ row: 11, col: 2 }, { row: 11, col: 4 }, { row: 13, col: 2 }, { row: 13, col: 4 }],
  blue: [{ row: 2, col: 10 }, { row: 2, col: 12 }, { row: 4, col: 10 }, { row: 4, col: 12 }],
  red: [{ row: 11, col: 10 }, { row: 11, col: 12 }, { row: 13, col: 10 }, { row: 13, col: 12 }],
  yellow: [{ row: 2, col: 2 }, { row: 2, col: 4 }, { row: 4, col: 2 }, { row: 4, col: 4 }]
};

const centerCoords = { row: 7, col: 7 };

// generate the board
function createBoard() {
  const GRID_SIZE = 15;
  const CELL_DIM = BOARD_SIZE / GRID_SIZE;

  // Create main track cells and home paths
  for (let i = 0; i < TRACK_LENGTH; i++) {
    const coords = mainTrackCoords[i];
    const el = createCell(coords.row, coords.col, i + 1);
    el.classList.add("path");
    if (SAFE_GLOBAL_INDICES.includes(i)) el.classList.add("safe");
    mainCells.push({ el, x: el.offsetLeft, y: el.offsetTop, globalIndex: i });
  }

  // Create player home paths
  PLAYERS.forEach(player => {
    playerHomeCells[player.id] = [];
    homePathsCoords[player.id].forEach((coords, i) => {
      const el = createCell(coords.row, coords.col);
      el.classList.add("home-path", `home-${player.id}`);
      playerHomeCells[player.id].push(el);
    });
  });

  // Create home bases & tokens
  PLAYERS.forEach(player => {
    tokens[player.id] = [];
    const baseEl = document.getElementById(`base-${player.id}`);
    homeBaseCoords[player.id].forEach((coords, i) => {
      const tokenEl = createToken(player.id, i);
      tokenEl.style.left = `${(coords.col / GRID_SIZE) * BOARD_SIZE}px`;
      tokenEl.style.top = `${(coords.row / GRID_SIZE) * BOARD_SIZE}px`;
      board.appendChild(tokenEl);
      tokens[player.id].push({
        id: i,
        pos: -1, // -1 means home base
        el: tokenEl,
        finished: false
      });
    });
  });

  // Create center cell
  const center = createCell(centerCoords.row, centerCoords.col, "WIN");
  center.classList.add("center");
}

function createCell(row, col, text = "") {
  const el = document.createElement("div");
  el.classList.add("cell");
  const x = (col / 15) * BOARD_SIZE + CELL_SIZE / 9;
  const y = (row / 15) * BOARD_SIZE + CELL_SIZE / 2;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  if (text) el.innerText = text;
  board.appendChild(el);
  return el;
}

function createToken(playerId, index) {
  const el = document.createElement("div");
  el.classList.add("token", playerId);
  el.dataset.playerId = playerId;
  el.dataset.tokenId = index;
  el.addEventListener("click", handleTokenClick);
  return el;
}

// game logic
function rollDice() {
  if (rolled) return;
  const roll = Math.floor(Math.random() * 6) + 1;
  currentDice = roll;
  diceEl.innerText = roll;
  diceValueEl.innerText = roll;
  rolled = true;
  showMsg(`You rolled a ${roll}!`);
  highlightMovableTokens();
}

function highlightMovableTokens() {
  const currentPlayer = PLAYERS[currentPlayerIndex].id;
  let hasMovableToken = false;
  tokens[currentPlayer].forEach(token => {
    if (token.finished) return;

    if (token.pos === -1) {
      if (currentDice === 6) {
        token.el.classList.add("movable");
        hasMovableToken = true;
      }
    } else {
      const newPos = token.pos + currentDice;
      if (newPos < TRACK_LENGTH) {
        token.el.classList.add("movable");
        hasMovableToken = true;
      } else if (newPos >= TRACK_LENGTH && newPos <= TRACK_LENGTH + HOME_LENGTH) {
        token.el.classList.add("movable");
        hasMovableToken = true;
      }
    }
  });

  if (!hasMovableToken) {
    showMsg(`No moves possible for ${PLAYERS[currentPlayerIndex].name}.`);
    setTimeout(nextTurn, 1500);
  }
}

function handleTokenClick(event) {
  if (!rolled) return;
  const tokenEl = event.target;
  if (!tokenEl.classList.contains("movable")) return;
  
  const playerId = tokenEl.dataset.playerId;
  const tokenId = parseInt(tokenEl.dataset.tokenId);
  const token = tokens[playerId][tokenId];
  const homePath = playerHomeCells[playerId];

  let newPos;
  let targetCell;

  if (token.pos === -1) {
    newPos = PLAYERS[currentPlayerIndex].start;
    targetCell = mainCells.find(c => c.globalIndex === newPos).el;
    token.pos = newPos;
    // Special case for tokens starting on their own start cell
    if (newPos === PLAYERS[currentPlayerIndex].start) {
        const coords = mainTrackCoords[newPos];
        const x = (coords.col / 15) * BOARD_SIZE + CELL_SIZE / 2;
        const y = (coords.row / 15) * BOARD_SIZE + CELL_SIZE / 2;
        token.el.style.left = `${x}px`;
        token.el.style.top = `${y}px`;
    }
  } else {
    newPos = token.pos + currentDice;

    if (newPos >= TRACK_LENGTH) {
      // Moving into home path
      const homePathIndex = newPos - TRACK_LENGTH;
      if (homePathIndex < HOME_LENGTH) {
        targetCell = homePath[homePathIndex];
        token.pos = newPos;
      } else if (homePathIndex === HOME_LENGTH) {
        // Finished
        token.finished = true;
        token.pos = -2; // a value to indicate finished
        token.el.style.display = "none";
        checkWin(playerId);
      }
    } else {
      targetCell = mainCells.find(c => c.globalIndex === newPos).el;
      token.pos = newPos;
    }
  }

  if (targetCell) {
    const x = parseFloat(targetCell.style.left);
    const y = parseFloat(targetCell.style.top);
    token.el.style.left = `${x}px`;
    token.el.style.top = `${y}px`;
    checkCapture(token);
  }

  document.querySelectorAll(".token.movable").forEach(el => el.classList.remove("movable"));

  if (currentDice !== 6) {
    setTimeout(nextTurn, 500);
  } else {
    rolled = false;
    showMsg("You rolled a 6! Roll again.");
  }
}

function checkCapture(movedToken) {
  const targetPos = movedToken.pos;
  const targetCell = mainCells.find(c => c.globalIndex === targetPos).el;
  
  if (SAFE_GLOBAL_INDICES.includes(targetPos)) {
    return;
  }

  PLAYERS.forEach(player => {
    if (player.id !== movedToken.el.dataset.playerId) {
      tokens[player.id].forEach(opponentToken => {
        if (opponentToken.pos === targetPos) {
          showMsg(`${movedToken.el.dataset.playerId.toUpperCase()} captured a ${player.id.toUpperCase()} token!`);
          resetToken(opponentToken);
        }
      });
    }
  });
}

function resetToken(token) {
  const playerId = token.el.dataset.playerId;
  token.pos = -1;
  const homeBase = homeBaseCoords[playerId][token.id];
  const x = (homeBase.col / 15) * BOARD_SIZE + CELL_SIZE / 2;
  const y = (homeBase.row / 15) * BOARD_SIZE + CELL_SIZE / 2;
  token.el.style.left = `${x}px`;
  token.el.style.top = `${y}px`;
}

// UI updates
function showMsg(message) {
  msgEl.innerText = message;
}

function nextTurn() {
  rolled = false;
  currentDice = null;
  diceEl.innerText = "-";
  diceValueEl.innerText = "-";
  document.querySelectorAll(".token.movable").forEach(el => el.classList.remove("movable"));
  currentPlayerIndex = (currentPlayerIndex + 1) % PLAYERS.length;
  updateTurnUI();
  showMsg(`It's ${PLAYERS[currentPlayerIndex].name}'s turn. Roll the dice.`);
}

function updateTurnUI() {
  currentPlayerEl.innerText = PLAYERS[currentPlayerIndex].name;
}

function checkWin(playerId) {
  const done = tokens[playerId].filter(t => t.finished).length;
  if (done === tokens[playerId].length) {
    showMsg(`🎉 ${playerId.toUpperCase()} wins the game!`);
    rollBtn.disabled = true;
    rollBtn.innerText = "Game Over";
  }
}

rollBtn.addEventListener("click", rollDice);
document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    updateTurnUI();
    showMsg(`It's Red's turn. Roll the dice.`);
});