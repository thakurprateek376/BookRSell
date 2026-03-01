const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    // The book being discussed
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    
    // The buyer
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // The seller
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Reference to the inquiry
    inquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inquiry',
    },
    
    // Last message preview (for list display)
    lastMessage: {
      type: String,
      default: '',
    },
    
    // Status: active, closed
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Index for fast queries
conversationSchema.index({ buyer: 1, seller: 1 });
conversationSchema.index({ book: 1 });
conversationSchema.index({ updatedAt: -1 });
conversationSchema.index({ status: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
