const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (city) filter.city = city;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    let books = await Book.find(filter)
      .populate('seller', 'name email city phone')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    books = books.map(book => ({
      ...book.toObject(),
      image: book.image ? book.image.replace(/\\/g, '/') : null
    }));

    const total = await Book.countDocuments(filter);

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      books,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id).populate(
      'seller',
      'name email city phone'
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book = book.toObject();
    if (book.image) {
      book.image = book.image.replace(/\\/g, '/');
    }

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const { title, author, price, category, description, city, condition } = req.body;
    const sellerId = req.userId;

    const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const book = new Book({
      title,
      author,
      price,
      category,
      description,
      city,
      condition,
      image,
      seller: sellerId,
    });

    await book.save();

    const populatedBook = await book.populate('seller', 'name email city phone');

    res.status(201).json({
      message: 'Book added successfully',
      book: populatedBook,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { title, author, price, category, description, city, condition, isActive } = req.body;
    const bookId = req.params.id;
    const userId = req.userId;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.seller.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.price = price || book.price;
    book.category = category || book.category;
    book.description = description || book.description;
    book.city = city || book.city;
    book.condition = condition || book.condition;
    book.isActive = isActive !== undefined ? isActive : book.isActive;

    if (req.file) {
      book.image = req.file.path.replace(/\\/g, '/');
    }

    await book.save();

    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.userId;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.seller.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await Book.findByIdAndDelete(bookId);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerBooks = async (req, res) => {
  try {
    const userId = req.userId;

    let books = await Book.find({ seller: userId }).sort({ createdAt: -1 });

    books = books.map(book => ({
      ...book.toObject(),
      image: book.image ? book.image.replace(/\\/g, '/') : null
    }));

    res.json({ success: true, books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
