## 🚀 Live Demo

[🎮 Play Tic-Tac-Toe Arena](https://tic-tac-toe-arena-r7ab.onrender.com)
# 🎮 Tic-Tac-Toe Arena

### Where every move counts. Every game creates a new champion. 🏆

Tic-Tac-Toe Arena is a modern, interactive **2-player Tic-Tac-Toe web application** built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

Challenge a friend, take turns on the classic 3×3 board, save every completed match, and climb the dynamic leaderboard.

---

## ✨ Features

🎮 **Two-Player Gameplay**  
Play with a friend on the same device with automatic turn switching.

⚡ **Interactive 3×3 Board**  
Fast and responsive gameplay with instant win and draw detection.

🏆 **Dynamic Leaderboard**  
Player rankings are automatically calculated from completed games stored in MongoDB.

💾 **Game History**  
Completed games are stored with player names, winner, moves, and playing time.

📱 **Responsive Design**  
Works across desktop, laptop, tablet, and mobile screens.

🔄 **Restart & Replay**  
Restart the current match or return to the home screen and start a new challenge.

🌙 **Modern UI**  
Glass-style interface, gradients, animations, and a clean gaming experience.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure |
| CSS3 | Styling and responsive design |
| JavaScript | Game logic and frontend interaction |
| Node.js | Backend runtime |
| Express.js | REST API and server |
| MongoDB Atlas | Database |
| Mongoose | MongoDB object modeling |
| Git & GitHub | Version control |

---

## 🏗️ Project Architecture

```text
                 🎮 Tic-Tac-Toe Arena
                         │
              ┌──────────┴──────────┐
              │                     │
          Frontend               Backend
              │                     │
       HTML / CSS / JS       Node.js + Express
              │                     │
              └──────────┬──────────┘
                         │
                    REST API
                         │
                         ▼
                    MongoDB Atlas
                         │
                         ▼
                  Game Collection
                         │
                         ▼
                   🏆 Leaderboard

tic-tac-toe-arena/
│
├── models/
│   └── Game.js
│
├── routes/
│   └── gameRoutes.js
│
├── public/
│   ├── index.html
│   ├── game.html
│   ├── leaderboard.html
│   ├── style.css
│   │
│   └── js/
│       ├── home.js
│       ├── game.js
│       └── leaderboard.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js

The application uses MongoDB Atlas to store completed games.

Each game contains information such as:
Player X
Player O
Winner
Moves
Played At
Created At / Updated At
Abhijit → 5 Wins
Rahul   → 3 Wins
Kiran   → 1 Win

The player with the highest number of wins appears at the top.

1.Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL

2. Open the project
cd tic-tac-toe-arena

3. Install dependencies
npm install

4. Configure MongoDB
Create a .env file in the project root:
MONGODB_URI=your_mongodb_connection_string
PORT=5000
Never upload your .env file or MongoDB credentials to GitHub.

5. Start the server
node server.js
Open:
http://localhost:5000

🎯 How to Play
Enter the name of Player X.
Enter the name of Player O.
Click Start Game.

Players take turns selecting cells.
Get three matching symbols in a row to win.
If all cells are filled without a winner, the game is a draw.

The completed game is automatically stored in MongoDB.

Open Leaderboard to see the rankings.

🔌 API Endpoints
Save a Game
POST /api/games
Stores a completed game in MongoDB.
Get Games
GET /api/games
Returns completed games used by the leaderboard.
Server Test
GET /api/test
Checks whether the backend server is running.

🔐 Security
Sensitive configuration is stored using environment variables.
The following files are excluded from Git:
.env
node_modules/
MongoDB credentials should never be committed to the repository.

🌟 Why This Project?
Tic-Tac-Toe Arena demonstrates how a simple browser game can be connected to a real backend and database.
Instead of keeping everything only inside the browser, the application:
plays → records → stores → analyzes → ranks
This makes the project a practical example of full-stack web development.

🔮 Future Improvements
Some possible future upgrades:
👥 Online multiplayer
🔐 Player accounts and authentication
📊 Detailed player statistics
🥇 Tournament mode
⏱️ Game timer
🎨 Multiple themes
📜 Complete match history
☁️ Cloud deployment
📱 Progressive Web App support

👨‍💻 Developer
Abhijit Dharmayat

Built as a full-stack web development project to practice frontend development, backend APIs, database integration, and deployment.

⭐ Support
If you like the project, consider giving the repository a ⭐ on GitHub.
Tic-Tac-Toe Arena — Play. Win. Climb. Repeat. 🏆