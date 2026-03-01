const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'sold'],
      default: 'pending',
      index: true,
    },
    offeredPrice: {
      type: Number,
      min: 0,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound indexes for common queries
inquirySchema.index({ buyer: 1, createdAt: -1 });
inquirySchema.index({ seller: 1, createdAt: -1 });
inquirySchema.index({ seller: 1, status: 1 });
inquirySchema.index({ buyer: 1, book: 1, status: 1 }); // For duplicate prevention

module.exports = mongoose.model('Inquiry', inquirySchema);
