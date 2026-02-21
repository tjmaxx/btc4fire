import { supabase } from './supabaseClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const API_BASE = `${SUPABASE_URL}/functions/v1`;

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
  };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  } else {
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
  }
  return headers;
}

async function request(method, path, body) {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
};

// --- Convenience helpers ---

export const btcApi = {
  getPrice: () => api.get('/btc-price'),
  getHistory: (days = 7) => api.get(`/btc-history?days=${days}`),
  getTechnical: (days = 30) => api.get(`/btc-technical?days=${days}`),
};

export const signalsApi = {
  getLatest: () => api.get('/signals-latest'),
  getHistory: (limit = 20) => api.get(`/signals-history?limit=${limit}`),
};
