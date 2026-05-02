const mongoose = require('mongoose');

/**
 * Transaction Schema - records every buy/sell action
 */
const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['buy', 'sell'],
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    assetType: {
      type: String,
      enum: ['stock', 'crypto'],
      default: 'stock',
    },
    quantity: {
      type: Number,
      required: true,
      min: [0.0001, 'Quantity must be positive'],
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    // Balance before and after transaction
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    // For sell transactions - profit/loss calculation
    profitLoss: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['completed', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
