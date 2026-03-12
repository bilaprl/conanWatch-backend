const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:movieId', reviewController.getReviewsByMovie);
router.post('/add', verifyToken, reviewController.addReview);
router.delete('/:id', verifyToken, reviewController.deleteReview);
router.put('/:id', verifyToken, reviewController.updateReview);

module.exports = router;