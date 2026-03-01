const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist
} = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

// Get user's wishlist
router.get('/', authMiddleware, getWishlist);

// Add to wishlist
router.post('/add/:bookId', authMiddleware, addToWishlist);

// Remove from wishlist
router.delete('/remove/:bookId', authMiddleware, removeFromWishlist);

// Check if book in wishlist
router.get('/check/:bookId', authMiddleware, isInWishlist);

// Clear entire wishlist
router.delete('/clear', authMiddleware, clearWishlist);

module.exports = router;
