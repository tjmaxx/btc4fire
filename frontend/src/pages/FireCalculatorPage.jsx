import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimePrice } from '../hooks/useRealtimePrice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Layout from '../components/Layout';
import { Target, Bitcoin, DollarSign, Flame } from 'lucide-react';

const fmt$ = (v, d = 0) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: d }).format(v || 0);

export default function FireCalculatorPage() {
  const [monthlyExpenses, setMonthlyExpenses] = useState('3000');
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [annualReturn, setAnnualReturn] = useState(20);
  const [currentSavings, setCurrentSavings] = useState('0');

  const { price: priceData } = useRealtimePrice();
  const currentPrice = priceData?.price ?? null;

  const expenses = parseFloat(monthlyExpenses) || 0;
  const savings = parseFloat(currentSavings) || 0;
  const rate = withdrawalRate / 100;
  const growth = annualReturn / 100;

  const results = useMemo(() => {
    if (!expenses) return null;
    const fireNumber = (expenses * 12) / rate;
    const btcNeeded = currentPrice ? fireNumber / currentPrice : null;
    const btcCurrent = currentPrice && savings ? savings / currentPrice : null;

    // Years to FIRE via compound growth: FV = PV * (1+r)^n → n = log(FV/PV) / log(1+r)
    let yearsToFire = null;
    if (savings > 0 && growth > 0 && fireNumber > savings) {
      yearsToFire = Math.log(fireNumber / savings) / Math.log(1 + growth);
    } else if (savings >= fireNumber) {
      yearsToFire = 0;
    }

    // Chart: 30-year projection
    const chartData = Array.from({ length: 31 }, (_, yr) => ({
      year: `Y${yr}`,
      value: parseFloat((savings * Math.pow(1 + growth, yr)).toFixed(0)),
      target: parseFloat(fireNumber.toFixed(0)),
    }));

    return { fireNumber, btcNeeded, btcCurrent, yearsToFire, chartData };
  }, [expenses, rate, growth, savings, currentPrice]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Flame className="w-7 h-7 text-orange-400" />
            <h1 className="text-3xl font-bold text-white">FIRE Calculator</h1>
          </div>
          <p className="text-slate-400 ml-10">
            Calculate your FIRE number and how much Bitcoin you need to retire early.
          </p>
        </div>

        {/* Inputs */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Monthly Expenses (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number" min="1" step="100"
                  value={monthlyExpenses}
                  onChange={e => setMonthlyExpenses(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 text-white pl-7 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Current Bitcoin Savings (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number" min="0" step="1000"
                  value={currentSavings}
                  onChange={e => setCurrentSavings(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 text-white pl-7 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Safe Withdrawal Rate: <span className="text-orange-400">{withdrawalRate}%</span>
              </label>
              <input
                type="range" min="2" max="6" step="0.5"
                value={withdrawalRate}
                onChange={e => setWithdrawalRate(parseFloat(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>2% (conservative)</span><span>6% (aggressive)</span>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Expected Annual BTC Return: <span className="text-orange-400">{annualReturn}%</span>
              </label>
              <input
                type="range" min="0" max="50" step="5"
                value={annualReturn}
                onChange={e => setAnnualReturn(parseInt(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span><span>50%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-xl p-5 border border-orange-500/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-xs font-medium">FIRE Number</p>
                  <Target className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-white text-2xl font-bold">{fmt$(results.fireNumber)}</p>
                <p className="text-slate-500 text-xs mt-0.5">at {withdrawalRate}% withdrawal</p>
              </div>

              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-xs font-medium">BTC Needed</p>
                  <Bitcoin className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-white text-2xl font-bold">
                  {results.btcNeeded != null ? results.btcNeeded.toFixed(4) : '—'}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">BTC at current price</p>
              </div>

              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-xs font-medium">You Have</p>
                  <DollarSign className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-white text-2xl font-bold">
                  {results.btcCurrent != null ? results.btcCurrent.toFixed(4) : '—'}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">BTC currently</p>
              </div>

              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-xs font-medium">Years to FIRE</p>
                  <Flame className="w-4 h-4 text-yellow-400" />
                </div>
                {results.yearsToFire === 0 ? (
                  <p className="text-green-400 text-2xl font-bold">Now! 🎯</p>
                ) : results.yearsToFire != null ? (
                  <p className="text-white text-2xl font-bold">{results.yearsToFire.toFixed(1)}</p>
                ) : (
                  <p className="text-slate-500 text-2xl font-bold">—</p>
                )}
                <p className="text-slate-500 text-xs mt-0.5">at {annualReturn}% annual growth</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-6">
              <h2 className="text-white font-semibold mb-4">30-Year Projection</h2>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={results.chartData}>
                  <CartesianGrid stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => '$' + (v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : (v / 1000).toFixed(0) + 'k')} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                    formatter={(v, name) => [fmt$(v), name === 'value' ? 'Portfolio' : 'FIRE Target']}
                  />
                  <ReferenceLine y={results.fireNumber} stroke="#f97316" strokeDasharray="4 3" label={{ value: 'FIRE', fill: '#f97316', fontSize: 11 }} />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} strokeWidth={2} name="value" />
                  <Line type="monotone" dataKey="target" stroke="#f97316" dot={false} strokeWidth={1} strokeDasharray="4 3" name="target" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-slate-600 text-xs mt-2 text-center">Assumes {annualReturn}% annual BTC return compounded yearly. Not financial advice.</p>
            </div>

            {/* Insight */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5 mb-6">
              <p className="text-orange-300 text-sm leading-relaxed">
                <span className="font-semibold">The math:</span> To spend {fmt$(expenses)}/month in retirement using a {withdrawalRate}% withdrawal rate,
                you need a portfolio of <span className="font-semibold text-white">{fmt$(results.fireNumber)}</span>.
                {results.btcNeeded != null && (
                  <> At today's price that's{' '}
                    <span className="font-semibold text-white">{results.btcNeeded.toFixed(4)} BTC</span>
                    {' '}({fmt$(currentPrice, 0)}/BTC).
                  </>
                )}
              </p>
            </div>
          </>
        )}

        {/* CTA */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-center">
          <p className="text-slate-300 mb-3">Start tracking your Bitcoin stack toward your FIRE goal.</p>
          <Link
            to="/portfolio"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Track My Portfolio →
          </Link>
        </div>
      </div>
    </Layout>
  );
}
