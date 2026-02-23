import { useState, useEffect } from 'react';

// Points to the Express backend, not Supabase Edge Functions
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/btc-data';

async function apiFetch(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
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
        const data = await apiFetch('/price');
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
        const result = await apiFetch(`/history?days=${days}`);
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
        const result = await apiFetch(`/technical?days=${days}`);
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
