import { useState, useEffect } from 'react';

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/market-insight`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const LS_KEY   = 'btc4fire_market_insight';

export function useMarketInsight() {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Browser-level cache: skip the network call if we already fetched today
      const today = new Date().toISOString().slice(0, 10);
      try {
        const stored = JSON.parse(localStorage.getItem(LS_KEY) ?? 'null');
        if (stored?.date === today && stored?.data) {
          if (!cancelled) { setInsight(stored.data); setLoading(false); }
          return;
        }
      } catch { /* ignore corrupt cache */ }

      try {
        const res = await fetch(ENDPOINT, {
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        if (!cancelled) {
          setInsight(data);
          localStorage.setItem(LS_KEY, JSON.stringify({ date: today, data }));
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { insight, loading, error };
}
