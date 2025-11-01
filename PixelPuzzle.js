document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const shuffleButton = document.getElementById('shuffleButton');
    const puzzleContainer = document.getElementById('puzzleContainer');
    const messageDisplay = document.getElementById('message');
    const levelSelector = document.getElementById('levelSelector');
    
    // NEW: Timer & Dark Mode elements
    const timerDisplay = document.getElementById('timerDisplay');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    let imageUrl = null;
    let pieces = [];
    let dragItem = null;
    let timerInterval = null; // Stores the interval ID for the timer
    let startTime = 0; // Stores the time the puzzle was started
    let isSolved = false; // Prevents timer/win logic from running repeatedly

    // Helper function to get the current dynamic GRID_SIZE
    const getGridSize = () => parseInt(levelSelector.value); 

    // --- NEW: THEME TOGGLE LOGIC ---
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.remove('light-theme');
            // If the default body class is light-theme, removing it activates the :root default (Dark)
        } else {
            body.classList.add('light-theme');
        }
    });

    // --- NEW: TIMER LOGIC ---
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval); // Clear any existing timer
        startTime = Date.now();
        isSolved = false;
        timerInterval = setInterval(updateTimer, 1000);
        timerDisplay.textContent = 'Time: 00:00';
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function updateTimer() {
        if (!isSolved) {
            const elapsedTime = Date.now() - startTime;
            timerDisplay.textContent = `Time: ${formatTime(elapsedTime)}`;
        }
    }

    // --- 1. Image Upload and Setup ---

    // Event listener for both image upload AND level change
    imageUpload.addEventListener('change', handleFileOrLevelChange);
    levelSelector.addEventListener('change', handleFileOrLevelChange);

    function handleFileOrLevelChange(e) {
        stopTimer(); // Stop timer when changing image/level
        isSolved = false;
        timerDisplay.textContent = 'Time: 00:00';

        const file = imageUpload.files[0];
        if (!file) {
             shuffleButton.disabled = true;
             return;
        }

        imageUrl = URL.createObjectURL(file);
        shuffleButton.disabled = false;
        createPuzzle(imageUrl);
    }
    
    shuffleButton.addEventListener('click', () => {
        if (imageUrl) {
            shufflePieces(pieces);
            renderPuzzle();
            messageDisplay.textContent = `Puzzle shuffled to ${getGridSize()}x${getGridSize()}. Solve it!`;
            startTimer(); // START TIMER ON SHUFFLE
        }
    });

    /**
     * Slices the image and creates the initial set of puzzle pieces.
     * @param {string} url - The URL of the uploaded image.
     */
    function createPuzzle(url) {
        const currentGridSize = getGridSize();

        // Clear previous puzzle
        puzzleContainer.innerHTML = '';
        messageDisplay.textContent = `Image loaded. Current level: ${currentGridSize}x${currentGridSize}. Click "Shuffle & Start" to play.`;

        // Set the grid layout in CSS dynamically
        puzzleContainer.style.gridTemplateColumns = `repeat(${currentGridSize}, 1fr)`;

        // --- DYNAMIC SIZE READING (Kept for responsiveness) ---
        const PUZZLE_CONTAINER_SIZE = puzzleContainer.clientWidth; 
        const pieceSize = PUZZLE_CONTAINER_SIZE / currentGridSize;
        // ------------------------------------------------------

        pieces = [];
        for (let i = 0; i < currentGridSize * currentGridSize; i++) {
            const row = Math.floor(i / currentGridSize);
            const col = i % currentGridSize;

            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.setAttribute('data-index', i); 
            piece.style.width = `${pieceSize}px`;
            piece.style.height = `${pieceSize}px`;

            // Use background image to show only the correct portion
            piece.style.backgroundImage = `url(${url})`;
            
            // Background size must match the dynamic container size for correct slicing
            piece.style.backgroundSize = `${PUZZLE_CONTAINER_SIZE}px ${PUZZLE_CONTAINER_SIZE}px`;
            
            // Calculate background position to show the correct slice
            const bgX = -(col * pieceSize);
            const bgY = -(row * pieceSize);
            piece.style.backgroundPosition = `${bgX}px ${bgY}px`;
            
            piece.draggable = true;
            pieces.push(piece);
        }
        
        // Render the unsolved puzzle (correct order initially)
        renderPuzzle();
    }

    // ... (renderPuzzle, shufflePieces functions remain the same) ...
    function renderPuzzle() {
        puzzleContainer.innerHTML = '';
        pieces.forEach(piece => {
            puzzleContainer.appendChild(piece);
        });
        addDragListeners();
    }

    function shufflePieces(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; 
        }
    }

    // --- 2. Drag-and-Drop Logic (Unchanged) ---
    function addDragListeners() {
        document.querySelectorAll('.puzzle-piece').forEach(piece => {
            piece.addEventListener('dragstart', handleDragStart);
            piece.addEventListener('dragover', handleDragOver);
            piece.addEventListener('dragleave', handleDragLeave);
            piece.addEventListener('drop', handleDrop);
            piece.addEventListener('dragend', handleDragEnd);
        });
    }

    function handleDragStart(e) {
        dragItem = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', ''); 
    }

    function handleDragOver(e) {
        e.preventDefault(); 
        e.target.classList.add('over');
    }

    function handleDragLeave(e) {
        e.target.classList.remove('over');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('over');

        const dropItem = e.target;
        if (dragItem !== dropItem) {
            const dragIndex = pieces.indexOf(dragItem);
            const dropIndex = pieces.indexOf(dropItem);

            [pieces[dragIndex], pieces[dropIndex]] = [pieces[dropIndex], pieces[dragIndex]];

            renderPuzzle(); 
            
            checkWin();
        }
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        dragItem = null;
    }

    // --- 3. Win Condition Check (Updated) ---

    function checkWin() {
        let isSolvedNow = true;
        
        for (let i = 0; i < pieces.length; i++) {
            const currentPieceIndex = parseInt(pieces[i].getAttribute('data-index'));
            if (currentPieceIndex !== i) {
                isSolvedNow = false;
                break;
            }
        }

        if (isSolvedNow && !isSolved) { // Check if solved now and was NOT solved before
            isSolved = true;
            stopTimer(); // STOP TIMER ON WIN
            
            const finalTime = timerDisplay.textContent.replace('Time: ', '');
            messageDisplay.textContent = `🎉 CONGRATULATIONS! You solved the ${getGridSize()}x${getGridSize()} puzzle in ${finalTime}!`;
            
            // Disable dragging on all pieces
            document.querySelectorAll('.puzzle-piece').forEach(piece => {
                piece.draggable = false;
            });
        } else if (!isSolved) {
             messageDisplay.textContent = ''; // Clear status if not solved
        }
    }
});