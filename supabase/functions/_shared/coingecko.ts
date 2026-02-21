const COINGECKO_URL = 'https://api.coingecko.com/api/v3';

export async function getBTCPrice() {
  const params = new URLSearchParams({
    ids: 'bitcoin',
    vs_currencies: 'usd',
    include_market_cap: 'true',
    include_24hr_vol: 'true',
    include_24hr_change: 'true',
  });

  const res = await fetch(`${COINGECKO_URL}/simple/price?${params}`);
  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);

  const json = await res.json();
  const btcData = json.bitcoin;

  return {
    price: btcData.usd,
    marketCap: btcData.usd_market_cap,
    volume24h: btcData.usd_24h_vol,
    change24h: btcData.usd_24h_change,
    timestamp: new Date().toISOString(),
  };
}

export async function getHistoricalBTCData(days = 7) {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    days: String(days),
    interval: 'daily',
  });

  const res = await fetch(`${COINGECKO_URL}/coins/bitcoin/market_chart?${params}`);
  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);

  const json = await res.json();
  return json.prices.map(([timestamp, price]: [number, number]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price: Math.round(price * 100) / 100,
  }));
}

export async function getTechnicalData(days = 30) {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    days: String(days),
    interval: 'daily',
  });

  const res = await fetch(`${COINGECKO_URL}/coins/bitcoin/market_chart?${params}`);
  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);

  const json = await res.json();
  const prices: [number, number][] = json.prices;

  const calculateSMA = (arr: [number, number][], period: number) => {
    return arr.map((_, index) => {
      if (index < period - 1) return null;
      const sum = arr
        .slice(index - period + 1, index + 1)
        .reduce((acc, [, price]) => acc + price, 0);
      return sum / period;
    });
  };

  const calculateRSI = (arr: [number, number][], period = 14) => {
    const changes: number[] = [];
    for (let i = 1; i < arr.length; i++) {
      changes.push(arr[i][1] - arr[i - 1][1]);
    }
    const gains = changes.map((c) => (c > 0 ? c : 0));
    const losses = changes.map((c) => (c < 0 ? -c : 0));
    const avgGain = gains.reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.reduce((a, b) => a + b, 0) / period;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  };

  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const rsi = calculateRSI(prices);

  return {
    prices: prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price: Math.round(price * 100) / 100,
    })),
    sma20: sma20[sma20.length - 1],
    sma50: sma50[sma50.length - 1],
    rsi,
    lastPrice: prices[prices.length - 1][1],
  };
}
