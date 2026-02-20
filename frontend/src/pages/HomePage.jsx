import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bitcoin, TrendingUp, Users, BookOpen, MessageSquare, Layers, ExternalLink, Shield, Zap, BarChart2, ArrowRight } from 'lucide-react';

const SAYLOR_QUOTES = [
  { quote: 'Bitcoin is the exit strategy.', context: 'On financial sovereignty' },
  { quote: 'If you don\'t buy Bitcoin, you\'re choosing to be poor.', context: 'On inflation vs. BTC' },
  { quote: 'Buy Bitcoin. It\'s the highest performing asset in human history.', context: 'On long-term returns' },
];

const STRATEGY_STATS = [
  { label: 'BTC Holdings', value: '555,450+', sub: 'Bitcoin on balance sheet' },
  { label: 'Avg Buy Price', value: '~$68k', sub: 'Cost basis per BTC' },
  { label: 'Since', value: '2020', sub: 'Years of accumulation' },
  { label: 'Strategy', value: 'Never sell', sub: 'HODl as treasury reserve' },
];

const FIRE_PRINCIPLES = [
  {
    icon: Shield,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/20',
    title: 'Scarcity = Protection',
    desc: '21 million hard cap. No government, no central bank can inflate Bitcoin away. Your purchasing power is protected over time.',
  },
  {
    icon: TrendingUp,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
    title: 'Asymmetric Upside',
    desc: 'Even a small BTC allocation — 5–20% of a FIRE portfolio — can dramatically accelerate your path to financial independence.',
  },
  {
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/20',
    title: 'DCA Beats Timing',
    desc: 'Buy consistently every week or month regardless of price. Historically, any 4-year DCA window in BTC has been profitable.',
  },
  {
    icon: BarChart2,
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
    title: 'Self-Custody = Ownership',
    desc: 'Not your keys, not your coins. Move to a hardware wallet. Sovereignty is the whole point of Bitcoin — and of FIRE.',
  },
];

