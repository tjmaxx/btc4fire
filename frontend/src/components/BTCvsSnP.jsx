import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useHistoricalPrice } from '../hooks/useRealtimePrice';
import { TrendingUp } from 'lucide-react';

// CoinGecko free tier: max 365 days. 3Y/5Y require Alpha Vantage.
const RANGE_OPTIONS = [
  { label: '1Y', years: 1, useAV: false },
  { label: '3Y', years: 3, useAV: true },
  { label: '5Y', years: 5, useAV: true },
];

// Alpha Vantage: daily BTC/USD close prices
const avBtcCache = new Map(); // years → { data, ts }
async function fetchBTCfromAV(apiKey, years) {
  const cached = avBtcCache.get(years);
  if (cached && Date.now() - cached.ts < 15 * 60 * 1000) return cached.data;

  const url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${apiKey}`;
  const res = await fetch(url);
  const json = await res.json();
  const series = json['Time Series (Digital Currency Daily)'];
  if (!series) return null;

  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const data = Object.entries(series)
    .filter(([date]) => date >= cutoffStr)
    .map(([date, vals]) => ({
      date,
      // AV field name varies slightly between responses
      price: parseFloat(vals['4a. close (USD)'] ?? vals['4. close'] ?? 0),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  avBtcCache.set(years, { data, ts: Date.now() });
  return data;
}

// Alpha Vantage: monthly SPY adjusted close
const avSpyCache = { data: null, ts: 0 };
async function fetchSPY(apiKey) {
  if (avSpyCache.data && Date.now() - avSpyCache.ts < 15 * 60 * 1000) return avSpyCache.data;

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=SPY&apikey=${apiKey}`;
  const res = await fetch(url);
  const json = await res.json();
  const series = json['Monthly Adjusted Time Series'];
  if (!series) return null;

  const data = Object.entries(series)
    .map(([date, vals]) => ({ date, price: parseFloat(vals['5. adjusted close']) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  avSpyCache.data = data;
  avSpyCache.ts = Date.now();
  return data;
}

// Normalise a price series so the first point = 100
function normalise(series, startDate) {
  const base = series.find(p => p.date >= startDate);
  if (!base) return [];
  return series
    .filter(p => p.date >= startDate)
    .map(p => ({ date: p.date, value: (p.price / base.price) * 100 }));
}

// Collapse a daily series to one entry per month (last entry wins)
function toMonthly(series) {
  const byMonth = {};
  series.forEach(p => { byMonth[p.date.slice(0, 7)] = p; });
  return Object.values(byMonth).sort((a, b) => a.date.localeCompare(b.date));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value?.toFixed(1)}×
        </p>
      ))}
    </div>
  );
};

