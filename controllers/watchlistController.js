const Watchlist = require("../models/Watchlist"); // 🚨 PASTIKAN PATH INI BENAR

exports.addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;

    // Log untuk memastikan data sampai di controller
    console.log("Agen yang menambah:", req.user.id);
    console.log("Film yang ditambah:", movieId);

    // 1. Validasi: Jangan sampai simpan film yang sama dua kali
    const duplicate = await Watchlist.findOne({ userId: req.user.id, movieId: movieId });
    if (duplicate) {
      return res.status(400).json({ message: "Kasus ini sudah ada di daftar investigasi Anda." });
    }

    // 2. Buat data baru
    const newItem = new Watchlist({
      userId: req.user.id, // Berasal dari verifyToken
      movieId: movieId,
      status: 'pending'   // Status awal
    });

    await newItem.save();
    console.log("✅ Berkas berhasil diarsipkan!");
    
    res.status(201).json({ message: "Berhasil menambahkan ke watchlist!" });
  } catch (error) {
    console.error("🚨 CRASH DI WATCHLIST CONTROLLER:", error.message);
    res.status(500).json({ message: "Server error saat menyimpan berkas.", error: error.message });
  }
};

// 1. Ambil data (GET /)
exports.getWatchlist = async (req, res) => {
  try {
    // Mencari watchlist berdasarkan ID user yang ada di token JWT
    const list = await Watchlist.find({ userId: req.user.id });
    res.status(200).json(list);
  } catch (error) {
    console.error("Error Get Watchlist:", error);
    res.status(500).json({ message: "Gagal mengambil data investigasi." });
  }
};

// 2. Tambah data (POST /add)
exports.addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body; 

    const existing = await Watchlist.findOne({ userId: req.user.id, movieId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Kasus ini sudah masuk daftar investigasi!" });
    }

    const newItem = new Watchlist({
      userId: req.user.id,
      movieId: movieId,
      status: "pending", 
    });

    await newItem.save();
    res.status(201).json({ message: "Berhasil menambahkan berkas kasus!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menyimpan berkas.", error: error.message });
  }
};

// 3. Hapus data (DELETE /:id)
exports.removeFromWatchlist = async (req, res) => {
  try {
    const deletedItem = await Watchlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // Pastikan hanya pemilik yang bisa hapus
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Berkas tidak ditemukan." });
    }

    res.status(200).json({ message: "Berkas kasus dimusnahkan!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus berkas." });
  }
};

// Update status kasus (PUT /api/watchlist/:id)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedItem = await Watchlist.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // Pastikan hanya pemilik yang bisa update
      { status: status },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Berkas kasus tidak ditemukan." });
    }

    res.status(200).json({ message: "Status kasus diperbarui!", data: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui status.", error: error.message });
  }
};
