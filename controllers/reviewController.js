const Review = require("../models/Review");

// 1. Kirim Laporan (POST)
exports.addReview = async (req, res) => {
  try {
    const { movieId, rating, text, username } = req.body;
    const newReview = new Review({
      userId: req.user.id, // 🚨 ID dari token harus masuk ke sini!
      username,
      movieId,
      rating,
      text
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengirim laporan." });
  }
};

// 2. Ambil Laporan per Film (GET)
exports.getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil feed." });
  }
};

// 3. Hapus Laporan (DELETE)
exports.deleteReview = async (req, res) => {
  try {
    await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ message: "Laporan dimusnahkan." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus." });
  }
};

// Update Laporan (PUT /api/reviews/:id)
exports.updateReview = async (req, res) => {
  try {
    const { text, rating } = req.body;
    
    // Pastikan hanya pemilik ulasan yang bisa mengedit
    const updatedReview = await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { text, rating },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Laporan tidak ditemukan atau Anda tidak memiliki akses." });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui laporan." });
  }
};