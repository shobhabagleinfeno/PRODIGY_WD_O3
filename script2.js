const board = document.getElementById('board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');
let currentPlayer = 'X';
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];

// AI player (O)
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Initialize the game
function initGame() {
    gameActive = true;
    boardState.fill('');
    board.innerHTML = '';
    message.textContent = '';
    currentPlayer = 'X';
    createBoard();
}

// Create board cells
function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
}

// Handle cell clicks
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = clickedCell.getAttribute('data-index');

    if (boardState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex, currentPlayer);
    checkResult();
}

// Update the clicked cell
function updateCell(cell, index, player) {
    boardState[index] = player;
    cell.textContent = player;
}

// Check for game result
function checkResult() {
    let roundWon = false;

    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardState[a] === '' || boardState[b] === '' || boardState[c] === '') {
            continue;
        }
        if (boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.textContent = `Player ${currentPlayer} wins! 🎉`;
        createPartyBurst();
        gameActive = false;
        return;
    }

    if (!boardState.includes('')) {
        message.textContent = `It's a draw!`;
        gameActive = false;
        return;
    }

    // Switch to AI turn
    currentPlayer = 'O';
    setTimeout(aiTurn, 500);
}

// AI turn
function aiTurn() {
    let availableIndices = boardState.map((value, index) => value === '' ? index : null).filter(v => v !== null);
    if (availableIndices.length === 0) return;

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    updateCell(board.children[randomIndex], randomIndex, currentPlayer);
    boardState[randomIndex] = currentPlayer;
    checkResult();
    currentPlayer = 'X';
}

// Create party burst effect
function createPartyBurst() {
    const burstCount = 20; // Number of burst elements
    for (let i = 0; i < burstCount; i++) {
        const burst = document.createElement('div');
        burst.classList.add('burst');
        burst.style.width = `${Math.random() * 50 + 10}px`;
        burst.style.height = burst.style.width;
        burst.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
        burst.style.top = `${Math.random() * (window.innerHeight - 50)}px`;
        document.body.appendChild(burst);
        
        // Remove burst after animation
        burst.addEventListener('animationend', () => {
            burst.remove();
        });
    }
}

// Restart the game
restartBtn.addEventListener('click', initGame);
initGame();
