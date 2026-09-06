const express = require("express");
const Game = require("../models/Game");

const router = express.Router();

// Save a completed game
router.post("/", async (req, res) => {
  try {
    const game = new Game(req.body);

    const savedGame = await game.save();

    res.status(201).json({
      message: "Game saved successfully",
      game: savedGame
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving game",
      error: error.message
    });
  }
});

// Get all games
router.get("/", async (req, res) => {
  try {
    const games = await Game.find().sort({ playedAt: -1 });

    res.json(games);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching games",
      error: error.message
    });
  }
});

module.exports = router;