import { supabase } from './supabaseClient';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = { 'Content-Type': 'application/json' };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
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
  getPrice: () => api.get('/btc-data/price'),
  getHistory: (days = 7) => api.get(`/btc-data/history?days=${days}`),
  getTechnical: (days = 30) => api.get(`/btc-data/technical?days=${days}`),
};

export const signalsApi = {
  getLatest: () => api.get('/signals/latest'),
  getHistory: (limit = 20) => api.get(`/signals/history?limit=${limit}`),
};
