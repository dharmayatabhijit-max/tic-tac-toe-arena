const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  playerX: { type: String, required: true },
  playerO: { type: String, required: true },
  winner: { type: String, required: true },
  moves: { type: [String], default: [] },
  playedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Game", gameSchema);