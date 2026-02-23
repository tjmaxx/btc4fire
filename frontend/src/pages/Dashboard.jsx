import React from 'react';
import { Link } from 'react-router-dom';
import { useRealtimePrice, useHistoricalPrice } from '../hooks/useRealtimePrice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, MessageSquare, BookOpen, Wallet } from 'lucide-react';
import Layout from '../components/Layout';

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
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 12 }} />
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
