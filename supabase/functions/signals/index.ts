import { corsHeaders, handleCors } from '../_shared/cors.ts';

const COINGECKO_URL = 'https://api.coingecko.com/api/v3';

async function fetchPrices(days: number): Promise<number[]> {
  const params = new URLSearchParams({ vs_currency: 'usd', days: String(days), interval: 'daily' });
  const res = await fetch(`${COINGECKO_URL}/coins/bitcoin/market_chart?${params}`);
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const json = await res.json();
  return (json.prices as [number, number][]).map(([, p]) => p);
}

function calculateEMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) ema = prices[i] * k + ema * (1 - k);
  return ema;
}

function calculateRSI(prices: number[], period = 14): number | null {
  if (prices.length < period + 1) return null;
  const changes = prices.slice(1).map((p, i) => p - prices[i]);
  const recent = changes.slice(-period);
  const gains = recent.filter(c => c > 0).reduce((a, b) => a + b, 0) / period;
  const losses = Math.abs(recent.filter(c => c < 0).reduce((a, b) => a + b, 0)) / period;
  if (losses === 0) return 100;
  return 100 - 100 / (1 + gains / losses);
}

function calculateMACD(prices: number[]): { macdLine: number | null; signalLine: number | null } {
  if (prices.length < 35) return { macdLine: null, signalLine: null };
  const ema12 = calculateEMA(prices, 12)!;
  const ema26 = calculateEMA(prices, 26)!;
  const macdLine = ema12 - ema26;
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

function scoreSignal(
  rsi: number | null, sma20: number, sma50: number,
  macdLine: number | null, signalLine: number | null
) {
  let score = 0;
  const reasoning: string[] = [];

  if (rsi !== null) {
    if (rsi < 30)      { score += 2; reasoning.push(`RSI ${rsi.toFixed(1)} is oversold — bullish`); }
    else if (rsi < 45) { score += 1; reasoning.push(`RSI ${rsi.toFixed(1)} is below neutral — mildly bullish`); }
    else if (rsi > 70) { score -= 2; reasoning.push(`RSI ${rsi.toFixed(1)} is overbought — bearish`); }
    else if (rsi > 55) { score -= 1; reasoning.push(`RSI ${rsi.toFixed(1)} is above neutral — mildly bearish`); }
    else               { reasoning.push(`RSI ${rsi.toFixed(1)} is neutral`); }
  }

  if (sma20 > sma50) { score += 1; reasoning.push('SMA20 above SMA50 — bullish trend'); }
  else               { score -= 1; reasoning.push('SMA20 below SMA50 — bearish trend'); }

  if (macdLine !== null && signalLine !== null) {
    if (macdLine > signalLine) { score += 1; reasoning.push('MACD above signal line — bullish momentum'); }
    else                       { score -= 1; reasoning.push('MACD below signal line — bearish momentum'); }
  }

  let signal_type: string;
  if      (score >= 3)  signal_type = 'STRONG_BUY';
  else if (score >= 1)  signal_type = 'BUY';
  else if (score <= -3) signal_type = 'STRONG_SELL';
  else if (score <= -1) signal_type = 'SELL';
  else                  signal_type = 'HOLD';

  return { signal_type, score, reasoning };
}

Deno.serve(async (req) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const prices = await fetchPrices(60);

    if (prices.length < 35) {
      return new Response(JSON.stringify({ error: 'Insufficient price history' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const currentPrice = prices[prices.length - 1];
    const rsi = calculateRSI(prices);
    const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, prices.length);
    const { macdLine, signalLine } = calculateMACD(prices);
    const { signal_type, score, reasoning } = scoreSignal(rsi, sma20, sma50, macdLine, signalLine);

    const result = {
      signal_type,
      score,
      rsi: rsi !== null ? parseFloat(rsi.toFixed(2)) : null,
      sma20: parseFloat(sma20.toFixed(2)),
      sma50: parseFloat(sma50.toFixed(2)),
      macd: macdLine !== null ? parseFloat(macdLine.toFixed(4)) : null,
      macd_signal: signalLine !== null ? parseFloat(signalLine.toFixed(4)) : null,
      price_at_signal: parseFloat(currentPrice.toFixed(2)),
      reasoning,
      created_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
