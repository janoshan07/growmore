const mongoose = require('mongoose');

/**
 * Portfolio Schema - tracks assets owned by user
 */
const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Array of owned assets
    holdings: [
      {
        symbol: {
          type: String,
          required: true,
          uppercase: true,
        },
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['stock', 'crypto'],
          default: 'stock',
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        avgBuyPrice: {
          type: Number,
          required: true,
        },
        totalInvested: {
          type: Number,
          required: true,
        },
      },
    ],
    // Total portfolio value at last update
    totalValue: {
      type: Number,
      default: 0,
    },
    totalInvested: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
