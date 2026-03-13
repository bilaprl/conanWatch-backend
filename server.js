require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const watchlistRoutes = require("./routes/watchlistRoutes");

const app = express();
app.use(
  cors({
    origin: "https://conan-watch-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// server.js
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ DATABASE CONNECTED");
    console.log("Target DB:", mongoose.connection.name); // Ini akan kasih tahu nama databasenya
  })
  .catch((err) => console.error("❌ DB CONNECTION ERROR:", err));
// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/watchlist", watchlistRoutes);
const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`[SERVER] Markas aktif di port ${PORT}`);
});
