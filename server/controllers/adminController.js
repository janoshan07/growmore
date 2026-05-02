const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');

/**
 * @desc    Get all users (admin)
 * @route   GET /api/admin/users
 * @access  Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get platform-wide stats (admin)
 * @route   GET /api/admin/stats
 * @access  Admin
 */
const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const buyCount = await Transaction.countDocuments({ type: 'buy' });
    const sellCount = await Transaction.countDocuments({ type: 'sell' });

    const volumeResult = await Transaction.aggregate([
      { $group: { _id: null, totalVolume: { $sum: '$total' } } },
    ]);
    const totalVolume = volumeResult[0]?.totalVolume || 0;

    res.status(200).json({
      success: true,
      data: { totalUsers, totalTransactions, buyCount, sellCount, totalVolume },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user active status (admin)
 * @route   PUT /api/admin/users/:id/toggle
 * @access  Admin
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getPlatformStats, toggleUserStatus };
