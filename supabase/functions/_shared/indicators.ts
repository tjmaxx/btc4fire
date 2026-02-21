export function calculateEMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}

export function calculateRSI(prices: number[], period = 14): number | null {
  if (prices.length < period + 1) return null;
  const changes = prices.slice(1).map((p, i) => p - prices[i]);
  const recent = changes.slice(-period);
  const gains = recent.filter((c) => c > 0).reduce((a, b) => a + b, 0) / period;
  const losses =
    Math.abs(recent.filter((c) => c < 0).reduce((a, b) => a + b, 0)) / period;
  if (losses === 0) return 100;
  return 100 - 100 / (1 + gains / losses);
}

export function calculateMACD(prices: number[]): {
  macdLine: number | null;
  signalLine: number | null;
} {
  if (prices.length < 35) return { macdLine: null, signalLine: null };
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12! - ema26!;

  const macdSeries: number[] = [];
  for (let i = prices.length - 9; i <= prices.length; i++) {
    const slice = prices.slice(0, i);
    const e12 = calculateEMA(slice, 12);
    const e26 = calculateEMA(slice, 26);
    if (e12 !== null && e26 !== null) macdSeries.push(e12 - e26);
  }
  const signalLine = calculateEMA(macdSeries, 9);
  return { macdLine, signalLine };
}

export function scoreSignal(
  rsi: number | null,
  sma20: number,
  sma50: number,
  macdLine: number | null,
  signalLine: number | null
): { signal_type: string; score: number; reasoning: string } {
  let score = 0;
  const reasons: string[] = [];

  if (rsi !== null) {
    if (rsi < 30) {
      score += 2;
      reasons.push(`RSI ${rsi.toFixed(1)} is oversold — bullish`);
    } else if (rsi < 45) {
      score += 1;
      reasons.push(`RSI ${rsi.toFixed(1)} is below neutral — mildly bullish`);
    } else if (rsi > 70) {
      score -= 2;
      reasons.push(`RSI ${rsi.toFixed(1)} is overbought — bearish`);
    } else if (rsi > 55) {
      score -= 1;
      reasons.push(`RSI ${rsi.toFixed(1)} is above neutral — mildly bearish`);
    } else {
      reasons.push(`RSI ${rsi.toFixed(1)} is neutral`);
    }
  }

  if (sma20 !== null && sma50 !== null) {
    if (sma20 > sma50) {
      score += 1;
      reasons.push('SMA20 above SMA50 — bullish trend');
    } else {
      score -= 1;
      reasons.push('SMA20 below SMA50 — bearish trend');
    }
  }

  if (macdLine !== null && signalLine !== null) {
    if (macdLine > signalLine) {
      score += 1;
      reasons.push('MACD above signal line — bullish momentum');
    } else {
      score -= 1;
      reasons.push('MACD below signal line — bearish momentum');
    }
  }

  let signal_type: string;
  if (score >= 3) signal_type = 'STRONG_BUY';
  else if (score >= 1) signal_type = 'BUY';
  else if (score <= -3) signal_type = 'STRONG_SELL';
  else if (score <= -1) signal_type = 'SELL';
  else signal_type = 'HOLD';

  return { signal_type, score, reasoning: reasons.join('. ') };
}
