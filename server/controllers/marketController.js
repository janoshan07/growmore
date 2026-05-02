const { getAllPrices, getPrice, getHistoricalData } = require('../utils/marketData');

/**
 * @desc    Get all market assets with live-like prices
 * @route   GET /api/market
 * @access  Public
 */
const getMarket = async (req, res, next) => {
  try {
    const prices = getAllPrices();
    res.status(200).json({ success: true, count: prices.length, data: prices });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single asset price
 * @route   GET /api/market/:symbol
 * @access  Public
 */
const getAssetPrice = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const asset = getPrice(symbol);
    if (!asset) {
      return res.status(404).json({ success: false, message: `Asset ${symbol.toUpperCase()} not found` });
    }
    res.status(200).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get historical data for chart
 * @route   GET /api/market/:symbol/history
 * @access  Public
 */
const getHistory = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { days = 30 } = req.query;
    const history = getHistoricalData(symbol, parseInt(days));
    if (!history) {
      return res.status(404).json({ success: false, message: `Asset ${symbol.toUpperCase()} not found` });
    }
    res.status(200).json({ success: true, symbol: symbol.toUpperCase(), data: history });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMarket, getAssetPrice, getHistory };
