const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // --- TAMBAHKAN CEK MANUAL (Agar tahu alasannya) ---
    console.log("Mengecek ketersediaan email/username...");
    const userExist = await User.findOne({ $or: [{ email }, { username }] });
    if (userExist) {
      console.log("❌ Gagal: Agen sudah terdaftar!");
      return res
        .status(400)
        .json({ message: "Email atau Username sudah digunakan." });
    }

    const newUser = new User({ username, email, password });
    console.log("Mencoba simpan ke MongoDB...");

    await newUser.save();

    console.log("✅ Berhasil simpan ke MongoDB!");
    res.status(201).json({ message: "Registrasi Berhasil!" });
  } catch (error) {
    console.error("🚨 DATABASE ERROR:", error.message); // Ini akan memunculkan alasan asli di terminal
    res.status(500).json({ message: "Gagal Registrasi", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // Kembali ke email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email tidak terdaftar!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // KIRIM DATA LENGKAP
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email, // 🚨 SANGAT PENTING: Kirim email juga!
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    // req.user.id ini nanti datang dari middleware verifyToken
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username: username },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Agen tidak ditemukan." });
    }

    res.status(200).json({
      message: "Profil diperbarui!",
      user: { username: updatedUser.username },
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal update database." });
  }
};

// Tambahkan di controllers/authController.js
exports.deleteAccount = async (req, res) => {
  try {
    // req.user.id didapat dari middleware verifyToken
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "Agen tidak ditemukan atau sudah dihapus." });
    }

    res.status(200).json({ message: "Identitas telah dimusnahkan selamanya." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus akun di server." });
  }
};

exports.register = async (req, res) => {
  console.log("--- Mencoba Register User Baru ---");
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email, password });
    console.log("Menjalankan newUser.save()...");

    const result = await newUser.save();

    console.log("Hasil Simpan:", result); // Jika muncul, data PASTI ada di database
    res.status(201).json({ message: "Registrasi Berhasil!" });
  } catch (error) {
    console.log("Terjadi Error di Catch:");
    console.error(error);
    res.status(500).json({ message: "Gagal Registrasi", error: error.message });
  }
};
