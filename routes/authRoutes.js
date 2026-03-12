const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const jwt = require("jsonwebtoken");

// Middleware Internal (Pos Penjagaan)
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Akses ditolak!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token tidak valid!" });
  }
};

router.post("/register", authController.register);
router.post("/login", authController.login);

// Rute untuk Update Profile
router.put("/update-profile", verifyToken, authController.updateProfile);

router.delete("/delete-account", verifyToken, authController.deleteAccount);

module.exports = router;
