const express = require("express");
const router = express.Router();
const watchlistController = require("../controllers/watchlistController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, watchlistController.getWatchlist);
router.post("/add", verifyToken, watchlistController.addToWatchlist);
router.delete("/:id", verifyToken, watchlistController.removeFromWatchlist);
router.put("/:id", verifyToken, watchlistController.updateStatus);

module.exports = router;
