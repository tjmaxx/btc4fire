import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bitcoin, TrendingUp, Users, BookOpen, MessageSquare, Layers, ExternalLink, Shield, Zap, BarChart2, ArrowRight, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';

const SAYLOR_QUOTES = [
  { quote: 'Bitcoin is the exit strategy.', context: 'On financial sovereignty' },
  { quote: 'If you don\'t buy Bitcoin, you\'re choosing to be poor.', context: 'On inflation vs. BTC' },
  { quote: 'Buy Bitcoin. It\'s the highest performing asset in human history.', context: 'On long-term returns' },
];

const STRATEGY_STATS = [
  { label: 'BTC Holdings', value: '717,131', sub: 'Bitcoin on balance sheet' },
  { label: 'Avg Buy Price', value: '~$76k', sub: 'Cost basis per BTC' },
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
  { label: 'Strategy Investor Page', url: 'https://www.strategy.com/btc', desc: 'Track Strategy\'s official BTC holdings and purchases.' },
  { label: 'Clark Moody Dashboard', url: 'https://bitcoin.clarkmoody.com', desc: 'On-chain BTC metrics and network health data.' },
  { label: 'FIRE & Bitcoin Forum', url: '/forum', desc: 'Discuss FIRE strategy with the BTC4Fire community.', internal: true },
  { label: 'r/Bitcoin', url: 'https://reddit.com/r/Bitcoin', desc: 'The largest Bitcoin community on Reddit.' },
];

