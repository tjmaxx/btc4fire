import { useState, useEffect } from 'react';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

async function cgFetch(path) {
  const res = await fetch(`${COINGECKO_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Downsample CoinGecko [[timestamp_ms, price], ...] to one entry per day
function toDailyPoints(prices) {
  const dailyMap = new Map();
  for (const [ts, px] of prices) {
    const label = new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyMap.set(label, px);
  }
  return Array.from(dailyMap.entries()).map(([date, price]) => ({ date, price }));
}

export const useRealtimePrice = (refreshInterval = 60000) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPrice = async () => {
      try {
        const data = await cgFetch(
          '/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
        );
        if (!cancelled) {
          setPrice({
            price: data.bitcoin.usd,
            change24h: data.bitcoin.usd_24h_change,
            marketCap: data.bitcoin.usd_market_cap,
            timestamp: new Date().toISOString(),
          });
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
        console.error('Error fetching BTC price:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, refreshInterval);
    return () => { cancelled = true; clearInterval(interval); };
  }, [refreshInterval]);

  return { price, loading, error };
};

export const useHistoricalPrice = (days = 7) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      try {
        const result = await cgFetch(`/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
        if (!cancelled) {
          setData(toDailyPoints(result.prices));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
        console.error('Error fetching historical data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHistory();
    return () => { cancelled = true; };
  }, [days]);

  return { data, loading, error };
};

export const useTechnicalData = (days = 30) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchTechnical = async () => {
      try {
        const result = await cgFetch(`/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
        if (!cancelled) {
          setData(toDailyPoints(result.prices));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
        console.error('Error fetching technical data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTechnical();
    return () => { cancelled = true; };
  }, [days]);

  return { data, loading, error };
};
