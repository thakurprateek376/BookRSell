const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getBuyerInquiries,
  getSellerInquiries,
  updateInquiryStatus,
  markAsRead,
  deleteInquiry
} = require('../controllers/inquiryController');
const authMiddleware = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

router.post(
  '/create/:bookId',
  authMiddleware,
  [
    body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message required and max 500 chars'),
    body('offeredPrice').isFloat({ min: 0 }).withMessage('Valid price required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createInquiry
);

router.get('/buyer', authMiddleware, getBuyerInquiries);

router.get('/seller', authMiddleware, getSellerInquiries);

router.put(
  '/status/:id',
  authMiddleware,
  [
    body('status').isIn(['pending', 'accepted', 'rejected', 'sold']).withMessage('Invalid status'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  updateInquiryStatus
);

router.put('/read/:id', authMiddleware, markAsRead);

router.delete('/delete/:id', authMiddleware, deleteInquiry);

module.exports = router;
