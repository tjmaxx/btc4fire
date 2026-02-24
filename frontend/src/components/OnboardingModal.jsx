import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bitcoin, TrendingUp, Users, ArrowRight, X } from 'lucide-react';

const STORAGE_KEY = 'btc4fire_onboarded';

const STEPS = [
  {
    icon: Bitcoin,
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-400/10',
    title: 'Bitcoin is the hardest money ever created',
    content: (
      <div className="space-y-3 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
        <p>
          In a world where governments print unlimited money, Bitcoin offers something radical:{' '}
          <span className="text-gray-900 dark:text-white font-medium">a fixed supply of 21 million coins — forever.</span>
        </p>
        <div className="grid grid-cols-3 gap-3 my-4">
          {[
            { label: '21M', sub: 'Hard cap. No exceptions.' },
            { label: '15yr', sub: 'Track record. Never hacked.' },
            { label: '4yr', sub: 'Every cycle profitable.' },
          ].map(({ label, sub }) => (
            <div key={label} className="bg-gray-100 dark:bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-orange-400 font-bold text-lg">{label}</p>
              <p className="text-gray-500 dark:text-slate-400 text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-400 dark:text-slate-400 text-xs">
          BlackRock, Fidelity, and pension funds now hold Bitcoin. The question is no longer <em>if</em> — it's <em>how much</em>.
        </p>
      </div>
    ),
  },
  {
    icon: TrendingUp,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    title: 'The FIRE strategy meets Bitcoin',
    content: (
      <div className="space-y-3 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
        <p>
          FIRE (Financial Independence, Retire Early) is built on one idea: save aggressively, invest wisely, live off returns.
        </p>
        <div className="bg-gray-100 dark:bg-slate-700/50 rounded-lg p-4 my-3">
          <p className="text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-2">The 4% Rule</p>
          <p className="text-gray-900 dark:text-white font-mono text-sm">FIRE Number = Annual Expenses ÷ 0.04</p>
          <p className="text-gray-500 dark:text-slate-400 text-xs mt-2">$3,000/month → $900,000 FIRE target</p>
        </div>
        <p>
          A small BTC allocation — even 5–20% of your portfolio — can{' '}
          <span className="text-gray-900 dark:text-white font-medium">dramatically shorten your path to freedom</span> through Bitcoin's asymmetric upside.
        </p>
        <p className="text-gray-500 dark:text-slate-400 text-xs">
          Use our FIRE Calculator to see exactly how many years Bitcoin could shave off your timeline.
        </p>
      </div>
    ),
  },
  {
    icon: Users,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-400/10',
    title: 'Join a community of Bitcoin stackers',
    content: (
      <div className="space-y-3 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
        <p>BTC4Fire gives you everything to execute your Bitcoin FIRE strategy:</p>
        <ul className="space-y-2">
          {[
            'Live BTC price with AI trading signals',
            'DCA Calculator — see your accumulation curve',
            'FIRE Calculator — know your target date',
            'Portfolio tracker — cost basis + P&L',
            'Blog, forum, and resource library',
          ].map(item => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY));
  const [step, setStep] = useState(0);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  const { icon: StepIcon, iconColor, iconBg, title, content } = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-orange-400' : 'w-1.5 bg-gray-300 dark:bg-slate-600'}`}
              />
            ))}
          </div>
          <button onClick={dismiss} className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4`}>
            <StepIcon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-4">{title}</h2>
          {content}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <button
            onClick={dismiss}
            className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 text-sm transition-colors"
          >
            I'll explore first
          </button>
          {isLast ? (
            <Link
              to="/signup"
              onClick={dismiss}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
