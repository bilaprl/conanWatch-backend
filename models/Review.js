const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true }, // Simpan username agar tidak perlu join table terus
    movieId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
