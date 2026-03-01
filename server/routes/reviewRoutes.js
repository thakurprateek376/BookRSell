const express = require('express');
const router = express.Router();
const {
  createReview,
  getBookReviews,
  updateReview,
  deleteReview,
  markAsHelpful
} = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

router.post(
  '/create/:bookId',
  authMiddleware,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('comment').trim().isLength({ max: 500 }).withMessage('Comment max 500 chars'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createReview
);

router.get('/book/:bookId', getBookReviews);

router.put(
  '/update/:id',
  authMiddleware,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('comment').trim().isLength({ max: 500 }).withMessage('Comment max 500 chars'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  updateReview
);

router.delete('/delete/:id', authMiddleware, deleteReview);

router.put('/helpful/:id', authMiddleware, markAsHelpful);

module.exports = router;
