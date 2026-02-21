import { useState, useEffect } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;

async function apiFetch(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const useRealtimePrice = (refreshInterval = 60000) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPrice = async () => {
      try {
        const data = await apiFetch('/btc-price');
        if (!cancelled) { setPrice(data); setError(null); }
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
        const result = await apiFetch(`/btc-history?days=${days}`);
        if (!cancelled) { setData(result); setError(null); }
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
        const result = await apiFetch(`/btc-technical?days=${days}`);
        if (!cancelled) { setData(result); setError(null); }
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
