import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { useRealtimePrice } from '../hooks/useRealtimePrice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import {
  Plus, Trash2, TrendingUp, TrendingDown, Bitcoin,
  DollarSign, Target, ChevronUp, BarChart2, X, Download,
} from 'lucide-react';

function exportCSV(purchases) {
  const rows = [
    ['Date', 'BTC Amount', 'Buy Price (USD)', 'Cost (USD)', 'Notes'],
    ...purchases.map(p => [
      p.purchase_date,
      p.btc_amount,
      p.purchase_price_usd,
      (Number(p.btc_amount) * Number(p.purchase_price_usd)).toFixed(2),
      p.notes || '',
    ]),
  ];
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'btc-portfolio.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

const fmt$ = (v, d = 0) => {
  if (v == null || isNaN(v)) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: d }).format(v);
};
const fmtPct = (v) => {
  if (v == null || isNaN(v)) return '—';
  return (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
};

const EMPTY_FORM = {
  btc_amount: '',
  purchase_price_usd: '',
  purchase_date: new Date().toISOString().slice(0, 10),
  notes: '',
};

export default function PortfolioPage() {
  const { user } = useAuth();
  const { price: priceData, loading: priceLoading } = useRealtimePrice();
  const currentPrice = priceData?.price ?? null;

  const [purchases, setPurchases]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [formError, setFormError]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting]     = useState(null);
  const [fireTarget, setFireTarget] = useState(null);

  // ── Load purchases + FIRE target ─────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [purchasesRes, profileRes] = await Promise.all([
        supabase
          .from('btc_purchases')
          .select('*')
          .eq('user_id', user.id)
          .order('purchase_date', { ascending: false }),
        supabase
          .from('profiles')
          .select('fire_target')
          .eq('id', user.id)
          .single(),
      ]);
      if (purchasesRes.data)           setPurchases(purchasesRes.data);
      if (profileRes.data?.fire_target) setFireTarget(Number(profileRes.data.fire_target));
      setLoading(false);
    })();
  }, [user]);

  // ── Portfolio-level stats ─────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!purchases.length) return null;
    const totalBTC      = purchases.reduce((s, p) => s + Number(p.btc_amount), 0);
    const totalInvested = purchases.reduce((s, p) => s + Number(p.btc_amount) * Number(p.purchase_price_usd), 0);
    const avgBuyPrice   = totalInvested / totalBTC;
    const currentValue  = currentPrice != null ? totalBTC * currentPrice : null;
    const pnl           = currentValue != null ? currentValue - totalInvested : null;
    const pnlPct        = pnl != null ? (pnl / totalInvested) * 100 : null;
    return { totalBTC, totalInvested, avgBuyPrice, currentValue, pnl, pnlPct };
  }, [purchases, currentPrice]);

  // ── Running total chart data (cumulative BTC & value over time) ───────────
  const chartData = useMemo(() => {
    if (!purchases.length || currentPrice == null) return [];
    const sorted = [...purchases].sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date));
    let cumBTC = 0;
    let cumCost = 0;
    return sorted.map(p => {
      cumBTC  += Number(p.btc_amount);
      cumCost += Number(p.btc_amount) * Number(p.purchase_price_usd);
      return {
        date:  new Date(p.purchase_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
        value: parseFloat((cumBTC * currentPrice).toFixed(2)),
        cost:  parseFloat(cumCost.toFixed(2)),
      };
    });
  }, [purchases, currentPrice]);

  const fireProgress = stats?.currentValue != null && fireTarget
    ? (stats.currentValue / fireTarget) * 100
    : null;
  const fireAchieved = fireProgress !== null && fireProgress >= 100;

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(form.btc_amount);
    const price  = parseFloat(form.purchase_price_usd);
    if (!amount || amount <= 0) { setFormError('Enter a valid BTC amount.'); return; }
    if (!price  || price  <= 0) { setFormError('Enter a valid purchase price.'); return; }
    setSubmitting(true);
    setFormError('');

    const { data, error } = await supabase
      .from('btc_purchases')
      .insert({
        user_id:            user.id,
        btc_amount:         amount,
        purchase_price_usd: price,
        purchase_date:      form.purchase_date,
        notes:              form.notes.trim() || null,
      })
      .select()
      .single();

    if (error) {
      setFormError('Failed to save. Please try again.');
      setSubmitting(false);
      return;
    }
    setPurchases(prev =>
      [data, ...prev].sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date))
    );
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    const { error } = await supabase.from('btc_purchases').delete().eq('id', id);
    if (!error) setPurchases(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">Log your Bitcoin purchases and track unrealized P&L in real time.</p>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setFormError(''); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
        >
          {showForm ? <><ChevronUp className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Purchase</>}
        </button>
      </div>

      {/* Add Purchase form */}
      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-6">
          <h2 className="text-white font-semibold mb-4">Log a Bitcoin Purchase</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">BTC Amount *</label>
              <input
                type="number" step="0.00000001" min="0"
                placeholder="0.01"
                value={form.btc_amount}
                onChange={e => setForm(f => ({ ...f, btc_amount: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Price Paid per BTC (USD) *</label>
              <input
                type="number" step="0.01" min="0"
                placeholder="85000"
                value={form.purchase_price_usd}
                onChange={e => setForm(f => ({ ...f, purchase_price_usd: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Purchase Date *</label>
              <input
                type="date"
                value={form.purchase_date}
                onChange={e => setForm(f => ({ ...f, purchase_date: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Notes</label>
              <input
                type="text"
                placeholder="DCA, lump sum, exchange..."
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {formError && (
              <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-2 text-red-400 text-sm">
                <X className="w-4 h-4 flex-shrink-0" />{formError}
              </div>
            )}

            <div className="sm:col-span-2 lg:col-span-4">
              <button
                type="submit" disabled={submitting}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {submitting ? 'Saving…' : 'Save Purchase'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>

      ) : purchases.length === 0 ? (
        /* Empty state */
        <div className="text-center py-24 bg-slate-800/50 rounded-xl border border-slate-700">
          <Bitcoin className="w-14 h-14 text-slate-600 mx-auto mb-4" />
          <p className="text-white font-semibold mb-1">No purchases logged yet</p>
          <p className="text-slate-500 text-sm mb-5">Click "Add Purchase" above to log your first Bitcoin buy.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add your first purchase
          </button>
        </div>

      ) : (
        <>
          {/* ── Summary cards ────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total BTC */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-xs font-medium">Total BTC</p>
                <Bitcoin className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-white text-2xl font-bold">{stats?.totalBTC?.toFixed(6)}</p>
              <p className="text-slate-500 text-xs mt-0.5">BTC held</p>
            </div>

            {/* Avg buy price */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-xs font-medium">Avg Buy Price</p>
                <DollarSign className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-white text-2xl font-bold">{fmt$(stats?.avgBuyPrice)}</p>
              <p className="text-slate-500 text-xs mt-0.5">per BTC (cost basis)</p>
            </div>

            {/* Current value */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-xs font-medium">Current Value</p>
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
              {priceLoading ? (
                <div className="h-8 bg-slate-700 rounded animate-pulse" />
              ) : (
                <>
                  <p className="text-white text-2xl font-bold">{fmt$(stats?.currentValue)}</p>
                  <p className="text-slate-500 text-xs mt-0.5">@ {fmt$(currentPrice)}/BTC</p>
                </>
              )}
            </div>

            {/* Unrealized P&L */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-xs font-medium">Unrealized P&L</p>
                {(stats?.pnl ?? 0) >= 0
                  ? <TrendingUp  className="w-4 h-4 text-green-400" />
                  : <TrendingDown className="w-4 h-4 text-red-400" />}
              </div>
              {priceLoading ? (
                <div className="h-8 bg-slate-700 rounded animate-pulse" />
              ) : (
                <>
                  <p className={`text-2xl font-bold ${(stats?.pnl ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {fmt$(stats?.pnl)}
                  </p>
                  <p className={`text-xs mt-0.5 ${(stats?.pnl ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {fmtPct(stats?.pnlPct)} on {fmt$(stats?.totalInvested)} invested
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ── FIRE progress bar ─────────────────────────────────────────── */}
          {fireTarget != null && stats?.currentValue != null && (
            <div className={`border rounded-xl p-5 mb-6 ${fireAchieved ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-slate-800 border-slate-700'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Target className={`w-5 h-5 ${fireAchieved ? 'text-yellow-400' : 'text-orange-400'}`} />
                <h2 className="text-white font-semibold">
                  {fireAchieved ? '🎯 FIRE Target Achieved!' : 'FIRE Target Progress'}
                </h2>
                <span className="ml-auto text-slate-400 text-sm">Goal: {fmt$(fireTarget)}</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${fireAchieved ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' : 'bg-gradient-to-r from-orange-500 to-yellow-400'}`}
                  style={{ width: `${Math.min(fireProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                {fireAchieved ? (
                  <>
                    <span className="text-yellow-400 font-medium">{fireProgress?.toFixed(1)}% — goal exceeded by {fmt$(stats.currentValue - fireTarget)}</span>
                    <span className="text-yellow-400">Keep stacking!</span>
                  </>
                ) : (
                  <>
                    <span>{fireProgress?.toFixed(1)}% of FIRE target</span>
                    <span>{fmt$(fireTarget - stats.currentValue)} remaining</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── Portfolio value chart ─────────────────────────────────────── */}
          {chartData.length > 1 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-white font-semibold">Cumulative Portfolio Value</h2>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                    formatter={(v, name) => [fmt$(v), name === 'value' ? 'Current Value' : 'Total Invested']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#f97316" dot={false} strokeWidth={2} name="value" />
                  <Line type="monotone" dataKey="cost"  stroke="#3b82f6" dot={false} strokeWidth={2} strokeDasharray="4 3" name="cost" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-orange-400 inline-block rounded" /> Current Value</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-400 inline-block rounded border-dashed" /> Total Invested</span>
              </div>
            </div>
          )}

          {/* ── Purchase history table ────────────────────────────────────── */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-white font-semibold">Purchase History</h2>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-xs">
                  {purchases.length} {purchases.length === 1 ? 'entry' : 'entries'} · {fmt$(stats?.totalInvested)} total invested
                </span>
                <button
                  onClick={() => exportCSV(purchases)}
                  title="Export to CSV"
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs border-b border-slate-700/50">
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                    <th className="text-right px-4 py-3 font-medium">BTC</th>
                    <th className="text-right px-4 py-3 font-medium">Buy Price</th>
                    <th className="text-right px-4 py-3 font-medium">Cost</th>
                    <th className="text-right px-4 py-3 font-medium">Value Now</th>
                    <th className="text-right px-5 py-3 font-medium">P&L</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Notes</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {purchases.map(p => {
                    const cost     = Number(p.btc_amount) * Number(p.purchase_price_usd);
                    const valueNow = currentPrice != null ? Number(p.btc_amount) * currentPrice : null;
                    const rowPnl   = valueNow != null ? valueNow - cost : null;
                    const rowPnlPct = rowPnl != null ? (rowPnl / cost) * 100 : null;
                    const isProfit = (rowPnl ?? 0) >= 0;

                    return (
                      <tr key={p.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                        <td className="px-5 py-3.5 text-slate-300 whitespace-nowrap">
                          {new Date(p.purchase_date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 py-3.5 text-right text-orange-300 font-mono whitespace-nowrap">
                          {Number(p.btc_amount).toFixed(6)}
                        </td>
                        <td className="px-4 py-3.5 text-right text-slate-300 whitespace-nowrap">
                          {fmt$(Number(p.purchase_price_usd))}
                        </td>
                        <td className="px-4 py-3.5 text-right text-slate-300 whitespace-nowrap">
                          {fmt$(cost)}
                        </td>
                        <td className="px-4 py-3.5 text-right text-slate-300 whitespace-nowrap">
                          {valueNow != null ? fmt$(valueNow) : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          {rowPnl != null ? (
                            <span className={isProfit ? 'text-green-400' : 'text-red-400'}>
                              {fmt$(rowPnl)}{' '}
                              <span className="text-xs opacity-70">({fmtPct(rowPnlPct)})</span>
                            </span>
                          ) : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 text-xs max-w-xs truncate hidden md:table-cell">
                          {p.notes || <span className="text-slate-700">—</span>}
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deleting === p.id}
                            title="Delete purchase"
                            className="p-1.5 text-slate-600 hover:text-red-400 disabled:opacity-40 transition-colors rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
