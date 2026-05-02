const express = require('express');
const router = express.Router();
const {
  getPortfolio,
  buyAsset,
  sellAsset,
  getTransactions,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// All portfolio routes are protected
router.use(protect);

router.get('/', getPortfolio);
router.post('/buy', buyAsset);
router.post('/sell', sellAsset);
router.get('/transactions', getTransactions);

module.exports = router;
