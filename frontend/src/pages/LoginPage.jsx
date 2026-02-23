import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const { login, resetPassword, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await login(email, password);
    if (error) {
      setError(error.message || 'Failed to login');
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    await resetPassword(resetEmail);
    setResetLoading(false);
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-orange-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">
            BTC4Fire
          </h1>
          <p className="text-gray-600 mt-2">Bitcoin + Financial Independence</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-orange-600 text-white font-medium py-2 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => { setShowReset(v => !v); setResetSent(false); }}
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {showReset && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            {resetSent ? (
              <p className="text-green-700 text-sm text-center">Check your email for a reset link.</p>
            ) : (
              <form onSubmit={handleReset} className="space-y-3">
                <p className="text-gray-600 text-sm">Enter your email and we'll send a reset link.</p>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {resetLoading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mt-6 text-center text-gray-600">
          <p>Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
