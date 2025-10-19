document.addEventListener('DOMContentLoaded', () => {
    const weightsArea = document.getElementById('weights-area');
    const scaleBeam = document.getElementById('scale-beam');
    const leftPan = document.getElementById('left-pan');
    const rightPan = document.getElementById('right-pan');
    const messageEl = document.getElementById('game-message');
    const timerEl = document.getElementById('timer');
    const levelEl = document.getElementById('level-display');
    const targetEl = document.getElementById('target-display');

    const LEVELS = [
    { level: 1, target: 14, weights: [1, 2, 3, 4, 5, 7, 10] }, //left 7+5+2=14, right 10+4=14
    { level: 2, target: 18, weights: [1, 2, 4, 6, 7, 8, 9, 10, 12] }, //left 10+8=18, right 9+7+2=18
    { level: 3, target: 11, weights: [1, 3, 5, 6, 7, 9, 10] }, //left 6+5=11, right 7+4=11
    { level: 4, target: 20, weights: [2, 3, 4, 5, 6, 7, 8, 9, 10] }, //left 10+6+4=20, right 9+8+3=20
    { level: 5, target: 22, weights: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11] }, //left 11+6+5=22, right 10+9+3=22
    { level: 6, target: 25, weights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }, //11+9+5=25, right 10+8+7=25
    { level: 7, target: 30, weights: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, //Left pan: 12 + 9 + 5 + 4 = 30, right pan: 11 + 10 + 6 + 3 = 30
    { level: 8, target: 36, weights: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] }, // Left pan: 13 + 12 + 7 + 4 = 36 , Right pan: 11 + 10 + 9 + 6 = 36
    { level: 9, target: 45, weights: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] }, // Left pan: 14 + 12 + 10 + 9 = 45 , Right pan: 13 + 11 + 8 + 7 + 6 = 45
    { level: 10, target: 51, weights: [4,5,6,7,8,9,10,11,12,13,14,15] } //Left pan: 15+14+12+10 = 51 , Right pan: 13+11+9+8 = 51
];

const restartBtn = document.getElementById('restart-btn');
restartBtn.addEventListener('click', () => {
    stopTimer(); // stop any running timer
    GAME_CONFIG.currentLevel = 1; // reset to first level
    GAME_CONFIG.availableWeights = [];
    GAME_CONFIG.gameWon = false;
    initGame();
});


    const GAME_CONFIG = {
        currentLevel: 1,
        availableWeights: [],
        targetWeight: 0,
        timer: null,
        timeLimit: 20,
        gameWon: false
    };

    function initGame() {
        GAME_CONFIG.gameWon = false;
        const levelData = LEVELS[GAME_CONFIG.currentLevel - 1];
        if (!levelData) {
            levelEl.textContent = "Game Complete!";
            messageEl.textContent = "Congratulations! You balanced all scales! click restart game to play again.";
            targetEl.textContent = '';
            return;
        }

        GAME_CONFIG.availableWeights = [...levelData.weights];
        GAME_CONFIG.targetWeight = levelData.target;

        levelEl.textContent = `Level ${levelData.level}`;
        targetEl.textContent = `Target: ${GAME_CONFIG.targetWeight}kg`;
        messageEl.textContent = "Drag weights to either pan to balance the scale!";

        leftPan.innerHTML = '<h2>Left Pan</h2>';
        rightPan.innerHTML = '<h2>Right Pan</h2>';
        weightsArea.innerHTML = '';

        renderAvailableWeights();
        startTimer();
    }

    function startTimer() {
        if (GAME_CONFIG.timer) clearInterval(GAME_CONFIG.timer);
        let timeLeft = GAME_CONFIG.timeLimit;
        timerEl.textContent = `Time: ${timeLeft}s`;

        GAME_CONFIG.timer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = `Time: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(GAME_CONFIG.timer);
                if (!GAME_CONFIG.gameWon) loseGame("Time's up!");
            }
        }, 1000);
    }

    function stopTimer() {
        if (GAME_CONFIG.timer) clearInterval(GAME_CONFIG.timer);
    }

    function renderAvailableWeights() {
        weightsArea.innerHTML = '';
        GAME_CONFIG.availableWeights.forEach(value => {
            const weight = createWeightElement(value);
            weightsArea.appendChild(weight);
        });
        attachDragStartListeners(weightsArea.querySelectorAll('.weight'));
    }

    function createWeightElement(value) {
        const weight = document.createElement('div');
        weight.className = 'weight';
        weight.textContent = value + 'kg';
        weight.setAttribute('data-weight', value);
        weight.setAttribute('draggable', 'true');
        return weight;
    }

    function attachDragStartListeners(elements) {
        elements.forEach(weight => {
            weight.addEventListener('dragstart', e => {
                e.dataTransfer.setData('weight-value', e.target.getAttribute('data-weight'));
                e.dataTransfer.setData('original-parent', e.target.parentElement.id);
                e.target.classList.add('dragging');
            });
            weight.addEventListener('dragend', e => e.target.classList.remove('dragging'));
        });
    }

    [leftPan, rightPan].forEach(pan => {
        pan.addEventListener('dragover', e => e.preventDefault());
        pan.addEventListener('drop', e => {
            e.preventDefault();
            const dragged = document.querySelector('.dragging');
            const originalParent = e.dataTransfer.getData('original-parent');
            if (!dragged) return;

            const weightValue = parseInt(dragged.getAttribute('data-weight'));
            if (originalParent === 'weights-area') {
                // Move from weights area to pan
                dragged.remove();
                const newWeight = createWeightElement(weightValue);
                newWeight.classList.add('used-weight');
                attachDragStartListeners([newWeight]);
                pan.appendChild(newWeight);
                // Remove from available weights
                GAME_CONFIG.availableWeights = GAME_CONFIG.availableWeights.filter(w => w !== weightValue);
            } else {
                // Move from pan to pan
                pan.appendChild(dragged);
            }

            updateScaleBalance();
        });
    });

    function updateScaleBalance() {
        const leftTotal = calculatePanWeight(leftPan);
        const rightTotal = calculatePanWeight(rightPan);

        const difference = leftTotal - rightTotal;
        const maxAngle = 15;
        let angle = (difference / 10) * maxAngle;
        angle = Math.max(Math.min(angle, maxAngle), -maxAngle);
        scaleBeam.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

        // Win: left total == right total (weights remaining are okay)
        if (!GAME_CONFIG.gameWon && leftTotal === rightTotal) {
            winGame();
        }
    }

    function calculatePanWeight(pan) {
        let total = 0;
        pan.querySelectorAll('.weight').forEach(w => total += parseInt(w.getAttribute('data-weight')));
        return total;
    }

    function winGame() {
        stopTimer();
        GAME_CONFIG.gameWon = true;
        messageEl.textContent = "SUCCESS! Scale balanced! Loading next level...";
        document.querySelectorAll('.weight').forEach(w => w.setAttribute('draggable', 'false'));
        setTimeout(() => {
            GAME_CONFIG.currentLevel++;
            initGame();
        }, 2000);
    }

    function loseGame(msg) {
        stopTimer();
        messageEl.textContent = `GAME OVER! ${msg} Restarting Level 1...`;
        scaleBeam.style.transform = `translate(-50%, -50%) rotate(0deg)`;
        GAME_CONFIG.currentLevel = 1;
        setTimeout(initGame, 3000);
    }

    initGame();
});
