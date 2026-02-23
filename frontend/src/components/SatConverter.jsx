import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimePrice } from '../hooks/useRealtimePrice';
import { Zap } from 'lucide-react';

const SATS_PER_BTC = 100_000_000;

export default function SatConverter() {
  const { price: priceData, loading } = useRealtimePrice();
  const btcPrice = priceData?.price ?? null;

  const [mode, setMode] = useState('usd'); // 'usd' | 'sats'
  const [value, setValue] = useState('');

  const sats = (() => {
    if (!btcPrice || !value) return null;
    if (mode === 'usd') return Math.round((parseFloat(value) / btcPrice) * SATS_PER_BTC);
    return Math.round(parseFloat(value));
  })();

  const usd = (() => {
    if (!btcPrice || !value) return null;
    if (mode === 'sats') return (parseFloat(value) / SATS_PER_BTC) * btcPrice;
    return parseFloat(value);
  })();

  const dcaAmount = mode === 'usd' ? value : usd?.toFixed(2) ?? '';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h3 className="text-white font-semibold">Satoshi Converter</h3>
        {btcPrice && (
          <span className="ml-auto text-slate-500 text-xs">
            1 BTC = {SATS_PER_BTC.toLocaleString()} sats
          </span>
        )}
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-lg overflow-hidden border border-slate-600 mb-4 text-sm">
        <button
          onClick={() => { setMode('usd'); setValue(''); }}
          className={`flex-1 py-2 font-medium transition-colors ${mode === 'usd' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
        >
          USD → Sats
        </button>
        <button
          onClick={() => { setMode('sats'); setValue(''); }}
          className={`flex-1 py-2 font-medium transition-colors ${mode === 'sats' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
        >
          Sats → USD
        </button>
      </div>

      {/* Input */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
          {mode === 'usd' ? '$' : '⚡'}
        </span>
        <input
          type="number"
          min="0"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={mode === 'usd' ? '100' : '1000000'}
          className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-600 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {/* Result */}
      <div className="bg-slate-900 rounded-lg p-4 min-h-[64px] flex flex-col justify-center">
        {loading ? (
          <div className="h-4 bg-slate-700 rounded animate-pulse w-1/2" />
        ) : !btcPrice ? (
          <p className="text-slate-500 text-sm">Price unavailable</p>
        ) : !value || isNaN(parseFloat(value)) ? (
          <p className="text-slate-600 text-sm">Enter a value above</p>
        ) : mode === 'usd' ? (
          <>
            <p className="text-yellow-400 font-bold text-xl">{sats?.toLocaleString()} sats</p>
            <p className="text-slate-500 text-xs mt-0.5">{(sats / SATS_PER_BTC).toFixed(8)} BTC</p>
          </>
        ) : (
          <>
            <p className="text-green-400 font-bold text-xl">${usd?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</p>
            <p className="text-slate-500 text-xs mt-0.5">{(parseFloat(value) / SATS_PER_BTC).toFixed(8)} BTC</p>
          </>
        )}
      </div>

      {/* DCA CTA */}
      {value && !isNaN(parseFloat(value)) && dcaAmount && (
        <div className="mt-3">
          <Link
            to={`/dca?amount=${dcaAmount}`}
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            Stack {mode === 'usd' ? `$${parseFloat(dcaAmount).toLocaleString()}` : `$${parseFloat(dcaAmount).toFixed(2)}`}/month via DCA →
          </Link>
        </div>
      )}
    </div>
  );
}
