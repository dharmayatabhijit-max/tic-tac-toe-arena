const startGameBtn = document.getElementById("startGameBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");
const gameMode = document.getElementById("gameMode");
const turnTimer = document.getElementById("turnTimer");
const soundEnabled = document.getElementById("soundEnabled");
const boardStyle = document.getElementById("boardStyle");
const seriesMode = document.getElementById("seriesMode");
const aiDifficulty = document.getElementById("aiDifficulty");

const savedProfile = JSON.parse(localStorage.getItem("ticTacToeProfile") || "null");
playerXInput.value = savedProfile?.playerX || localStorage.getItem("playerX") || "";
playerOInput.value = savedProfile?.playerO || localStorage.getItem("playerO") || "";
gameMode.value = localStorage.getItem("gameMode") || "local";
turnTimer.value = localStorage.getItem("turnTimer") || "30";
soundEnabled.checked = localStorage.getItem("soundEnabled") !== "false";
boardStyle.value = localStorage.getItem("boardStyle") || "glass";
seriesMode.value = localStorage.getItem("seriesMode") || "bestOf3";
aiDifficulty.value = localStorage.getItem("aiDifficulty") || "normal";

function updateModeFields() {
    const aiMode = gameMode.value === "ai";
    playerOInput.disabled = aiMode;
    playerOInput.required = !aiMode;
    playerOInput.placeholder = aiMode ? "Computer opponent" : "Enter Player O name";
    aiDifficulty.disabled = !aiMode;
    if (aiMode) {
        playerOInput.value = "Nova AI";
    } else if (playerOInput.value === "Nova AI") {
        playerOInput.value = "";
    }
}

gameMode.addEventListener("change", updateModeFields);
updateModeFields();

startGameBtn.addEventListener("click", () => {

    const playerX = playerXInput.value.trim();
    const playerO = gameMode.value === "ai" ? "Nova AI" : playerOInput.value.trim();

    if (!playerX || !playerO) {
        alert("Please enter both player names.");
        return;
    }

    if (playerX.toLowerCase() === playerO.toLowerCase()) {
        alert("Players must have different names.");
        return;
    }

    localStorage.setItem("playerX", playerX);
    localStorage.setItem("playerO", playerO);
    localStorage.setItem("ticTacToeProfile", JSON.stringify({ playerX, playerO }));
    localStorage.setItem("gameMode", gameMode.value);
    localStorage.setItem("turnTimer", turnTimer.value);
    localStorage.setItem("soundEnabled", String(soundEnabled.checked));
    localStorage.setItem("boardStyle", boardStyle.value);
    localStorage.setItem("seriesMode", seriesMode.value);
    localStorage.setItem("aiDifficulty", aiDifficulty.value);

    window.location.href = "game.html";
});

leaderboardBtn.addEventListener("click", () => {
    window.location.href = "leaderboard.html";
});