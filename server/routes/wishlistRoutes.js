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

router.get('/', authMiddleware, getWishlist);
router.post('/add/:bookId', authMiddleware, addToWishlist);
router.delete('/remove/:bookId', authMiddleware, removeFromWishlist);
router.get('/check/:bookId', authMiddleware, isInWishlist);
router.delete('/clear', authMiddleware, clearWishlist);

module.exports = router;