const MYTHS = [
  {
    myth: '"Bitcoin is mainly used by criminals."',
    short: 'Blockchain is the most transparent financial system ever built.',
    rebuttal: `This is one of the oldest and most thoroughly debunked claims. The US Treasury, Chainalysis, and Elliptic all report that illicit activity represents less than 1% of all Bitcoin transactions — far lower than cash, which remains the primary vehicle for money laundering, drug trafficking, and tax evasion globally.

Every Bitcoin transaction is permanently recorded on a public ledger, traceable by anyone with an internet connection. Law enforcement agencies have repeatedly seized billions in criminal BTC precisely because the blockchain makes it easier to track than cash. The FBI, IRS-CI, and Europol actively use blockchain analytics to solve crimes.

The narrative was born when Bitcoin was new and unfamiliar. Today, regulated exchanges with KYC/AML requirements handle the vast majority of volume, and institutional investors — BlackRock, Fidelity, pension funds — hold billions in BTC. Associating Bitcoin with crime is like saying the internet is "for hackers."`,
  },
  {
    myth: '"Bitcoin has no intrinsic value."',
    short: 'Value is derived from scarcity, security, and network — the same as gold.',
    rebuttal: `The "intrinsic value" argument is a philosophical trap. Gold has no industrial use for most of its value — it is valued because of scarcity, durability, and human consensus. Fiat currency has no backing whatsoever beyond government decree. Yet nobody questions their value.

Bitcoin's value comes from several concrete properties: (1) Absolute scarcity — only 21 million will ever exist, enforced by code not trust; (2) Decentralisation — no single point of failure or control; (3) Immutability — transactions cannot be reversed or censored; (4) Portability — you can move $1 billion across borders in 10 minutes for a few dollars in fees; (5) Network effect — over 100 million users and growing.

BlackRock, in their Bitcoin ETF prospectus, described Bitcoin as "digital gold" and a legitimate store of value. When the largest asset manager in human history ($10 trillion AUM) calls Bitcoin valuable, the "no intrinsic value" argument collapses.`,
  },
  {
    myth: '"Bitcoin is too volatile to be a store of value."',
    short: 'Volatility is decreasing as adoption grows — and long-term holders always win.',
    rebuttal: `Yes, Bitcoin is volatile in the short term. But zoom out and the picture changes completely. Every single 4-year period in Bitcoin's history has been profitable. Every. Single. One. The worst possible time to buy — the peak of the 2017 bull run at $20k — still resulted in a 5x return if held to 2024.

Volatility is the price you pay for asymmetric upside. Gold was volatile when it was being adopted globally in the 1970s. Equities were volatile in the early 20th century. As Bitcoin's market cap grows, volatility structurally decreases — this is mathematically inevitable.

The FIRE approach handles volatility perfectly: Dollar Cost Averaging (DCA) removes timing risk entirely. Someone who bought $100 of BTC every week for the past 5 years would be significantly up regardless of when they started. Volatility is a feature for disciplined accumulators, not a bug.`,
  },
  {
    myth: '"Governments will ban Bitcoin."',
    short: 'Governments that tried to ban it failed. Most are now regulating and embracing it.',
    rebuttal: `China has "banned" Bitcoin at least five times since 2013. Each time, the network continued running without interruption. Bitcoin's decentralised architecture makes it technically impossible to ban — there is no server to seize, no CEO to arrest, no office to raid.

The global regulatory trajectory has moved sharply in the opposite direction. The US SEC approved spot Bitcoin ETFs from BlackRock and Fidelity in January 2024. The EU's MiCA framework provides legal clarity for crypto across all member states. El Salvador made Bitcoin legal tender. The UAE, Singapore, Switzerland, and Australia have established crypto-friendly regulatory frameworks.

In the US, Bitcoin is classified as a commodity by the CFTC, is held in regulated ETFs, and is a reserve asset of publicly traded companies. Any attempt to "ban" it would require outlawing private key ownership — as absurd as banning numbers. Governments are learning to regulate Bitcoin, not eliminate it.`,
  },
  {
    myth: '"Bitcoin wastes too much energy."',
    short: 'Bitcoin secures $1 trillion+ of value. Its energy use is a feature, not a flaw.',
    rebuttal: `Context matters enormously here. The global banking system consumes an estimated 263 TWh per year. Gold mining consumes ~130 TWh. Bitcoin mining consumes approximately 120–150 TWh — less than either, while securing a $1 trillion+ network without banks, clearing houses, or armies.

More importantly, Bitcoin mining is uniquely suited to use stranded, excess, and renewable energy. Because mining can be instantly switched on or off, it acts as a buyer of last resort for energy grids — stabilising renewable energy production by consuming excess solar and wind that would otherwise be wasted. Studies show 50–70% of Bitcoin mining uses renewable or sustainable energy sources, the highest proportion of any major industry.

Bitcoin miners in Texas are paid to shut down during peak demand, actively supporting grid stability. Volcanic energy in El Salvador, hydro in Norway and Paraguay, flared gas in the US oilfields — Bitcoin turns waste energy into monetary value. The "energy waste" narrative ignores the function that energy provides: an uncensorable, apolitical, global monetary settlement network.`,
  },
  {
    myth: '"Bitcoin is a Ponzi scheme / bubble."',
    short: 'Bitcoin has survived 5 crashes of 80%+ and recovered to new all-time highs each time.',
    rebuttal: `A Ponzi scheme requires a centralised operator paying early investors with money from new investors — Bernie Madoff, FTX, Bitconnect. Bitcoin has no CEO, no company, no promises of returns, no one to pay anyone. It is open-source software running on a decentralised network. Calling Bitcoin a Ponzi reveals a fundamental misunderstanding of what a Ponzi scheme is.

Bitcoin has been declared "dead" by mainstream media over 400 times. It has crashed 80%+ five separate times (2011, 2013, 2015, 2018, 2022). Each time, it recovered to new all-time highs. This is the opposite of a Ponzi — Ponzis collapse and never recover.

Real bubbles (Tulips, Dot-com, Mortgage-backed securities) do not recover. Bitcoin has a 15-year track record of surviving every crash, every ban, every hack, and every obituary. The institutions now holding it — BlackRock, Fidelity, MassMutual, Wisconsin pension funds — do not allocate capital to Ponzi schemes.`,
  },
  {
    myth: '"I\'ve missed the boat — it\'s too late and too expensive."',
    short: 'You can buy 0.00000001 BTC. "Too expensive" misunderstands how Bitcoin works.',
    rebuttal: `Bitcoin is divisible to 8 decimal places. The smallest unit — one Satoshi — is worth a fraction of a cent. You do not need to buy a "whole Bitcoin." When people say Bitcoin is "too expensive at $80,000," they are revealing that they don't understand you can buy $50 worth.

More importantly, consider where we actually are in adoption: roughly 300 million people own Bitcoin globally. That is less than 4% of the world's population. For comparison, 50% of Americans own equities. We are in the early innings, not the final quarter.

The same "too late" argument was made at $1, $100, $1,000, $10,000, and $50,000. Anyone who acted on that fear left life-changing returns on the table. Michael Saylor's view: the price of Bitcoin in 20 years will make today's price look trivially cheap. Whether he is right or wrong, the risk/reward of a small allocation remains compelling — your maximum loss is 100%, your potential gain is multiples.`,
  },
  {
    myth: '"Bitcoin will be replaced by a better cryptocurrency."',
    short: 'Bitcoin\'s simplicity, security, and network effect are its moat — not its features.',
    rebuttal: `This argument has been made since Litecoin in 2011. Ethereum, XRP, Solana, Cardano, Dogecoin — each was supposed to "replace" Bitcoin. None has. Bitcoin's market dominance has remained remarkably stable at 40–60% of total crypto market cap for over a decade.

The reason is that Bitcoin's value proposition is not speed or smart contracts — it is absolute scarcity, maximum decentralisation, and 15 years of unbroken security. No other network has Bitcoin's track record. Ethereum has had planned upgrades (The Merge), hard forks, and foundation control. Solana has experienced multiple network outages. Bitcoin's network has never been hacked, never gone offline, and has processed every transaction since January 2009.

Adding features to Bitcoin means adding attack surface and trust assumptions. Simplicity is a security feature. Bitcoin does one thing — be sound money — and does it better than any alternative. Gold wasn't replaced by a "better gold."`,
  },
  {
    myth: '"Quantum computers will break Bitcoin\'s encryption."',
    short: 'Quantum threats are known, monitored, and Bitcoin\'s protocol can adapt.',
    rebuttal: `This is a legitimate long-term consideration — not a near-term threat. Current quantum computers (as of 2025) have nowhere near the qubit count required to threaten Bitcoin's ECDSA encryption. Estimates from cryptographers suggest a cryptographically relevant quantum computer would require millions of stable qubits; the current state of the art is thousands of noisy qubits.

More importantly, Bitcoin is not static. It is a protocol that can be upgraded through community consensus. The Bitcoin developer community has been researching post-quantum cryptographic algorithms (including lattice-based cryptography) for years. NIST finalised post-quantum cryptography standards in 2024. Bitcoin can adopt these standards well before quantum computers become a genuine threat.

The same quantum threat applies to every bank, every government system, every SSL certificate, and every nuclear missile launch code on the planet. Bitcoin is not uniquely vulnerable — and it has a highly motivated, global community of the world's best cryptographers working on its security.`,
  },
  {
    myth: '"Bitcoin is too slow and can\'t scale for everyday use."',
    short: 'The Lightning Network processes millions of instant, near-free transactions today.',
    rebuttal: `Bitcoin's base layer processes ~7 transactions per second by design — it is a global settlement layer, not a payments processor. Comparing it to Visa's throughput is like complaining that gold bars are slow to carry compared to your wallet.

The Lightning Network, Bitcoin's Layer 2 scaling solution, solves this entirely. Lightning enables instant, near-zero-fee transactions (fractions of a cent) by routing payments through payment channels. It can theoretically process millions of transactions per second. El Salvador's national Bitcoin wallet (Chivo) runs on Lightning. Strike, Cash App, and thousands of merchants accept Lightning payments globally.

The architecture is deliberate: a maximally secure, decentralised base layer (Bitcoin) with fast, cheap payment layers on top (Lightning). This mirrors how the internet works — TCP/IP is the base protocol, HTTP and applications are built on top. Bitcoin is the TCP/IP of money. You don't need to understand TCP/IP to use the web, and you won't need to understand Lightning channels to spend Bitcoin.`,
  },
];

function MythAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {MYTHS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`rounded-xl border transition-colors ${isOpen ? 'border-orange-500/40 bg-orange-500/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left px-5 py-4 flex items-start gap-3"
            >
              <XCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${isOpen ? 'text-orange-400' : 'text-red-400/60'}`} />
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm transition-colors ${isOpen ? 'text-orange-300' : 'text-white/80'}`}>
                  {item.myth}
                </p>
                {!isOpen && (
                  <p className="text-white/40 text-xs mt-0.5">{item.short}</p>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-xs font-semibold uppercase tracking-wider">The Reality</p>
                </div>
                <div className="space-y-3">
                  {item.rebuttal.trim().split('\n\n').map((para, j) => (
                    <p key={j} className="text-white/70 text-sm leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

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
                Since August 2020, they have accumulated over 717,000 BTC, making them the largest corporate Bitcoin holder in the world.
                Their thesis: <span className="text-orange-300 font-medium">Bitcoin is the only rational savings asset in a world of infinite money printing.</span>
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                The same logic applies to personal FIRE planning. Instead of watching your savings erode to inflation,
                accumulate Bitcoin consistently — and let the fixed 21M supply work in your favour over a 10–20 year horizon.
              </p>
              <a
                href="https://www.strategy.com/btc"
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

        {/* Myths & Objections */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="text-2xl font-bold text-white">"But I heard Bitcoin…"</h2>
            <span className="text-xs text-white/30 mt-1.5 flex-shrink-0">Click to expand</span>
          </div>
          <p className="text-white/50 text-sm mb-6">The 10 most common objections — and the evidence-backed answers that put them to rest.</p>
          <MythAccordion />
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

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="bg-slate-900/80 border border-slate-700 rounded-xl px-6 py-5">
          <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Disclaimer</h3>
          <p className="text-white/40 text-xs leading-relaxed">
            BTC4Fire is an educational and community platform only. Nothing on this website constitutes financial, investment, tax, or legal advice. All content — including price data, trading signals, technical indicators, articles, and forum posts — is provided for informational and educational purposes only and should not be relied upon as a recommendation to buy, sell, or hold any asset. Cryptocurrency is highly volatile and you may lose some or all of your investment. Always do your own research (DYOR) and consult a qualified financial advisor before making any investment decisions. BTC4Fire, its creators, and contributors accept no responsibility or liability for any financial losses or damages arising from the use of this website or reliance on any information provided herein. Past performance is not indicative of future results.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-white/40 text-sm">
          <p>© 2025 BTC4Fire — Not financial advice. Always DYOR.</p>
          <div className="flex gap-6">
            <Link to="/blog"      className="hover:text-white/70 transition-colors">Blog</Link>
            <Link to="/forum"     className="hover:text-white/70 transition-colors">Forum</Link>
            <Link to="/resources" className="hover:text-white/70 transition-colors">Resources</Link>
            <a href="https://www.strategy.com/btc" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">Strategy Inc</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
