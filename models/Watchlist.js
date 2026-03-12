const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  movieId: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'solved'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);