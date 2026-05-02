/**
 * Mock market data for trading simulation
 * Simulates realistic stock and crypto prices with random fluctuations
 */

// Base price data
const marketAssets = [
  // Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', basePrice: 178.5, logo: '🍎' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', basePrice: 141.2, logo: '🔍' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock', basePrice: 415.8, logo: '🪟' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock', basePrice: 185.3, logo: '📦' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', basePrice: 245.7, logo: '⚡' },
  { symbol: 'META', name: 'Meta Platforms', type: 'stock', basePrice: 492.1, logo: '👤' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock', basePrice: 875.4, logo: '🎮' },
  { symbol: 'NFLX', name: 'Netflix Inc.', type: 'stock', basePrice: 628.3, logo: '🎬' },
  // Crypto
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', basePrice: 68420.0, logo: '₿' },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto', basePrice: 3812.5, logo: '⬡' },
  { symbol: 'BNB', name: 'Binance Coin', type: 'crypto', basePrice: 582.3, logo: '🔶' },
  { symbol: 'SOL', name: 'Solana', type: 'crypto', basePrice: 168.4, logo: '☀️' },
  { symbol: 'ADA', name: 'Cardano', type: 'crypto', basePrice: 0.485, logo: '🔵' },
  { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', basePrice: 0.162, logo: '🐕' },
];

// Cache of current prices with simulated fluctuation
let priceCache = {};

/**
 * Initialize price cache
 */
const initPrices = () => {
  marketAssets.forEach((asset) => {
    priceCache[asset.symbol] = {
      ...asset,
      price: asset.basePrice,
      change: 0,
      changePercent: 0,
      high24h: asset.basePrice * 1.03,
      low24h: asset.basePrice * 0.97,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: asset.basePrice * (Math.floor(Math.random() * 1000000000) + 100000000),
    };
  });
};

/**
 * Generate a random price fluctuation (±2%)
 */
const fluctuatePrice = (currentPrice, volatility = 0.02) => {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return parseFloat((currentPrice * (1 + change)).toFixed(6));
};

/**
 * Update all prices with simulated market movement
 */
const updatePrices = () => {
  Object.keys(priceCache).forEach((symbol) => {
    const asset = priceCache[symbol];
    const oldPrice = asset.price;
    // Crypto is more volatile
    const volatility = asset.type === 'crypto' ? 0.025 : 0.01;
    const newPrice = fluctuatePrice(oldPrice, volatility);
    const change = parseFloat((newPrice - asset.basePrice).toFixed(6));
    const changePercent = parseFloat(((change / asset.basePrice) * 100).toFixed(2));

    priceCache[symbol] = {
      ...asset,
      price: newPrice,
      change,
      changePercent,
      high24h: Math.max(asset.high24h, newPrice),
      low24h: Math.min(asset.low24h, newPrice),
      volume: asset.volume + Math.floor(Math.random() * 1000),
      lastUpdated: new Date().toISOString(),
    };
  });
  return priceCache;
};

/**
 * Get all market prices
 */
const getAllPrices = () => {
  if (Object.keys(priceCache).length === 0) initPrices();
  updatePrices();
  return Object.values(priceCache);
};

/**
 * Get price for a specific symbol
 */
const getPrice = (symbol) => {
  if (Object.keys(priceCache).length === 0) initPrices();
  const upperSymbol = symbol.toUpperCase();
  if (!priceCache[upperSymbol]) return null;
  updatePrices();
  return priceCache[upperSymbol];
};

/**
 * Generate historical price data (last 30 days)
 */
const getHistoricalData = (symbol, days = 30) => {
  const asset = marketAssets.find((a) => a.symbol === symbol.toUpperCase());
  if (!asset) return null;

  const history = [];
  let price = asset.basePrice * (0.85 + Math.random() * 0.3); // ±15% from base

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price = fluctuatePrice(price, 0.03);

    history.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat((price * 0.995).toFixed(4)),
      high: parseFloat((price * 1.015).toFixed(4)),
      low: parseFloat((price * 0.985).toFixed(4)),
      close: parseFloat(price.toFixed(4)),
      volume: Math.floor(Math.random() * 5000000) + 500000,
    });
  }

  return history;
};

// Initialize on load
initPrices();

module.exports = { getAllPrices, getPrice, getHistoricalData, marketAssets };
