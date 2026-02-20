const express = require('express');
const router = express.Router();
const coinGeckoService = require('../services/coinGeckoService');

/**
 * GET /api/btc-data/price
 * Get current BTC price
 */
router.get('/price', async (req, res) => {
  try {
    const priceData = await coinGeckoService.getBTCPrice();
    res.json(priceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/btc-data/history
 * Get historical BTC price data
 */
router.get('/history', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const historicalData = await coinGeckoService.getHistoricalBTCData(days);
    res.json(historicalData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/btc-data/technical
 * Get technical analysis data (RSI, SMA)
 */
router.get('/technical', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const technicalData = await coinGeckoService.getTechnicalData(days);
    res.json(technicalData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
