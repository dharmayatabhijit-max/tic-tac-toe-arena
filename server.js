const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const gameRoutes = require("./routes/gameRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});