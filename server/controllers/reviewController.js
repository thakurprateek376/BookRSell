const Review = require('../models/Review');
const Book = require('../models/Book');

// Create review
exports.createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const reviewerId = req.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ book: bookId, reviewer: reviewerId });
    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this book' });
    }

    const review = new Review({
      book: bookId,
      reviewer: reviewerId,
      rating,
      comment: comment || '',
    });

    await review.save();
    const populatedReview = await review.populate('reviewer');

    res.status(201).json({
      message: 'Review created successfully',
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get book reviews
exports.getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({ book: bookId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({ success: true, reviews, avgRating, totalReviews: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.reviewer.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    review.rating = rating || review.rating;
    review.comment = comment !== undefined ? comment : review.comment;
    await review.save();

    res.json({ message: 'Review updated', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.reviewer.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark as helpful
exports.markAsHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
