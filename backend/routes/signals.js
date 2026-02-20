const express = require('express');
const router = express.Router();
const coinGeckoService = require('../services/coinGeckoService');

// --- Technical indicator helpers ---

function calculateEMA(prices, period) {
  if (prices.length < period) return null;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}

function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return null;
  const changes = prices.slice(1).map((p, i) => p - prices[i]);
  const recent = changes.slice(-period);
  const gains = recent.filter(c => c > 0).reduce((a, b) => a + b, 0) / period;
  const losses = Math.abs(recent.filter(c => c < 0).reduce((a, b) => a + b, 0)) / period;
  if (losses === 0) return 100;
  return 100 - 100 / (1 + gains / losses);
}

function calculateMACD(prices) {
  if (prices.length < 35) return { macdLine: null, signalLine: null };
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12 - ema26;

  // Build MACD series over last 9 points for signal line
  const macdSeries = [];
  for (let i = prices.length - 9; i <= prices.length; i++) {
    const slice = prices.slice(0, i);
    const e12 = calculateEMA(slice, 12);
    const e26 = calculateEMA(slice, 26);
    if (e12 !== null && e26 !== null) macdSeries.push(e12 - e26);
  }
  const signalLine = calculateEMA(macdSeries, 9);
  return { macdLine, signalLine };
}

function scoreSignal(rsi, sma20, sma50, macdLine, signalLine) {
  let score = 0;
  const reasons = [];

  if (rsi !== null) {
    if (rsi < 30)      { score += 2; reasons.push(`RSI ${rsi.toFixed(1)} is oversold — bullish`); }
    else if (rsi < 45) { score += 1; reasons.push(`RSI ${rsi.toFixed(1)} is below neutral — mildly bullish`); }
    else if (rsi > 70) { score -= 2; reasons.push(`RSI ${rsi.toFixed(1)} is overbought — bearish`); }
    else if (rsi > 55) { score -= 1; reasons.push(`RSI ${rsi.toFixed(1)} is above neutral — mildly bearish`); }
    else               { reasons.push(`RSI ${rsi.toFixed(1)} is neutral`); }
  }

  if (sma20 !== null && sma50 !== null) {
    if (sma20 > sma50) { score += 1; reasons.push('SMA20 above SMA50 — bullish trend'); }
    else               { score -= 1; reasons.push('SMA20 below SMA50 — bearish trend'); }
  }

  if (macdLine !== null && signalLine !== null) {
    if (macdLine > signalLine) { score += 1; reasons.push('MACD above signal line — bullish momentum'); }
    else                       { score -= 1; reasons.push('MACD below signal line — bearish momentum'); }
  }

  let signal_type;
  if      (score >= 3)  signal_type = 'STRONG_BUY';
  else if (score >= 1)  signal_type = 'BUY';
  else if (score <= -3) signal_type = 'STRONG_SELL';
  else if (score <= -1) signal_type = 'SELL';
  else                  signal_type = 'HOLD';

  return { signal_type, score, reasoning: reasons.join('. ') };
}

/**
 * GET /api/signals/latest
 * Generate current trading signal from live technical data
 */
router.get('/latest', async (req, res) => {
  try {
    const techData = await coinGeckoService.getTechnicalData(60);
    const prices = techData.prices.map(p => p.price);

    if (prices.length < 35) {
      return res.status(400).json({ error: 'Insufficient price history for signal generation' });
    }

    const currentPrice = prices[prices.length - 1];
    const rsi = calculateRSI(prices);
    const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, prices.length);
    const { macdLine, signalLine } = calculateMACD(prices);

    const { signal_type, score, reasoning } = scoreSignal(rsi, sma20, sma50, macdLine, signalLine);

    const record = {
      signal_type,
      score,
      rsi: rsi !== null ? parseFloat(rsi.toFixed(2)) : null,
      sma20: parseFloat(sma20.toFixed(2)),
      sma50: parseFloat(sma50.toFixed(2)),
      macd: macdLine !== null ? parseFloat(macdLine.toFixed(4)) : null,
      macd_signal: signalLine !== null ? parseFloat(signalLine.toFixed(4)) : null,
      price_at_signal: parseFloat(currentPrice.toFixed(2)),
      reasoning,
    };

    // Persist to Supabase (best-effort, non-blocking)
    req.supabase.from('trading_signals').insert(record).then(({ error }) => {
      if (error) console.warn('Signal DB write failed:', error.message);
    });

    res.json({ ...record, created_at: new Date().toISOString() });
  } catch (err) {
    console.error('Signal generation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/signals/history?limit=20
 * Return recent stored signals from DB
 */
router.get('/history', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const { data, error } = await req.supabase
      .from('trading_signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
