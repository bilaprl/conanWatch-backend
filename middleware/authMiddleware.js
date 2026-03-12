const jwt = require('jsonwebtoken');

// Fungsi untuk mengecek apakah agen punya kartu akses (Token JWT) yang sah
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Mengambil token setelah kata 'Bearer'

  if (!token) {
    return res.status(401).json({ message: "Akses Ditolak: Kamu tidak punya kartu akses!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Menyimpan data user (id & username) ke dalam request
    next(); // Lanjut ke proses berikutnya (Update Profile)
  } catch (error) {
    res.status(403).json({ message: "Akses Ditolak: Kartu akses kadaluarsa atau palsu!" });
  }
};