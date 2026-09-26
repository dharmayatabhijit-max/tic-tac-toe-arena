const playerX = localStorage.getItem("playerX");
const gameMode = localStorage.getItem("gameMode") || "local";
const timerSeconds = Number(localStorage.getItem("turnTimer") || 30);
const seriesMode = localStorage.getItem("seriesMode") || "bestOf3";
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";
const aiDifficulty = localStorage.getItem("aiDifficulty") || "normal";
const playerO = gameMode === "ai" ? "Nova AI" : localStorage.getItem("playerO");

if (!playerX || !playerO) window.location.href = "index.html";

const cells = document.querySelectorAll(".cell");
const gameBoard = document.getElementById("gameBoard");
const playerXName = document.getElementById("playerXName");
const playerOName = document.getElementById("playerOName");
const turnMessage = document.getElementById("turnMessage");
const resultMessage = document.getElementById("resultMessage");
const timerDisplay = document.getElementById("timerDisplay");
const seriesScore = document.getElementById("seriesScore");
const reactionPop = document.getElementById("reactionPop");
const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const homeBtn = document.getElementById("homeBtn");
const musicToggle = document.getElementById("musicToggle");

playerXName.textContent = playerX;
playerOName.textContent = playerO;
document.body.dataset.theme = localStorage.getItem("boardStyle") || "glass";

let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let seriesOver = false;
let timeLeft = timerSeconds;
let timerId = null;
let audioContext = null;
let musicTimer = null;
let reactionTimeout = null;
let seriesScoreState = { X: 0, O: 0 };