const BTC_NEWS_LINKS = [
  { label: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com', desc: 'The definitive source for Bitcoin news and analysis.' },
  { label: 'Michael Saylor on X', url: 'https://x.com/saylor', desc: 'Strategy CEO\'s real-time Bitcoin commentary.' },
  { label: 'Strategy Investor Page', url: 'https://www.strategy.com/bitcoin', desc: 'Track Strategy\'s official BTC holdings and purchases.' },
  { label: 'Clark Moody Dashboard', url: 'https://bitcoin.clarkmoody.com', desc: 'On-chain BTC metrics and network health data.' },
  { label: 'FIRE & Bitcoin Forum', url: '/forum', desc: 'Discuss FIRE strategy with the BTC4Fire community.', internal: true },
  { label: 'r/Bitcoin', url: 'https://reddit.com/r/Bitcoin', desc: 'The largest Bitcoin community on Reddit.' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-orange-900">

      {/* Navigation */}
      <nav className="bg-black/40 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-white">
            <Bitcoin className="w-7 h-7 text-orange-400" />
            BTC<span className="text-orange-400">4</span>FIRE
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/blog"      className="hidden sm:block text-white/70 hover:text-white text-sm transition-colors">Blog</Link>
            <Link to="/forum"     className="hidden sm:block text-white/70 hover:text-white text-sm transition-colors">Forum</Link>
            <Link to="/resources" className="hidden sm:block text-white/70 hover:text-white text-sm transition-colors">Resources</Link>
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login"  className="px-4 py-2 hover:bg-white/10 text-white text-sm rounded-lg transition-colors">Log In</Link>
                <Link to="/signup" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4">

        {/* Hero */}
        <div className="text-center py-20 mb-4">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5 text-orange-300 text-sm font-medium mb-6">
            <Bitcoin className="w-4 h-4" /> The Bitcoin FIRE Strategy
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-5 leading-tight">
            Stack Sats.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Retire Early.
            </span>
          </h1>
          <p className="text-xl text-white/70 mb-4 max-w-2xl mx-auto">
            Bitcoin is the most powerful tool for achieving Financial Independence. Buy it. Hold it. Let scarcity do the work.
          </p>
          <p className="text-white/40 text-sm mb-8 max-w-xl mx-auto">
            Inspired by the conviction of Strategy Inc (formerly MicroStrategy) — accumulate Bitcoin as your primary savings vehicle.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Start Stacking Sats <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link to="/blog"  className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors">Read the Blog</Link>
            <Link to="/forum" className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors">Join the Forum</Link>
          </div>
        </div>

        {/* Strategy Inc spotlight */}
        <div className="bg-gradient-to-r from-orange-900/40 to-slate-900/40 border border-orange-500/30 rounded-2xl p-8 mb-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-lg">S</div>
                <div>
                  <h2 className="text-xl font-bold text-white">Strategy Inc</h2>
                  <p className="text-orange-300 text-sm">Formerly MicroStrategy · The Bitcoin Treasury Company</p>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Strategy Inc, led by Michael Saylor, pioneered the corporate Bitcoin treasury strategy — converting cash reserves into Bitcoin rather than holding depreciating fiat.
                Since August 2020, they have accumulated over 555,000 BTC, making them the largest corporate Bitcoin holder in the world.
                Their thesis: <span className="text-orange-300 font-medium">Bitcoin is the only rational savings asset in a world of infinite money printing.</span>
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                The same logic applies to personal FIRE planning. Instead of watching your savings erode to inflation,
                accumulate Bitcoin consistently — and let the fixed 21M supply work in your favour over a 10–20 year horizon.
              </p>
              <a
                href="https://www.strategy.com/bitcoin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                View Strategy's BTC Holdings <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-3 lg:w-72 w-full flex-shrink-0">
              {STRATEGY_STATS.map(({ label, value, sub }) => (
                <div key={label} className="bg-black/30 rounded-xl p-4 border border-white/10">
                  <p className="text-white/40 text-xs mb-1">{label}</p>
                  <p className="text-white font-bold text-lg leading-tight">{value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Michael Saylor quotes */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {SAYLOR_QUOTES.map(({ quote, context }) => (
            <div key={quote} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-white/80 text-sm italic leading-relaxed mb-3">"{quote}"</p>
              <p className="text-orange-400 text-xs font-medium">— Michael Saylor · {context}</p>
            </div>
          ))}
        </div>

        {/* The FIRE + BTC Principles */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">The Bitcoin FIRE Principles</h2>
          <p className="text-white/50 text-sm mb-6">Why Bitcoin is the optimal savings vehicle for Financial Independence.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FIRE_PRINCIPLES.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className={`rounded-xl p-5 border ${bg}`}>
                <Icon className={`w-8 h-8 ${color} mb-3`} />
                <h3 className={`font-bold ${color} mb-2 text-sm`}>{title}</h3>
                <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform features */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">Everything You Need</h2>
          <p className="text-white/50 text-sm mb-6">Tools, community, and knowledge to execute your Bitcoin FIRE strategy.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Bitcoin,       color: 'text-orange-400', title: 'Live BTC Price',      desc: 'Real-time BTC/USD with 7-day chart, 24h change, and market cap.',         link: '/dashboard' },
              { icon: TrendingUp,    color: 'text-blue-400',   title: 'AI Signals',           desc: 'AI-powered buy/hold signals using RSI, MACD, and moving averages.',       link: '/dashboard' },
              { icon: BookOpen,      color: 'text-green-400',  title: 'Blog & Guides',        desc: 'Deep-dives on Bitcoin, FIRE maths, DCA strategies, and self-custody.',     link: '/blog' },
              { icon: MessageSquare, color: 'text-purple-400', title: 'Community Forum',      desc: 'Share FIRE numbers, DCA plans, and milestones with fellow stackers.',      link: '/forum' },
              { icon: Layers,        color: 'text-yellow-400', title: 'Resource Library',     desc: 'Curated books, tools, and courses — from Bitcoin basics to cold storage.',  link: '/resources' },
              { icon: Users,         color: 'text-pink-400',   title: 'Portfolio Tracker',    desc: 'Track BTC holdings, cost basis, and P&L in real time. Coming Phase 3.',    link: '/dashboard' },
            ].map(({ icon: Icon, color, title, desc, link }) => (
              <Link
                key={title}
                to={link}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all group"
              >
                <Icon className={`w-10 h-10 ${color} mb-3`} />
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Bitcoin information & news links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">Stay Informed</h2>
          <p className="text-white/50 text-sm mb-6">Essential sources for Bitcoin news, data, and community.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BTC_NEWS_LINKS.map(({ label, url, desc, internal }) => (
              internal ? (
                <Link
                  key={label}
                  to={url}
                  className="bg-white/5 border border-white/10 hover:border-orange-500/40 rounded-xl p-5 transition-all group flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors">{label}</span>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                </Link>
              ) : (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 border border-white/10 hover:border-orange-500/40 rounded-xl p-5 transition-all group flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors">{label}</span>
                    <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                </a>
              )
            ))}
          </div>
        </div>

        {/* CTA banner */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-orange-600/30 to-blue-600/30 border border-orange-500/30 rounded-2xl p-10 text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to Start Stacking?</h2>
            <p className="text-white/60 mb-6 max-w-lg mx-auto text-sm">
              Join a community of Bitcoiners on the path to Financial Independence. Track prices, read strategies, and build your stack — one sat at a time.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all hover:scale-105"
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-white/40 text-sm">
          <p>© 2025 BTC4Fire — Not financial advice. Always DYOR.</p>
          <div className="flex gap-6">
            <Link to="/blog"      className="hover:text-white/70 transition-colors">Blog</Link>
            <Link to="/forum"     className="hover:text-white/70 transition-colors">Forum</Link>
            <Link to="/resources" className="hover:text-white/70 transition-colors">Resources</Link>
            <a href="https://www.strategy.com/bitcoin" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">Strategy Inc</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
