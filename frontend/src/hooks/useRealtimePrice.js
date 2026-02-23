import { useState, useEffect } from 'react';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const HIST_CACHE_TTL  = 10 * 60 * 1000; // 10 min — historical data changes slowly
const PRICE_CACHE_TTL =  1 * 60 * 1000; //  1 min — live price refreshes often

// Module-level caches shared across all hook instances
const histCache   = new Map(); // days → { data, ts }
const histInflight = new Map(); // days → Promise (dedup concurrent requests)
let   priceCache  = null;       // { data, ts }
let   priceInflight = null;     // Promise

async function cgFetch(path) {
  const res = await fetch(`${COINGECKO_BASE}${path}`);
  if (res.status === 429) throw new Error('rate_limited');
  if (!res.ok)            throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Downsample CoinGecko [[timestamp_ms, price], ...] to one entry per day
function toDailyPoints(prices) {
  const dailyMap = new Map();
  for (const [ts, px] of prices) {
    const label = new Date(ts).toISOString().slice(0, 10); // YYYY-MM-DD
    dailyMap.set(label, px);
  }
  return Array.from(dailyMap.entries()).map(([date, price]) => ({ date, price }));
}

// ── Cached historical fetcher ──────────────────────────────────────────────────
async function fetchHistoricalCached(days) {
  const cached = histCache.get(days);
  if (cached && Date.now() - cached.ts < HIST_CACHE_TTL) {
    return cached.data;
  }
  // Deduplicate: if a request for this `days` is already in flight, reuse it
  if (histInflight.has(days)) {
    return histInflight.get(days);
  }
  const promise = cgFetch(`/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`)
    .then(result => {
      const data = toDailyPoints(result.prices);
      histCache.set(days, { data, ts: Date.now() });
      histInflight.delete(days);
      return data;
    })
    .catch(err => {
      histInflight.delete(days);
      throw err;
    });
  histInflight.set(days, promise);
  return promise;
}

// ── Cached price fetcher ───────────────────────────────────────────────────────
async function fetchPriceCached() {
  if (priceCache && Date.now() - priceCache.ts < PRICE_CACHE_TTL) {
    return priceCache.data;
  }
  if (priceInflight) return priceInflight;

  priceInflight = cgFetch(
    '/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
  )
    .then(data => {
      const result = {
        price:     data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change,
        marketCap: data.bitcoin.usd_market_cap,
        timestamp: new Date().toISOString(),
      };
      priceCache = { data: result, ts: Date.now() };
      priceInflight = null;
      return result;
    })
    .catch(err => {
      priceInflight = null;
      throw err;
    });
  return priceInflight;
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

export const useRealtimePrice = (refreshInterval = 60000) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPrice = async () => {
      try {
        const data = await fetchPriceCached();
        if (!cancelled) { setPrice(data); setError(null); }
      } catch (err) {
        if (!cancelled) {
          setError(err.message === 'rate_limited' ? 'Rate limited — retrying soon.' : err.message);
        }
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

    fetchHistoricalCached(days)
      .then(result => { if (!cancelled) { setData(result); setError(null); } })
      .catch(err   => { if (!cancelled) setError(err.message === 'rate_limited' ? 'Rate limited — try again shortly.' : err.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });

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

    fetchHistoricalCached(days)
      .then(result => { if (!cancelled) { setData(result); setError(null); } })
      .catch(err   => { if (!cancelled) setError(err.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [days]);

  return { data, loading, error };
};
