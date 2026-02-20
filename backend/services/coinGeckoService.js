const axios = require('axios');

const COINGECKO_URL = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION = 60 * 1000; // 1 minute cache

let priceCache = {
  data: null,
  timestamp: 0
};

/**
 * Fetch current BTC price from CoinGecko
 */
async function getBTCPrice() {
  const now = Date.now();
  
  // Return cached data if still fresh
  if (priceCache.data && now - priceCache.timestamp < CACHE_DURATION) {
    return priceCache.data;
  }

  try {
    const response = await axios.get(`${COINGECKO_URL}/simple/price`, {
      params: {
        ids: 'bitcoin',
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_vol: true,
        include_24hr_change: true
      }
    });

    const btcData = response.data.bitcoin;
    
    const formattedData = {
      price: btcData.usd,
      marketCap: btcData.usd_market_cap,
      volume24h: btcData.usd_24h_vol,
      change24h: btcData.usd_24h_change,
      timestamp: new Date().toISOString()
    };

    // Update cache
    priceCache = {
      data: formattedData,
      timestamp: now
    };

    return formattedData;
  } catch (error) {
    console.error('Error fetching BTC price:', error.message);
    
    // Return cached data if available, even if expired
    if (priceCache.data) {
      return priceCache.data;
    }
    
    throw new Error('Failed to fetch BTC price and no cached data available');
  }
}

/**
 * Fetch historical BTC data for chart
 */
async function getHistoricalBTCData(days = 7) {
  try {
    const response = await axios.get(
      `${COINGECKO_URL}/coins/bitcoin/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: 'daily'
        }
      }
    );

    return response.data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price: Math.round(price * 100) / 100
    }));
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
    throw error;
  }
}

/**
 * Fetch technical indicators data (requires more detailed data)
 */
async function getTechnicalData(days = 30) {
  try {
    const response = await axios.get(
      `${COINGECKO_URL}/coins/bitcoin/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: 'daily'
        }
      }
    );

    const prices = response.data.prices;
    
    // Calculate simple moving average (SMA)
    const calculateSMA = (arr, period) => {
      return arr.map((_, index) => {
        if (index < period - 1) return null;
        const sum = arr.slice(index - period + 1, index + 1)
          .reduce((acc, [_, price]) => acc + price, 0);
        return sum / period;
      });
    };

    // Calculate RSI (Relative Strength Index)
    const calculateRSI = (arr, period = 14) => {
      const changes = [];
      for (let i = 1; i < arr.length; i++) {
        changes.push(arr[i][1] - arr[i - 1][1]);
      }

      const gains = changes.map(change => change > 0 ? change : 0);
      const losses = changes.map(change => change < 0 ? -change : 0);

      const avgGain = gains.reduce((a, b) => a + b) / period;
      const avgLoss = losses.reduce((a, b) => a + b) / period;

      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));

      return rsi;
    };

    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);
    const rsi = calculateRSI(prices);

    return {
      prices: prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price: Math.round(price * 100) / 100
      })),
      sma20: sma20[sma20.length - 1],
      sma50: sma50[sma50.length - 1],
      rsi: rsi,
      lastPrice: prices[prices.length - 1][1]
    };
  } catch (error) {
    console.error('Error fetching technical data:', error.message);
    throw error;
  }
}

module.exports = {
  getBTCPrice,
  getHistoricalBTCData,
  getTechnicalData
};
