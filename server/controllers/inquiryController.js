const Inquiry = require('../models/Inquiry');
const Book = require('../models/Book');
const Conversation = require('../models/Conversation');

// Create inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { message, offeredPrice } = req.body;
    const { bookId } = req.params;
    const buyerId = req.userId;

    // Validate inputs
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!offeredPrice || parseFloat(offeredPrice) <= 0) {
      return res.status(400).json({ message: 'Valid offered price is required' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if buyer is trying to inquiry their own book
    if (book.seller.toString() === buyerId) {
      return res.status(400).json({ message: 'You cannot send inquiry for your own listing' });
    }

    // Check if inquiry already exists
    const existingInquiry = await Inquiry.findOne({
      book: bookId,
      buyer: buyerId,
      status: 'pending'
    });

    if (existingInquiry) {
      return res.status(400).json({ message: 'You already have a pending inquiry for this book' });
    }

    // Create inquiry
    const inquiry = new Inquiry({
      book: bookId,
      buyer: buyerId,
      seller: book.seller,
      message: message.trim(),
      offeredPrice: parseFloat(offeredPrice),
    });

    await inquiry.save();
    const populatedInquiry = await inquiry.populate(['buyer', 'seller', 'book']);

    res.status(201).json({
      message: 'Inquiry sent successfully to seller',
      success: true,
      inquiry: populatedInquiry,
    });
  } catch (error) {
    console.error('Inquiry creation error:', error);
    res.status(500).json({ message: error.message || 'Error creating inquiry' });
  }
};

// Get buyer inquiries with pagination
exports.getBuyerInquiries = async (req, res) => {
  try {
    const buyerId = req.userId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10)); // Max 20, default 10
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Inquiry.countDocuments({ buyer: buyerId });

    const inquiries = await Inquiry.find({ buyer: buyerId })
      .select('book seller message offeredPrice status isRead createdAt updatedAt')
      .populate({
        path: 'book',
        select: 'title price image seller',
      })
      .populate({
        path: 'seller',
        select: 'name email phone city',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    res.json({
      success: true,
      inquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching buyer inquiries:', error);
    res.status(500).json({ 
      message: error.message || 'Error loading inquiries. Please try again.',
      success: false 
    });
  }
};

// Get seller inquiries with pagination
exports.getSellerInquiries = async (req, res) => {
  try {
    const sellerId = req.userId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10)); // Max 20, default 10
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Inquiry.countDocuments({ seller: sellerId });

    const inquiries = await Inquiry.find({ seller: sellerId })
      .select('book buyer message offeredPrice status isRead createdAt updatedAt')
      .populate({
        path: 'book',
        select: 'title price image seller',
      })
      .populate({
        path: 'buyer',
        select: 'name email phone city',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    res.json({
      success: true,
      inquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching seller inquiries:', error);
    res.status(500).json({ 
      message: error.message || 'Error loading inquiries. Please try again.',
      success: false 
    });
  }
};

// Update inquiry status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const sellerId = req.userId;

    if (!['pending', 'accepted', 'rejected', 'sold'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    if (inquiry.seller.toString() !== sellerId) {
      return res.status(403).json({ message: 'Not authorized to update this inquiry' });
    }

    inquiry.status = status;
    await inquiry.save();

    // Create conversation when inquiry is accepted
    if (status === 'accepted') {
      const existingConversation = await Conversation.findOne({
        inquiry: inquiry._id,
      });

      if (!existingConversation) {
        const newConversation = new Conversation({
          book: inquiry.book,
          buyer: inquiry.buyer,
          seller: inquiry.seller,
          inquiry: inquiry._id,
          lastMessage: `Chat opened for: ${inquiry.message}`,
          status: 'active',
        });
        await newConversation.save();
        console.log('✅ Conversation created for inquiry:', inquiry._id);
      }
    }

    const updatedInquiry = await inquiry.populate(['buyer', 'seller', 'book']);

    res.json({ message: 'Inquiry updated', success: true, inquiry: updatedInquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark inquiry as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    ).populate(['buyer', 'seller', 'book']);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ success: true, message: 'Inquiry marked as read', inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    if (inquiry.buyer.toString() !== userId && inquiry.seller.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this inquiry' });
    }

    await Inquiry.findByIdAndDelete(id);

    res.json({ message: 'Inquiry deleted successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
