const User = require('../models/User');

// Get user profile (protected route)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile (protected route)
exports.updateProfile = async (req, res) => {
  try {
    const { name, city, phone } = req.body;
    const userId = req.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, city, phone },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seller info
exports.getSellerInfo = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json({
      success: true,
      seller: {
        id: seller._id,
        name: seller.name,
        city: seller.city,
        phone: seller.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