export default function BTCvsSnP() {
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
  const [range, setRange] = useState(RANGE_OPTIONS[0]); // default 1Y

  // CoinGecko 1Y data — only used when range.useAV === false
  const { data: btcRaw1Y, loading: btcLoading1Y } = useHistoricalPrice(365);

  const [chartData, setChartData]   = useState([]);
  const [spyError, setSpyError]     = useState(false);
  const [loading, setLoading]       = useState(true);
  const [errorMsg, setErrorMsg]     = useState('');

  useEffect(() => {
    async function compute() {
      setErrorMsg('');
      setSpyError(false);

      // ── 1Y: use CoinGecko (free, cached) ───────────────────────────────
      if (!range.useAV) {
        if (btcLoading1Y || !btcRaw1Y?.length) return;

        const startDate = btcRaw1Y[0]?.date;
        const btcMonthly = toMonthly(btcRaw1Y);
        const btcNorm = normalise(btcMonthly, startDate);

        if (!apiKey) {
          setChartData(btcNorm.map(p => ({ date: p.date.slice(0, 7), btc: p.value })));
          setSpyError(true);
          setLoading(false);
          return;
        }

        try {
          const spyRaw = await fetchSPY(apiKey);
          if (!spyRaw) throw new Error('no data');
          const spyNorm = normalise(spyRaw, startDate);
          const spyMap = Object.fromEntries(spyNorm.map(p => [p.date.slice(0, 7), p.value]));
          setChartData(btcNorm.map(p => ({
            date: p.date.slice(0, 7),
            btc: p.value,
            spy: spyMap[p.date.slice(0, 7)] ?? null,
          })));
        } catch {
          setChartData(btcNorm.map(p => ({ date: p.date.slice(0, 7), btc: p.value })));
          setSpyError(true);
        }
        setLoading(false);
        return;
      }

      // ── 3Y / 5Y: requires Alpha Vantage ────────────────────────────────
      if (!apiKey) {
        setErrorMsg('Add VITE_ALPHA_VANTAGE_KEY to GitHub secrets to enable 3Y/5Y data.');
        setLoading(false);
        return;
      }

      try {
        const [btcRawAV, spyRaw] = await Promise.all([
          fetchBTCfromAV(apiKey, range.years),
          fetchSPY(apiKey),
        ]);

        if (!btcRawAV?.length) throw new Error('BTC data unavailable from Alpha Vantage');

        const btcMonthly = toMonthly(btcRawAV);
        const startDate  = btcMonthly[0]?.date;
        const btcNorm    = normalise(btcMonthly, startDate);

        if (!spyRaw) {
          setChartData(btcNorm.map(p => ({ date: p.date.slice(0, 7), btc: p.value })));
          setSpyError(true);
        } else {
          const spyNorm = normalise(spyRaw, startDate);
          const spyMap  = Object.fromEntries(spyNorm.map(p => [p.date.slice(0, 7), p.value]));
          setChartData(btcNorm.map(p => ({
            date: p.date.slice(0, 7),
            btc:  p.value,
            spy:  spyMap[p.date.slice(0, 7)] ?? null,
          })));
        }
      } catch (err) {
        setErrorMsg(`Alpha Vantage error: ${err.message}`);
      }
      setLoading(false);
    }

    compute();
  }, [range, btcRaw1Y, btcLoading1Y, apiKey]);

  const isLoading = loading || (!range.useAV && btcLoading1Y);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <h3 className="text-white font-semibold">Bitcoin vs S&P 500</h3>
          <span className="text-slate-500 text-xs">(indexed to 100 at start)</span>
        </div>
        <div className="flex gap-1">
          {RANGE_OPTIONS.map(opt => {
            const disabled = opt.useAV && !apiKey;
            return (
              <button
                key={opt.label}
                disabled={disabled}
                title={disabled ? 'Requires VITE_ALPHA_VANTAGE_KEY' : undefined}
                onClick={() => { setLoading(true); setRange(opt); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  range.label === opt.label
                    ? 'bg-orange-500 text-white'
                    : disabled
                      ? 'bg-slate-700/40 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 bg-slate-700 rounded animate-pulse" />
      ) : errorMsg ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-500 text-sm text-center max-w-xs">{errorMsg}</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis
                dataKey="date"
                stroke="#475569"
                tick={{ fontSize: 11 }}
                interval={Math.max(0, Math.floor(chartData.length / 6) - 1)}
              />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => v.toFixed(0)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="btc" name="Bitcoin" stroke="#f97316" dot={false} strokeWidth={2} />
              {!spyError && (
                <Line type="monotone" dataKey="spy" name="S&P 500 (SPY)" stroke="#60a5fa" dot={false} strokeWidth={2} />
              )}
            </LineChart>
          </ResponsiveContainer>
          {spyError && (
            <p className="text-slate-500 text-xs mt-2 text-center">
              {!apiKey
                ? 'Add VITE_ALPHA_VANTAGE_KEY to enable S&P 500 comparison.'
                : 'S&P 500 data unavailable — Alpha Vantage API error.'}
            </p>
          )}
        </>
      )}
    </div>
  );
}
