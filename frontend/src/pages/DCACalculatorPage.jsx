import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimePrice, useHistoricalPrice } from '../hooks/useRealtimePrice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { TrendingUp, Bitcoin, DollarSign, Calculator } from 'lucide-react';

const fmt$ = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0);
const fmtPct = (v) => (v >= 0 ? '+' : '') + v.toFixed(1) + '%';

function yearsAgoDate(years) {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}

function daysBetween(startDate) {
  return Math.max(1, Math.round((Date.now() - new Date(startDate).getTime()) / 86400000));
}

export default function DCACalculatorPage() {
  const [monthly, setMonthly] = useState('100');
  const [startDate, setStartDate] = useState(yearsAgoDate(3));

  const days = daysBetween(startDate);
  const { data: priceHistory, loading: histLoading } = useHistoricalPrice(Math.min(days, 1825)); // max 5y
  const { price: priceData, loading: priceLoading } = useRealtimePrice();
  const currentPrice = priceData?.price ?? null;

  const monthlyAmount = parseFloat(monthly) || 0;

  // Simulate monthly DCA over the historical price series
  const sim = useMemo(() => {
    if (!priceHistory?.length || !monthlyAmount) return null;

    // Filter to roughly monthly points (every ~30th day)
    const step = Math.max(1, Math.floor(priceHistory.length / Math.ceil(priceHistory.length / 30)));
    const monthly_points = priceHistory.filter((_, i) => i % step === 0 || i === priceHistory.length - 1);

    let cumBTC = 0;
    let cumCost = 0;
    const chartData = monthly_points.map(({ date, price }) => {
      cumBTC += monthlyAmount / price;
      cumCost += monthlyAmount;
      return {
        date,
        value: parseFloat((cumBTC * (currentPrice ?? price)).toFixed(0)),
        cost: parseFloat(cumCost.toFixed(0)),
      };
    });

    const totalBTC = cumBTC;
    const totalInvested = cumCost;
    const currentValue = currentPrice != null ? totalBTC * currentPrice : null;
    const pnl = currentValue != null ? currentValue - totalInvested : null;
    const pnlPct = pnl != null ? (pnl / totalInvested) * 100 : null;

    return { chartData, totalBTC, totalInvested, currentValue, pnl, pnlPct };
  }, [priceHistory, monthlyAmount, currentPrice]);

  const isLoading = histLoading || priceLoading;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Calculator className="w-7 h-7 text-orange-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DCA Calculator</h1>
          </div>
          <p className="text-gray-500 dark:text-slate-400 ml-10">
            See what would have happened if you'd invested a fixed amount in Bitcoin every month.
          </p>
        </div>

        {/* Inputs */}
        <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 mb-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-500 dark:text-slate-400 text-sm font-medium mb-2">Monthly Investment (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-400 text-sm">$</span>
                <input
                  type="number" min="1" step="1"
                  value={monthly}
                  onChange={e => setMonthly(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pl-7 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-500 dark:text-slate-400 text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
          {/* Quick buttons */}
          <div className="flex gap-2 mt-4">
            <span className="text-gray-400 dark:text-slate-500 text-xs self-center">Quick:</span>
            {[1, 2, 3, 5].map(y => (
              <button
                key={y}
                onClick={() => setStartDate(yearsAgoDate(y))}
                className="px-3 py-1 bg-gray-200 dark:bg-slate-700 hover:bg-orange-500/20 hover:text-orange-400 text-gray-600 dark:text-slate-300 text-xs rounded-full transition-colors"
              >
                {y}Y ago
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse" />)}
          </div>
        ) : sim ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 dark:text-slate-400 text-xs font-medium">Total Invested</p>
                  <DollarSign className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-gray-900 dark:text-white text-2xl font-bold">{fmt$(sim.totalInvested)}</p>
                <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">at {fmt$(monthlyAmount)}/month</p>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 dark:text-slate-400 text-xs font-medium">BTC Accumulated</p>
                  <Bitcoin className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-gray-900 dark:text-white text-2xl font-bold">{sim.totalBTC.toFixed(5)}</p>
                <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">BTC held</p>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 dark:text-slate-400 text-xs font-medium">Current Value</p>
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-gray-900 dark:text-white text-2xl font-bold">{sim.currentValue != null ? fmt$(sim.currentValue) : '—'}</p>
                <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">@ {currentPrice ? fmt$(currentPrice) : '…'}/BTC</p>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 dark:text-slate-400 text-xs font-medium">Total Return</p>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <p className={`text-2xl font-bold ${(sim.pnl ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {sim.pnlPct != null ? fmtPct(sim.pnlPct) : '—'}
                </p>
                <p className={`text-xs mt-0.5 ${(sim.pnl ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {sim.pnl != null ? fmt$(sim.pnl) + (sim.pnl >= 0 ? ' profit' : ' loss') : '—'}
                </p>
              </div>
            </div>

            {/* Chart */}
            {sim.chartData.length > 1 && (
              <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 mb-6">
                <h2 className="text-gray-900 dark:text-white font-semibold mb-4">Portfolio Growth</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={sim.chartData}>
                    <CartesianGrid stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} interval="preserveStartEnd" tickFormatter={d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })} />
                    <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                      formatter={(v, name) => [fmt$(v), name === 'value' ? 'Portfolio Value' : 'Total Invested']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#f97316" dot={false} strokeWidth={2} name="value" />
                    <Line type="monotone" dataKey="cost" stroke="#3b82f6" dot={false} strokeWidth={2} strokeDasharray="4 3" name="cost" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex gap-6 mt-3 text-xs text-gray-400 dark:text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-orange-400 inline-block rounded" /> Portfolio Value</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-400 inline-block rounded" /> Total Invested</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400 dark:text-slate-500 text-sm text-center py-12">Enter an amount to see your DCA results.</p>
        )}

        {/* CTA */}
        <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 text-center">
          <p className="text-gray-700 dark:text-slate-300 mb-3">Ready to start tracking your real purchases?</p>
          <Link
            to="/portfolio"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Open Portfolio Tracker →
          </Link>
        </div>
      </div>
    </Layout>
  );
}
