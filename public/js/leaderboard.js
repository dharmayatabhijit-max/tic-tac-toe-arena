const leaderboard = document.getElementById("leaderboard");
const homeBtn = document.getElementById("homeBtn");

async function loadLeaderboard() {

    try {

        const response = await fetch("/api/games");

        const games = await response.json();

        const wins = {};

        games.forEach((game) => {

            if (game.winner !== "Draw") {

                if (!wins[game.winner]) {
                    wins[game.winner] = 0;
                }

                wins[game.winner]++;
            }

        });

        const players = Object.entries(wins)
            .sort((a, b) => b[1] - a[1]);

        if (players.length === 0) {

            leaderboard.innerHTML = `
                <p>No completed games yet.</p>
            `;

            return;
        }

        leaderboard.innerHTML = "";

        players.forEach(([player, winCount], index) => {

            const row = document.createElement("div");

            row.className = "leaderboard-row";

            row.innerHTML = `
                <span class="rank">#${index + 1}</span>
                <span class="player-name">${player}</span>
                <span class="wins">${winCount} Wins</span>
            `;

            leaderboard.appendChild(row);
        });

    } catch (error) {

        console.error("Leaderboard error:", error);

        leaderboard.innerHTML = `
            <p>Unable to load leaderboard.</p>
        `;
    }
}

homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

loadLeaderboard();