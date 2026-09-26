const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const gameRoutes = require("./routes/gameRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tic-tac-toe-arena";

app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Game API routes
app.use("/api/games", gameRoutes);

// Test API
app.get("/api/test", (req, res) => {
  res.json({
    message: "Tic-Tac-Toe Arena server is working!"
  });
});

// MongoDB connection
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    console.error("Set MONGODB_URI in a .env file for a hosted MongoDB connection.");
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});