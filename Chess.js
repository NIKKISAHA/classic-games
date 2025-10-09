
// Chess.js (Final Code with All Standard Piece Movement)

const chessboard = document.getElementById('chessboard');
const messageDisplay = document.getElementById('message');
const resetButton = document.getElementById('reset-button');

// Unicode Emojis for Chess Pieces
const PIECES = {
    wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
    bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟'
};

// Initial board setup
const INITIAL_BOARD = [
    'br', 'bb', 'bn', 'bq', 'bk', 'bn', 'bb', 'br',
    'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp',
    'wr', 'wb', 'wn', 'wq', 'wk', 'wn', 'wb', 'wr' 
];

let boardState = [...INITIAL_BOARD];
let selectedTile = null;
let turn = 'w'; 
let isGameOver = false; 

// --- COORDINATE UTILITIES ---

const toCoord = (index) => ({
    row: Math.floor(index / 8),
    col: index % 8
});

const toIndex = (row, col) => row * 8 + col;

// --- LEGAL MOVE LOGIC ---

// Helper function for sliding pieces (Rook, Bishop, Queen)
function checkSlidingMoves(fromRow, fromCol, directions, color, opponentColor) {
    const moves = [];

    directions.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
            const newRow = fromRow + dr * i;
            const newCol = fromCol + dc * i;
            
            // Check if move is off the board
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break; 

            const newIndex = toIndex(newRow, newCol);
            const targetPiece = boardState[newIndex];

            if (!targetPiece) {
                moves.push(newIndex); // Empty square
            } else if (targetPiece.startsWith(opponentColor)) {
                moves.push(newIndex); // Capture
                break; // Stop after capture
            } else {
                break; // Blocked by own piece
            }
        }
    });
    return moves;
}


function getLegalMoves(pieceKey, fromIndex) {
    const moves = [];
    if (!pieceKey) return moves; 

    const { row: fromRow, col: fromCol } = toCoord(fromIndex);
    const pieceType = pieceKey.substring(1); 
    const color = pieceKey.charAt(0);
    const opponentColor = (color === 'w' ? 'b' : 'w');

    // --- SLIDING PIECES (Rook, Bishop, Queen) ---
    
    // Rook/Horizontal/Vertical Directions
    const straightDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    // Bishop/Diagonal Directions
    const diagonalDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    // ROOK (R)
    if (pieceType === 'r') {
        moves.push(...checkSlidingMoves(fromRow, fromCol, straightDirections, color, opponentColor));
    }

    // BISHOP (ELEPHANT, B)
    if (pieceType === 'b') {
        moves.push(...checkSlidingMoves(fromRow, fromCol, diagonalDirections, color, opponentColor));
    }
    
    // QUEEN (Q)
    if (pieceType === 'q') {
        // Queen is a combination of Rook and Bishop movement
        const allDirections = [...straightDirections, ...diagonalDirections];
        moves.push(...checkSlidingMoves(fromRow, fromCol, allDirections, color, opponentColor));
    }

    // --- JUMPING/STEPPING PIECES ---

    // PAWN (P) Logic (Pawn logic is unique and remains the same)
    if (pieceType === 'p') {
        const direction = (color === 'w' ? -1 : 1);
        const newRow1 = fromRow + direction;
        const newIndex1 = toIndex(newRow1, fromCol);
        if (newRow1 >= 0 && newRow1 < 8 && !boardState[newIndex1]) {
            moves.push(newIndex1);
            const isStartingRow = (color === 'w' && fromRow === 6) || (color === 'b' && fromRow === 1);
            if (isStartingRow) {
                const newRow2 = fromRow + 2 * direction;
                const newIndex2 = toIndex(newRow2, fromCol);
                if (!boardState[newIndex2]) moves.push(newIndex2);
            }
        }
        [-1, 1].forEach(colOffset => {
            const newRow = fromRow + direction;
            const newCol = fromCol + colOffset;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const captureIndex = toIndex(newRow, newCol);
                const targetPiece = boardState[captureIndex];
                if (targetPiece && targetPiece.startsWith(opponentColor)) moves.push(captureIndex);
            }
        });
    }

    // KNIGHT (N) Logic (Knight logic is unique and remains the same)
    if (pieceType === 'n') {
        const knightMoves = [
            { dr: -2, dc: -1 }, { dr: -2, dc: 1 }, { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
            { dr: 1, dc: -2 }, { dr: 1, dc: 2 }, { dr: 2, dc: -1 }, { dr: 2, dc: 1 }
        ];
        knightMoves.forEach(({ dr, dc }) => {
            const newRow = fromRow + dr;
            const newCol = fromCol + dc;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const newIndex = toIndex(newRow, newCol);
                const targetPiece = boardState[newIndex];
                if (!targetPiece || targetPiece.startsWith(opponentColor)) moves.push(newIndex);
            }
        });
    }
    
    // KING (K) Logic (Moves one step in any direction)
    if (pieceType === 'k') {
        // All 8 possible single-step directions
        const kingMoves = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1]
        ];
        
        kingMoves.forEach(([dr, dc]) => {
            const newRow = fromRow + dr;
            const newCol = fromCol + dc;
            
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const newIndex = toIndex(newRow, newCol);
                const targetPiece = boardState[newIndex];
                
                // King can move to an empty square OR capture an opponent's piece
                if (!targetPiece || targetPiece.startsWith(opponentColor)) {
                    // NOTE: This basic implementation skips the check/checkmate safety rule
                    moves.push(newIndex);
                }
            }
        });
    }

    return moves;
}

