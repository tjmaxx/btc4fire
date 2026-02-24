import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bitcoin, TrendingUp, Users, BookOpen, MessageSquare, Layers, ExternalLink, ArrowRight } from 'lucide-react';
import { SAYLOR_QUOTES, STRATEGY_STATS, FIRE_PRINCIPLES, BTC_NEWS_LINKS } from '../data/homeContent';
import MythAccordion from '../components/MythAccordion';
import OnboardingModal from '../components/OnboardingModal';
import BTCvsSnP from '../components/BTCvsSnP';
import Navbar from '../components/Navbar';
import MarketInsight from '../components/MarketInsight';
import ScrollSection from '../components/ScrollSection';
import ScrollProgress from '../components/ScrollProgress';

/* ─── layout helpers ─────────────────────────────────────────────────────── */

function Section({ children, tint = false }) {
  return (
    <section className={`py-20 ${tint ? 'bg-black/20' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">{children}</div>
    </section>
  );
}

function Divider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-8" />;
}

/* ─── static data ────────────────────────────────────────────────────────── */

const GLOSSARY = [
  { term: 'DCA',          full: 'Dollar Cost Averaging',               color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-900/10',  def: 'Buying a fixed dollar amount of Bitcoin on a regular schedule (weekly, monthly) regardless of price. Removes the stress of market timing and smooths out your average cost.' },
  { term: 'FIRE',         full: 'Financial Independence, Retire Early', color: 'text-blue-400',   border: 'border-blue-500/20',   bg: 'bg-blue-900/10',    def: 'A movement built on aggressive saving and investing to reach a point where you no longer need to work for money. Bitcoin accelerates the timeline thanks to its fixed supply.' },
  { term: 'ATH',          full: 'All-Time High',                        color: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-900/10',  def: 'The highest price Bitcoin has ever traded at. How far below ATH we are right now is one of the most watched indicators — bigger discounts historically offer better entry points.' },
  { term: 'Sats',         full: 'Satoshis',                             color: 'text-emerald-400',border: 'border-emerald-500/20',bg: 'bg-emerald-900/10', def: "1 Bitcoin = 100,000,000 satoshis. You don't need to buy a whole Bitcoin — stack sats (fractions) over time. Think of sats like cents are to a dollar, but far more scarce." },
  { term: 'HODL',         full: 'Hold On for Dear Life',                color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-900/10',  def: "A meme-born philosophy: don't sell during dips or fear. Long-term holders who didn't sell through past crashes (−80%) saw life-changing gains in subsequent bull markets." },
  { term: '4% Rule',      full: 'Safe Withdrawal Rate',                 color: 'text-pink-400',   border: 'border-pink-500/20',   bg: 'bg-pink-900/10',    def: 'A FIRE guideline: withdraw 4% of your portfolio per year and it statistically lasts 30+ years. FIRE number = annual expenses ÷ 0.04. E.g. $40k/yr → $1M target.' },
  { term: 'Stack',        full: 'Accumulating Bitcoin',                 color: 'text-cyan-400',   border: 'border-cyan-500/20',   bg: 'bg-cyan-900/10',    def: 'To "stack" means to continuously accumulate more Bitcoin or sats over time, usually through DCA. The goal is to increase BTC holdings regardless of short-term price moves.' },
  { term: 'Self-Custody', full: 'Holding Your Own Keys',                color: 'text-rose-400',   border: 'border-rose-500/20',   bg: 'bg-rose-900/10',    def: '"Not your keys, not your coins." Self-custody means storing Bitcoin in a wallet you control (hardware wallet) rather than on an exchange — protects against exchange collapses.' },
];

const FEATURES = [
  { icon: Bitcoin,       color: 'text-orange-400', title: 'Live BTC Price',   desc: 'Real-time BTC/USD with 7-day chart, 24h change, and market cap.',         link: '/dashboard' },
  { icon: TrendingUp,    color: 'text-blue-400',   title: 'AI Signals',        desc: 'AI-powered buy/hold signals using RSI, MACD, and moving averages.',       link: '/dashboard' },
  { icon: BookOpen,      color: 'text-green-400',  title: 'Blog & Guides',     desc: 'Deep-dives on Bitcoin, FIRE maths, DCA strategies, and self-custody.',     link: '/blog' },
  { icon: MessageSquare, color: 'text-purple-400', title: 'Community Forum',   desc: 'Share FIRE numbers, DCA plans, and milestones with fellow stackers.',      link: '/forum' },
  { icon: Layers,        color: 'text-yellow-400', title: 'Resource Library',  desc: 'Curated books, tools, and courses — from Bitcoin basics to cold storage.', link: '/resources' },
  { icon: Users,         color: 'text-pink-400',   title: 'Portfolio Tracker', desc: 'Log BTC purchases, track cost basis, unrealized P&L, and FIRE progress.', link: '/portfolio' },
];

/* ─── page ───────────────────────────────────────────────────────────────── */

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <OnboardingModal />
      <Navbar />
      <ScrollProgress />

      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-orange-900">

        {/* ── 1. HERO ── */}
        <section className="min-h-[88vh] flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-4 text-center py-20">
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
            <p className="text-white/40 text-sm mb-10 max-w-xl mx-auto">
              Inspired by the conviction of Strategy Inc (formerly MicroStrategy) — accumulate Bitcoin as your primary savings vehicle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!isAuthenticated && (
                <Link to="/signup"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:shadow-2xl transition-all hover:scale-105">
                  Start Stacking Sats <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link to="/blog"  className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors">Read the Blog</Link>
              <Link to="/forum" className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors">Join the Forum</Link>
            </div>
            {/* Scroll hint */}
            <div className="mt-16 flex flex-col items-center gap-1 text-white/20 text-xs">
              <span>Scroll to explore</span>
              <svg className="w-4 h-4 animate-bounce mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── 2. FIRE PRINCIPLES ── */}
        <Section>
          <ScrollSection>
            <h2 className="text-2xl font-bold text-white mb-2">The Bitcoin FIRE Principles</h2>
            <p className="text-white/50 text-sm mb-6">Why Bitcoin is the optimal savings vehicle for Financial Independence.</p>
          </ScrollSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FIRE_PRINCIPLES.map(({ icon, color, bg, title, desc }, i) => {
              const PrincipleIcon = icon;
              return (
                <ScrollSection key={title} delay={i * 80}>
                  <div className={`rounded-xl p-5 border h-full ${bg}`}>
                    <PrincipleIcon className={`w-8 h-8 ${color} mb-3`} />
                    <h3 className={`font-bold ${color} mb-2 text-sm`}>{title}</h3>
                    <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
                  </div>
                </ScrollSection>
              );
            })}
          </div>
        </Section>

        <Divider />

        {/* ── 3. AI MARKET INSIGHT + BTC vs S&P 500 ── */}
        <Section tint>
          <ScrollSection>
            <MarketInsight />
          </ScrollSection>
          <ScrollSection>
            <BTCvsSnP />
          </ScrollSection>
        </Section>

        <Divider />

        {/* ── 4. STRATEGY INC + QUOTES ── */}
        <Section>
          <ScrollSection>
            <div className="bg-gradient-to-r from-orange-900/40 to-slate-900/40 border border-orange-500/30 rounded-2xl p-8">
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
                  <a href="https://www.strategy.com/btc" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
                    View Strategy's BTC Holdings <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
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
          </ScrollSection>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {SAYLOR_QUOTES.map(({ quote, context }, i) => (
              <ScrollSection key={quote} delay={i * 100}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 h-full">
                  <p className="text-white/80 text-sm italic leading-relaxed mb-3">"{quote}"</p>
                  <p className="text-orange-400 text-xs font-medium">— Michael Saylor · {context}</p>
                </div>
              </ScrollSection>
            ))}
          </div>
        </Section>

        <Divider />

        {/* ── 5. KEY TERMS ── */}
        <Section tint>
          <ScrollSection>
            <h2 className="text-2xl font-bold text-white mb-2">Key Terms</h2>
            <p className="text-white/50 text-sm mb-6">New to Bitcoin and FIRE? Here's the language you'll see on this site.</p>
          </ScrollSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GLOSSARY.map(({ term, full, color, border, bg, def }, i) => (
              <ScrollSection key={term} delay={i * 60}>
                <div className={`rounded-xl p-5 border h-full ${border} ${bg}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-xl font-bold ${color}`}>{term}</span>
                    <span className="text-white/40 text-xs">{full}</span>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed">{def}</p>
                </div>
              </ScrollSection>
            ))}
          </div>
        </Section>

        <Divider />

        {/* ── 6. MYTHS & OBJECTIONS ── */}
        <Section tint>
          <ScrollSection>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-2xl font-bold text-white">"But I heard Bitcoin…"</h2>
              <span className="text-xs text-white/30 mt-1.5 flex-shrink-0">Click to expand</span>
            </div>
            <p className="text-white/50 text-sm mb-6">The 10 most common objections — and the evidence-backed answers that put them to rest.</p>
            <MythAccordion />
          </ScrollSection>
        </Section>

        <Divider />

        {/* ── 8. PLATFORM FEATURES ── */}
        <Section>
          <ScrollSection>
            <h2 className="text-2xl font-bold text-white mb-2">Everything You Need</h2>
            <p className="text-white/50 text-sm mb-6">Tools, community, and knowledge to execute your Bitcoin FIRE strategy.</p>
          </ScrollSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon, color, title, desc, link }, i) => {
              const FeatureIcon = icon;
              return (
                <ScrollSection key={title} delay={i * 70}>
                  <Link to={link} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all group block h-full">
                    <FeatureIcon className={`w-10 h-10 ${color} mb-3`} />
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
                  </Link>
                </ScrollSection>
              );
            })}
          </div>
        </Section>

        <Divider />

        {/* ── 9. STAY INFORMED ── */}
        <Section tint>
          <ScrollSection>
            <h2 className="text-2xl font-bold text-white mb-2">Stay Informed</h2>
            <p className="text-white/50 text-sm mb-6">Essential sources for Bitcoin news, data, and community.</p>
          </ScrollSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BTC_NEWS_LINKS.map(({ label, url, desc, internal }, i) => (
              <ScrollSection key={label} delay={i * 60}>
                {internal ? (
                  <Link to={url} className="bg-white/5 border border-white/10 hover:border-orange-500/40 rounded-xl p-5 transition-all group flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors">{label}</span>
                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                  </Link>
                ) : (
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="bg-white/5 border border-white/10 hover:border-orange-500/40 rounded-xl p-5 transition-all group flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors">{label}</span>
                      <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                  </a>
                )}
              </ScrollSection>
            ))}
          </div>
        </Section>

        {/* ── 10. CTA (unauthenticated only) ── */}
        {!isAuthenticated && (
          <>
            <Divider />
            <Section>
              <ScrollSection>
                <div className="bg-gradient-to-r from-orange-600/30 to-blue-600/30 border border-orange-500/30 rounded-2xl p-10 text-center">
                  <h2 className="text-3xl font-bold text-white mb-3">Ready to Start Stacking?</h2>
                  <p className="text-white/60 mb-6 max-w-lg mx-auto text-sm">
                    Join a community of Bitcoiners on the path to Financial Independence. Track prices, read strategies, and build your stack — one sat at a time.
                  </p>
                  <Link to="/signup"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all hover:scale-105">
                    Create Free Account <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollSection>
            </Section>
          </>
        )}

        {/* ── DISCLAIMER ── */}
        <div className="max-w-7xl mx-auto px-4 pb-10">
          <div className="bg-slate-900/80 border border-slate-700 rounded-xl px-6 py-5">
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Disclaimer</h3>
            <p className="text-white/40 text-xs leading-relaxed">
              BTC4Fire is an educational and community platform only. Nothing on this website constitutes financial, investment, tax, or legal advice. All content — including price data, trading signals, technical indicators, articles, and forum posts — is provided for informational and educational purposes only and should not be relied upon as a recommendation to buy, sell, or hold any asset. Cryptocurrency is highly volatile and you may lose some or all of your investment. Always do your own research (DYOR) and consult a qualified financial advisor before making any investment decisions. BTC4Fire, its creators, and contributors accept no responsibility or liability for any financial losses or damages arising from the use of this website or reliance on any information provided herein. Past performance is not indicative of future results.
            </p>
          </div>
        </div>

        {/* ── FOOTER ── */}
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
    </>
  );
};

export default HomePage;
