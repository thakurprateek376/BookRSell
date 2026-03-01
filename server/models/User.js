const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      sparse: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
      default: null,
    },
    city: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
      default: null,
      set: (value) => {
        // Convert empty strings and whitespace to null
        if (!value || (typeof value === 'string' && !value.trim())) {
          return null;
        }
        return value.trim();
      },
    },
    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    picture: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer',
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
