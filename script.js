document.addEventListener('DOMContentLoaded', () => {
    let player1Symbol = 'X';
    let player2Symbol = 'O';
    let currentPlayer;
    let player1Wins = 0;
    let player2Wins = 0;
    let ties = 0;
    let gameOver = false;

    const playerChoiceSelect = document.getElementById('playerChoice');
    const player1WinsElement = document.getElementById('player1Wins');
    const player2WinsElement = document.getElementById('player2Wins');
    const tiesElement = document.getElementById('ties');

    const board = document.getElementById('board');
    const scoreboard = document.getElementById('scoreboard');

    playerChoiceSelect.addEventListener('change', () => {
        player1Symbol = playerChoiceSelect.value;
        player2Symbol = player1Symbol === 'X' ? 'O' : 'X';
    });

    document.getElementById('startBtn').addEventListener('click', startGame);

    function startGame() {
        currentPlayer = player1Symbol;
        gameOver = false;
        renderBoard();
    }

    function renderBoard() {
        board.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', () => handleCellClick(i));
            board.appendChild(cell);
        }
    }

    function handleCellClick(index) {
        if (!gameOver && isCellEmpty(index)) {
            makeMove(index, currentPlayer);
            if (checkWinner()) {
                updateScore(currentPlayer);
                displayResult(`${currentPlayer} wins!`);
                gameOver = true;
            } else if (isBoardFull()) {
                displayResult('It\'s a tie!');
                ties++;
                updateScoreboard();
                gameOver = true;
            } else {
                switchPlayer();
                if (currentPlayer === player2Symbol) {
                    makeComputerMove();
                }
            }
        }
    }

    function makeMove(index, player) {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = player;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === player1Symbol ? player2Symbol : player1Symbol;
    }

    function isCellEmpty(index) {
        const cell = document.querySelector(`[data-index="${index}"]`);
        return cell.textContent === '';
    }

    function isBoardFull() {
        const cells = document.querySelectorAll('.cell');
        return Array.from(cells).every(cell => cell.textContent !== '');
    }

    function checkWinner() {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            const cells = document.querySelectorAll('.cell');
            if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
                return true;
            }
        }

        return false;
    }

    function makeComputerMove() {
        const availableMoves = getAvailableMoves();

        let bestScore = -Infinity;
        let bestMove;

        for (const move of availableMoves) {
            makeMove(move, player2Symbol);
            const score = minimax(0, false);
            makeMove(move, ''); // Undo the move

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        setTimeout(() => handleCellClick(bestMove), 500);
    }

    function minimax(depth, isMaximizing) {
        if (checkWinner()) {
            return isMaximizing ? -1 : 1;
        }

        if (isBoardFull()) {
            return 0;
        }

        const scores = [];
        const availableMoves = getAvailableMoves();

        for (const move of availableMoves) {
            makeMove(move, isMaximizing ? player2Symbol : player1Symbol);
            scores.push(minimax(depth + 1, !isMaximizing));
            makeMove(move, ''); // Undo the move
        }

        return isMaximizing ? Math.max(...scores) : Math.min(...scores);
    }

    function getAvailableMoves() {
        const availableMoves = [];
        for (let i = 0; i < 9; i++) {
            if (isCellEmpty(i)) {
                availableMoves.push(i);
            }
        }
        return availableMoves;
    }

    function updateScore(winner) {
        if (winner === player1Symbol) {
            player1Wins++;
        } else if (winner === player2Symbol) {
            player2Wins++;
        }
        updateScoreboard();
    }

    function updateScoreboard() {
        player1WinsElement.textContent = player1Wins;
        player2WinsElement.textContent = player2Wins;
        tiesElement.textContent = ties;
    }

    function displayResult(message) {
        alert(message);
    }
});
