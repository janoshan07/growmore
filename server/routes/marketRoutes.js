const express = require('express');
const router = express.Router();
const { getMarket, getAssetPrice, getHistory } = require('../controllers/marketController');

// Public routes - no auth needed
router.get('/', getMarket);
router.get('/:symbol', getAssetPrice);
router.get('/:symbol/history', getHistory);

module.exports = router;
