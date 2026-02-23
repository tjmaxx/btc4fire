import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useHistoricalPrice } from '../hooks/useRealtimePrice';
import { TrendingUp } from 'lucide-react';

const RANGE_OPTIONS = [
  { label: '1Y', days: 365 },
  { label: '3Y', days: 365 * 3 },
  { label: '5Y', days: 365 * 5 },
];

// Fetch monthly SPY adjusted close from Alpha Vantage
async function fetchSPY(apiKey) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=SPY&apikey=${apiKey}`;
  const res = await fetch(url);
  const json = await res.json();
  const series = json['Monthly Adjusted Time Series'];
  if (!series) return null;
  return Object.entries(series)
    .map(([date, vals]) => ({ date, price: parseFloat(vals['5. adjusted close']) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Normalise a price series to index 100 at startDate
function normalise(series, startDate) {
  const base = series.find(p => p.date >= startDate);
  if (!base) return [];
  return series
    .filter(p => p.date >= startDate)
    .map(p => ({ date: p.date, value: (p.price / base.price) * 100 }));
}

// Downsample BTC daily series to monthly points
function toMonthly(series) {
  const byMonth = {};
  series.forEach(p => {
    const key = p.date.slice(0, 7); // YYYY-MM
    byMonth[key] = p;
  });
  return Object.values(byMonth).sort((a, b) => a.date.localeCompare(b.date));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value?.toFixed(1)} (indexed)
        </p>
      ))}
    </div>
  );
};

export default function BTCvsSnP() {
  const [range, setRange] = useState(RANGE_OPTIONS[1]); // default 3Y
  const { data: btcRaw, loading: btcLoading } = useHistoricalPrice(range.days);
  const [chartData, setChartData] = useState([]);
  const [spyError, setSpyError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (btcLoading || !btcRaw?.length) return;

    async function compute() {
      const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
      const startDate = btcRaw[0]?.date;
      const btcMonthly = toMonthly(btcRaw);
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
        const merged = btcNorm.map(p => ({
          date: p.date.slice(0, 7),
          btc: p.value,
          spy: spyMap[p.date.slice(0, 7)] ?? null,
        }));
        setChartData(merged);
      } catch {
        setChartData(btcNorm.map(p => ({ date: p.date.slice(0, 7), btc: p.value })));
        setSpyError(true);
      }
      setLoading(false);
    }

    compute();
  }, [btcRaw, btcLoading, range]);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <h3 className="text-white font-semibold">Bitcoin vs S&P 500</h3>
          <span className="text-slate-500 text-xs">(indexed to 100 at start)</span>
        </div>
        <div className="flex gap-1">
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt.label}
              onClick={() => { setLoading(true); setRange(opt); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                range.label === opt.label
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading || btcLoading ? (
        <div className="h-64 bg-slate-700 rounded animate-pulse" />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} interval={Math.floor(chartData.length / 6)} />
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
              S&P 500 data unavailable.{' '}
              {!import.meta.env.VITE_ALPHA_VANTAGE_KEY
                ? 'Add VITE_ALPHA_VANTAGE_KEY to enable comparison.'
                : 'Alpha Vantage API error.'}
            </p>
          )}
        </>
      )}
    </div>
  );
}