// --- CORE FUNCTIONS (Unchanged) ---

function createBoard() {
    chessboard.innerHTML = ''; 
    for (let i = 0; i < 64; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        
        const isDark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
        tile.classList.add(isDark ? 'dark' : 'light');

        tile.setAttribute('data-index', i);
        tile.addEventListener('click', handleTileClick);
        
        chessboard.appendChild(tile);
    }
    placePieces();
}

function placePieces() {
    const tiles = chessboard.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
        const pieceKey = boardState[index];
        tile.innerHTML = ''; 
        
        if (pieceKey) {
            const piece = document.createElement('span');
            piece.classList.add('piece');
            piece.classList.add(pieceKey.startsWith('w') ? 'white-piece' : 'black-piece');
            piece.textContent = PIECES[pieceKey];
            tile.appendChild(piece);
        }
    });
}

function checkForGameOver() {
    const whiteKingExists = boardState.includes('wk');
    const blackKingExists = boardState.includes('bk');

    if (!whiteKingExists) {
        messageDisplay.textContent = 'Game Over! Black wins by King capture! 👑';
        isGameOver = true;
    } else if (!blackKingExists) {
        messageDisplay.textContent = 'Game Over! White wins by King capture! 👑';
        isGameOver = true;
    }
}

function handleTileClick(event) {
    if (isGameOver) {
        return; 
    }

    const tile = event.currentTarget;
    const index = parseInt(tile.getAttribute('data-index'));
    const pieceKey = boardState[index];

    // 1. If a piece is already selected...
    if (selectedTile) {
        const fromIndex = parseInt(selectedTile.getAttribute('data-index'));
        const fromPieceKey = boardState[fromIndex];
        const toIndex = index;

        // Deselect logic
        if (fromIndex === toIndex) {
            selectedTile.classList.remove('selected');
            selectedTile = null;
            return;
        }
        
        const isTargetOwnPiece = pieceKey && pieceKey.startsWith(turn);

        // Switch selection logic
        if (isTargetOwnPiece) {
            selectedTile.classList.remove('selected');
            selectedTile = tile;
            selectedTile.classList.add('selected');
            return;
        }

        // --- CHECK LEGAL MOVE ---
        const legalMoves = getLegalMoves(fromPieceKey, fromIndex);
        
        if (legalMoves.includes(toIndex)) {
            // EXECUTE THE MOVE
            boardState[toIndex] = boardState[fromIndex];
            boardState[fromIndex] = ''; 

            placePieces();
            selectedTile.classList.remove('selected');
            selectedTile = null;
            switchTurn();
            
            checkForGameOver(); 
            return;
        } else {
             // Illegal Move
            selectedTile.classList.remove('selected');
            selectedTile = null;
            messageDisplay.textContent = 'Illegal move! Try again.';
            return;
        }
    }

    // 2. No piece selected, try to SELECT a piece.
    if (pieceKey && pieceKey.startsWith(turn)) {
        selectedTile = tile;
        selectedTile.classList.add('selected');
        messageDisplay.textContent = (turn === 'w') ? 'White to move.' : 'Black to move.';
    }
}

function switchTurn() {
    turn = (turn === 'w') ? 'b' : 'w';
    messageDisplay.textContent = (turn === 'w') ? 'White to move.' : 'Black to move.';
}

function resetGame() {
    boardState = [...INITIAL_BOARD];
    turn = 'w';
    selectedTile = null;
    isGameOver = false; 
    createBoard();
    messageDisplay.textContent = 'White to move.'; 
}

// --- EVENT LISTENERS AND INITIALIZATION ---

resetButton.addEventListener('click', resetGame);

// Initial Board Setup
createBoard();