require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany();
  await Portfolio.deleteMany();
  await Transaction.deleteMany();
  console.log('🗑️  Cleared existing data');

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@growmore.com',
    password: 'Admin@1234',
    role: 'admin',
    balance: 100000,
  });

  // Create sample users
  const users = await User.insertMany([
    { name: 'John Trader', email: 'john@test.com', password: 'Test@1234', balance: 15000 },
    { name: 'Jane Investor', email: 'jane@test.com', password: 'Test@1234', balance: 8500 },
    { name: 'Demo User', email: 'demo@growmore.com', password: 'Demo@1234', balance: 10000 },
  ]);

  // Create portfolios for all users
  for (const user of [admin, ...users]) {
    await Portfolio.create({
      user: user._id,
      holdings:
        user.email === 'admin@growmore.com'
          ? []
          : [
              { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', quantity: 5, avgBuyPrice: 175.0, totalInvested: 875 },
              { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', quantity: 0.05, avgBuyPrice: 65000, totalInvested: 3250 },
            ],
    });
  }

  // Sample transactions for john
  await Transaction.insertMany([
    {
      user: users[0]._id, type: 'buy', symbol: 'AAPL', name: 'Apple Inc.',
      assetType: 'stock', quantity: 5, price: 175.0, total: 875,
      balanceBefore: 15875, balanceAfter: 15000, status: 'completed',
    },
    {
      user: users[0]._id, type: 'buy', symbol: 'BTC', name: 'Bitcoin',
      assetType: 'crypto', quantity: 0.05, price: 65000, total: 3250,
      balanceBefore: 18250, balanceAfter: 15000, status: 'completed',
    },
  ]);

  console.log('✅ Seed data created successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('  Admin  → admin@growmore.com / Admin@1234');
  console.log('  User 1 → john@test.com      / Test@1234');
  console.log('  User 2 → jane@test.com      / Test@1234');
  console.log('  Demo   → demo@growmore.com  / Demo@1234\n');

  mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seeder failed:', err);
  process.exit(1);
});
