import { useState, useEffect } from 'react';

const SIGNALS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/signals`;

export const useSignal = () => {
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchSignal = async () => {
      try {
        const res = await fetch(SIGNALS_URL, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) { setSignal(data); setError(null); }
      } catch (err) {
        if (!cancelled) setError(err.message);
        console.error('Error fetching signal:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSignal();
    return () => { cancelled = true; };
  }, []);

  return { signal, loading, error };
};
