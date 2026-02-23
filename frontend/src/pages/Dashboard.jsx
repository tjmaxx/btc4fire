import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimePrice, useHistoricalPrice } from '../hooks/useRealtimePrice';
import { useSignal } from '../hooks/useSignal';
import { usePriceAlert } from '../hooks/usePriceAlert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, MessageSquare, BookOpen, Wallet, Activity, Bell, BellOff, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import SatConverter from '../components/SatConverter';

const SIGNAL_STYLES = {
  STRONG_BUY:  { label: 'Strong Buy',  bg: 'bg-green-500/20',  text: 'text-green-400',  border: 'border-green-500/40' },
  BUY:         { label: 'Buy',         bg: 'bg-emerald-500/20',text: 'text-emerald-400',border: 'border-emerald-500/40' },
  HOLD:        { label: 'Hold',        bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40' },
  SELL:        { label: 'Sell',        bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40' },
  STRONG_SELL: { label: 'Strong Sell', bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/40' },
};

const formatCurrency = (value) => {
  if (!value) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const formatPercent = (value) => {
  if (!value) return '0.00%';
  return (value > 0 ? '+' : '') + value.toFixed(2) + '%';
};

export default function Dashboard() {
  const { price, loading: priceLoading, error: priceError } = useRealtimePrice();
  const { data: historicalData, loading: historyLoading } = useHistoricalPrice(7);
  const { signal, loading: signalLoading } = useSignal();
  const { alerts, addAlert, removeAlert } = usePriceAlert(price?.price ?? null);

  const [alertInput, setAlertInput] = useState('');
  const [alertDir, setAlertDir] = useState('above');

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Live Bitcoin market data</p>
      </div>

      {/* Price cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-400 text-sm font-medium">Bitcoin Price</h3>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          {priceLoading ? (
            <div className="h-9 bg-slate-700 rounded animate-pulse" />
          ) : priceError ? (
            <p className="text-red-400 text-sm">{priceError}</p>
          ) : (
            <>
              <div className="text-3xl font-bold text-white">{formatCurrency(price?.price)}</div>
              <p className="text-slate-500 text-xs mt-1">
                {price?.timestamp ? new Date(price.timestamp).toLocaleString() : ''}
              </p>
            </>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-400 text-sm font-medium">24h Change</h3>
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          {priceLoading ? (
            <div className="h-9 bg-slate-700 rounded animate-pulse" />
          ) : (
            <div className={`text-3xl font-bold ${price?.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatPercent(price?.change24h)}
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-400 text-sm font-medium">Market Cap</h3>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          {priceLoading ? (
            <div className="h-9 bg-slate-700 rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-bold text-white">
              {price?.marketCap ? formatCurrency(price.marketCap / 1e9) + 'B' : '-'}
            </div>
          )}
        </div>
      </div>

      {/* 7-day chart */}
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-6">
        <h2 className="text-white font-semibold mb-4">7-Day Price Chart</h2>
        {historyLoading ? (
          <div className="h-64 bg-slate-700 rounded animate-pulse" />
        ) : historicalData?.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={historicalData}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 12 }} tickFormatter={d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis stroke="#475569" tick={{ fontSize: 12 }} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={v => [formatCurrency(v), 'Price']}
              />
              <Line type="monotone" dataKey="price" stroke="#f97316" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-500 text-sm">No chart data available.</p>
        )}
      </div>

      {/* Technical Signal */}
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" /> Technical Signal
          </h2>
          {signal && (
            <span className="text-slate-500 text-xs">
              {new Date(signal.created_at).toLocaleString()}
            </span>
          )}
        </div>

        {signalLoading ? (
          <div className="h-24 bg-slate-700 rounded animate-pulse" />
        ) : signal ? (() => {
          const style = SIGNAL_STYLES[signal.signal_type] || SIGNAL_STYLES.HOLD;
          return (
            <>
              <div className="flex items-center gap-4 mb-4">
                <span className={`text-2xl font-bold px-4 py-2 rounded-lg border ${style.bg} ${style.text} ${style.border}`}>
                  {style.label}
                </span>
                {/* Score bar -5 to +5 */}
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Bearish</span>
                    <span className={`font-medium ${style.text}`}>Score: {signal.score > 0 ? '+' : ''}{signal.score}</span>
                    <span>Bullish</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${style.bg.replace('/20', '')}`}
                      style={{ width: `${((signal.score + 5) / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Indicators grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'RSI (14)', value: signal.rsi?.toFixed(1) ?? '—' },
                  { label: 'SMA 20', value: signal.sma20 ? formatCurrency(signal.sma20) : '—' },
                  { label: 'SMA 50', value: signal.sma50 ? formatCurrency(signal.sma50) : '—' },
                  { label: 'MACD', value: signal.macd?.toFixed(2) ?? '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-900 rounded-lg p-3 text-center">
                    <p className="text-slate-500 text-xs mb-1">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>

              {/* Reasoning */}
              <ul className="space-y-1 mb-3">
                {(Array.isArray(signal.reasoning) ? signal.reasoning : [signal.reasoning]).map((r, i) => (
                  <li key={i} className="text-slate-400 text-xs flex items-start gap-1.5">
                    <span className={`mt-0.5 flex-shrink-0 ${style.text}`}>•</span>{r}
                  </li>
                ))}
              </ul>

              <p className="text-slate-600 text-xs">For educational purposes only. Not financial advice.</p>
            </>
          );
        })() : (
          <p className="text-slate-500 text-sm">Signal unavailable.</p>
        )}
      </div>

      {/* Sat Converter + Price Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <SatConverter />

        {/* Price Alerts */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Price Alerts</h3>
          </div>

          {/* Add alert form */}
          <div className="flex gap-2 mb-4">
            <select
              value={alertDir}
              onChange={e => setAlertDir(e.target.value)}
              className="bg-slate-900 border border-slate-600 text-slate-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
            <input
              type="number"
              value={alertInput}
              onChange={e => setAlertInput(e.target.value)}
              placeholder="Target price (USD)"
              className="flex-1 bg-slate-900 border border-slate-600 text-white placeholder-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={async () => {
                if (!alertInput || isNaN(Number(alertInput))) return;
                await addAlert(alertInput, alertDir);
                setAlertInput('');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Set
            </button>
          </div>

          {/* Active alerts */}
          {alerts.length === 0 ? (
            <div className="text-center py-4">
              <BellOff className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">No active alerts. Browser notifications required.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {alerts.map(a => (
                <li key={a.id} className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2">
                  <span className="text-slate-300 text-sm">
                    <span className={a.direction === 'above' ? 'text-green-400' : 'text-red-400'}>
                      {a.direction === 'above' ? '↑' : '↓'}
                    </span>{' '}
                    ${Number(a.targetPrice).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeAlert(a.id)}
                    className="text-slate-600 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/forum"
          className="bg-slate-800 border border-slate-700 hover:border-orange-500/50 rounded-xl p-5 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-6 h-6 text-orange-400" />
            <h3 className="text-white font-semibold">Community Forum</h3>
          </div>
          <p className="text-slate-400 text-sm">Discuss Bitcoin & FIRE with the community.</p>
          <p className="text-orange-400 text-sm mt-3 group-hover:underline">Open forum →</p>
        </Link>

        <Link
          to="/blog"
          className="bg-slate-800 border border-slate-700 hover:border-orange-500/50 rounded-xl p-5 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h3 className="text-white font-semibold">Blog & Guides</h3>
          </div>
          <p className="text-slate-400 text-sm">Articles on Bitcoin, FIRE strategies, and more.</p>
          <p className="text-orange-400 text-sm mt-3 group-hover:underline">Read articles →</p>
        </Link>

        <Link
          to="/portfolio"
          className="bg-slate-800 border border-slate-700 hover:border-green-500/50 rounded-xl p-5 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-6 h-6 text-green-400" />
            <h3 className="text-white font-semibold">Portfolio Tracker</h3>
          </div>
          <p className="text-slate-400 text-sm">Track your BTC holdings, cost basis, and P&L.</p>
          <p className="text-green-400 text-sm mt-3 group-hover:underline">Open portfolio →</p>
        </Link>
      </div>
    </Layout>
  );
}
