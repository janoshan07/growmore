const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { getPrice } = require('../utils/marketData');

/**
 * @desc    Get user's portfolio with current values
 * @route   GET /api/portfolio
 * @access  Private
 */
const getPortfolio = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      portfolio = await Portfolio.create({ user: req.user._id, holdings: [] });
    }

    // Enrich holdings with current market prices
    let totalCurrentValue = 0;
    let totalInvested = 0;

    const enrichedHoldings = portfolio.holdings.map((holding) => {
      const marketAsset = getPrice(holding.symbol);
      const currentPrice = marketAsset ? marketAsset.price : holding.avgBuyPrice;
      const currentValue = currentPrice * holding.quantity;
      const profitLoss = currentValue - holding.totalInvested;
      const profitLossPercent = ((profitLoss / holding.totalInvested) * 100).toFixed(2);

      totalCurrentValue += currentValue;
      totalInvested += holding.totalInvested;

      return {
        symbol: holding.symbol,
        name: holding.name,
        type: holding.type,
        quantity: holding.quantity,
        avgBuyPrice: holding.avgBuyPrice,
        currentPrice,
        totalInvested: holding.totalInvested,
        currentValue: parseFloat(currentValue.toFixed(2)),
        profitLoss: parseFloat(profitLoss.toFixed(2)),
        profitLossPercent: parseFloat(profitLossPercent),
        change24h: marketAsset ? marketAsset.changePercent : 0,
      };
    });

    const user = await User.findById(req.user._id).select('balance');

    res.status(200).json({
      success: true,
      data: {
        holdings: enrichedHoldings,
        summary: {
          balance: user.balance,
          totalInvested: parseFloat(totalInvested.toFixed(2)),
          totalCurrentValue: parseFloat(totalCurrentValue.toFixed(2)),
          totalProfitLoss: parseFloat((totalCurrentValue - totalInvested).toFixed(2)),
          totalProfitLossPercent:
            totalInvested > 0
              ? parseFloat((((totalCurrentValue - totalInvested) / totalInvested) * 100).toFixed(2))
              : 0,
          netWorth: parseFloat((user.balance + totalCurrentValue).toFixed(2)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Execute a BUY trade
 * @route   POST /api/portfolio/buy
 * @access  Private
 */
const buyAsset = async (req, res, next) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Symbol and valid quantity are required' });
    }

    // Get current market price
    const marketAsset = getPrice(symbol);
    if (!marketAsset) {
      return res.status(404).json({ success: false, message: `Asset ${symbol} not found in market` });
    }

    const price = marketAsset.price;
    const total = parseFloat((price * quantity).toFixed(2));

    // Get user's current balance
    const user = await User.findById(req.user._id).select('+balance');
    if (user.balance < total) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Required: $${total.toFixed(2)}, Available: $${user.balance.toFixed(2)}`,
      });
    }

    const balanceBefore = user.balance;
    const balanceAfter = parseFloat((user.balance - total).toFixed(2));

    // Update user balance
    await User.findByIdAndUpdate(req.user._id, { balance: balanceAfter });

    // Update portfolio holdings
    let portfolio = await Portfolio.findOne({ user: req.user._id });
    const holdingIndex = portfolio.holdings.findIndex((h) => h.symbol === symbol.toUpperCase());

    if (holdingIndex >= 0) {
      // Update existing holding with new average price
      const existing = portfolio.holdings[holdingIndex];
      const newTotalInvested = existing.totalInvested + total;
      const newQuantity = existing.quantity + quantity;
      portfolio.holdings[holdingIndex].quantity = newQuantity;
      portfolio.holdings[holdingIndex].avgBuyPrice = parseFloat((newTotalInvested / newQuantity).toFixed(6));
      portfolio.holdings[holdingIndex].totalInvested = parseFloat(newTotalInvested.toFixed(2));
    } else {
      // Add new holding
      portfolio.holdings.push({
        symbol: symbol.toUpperCase(),
        name: marketAsset.name,
        type: marketAsset.type,
        quantity,
        avgBuyPrice: price,
        totalInvested: total,
      });
    }
    await portfolio.save();

    // Record transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'buy',
      symbol: symbol.toUpperCase(),
      name: marketAsset.name,
      assetType: marketAsset.type,
      quantity,
      price,
      total,
      balanceBefore,
      balanceAfter,
    });

    res.status(200).json({
      success: true,
      message: `Successfully bought ${quantity} ${symbol.toUpperCase()} at $${price.toFixed(2)}`,
      data: { transaction, newBalance: balanceAfter },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Execute a SELL trade
 * @route   POST /api/portfolio/sell
 * @access  Private
 */
const sellAsset = async (req, res, next) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Symbol and valid quantity are required' });
    }

    // Check portfolio holding
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    const holdingIndex = portfolio.holdings.findIndex((h) => h.symbol === symbol.toUpperCase());

    if (holdingIndex < 0) {
      return res.status(400).json({ success: false, message: `You don't own any ${symbol}` });
    }

    const holding = portfolio.holdings[holdingIndex];
    if (holding.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient holdings. You own ${holding.quantity} ${symbol}, tried to sell ${quantity}`,
      });
    }

    // Get current price
    const marketAsset = getPrice(symbol);
    const price = marketAsset ? marketAsset.price : holding.avgBuyPrice;
    const total = parseFloat((price * quantity).toFixed(2));
    const costBasis = parseFloat((holding.avgBuyPrice * quantity).toFixed(2));
    const profitLoss = parseFloat((total - costBasis).toFixed(2));

    // Update balance
    const user = await User.findById(req.user._id).select('+balance');
    const balanceBefore = user.balance;
    const balanceAfter = parseFloat((user.balance + total).toFixed(2));
    await User.findByIdAndUpdate(req.user._id, { balance: balanceAfter });

    // Update portfolio
    const newQuantity = holding.quantity - quantity;
    if (newQuantity <= 0) {
      portfolio.holdings.splice(holdingIndex, 1);
    } else {
      portfolio.holdings[holdingIndex].quantity = newQuantity;
      portfolio.holdings[holdingIndex].totalInvested = parseFloat(
        (holding.totalInvested - costBasis).toFixed(2)
      );
    }
    await portfolio.save();

    // Record transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'sell',
      symbol: symbol.toUpperCase(),
      name: holding.name,
      assetType: holding.type,
      quantity,
      price,
      total,
      balanceBefore,
      balanceAfter,
      profitLoss,
    });

    res.status(200).json({
      success: true,
      message: `Successfully sold ${quantity} ${symbol.toUpperCase()} at $${price.toFixed(2)}`,
      data: { transaction, newBalance: balanceAfter, profitLoss },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's transaction history
 * @route   GET /api/portfolio/transactions
 * @access  Private
 */
const getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPortfolio, buyAsset, sellAsset, getTransactions };
