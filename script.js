const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');

let board = Array(9).fill(null);
let gameActive = true;
let scoreX = 0, scoreO = 0;

const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

cells.forEach(cell => cell.addEventListener('click', () => {
    const idx = cell.getAttribute('data-index');
    if (!board[idx] && gameActive) {
        playerMove(idx);
    }
}));

function playerMove(idx) {
    board[idx] = 'X';
    cells[idx].textContent = 'X';
    if (!checkWin()){
        statusDisplay.textContent = "Бот думает...";
        gameActive = false;
        setTimeout(botMove, 600);
    }
}

function botMove() {
    let move = getBestMove();
    board[move] = 'O';
    cells[move].textContent = 'O';
    if (!checkWin()) {
        statusDisplay.textContent = "Твой ход!";
        gameActive = true;
    }
}

function getBestMove() {
    // 1. Попытка победить
    for (let w of winConditions) {
        let b = w.filter(i => board[i] === 'O').length;
        let n = w.filter(i => board[i] === null).length;
        if (b === 2 && n === 1) return w.find(i => board[i] === null);
    }
    // 2. Блокировка
    for (let w of winConditions) {
        let p = w.filter(i => board[i] === 'X').length;
        let n = w.filter(i => board[i] === null).length;
        if (p === 2 && n === 1) return w.find(i => board[i] === null);
    }
    // 3. Случайный
    let empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}

function checkWin() {
    for (let w of winConditions) {
        if (board[w[0]] && board[w[0]] === board[w[1]] && board[w[0]] === board[w[2]]) {
            w.forEach(i => cells[i].classList.add('winner'));
            if (board[w[0]] === 'X') { scoreX++; scoreXDisplay.textContent = scoreX; statusDisplay.textContent = "Ты победил!"; }
            else { scoreO++; scoreODisplay.textContent = scoreO; statusDisplay.textContent = "Бот победил!"; }
            gameActive = false;
            return true;
        }
    }
    if (!board.includes(null)) { statusDisplay.textContent = "Ничья!"; gameActive = false; return true; }
    return false;
}

function resetGame() {
    board.fill(null);
    cells.forEach(c => { c.textContent = ''; c.className = 'cell'; });
    gameActive = true;
    statusDisplay.textContent = "Твой ход!";
}// ... (предыдущий код)

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;

    // Добавляем класс, чтобы сработала анимация CSS
    cells[index].classList.add(player.toLowerCase());

    checkWin();
}

// Обновим вызовы в playerMove и botMove:
function playerMove(idx) {
    board[idx] = 'X';
    // Вместо прямого присвоения используем функцию makeMove
    makeMove(idx, 'X');

    if (!checkWin()) {
        statusDisplay.textContent = "Бот думает...";
        gameActive = false;
        setTimeout(botMove, 600);
    }
}

function botMove() {
    let move = getBestMove();
    board[move] = 'O';
    makeMove(move, 'O'); // Теперь анимация сработает здесь

    if (!checkWin()) {
        statusDisplay.textContent = "Твой ход!";
        gameActive = true;
    }
}

// ... (остальной код функции checkWin и resetGame)