import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bitcoin, TrendingUp, Users, BookOpen, MessageSquare, Layers } from 'lucide-react';

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

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight">
            Bitcoin to Financial{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
              Freedom
            </span>
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Track your Bitcoin investments, learn from community traders, and achieve financial independence.
            Powered by real-time market data and a growing FIRE community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Start Your FIRE Journey
              </Link>
            )}
            <Link to="/blog"  className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors">Read the Blog</Link>
            <Link to="/forum" className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors">Join the Forum</Link>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {[
            { icon: Bitcoin,       color: 'text-orange-400', title: 'Real-time Price',   desc: 'Live BTC/USD tracking with 24/7 market data and interactive charts.',     link: '/dashboard' },
            { icon: TrendingUp,    color: 'text-blue-400',   title: 'AI Signals',        desc: 'AI-powered trading signals with technical indicators (RSI, MACD, MA).',   link: '/dashboard' },
            { icon: BookOpen,      color: 'text-green-400',  title: 'Blog & Guides',     desc: 'Articles on Bitcoin, FIRE strategies, and investment education.',          link: '/blog' },
            { icon: MessageSquare, color: 'text-purple-400', title: 'Community Forum',   desc: 'Discuss strategy with FIRE enthusiasts and experienced traders.',          link: '/forum' },
            { icon: Layers,        color: 'text-yellow-400', title: 'Resources',         desc: 'Curated tools, books, and courses for your Bitcoin & FIRE journey.',       link: '/resources' },
            { icon: Users,         color: 'text-pink-400',   title: 'Portfolio Tracker', desc: 'Track BTC holdings with real-time P&L calculations. Coming in Phase 3.',  link: '/dashboard' },
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

        {/* Detail section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-10 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why BTC4Fire?</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {[
              { color: 'text-blue-400',   emoji: '📊', title: 'Portfolio Tracking',  items: ['Track BTC holdings with real-time P&L', 'Monitor cost basis and average buy price', 'Export your portfolio data anytime'] },
              { color: 'text-orange-400', emoji: '🤖', title: 'AI Trading Signals',  items: ['Daily signals with confidence scores', 'Technical analysis (RSI, MACD, MA)', 'Alert notifications for perfect timing'] },
              { color: 'text-green-400',  emoji: '📚', title: 'Learning Hub',        items: ['Guides from beginner to advanced', 'Community contributed articles', 'Investment strategy resources'] },
              { color: 'text-purple-400', emoji: '👥', title: 'Community Forum',     items: ['Discuss strategy with experienced traders', 'Share insights and FIRE progress', 'Connect with your FIRE community'] },
            ].map(({ color, emoji, title, items }) => (
              <div key={title}>
                <h3 className={`text-xl font-bold ${color} mb-3`}>{emoji} {title}</h3>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="text-white/60 text-sm flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-white/40 text-sm">
          <p>© 2025 BTC4Fire — Not financial advice. Always DYOR.</p>
          <div className="flex gap-6">
            <Link to="/blog"      className="hover:text-white/70 transition-colors">Blog</Link>
            <Link to="/forum"     className="hover:text-white/70 transition-colors">Forum</Link>
            <Link to="/resources" className="hover:text-white/70 transition-colors">Resources</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
