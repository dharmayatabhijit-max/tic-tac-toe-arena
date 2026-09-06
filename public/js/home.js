const startGameBtn = document.getElementById("startGameBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");

startGameBtn.addEventListener("click", () => {

    const playerX = document.getElementById("playerX").value.trim();
    const playerO = document.getElementById("playerO").value.trim();

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

    window.location.href = "game.html";
});

leaderboardBtn.addEventListener("click", () => {
    window.location.href = "leaderboard.html";
});