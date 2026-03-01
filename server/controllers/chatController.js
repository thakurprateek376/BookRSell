const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Inquiry = require('../models/Inquiry');

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({
      $or: [{ buyer: userId }, { seller: userId }],
      status: 'active',
    })
      .populate('book', 'title price image')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get or create conversation
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { bookId, inquiryId } = req.body;
    const buyerId = req.userId;

    // Get the inquiry to find seller
    const inquiry = await Inquiry.findById(inquiryId).populate('seller');
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    const sellerId = inquiry.seller._id;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      book: bookId,
      buyer: buyerId,
      seller: sellerId,
    });

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        book: bookId,
        buyer: buyerId,
        seller: sellerId,
        inquiry: inquiryId,
        lastMessage: `Chat started for "${inquiry.bookTitle}"`,
      });
      await conversation.save();
    }

    await conversation.populate('book', 'title price image');
    await conversation.populate('buyer', 'name email phone');
    await conversation.populate('seller', 'name email phone');

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || (conversation.buyer.toString() !== userId && conversation.seller.toString() !== userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: userId }, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    const senderId = req.userId;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || (conversation.buyer.toString() !== senderId && conversation.seller.toString() !== senderId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create message
    const newMessage = new Message({
      conversation: conversationId,
      sender: senderId,
      message: message.trim(),
    });

    await newMessage.save();
    await newMessage.populate('sender', 'name email');

    // Update conversation's last message
    conversation.lastMessage = message;
    conversation.updatedAt = new Date();
    await conversation.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;

    const unreadCount = await Message.countDocuments({
      isRead: false,
      conversation: {
        $in: await Conversation.find({
          $or: [{ buyer: userId }, { seller: userId }],
        }).distinct('_id'),
      },
      sender: { $ne: userId },
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Close conversation
exports.closeConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || (conversation.buyer.toString() !== userId && conversation.seller.toString() !== userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    conversation.status = 'closed';
    await conversation.save();

    res.json({ message: 'Conversation closed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete conversation
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || (conversation.buyer.toString() !== userId && conversation.seller.toString() !== userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversation: conversationId });
    
    // Delete the conversation
    await Conversation.findByIdAndDelete(conversationId);

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