const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function playerName(symbol) { return symbol === "X" ? playerX : playerO; }
function stopTimer() { clearInterval(timerId); timerId = null; }
function updateTimer() {
    timerDisplay.textContent = timerSeconds ? `${timeLeft}s` : "∞";
    timerDisplay.classList.toggle("urgent", timerSeconds > 0 && timeLeft <= 5);
}
function startTimer() {
    stopTimer();
    timeLeft = timerSeconds;
    updateTimer();
    if (!timerSeconds) return;
    timerId = setInterval(() => {
        timeLeft -= 1;
        updateTimer();
        if (timeLeft <= 0) handleTimeout();
    }, 1000);
}
function playSound(type) {
    if (!soundEnabled) return;
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const harmonic = audioContext.createOscillator();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    const tones = { move: [420, 0.08], win: [720, 0.22], draw: [260, 0.16], reaction: [560, 0.1] };
    const [frequency, duration] = tones[type] || tones.move;
    oscillator.frequency.value = frequency;
    harmonic.frequency.value = frequency * 2;
    oscillator.type = type === "win" ? "triangle" : "sine";
    harmonic.type = "sine";
    harmonic.detune.value = 4;
    filter.type = "lowpass";
    filter.frequency.value = 1800;
    const now = audioContext.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.11, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(filter);
    harmonic.connect(filter);
    filter.connect(gain).connect(audioContext.destination);
    oscillator.start();
    harmonic.start();
    oscillator.stop(now + duration + 0.03);
    harmonic.stop(now + duration + 0.03);
}
function startMusic() {
    if (!soundEnabled) return;
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    if (musicTimer) return;
    const notes = [196, 247, 294, 247, 220, 262, 330, 262];
    let noteIndex = 0;
    const playNote = () => {
        const oscillator = audioContext.createOscillator();
        const harmony = audioContext.createOscillator();
        const filter = audioContext.createBiquadFilter();
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;
        oscillator.frequency.value = notes[noteIndex % notes.length];
        harmony.frequency.value = oscillator.frequency.value * 1.5;
        noteIndex += 1;
        oscillator.type = "sine";
        harmony.type = "triangle";
        harmony.detune.value = -3;
        filter.type = "lowpass";
        filter.frequency.value = 1200;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
        oscillator.connect(filter);
        harmony.connect(filter);
        filter.connect(gain).connect(audioContext.destination);
        oscillator.start();
        harmony.start();
        oscillator.stop(now + 3);
        harmony.stop(now + 3);
    };
    playNote();
    musicTimer = setInterval(playNote, 4200);
}
function stopMusic() {
    clearInterval(musicTimer);
    musicTimer = null;
    if (audioContext && audioContext.state === "running") audioContext.suspend();
}
function updateMusicToggle() {
    musicToggle.textContent = soundEnabled ? "♫ Sound On" : "♫ Sound Off";
    musicToggle.setAttribute("aria-pressed", String(soundEnabled));
    musicToggle.classList.toggle("muted", !soundEnabled);
}
function renderTurn() {
    turnMessage.textContent = `${playerName(currentPlayer)}'s turn (${currentPlayer})`;
    document.querySelector(".player-x").classList.toggle("active-player", currentPlayer === "X");
    document.querySelector(".player-o").classList.toggle("active-player", currentPlayer === "O");
}
function renderSeriesScore() {
    const format = seriesMode === "bestOf3" ? "Best of 3" : "Single game";
    seriesScore.textContent = `${format}  ·  ${playerX}: ${seriesScoreState.X}  —  ${playerO}: ${seriesScoreState.O}`;
}
function makeMove(index, isComputer = false) {
    if (gameOver || board[index] || (gameMode === "ai" && currentPlayer === "O" && !isComputer)) return;
    startMusic();
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase());
    playSound("move");
    checkGame();
}
function checkGame() {
    const winningLine = winningCombinations.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
    if (winningLine) return finishRound(currentPlayer, winningLine);
    if (!board.includes("")) return finishRound("Draw");
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    renderTurn();
    startTimer();
    if (gameMode === "ai" && currentPlayer === "O") setTimeout(makeAiMove, 380);
}
function finishRound(winner, winningLine = []) {
    gameOver = true;
    stopTimer();
    winningLine.forEach((index) => cells[index].classList.add("winner"));
    if (winner === "Draw") {
        resultMessage.textContent = "It's a draw! 🤝";
        playSound("draw");
    } else {
        seriesScoreState[winner] += 1;
        resultMessage.textContent = `${playerName(winner)} wins this round! 🎉`;
        playSound("win");
    }
    const neededWins = seriesMode === "bestOf3" ? 2 : 1;
    const seriesWinner = Object.keys(seriesScoreState).find((symbol) => seriesScoreState[symbol] >= neededWins);
    seriesOver = Boolean(seriesWinner);
    turnMessage.textContent = seriesWinner ? `${playerName(seriesWinner)} wins the match!` : "Round complete";
    playAgainBtn.textContent = seriesMode === "single" || seriesWinner ? "Play Again" : "Next Round";
    renderSeriesScore();
    saveGame(winner === "Draw" ? "Draw" : playerName(winner));
}
function resetBoard() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameOver = false;
    resultMessage.textContent = "";
    playAgainBtn.textContent = seriesMode === "single" ? "Play Again" : "Next Round";
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner");
    });
    renderTurn();
    startTimer();
}
function restartMatch() {
    seriesScoreState = { X: 0, O: 0 };
    seriesOver = false;
    renderSeriesScore();
    resetBoard();
}
function handleTimeout() {
    if (gameOver) return;
    playSound("draw");
    resultMessage.textContent = `${playerName(currentPlayer)} ran out of time.`;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    renderTurn();
    startTimer();
    if (gameMode === "ai" && currentPlayer === "O") setTimeout(makeAiMove, 380);
}
function getWinner(state) {
    const line = winningCombinations.find(([a, b, c]) => state[a] && state[a] === state[b] && state[a] === state[c]);
    return line ? state[line[0]] : "";
}
function minimax(state, maximizing, depth = 0) {
    const winner = getWinner(state);
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (!state.includes("")) return 0;
    const scores = [];
    state.forEach((value, index) => {
        if (value) return;
        state[index] = maximizing ? "O" : "X";
        scores.push({ index, score: minimax(state, !maximizing, depth + 1) });
        state[index] = "";
    });
    return maximizing ? Math.max(...scores.map((item) => item.score)) : Math.min(...scores.map((item) => item.score));
}
function makeAiMove() {
    if (gameOver || currentPlayer !== "O") return;
    const moves = board.map((value, index) => value ? null : index).filter((index) => index !== null);
    let bestMove = moves[Math.floor(Math.random() * moves.length)];

    if (aiDifficulty === "easy") {
        makeMove(bestMove, true);
        return;
    }

    const winningMove = findImmediateMove("O");
    const blockingMove = findImmediateMove("X");
    if (aiDifficulty === "normal") {
        bestMove = winningMove ?? blockingMove ?? (board[4] === "" ? 4 : bestMove);
        makeMove(bestMove, true);
        return;
    }

    let bestScore = -Infinity;
    moves.forEach((index) => {
        board[index] = "O";
        const score = minimax(board, false);
        board[index] = "";
        if (score > bestScore) { bestScore = score; bestMove = index; }
    });
    makeMove(bestMove, true);
}
function findImmediateMove(symbol) {
    const move = board.findIndex((value, index) => {
        if (value) return false;
        board[index] = symbol;
        const wins = getWinner(board) === symbol;
        board[index] = "";
        return wins;
    });
    return move === -1 ? null : move;
}
async function saveGame(winner) {
    try {
        await fetch("/api/games", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ playerX, playerO, winner, moves: board, gameMode, seriesMode }) });
    } catch (error) { console.error("Could not save game:", error); }
}

gameBoard.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell");
    if (cell) makeMove(Number(cell.dataset.index));
});
document.addEventListener("pointerdown", startMusic, { once: true });
document.addEventListener("keydown", startMusic, { once: true });
document.querySelectorAll(".reaction-btn").forEach((button) => button.addEventListener("click", () => {
    startMusic();
    playSound("reaction");
    reactionPop.querySelector(".reaction-name").textContent = playerName(currentPlayer);
    reactionPop.querySelector(".reaction-emoji").textContent = button.dataset.reaction;
    reactionPop.classList.remove("show");
    requestAnimationFrame(() => reactionPop.classList.add("show"));
    clearTimeout(reactionTimeout);
    reactionTimeout = setTimeout(() => reactionPop.classList.remove("show"), 2000);
}));
restartBtn.addEventListener("click", restartMatch);
musicToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("soundEnabled", String(soundEnabled));
    if (soundEnabled) startMusic();
    else stopMusic();
    updateMusicToggle();
});
playAgainBtn.addEventListener("click", () => (seriesOver ? restartMatch() : resetBoard()));
homeBtn.addEventListener("click", () => { window.location.href = "index.html"; });
updateMusicToggle();
startMusic();
renderSeriesScore();
resetBoard();
