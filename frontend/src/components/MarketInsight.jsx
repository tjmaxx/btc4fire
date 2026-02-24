import React from 'react';
import { Bot, TrendingDown, TrendingUp, Minus, Zap } from 'lucide-react';
import { useMarketInsight } from '../hooks/useMarketInsight';
import Tooltip from './Tooltip';

const SIGNAL_CONFIG = {
  STRONG_DCA: {
    label: 'Strong DCA Zone',
    desc:  'Significantly below ATH — historically a high-conviction accumulation window.',
    color:       'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bg:          'bg-emerald-900/20',
    badgeBg:     'bg-emerald-500/15',
    Icon: TrendingDown,
  },
  DCA: {
    label: 'Good DCA Zone',
    desc:  'Meaningful discount from ATH — a solid window to build your stack.',
    color:       'text-orange-400',
    borderColor: 'border-orange-500/30',
    bg:          'bg-orange-900/20',
    badgeBg:     'bg-orange-500/15',
    Icon: Zap,
  },
  HOLD: {
    label: 'Hold & Accumulate',
    desc:  'Moderate distance from ATH — stay the course with your regular DCA plan.',
    color:       'text-blue-400',
    borderColor: 'border-blue-500/30',
    bg:          'bg-blue-900/20',
    badgeBg:     'bg-blue-500/15',
    Icon: Minus,
  },
  NEAR_ATH: {
    label: 'Near All-Time High',
    desc:  'Price is close to ATH — patience if undeployed; conviction holders, keep holding.',
    color:       'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    bg:          'bg-yellow-900/20',
    badgeBg:     'bg-yellow-500/15',
    Icon: TrendingUp,
  },
};

function Skeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-white/10 rounded-xl flex-shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 bg-white/10 rounded w-40" />
          <div className="h-2.5 bg-white/10 rounded w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-11/12" />
        <div className="h-3 bg-white/10 rounded w-4/6" />
      </div>
    </div>
  );
}

export default function MarketInsight() {
  const { insight, loading, error } = useMarketInsight();

  if (loading) return <Skeleton />;
  if (error || !insight) return null;

  const cfg = SIGNAL_CONFIG[insight.signal] ?? SIGNAL_CONFIG.HOLD;
  const { Icon } = cfg;

  const pctFromAth = insight.pct_from_ath != null
    ? `${Math.abs(insight.pct_from_ath).toFixed(1)}% below ATH`
    : null;

  const updatedLabel = new Date(insight.generated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className={`${cfg.bg} border ${cfg.borderColor} rounded-2xl p-6 mb-10`}>

      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Bot icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.badgeBg} flex-shrink-0`}>
          <Bot className={`w-5 h-5 ${cfg.color}`} />
        </div>

        {/* Signal badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${cfg.badgeBg}`}>
          <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
          <span className={`text-xs font-bold tracking-wide ${cfg.color}`}>{cfg.label}</span>
        </div>

        {/* Price pill */}
        <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
          BTC ${insight.btc_price?.toLocaleString()}
        </span>

        {pctFromAth && (
          <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs">
            {pctFromAth}
          </span>
        )}

        <span className="ml-auto text-white/30 text-xs flex-shrink-0">
          Updated {updatedLabel}
        </span>
      </div>

      {/* Signal context line */}
      <p className={`text-xs font-medium ${cfg.color} mb-3`}>{cfg.desc}</p>

      {/* AI message */}
      <p className="text-white/80 text-sm leading-relaxed mb-4">{insight.message}</p>

      {/* Definitions row */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3">
        {[
          { term: 'DCA',  full: 'Dollar Cost Averaging', def: 'Buying a fixed dollar amount on a regular schedule regardless of price — removes the need to time the market.' },
          { term: 'ATH',  full: 'All-Time High',         def: 'The highest price Bitcoin has ever traded at. Distance from ATH is a key gauge of where we are in the cycle.' },
          { term: 'FIRE', full: 'Financial Independence, Retire Early', def: 'A strategy of aggressive saving and investing to achieve financial freedom and retire on your own schedule.' },
          { term: 'Sats', full: 'Satoshis',              def: '1 BTC = 100,000,000 satoshis (sats). The smallest unit of Bitcoin — useful for thinking in small amounts.' },
        ].map(({ term, full, def }) => (
          <Tooltip key={term} text={`${full} — ${def}`}>
            <span className="text-white/40 text-xs">{term}</span>
          </Tooltip>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        <Bot className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
        <p className="text-white/30 text-xs">
          AI-generated daily insight · Educational only — not financial advice · Refreshes once per day
        </p>
      </div>
    </div>
  );
}
