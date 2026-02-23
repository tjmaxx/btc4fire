import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bitcoin, Menu, X, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, profile, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/blog', label: 'Blog' },
    { to: '/forum', label: 'Forum' },
    { to: '/dca', label: 'DCA Calc' },
    { to: '/fire-calculator', label: 'FIRE Calc' },
    { to: '/resources', label: 'Resources' },
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
  ];

  const isActive = (path) => location.pathname.startsWith(path);
  const username = profile?.username || user?.email?.split('@')[0] || '';

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl flex-shrink-0">
            <Bitcoin className="w-7 h-7 text-orange-400" />
            <span>BTC<span className="text-orange-400">4</span>FIRE</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'text-orange-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/profile/${username}`}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white text-sm transition-colors"
                >
                  <div className="w-7 h-7 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs font-bold">
                    {username[0]?.toUpperCase()}
                  </div>
                  {username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-slate-400 hover:text-red-400 text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block text-slate-300 hover:text-white py-2 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-700">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/profile/${username}`}
                  className="block text-slate-300 py-2 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button onClick={handleLogout} className="block text-red-400 py-2 text-sm w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-slate-300 py-2 text-sm" onClick={() => setMenuOpen(false)}>Log In</Link>
                <Link to="/signup" className="block text-orange-400 py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
