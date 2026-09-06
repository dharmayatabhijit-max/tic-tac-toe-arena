const playerX = localStorage.getItem("playerX");
const playerO = localStorage.getItem("playerO");

if (!playerX || !playerO) {
    window.location.href = "index.html";
}

const playerXName = document.getElementById("playerXName");
const playerOName = document.getElementById("playerOName");
const turnMessage = document.getElementById("turnMessage");
const resultMessage = document.getElementById("resultMessage");

const cells = document.querySelectorAll(".cell");

const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const homeBtn = document.getElementById("homeBtn");

playerXName.textContent = playerX;
playerOName.textContent = playerO;

let board = ["", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach((cell) => {
    cell.addEventListener("click", () => {

        const index = Number(cell.dataset.index);

        if (board[index] !== "" || gameOver) {
            return;
        }

        board[index] = currentPlayer;

        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        checkGame();
    });
});

function checkGame() {

    for (const combination of winningCombinations) {

        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            gameOver = true;

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");

            const winnerName =
                currentPlayer === "X" ? playerX : playerO;

            turnMessage.textContent = "Game Over!";
            resultMessage.textContent = `${winnerName} wins! 🎉`;

            saveGame(winnerName);

            return;
        }
    }

    if (!board.includes("")) {

        gameOver = true;

        turnMessage.textContent = "Game Over!";
        resultMessage.textContent = "It's a draw! 🤝";

        saveGame("Draw");

        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    const currentName =
        currentPlayer === "X" ? playerX : playerO;

    turnMessage.textContent = `${currentName}'s turn (${currentPlayer})`;
}

async function saveGame(winner) {

    try {

        const response = await fetch("/api/games", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                playerX: playerX,
                playerO: playerO,
                winner: winner,
                moves: board
            })
        });

        const data = await response.json();

        console.log("Game saved:", data);

    } catch (error) {

        console.error("Could not save game:", error);

    }
}

function restartGame() {

    board = ["", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;

    cells.forEach((cell) => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );
    });

    resultMessage.textContent = "";

    turnMessage.textContent =
        `${playerX}'s turn (X)`;
}

restartBtn.addEventListener("click", restartGame);

playAgainBtn.addEventListener("click", restartGame);

homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});