const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.put("/update-profile", verifyToken, authController.updateProfile);

module.exports = router;