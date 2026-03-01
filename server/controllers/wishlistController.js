const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');

// Get or create wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.userId;

    let wishlist = await Wishlist.findOne({ user: userId }).populate('books');

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, books: [] });
      await wishlist.save();
    }

    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.userId;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, books: [bookId] });
    } else {
      if (!wishlist.books.includes(bookId)) {
        wishlist.books.push(bookId);
      }
    }

    await wishlist.save();
    const populatedWishlist = await wishlist.populate('books');

    res.json({ message: 'Added to wishlist', wishlist: populatedWishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.userId;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.books = wishlist.books.filter(id => id.toString() !== bookId);
    await wishlist.save();

    const populatedWishlist = await wishlist.populate('books');

    res.json({ message: 'Removed from wishlist', wishlist: populatedWishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if book in wishlist
exports.isInWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.userId;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.json({ success: true, inWishlist: false });
    }

    const inWishlist = wishlist.books.includes(bookId);

    res.json({ success: true, inWishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.userId;

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { books: [] },
      { new: true }
    );

    res.json({ message: 'Wishlist cleared', wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
