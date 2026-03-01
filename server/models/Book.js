const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide book title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please provide author name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: 0,
    },
    category: {
      type: String,
      enum: [
        'Text Books',
        'Competitive Books',
        'Kids Books',
        'Fantasy',
        'Hindi Books',
        'Used Books',
        'Popular New Books',
        'Rupa Publication',
        'Engineering',
        'Medical',
        'Science',
        'Arts',
        'Commerce',
        'Others'
      ],
      required: [true, 'Please provide category'],
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
    },
    image: {
      type: String,
      default: null,
    },
    condition: {
      type: String,
      enum: ['Like New', 'Very Good', 'Good', 'Fair'],
      default: 'Good',
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' }); // Full-text search
bookSchema.index({ seller: 1 });
bookSchema.index({ category: 1 });
bookSchema.index({ city: 1 });
bookSchema.index({ isActive: 1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ price: 1 });

module.exports = mongoose.model('Book', bookSchema);
