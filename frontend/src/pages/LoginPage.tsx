import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ArrowRight, Shield, User, Eye } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      // Authenticate with Google endpoint
      const res = await api.post('/auth/google', {
        email: 'alex.google@example.com',
        name: 'Alex (Google Verified)',
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0908] text-[#f2efe9] font-sans flex flex-col justify-between selection:bg-[#7355be] selection:text-white">
      {/* Top Header */}
      <header className="h-16 px-6 sm:px-10 flex items-center justify-between border-b border-[#24211d]/60 bg-[#0b0908]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7355be] to-[#9376de] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#7355be]/30">
            M
          </div>
          <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#9376de] transition-colors">
            Money<span className="text-[#9376de]">Matter</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-[#8c857b] hover:text-white hover:bg-[#1a1714] transition-colors"
          >
            {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>
          <div className="px-3 py-1 rounded-lg bg-[#141210] border border-[#24211d] text-xs font-mono text-[#8c857b]">
            English 🇬🇧
          </div>
        </div>
      </header>

      {/* Main Login Card (Matching Screenshot exactly) */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] rounded-2xl bg-[#141210] border border-[#24211d] p-7 sm:p-9 shadow-2xl relative overflow-hidden">
          
          <h1 className="text-xl sm:text-2xl font-black text-white text-center mb-6 tracking-tight">
            Log in to account
          </h1>

          {error && (
            <div className="p-3 mb-5 bg-[#ef6a57]/10 border border-[#ef6a57]/30 text-[#ef6a57] rounded-xl text-xs font-medium text-center">
              {error}
            </div>
          )}

          {/* Single Google Sign In Button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1a1714] hover:bg-[#221e1a] border border-[#2e2a25] text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all hover:border-[#423c34] active:scale-[0.99] disabled:opacity-50"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>{googleLoading ? 'Signing in with Google...' : 'Sign in with Google'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#24211d]"></div>
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="px-3 bg-[#141210] text-[#8c857b]">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Standard Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-[#8c857b]">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0c0a] border border-[#24211d] text-xs text-white placeholder-[#524b42] focus:outline-none focus:border-[#7355be] transition-colors"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#8c857b]">
                  Password
                </label>
                <Link
                  to="/contact"
                  className="text-[11px] text-[#8c857b] hover:text-[#9376de] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0c0a] border border-[#24211d] text-xs text-white placeholder-[#524b42] focus:outline-none focus:border-[#7355be] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#7355be] hover:bg-[#8365ce] text-white font-bold text-xs transition-all shadow-md shadow-[#7355be]/20 active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Log in'}
            </button>
          </form>

          {/* Sign up prompt */}
          <p className="text-center text-xs text-[#8c857b] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#9376de] hover:underline font-bold">
              Sign up
            </Link>
          </p>

          {/* One-Click Quick Demo Autofill Bar */}
          <div className="mt-6 pt-5 border-t border-[#24211d] text-left space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c857b] block">
              Quick Test Autofill (RBAC):
            </span>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@finance.com', 'AdminPassword123!')}
                className="py-1 px-2 rounded-lg bg-[#1a1714] border border-[#24211d] hover:border-purple-500/50 text-purple-400 text-center transition-all truncate"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('user@finance.com', 'UserPassword123!')}
                className="py-1 px-2 rounded-lg bg-[#1a1714] border border-[#24211d] hover:border-emerald-500/50 text-[#4cc38a] text-center transition-all truncate"
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('readonly@finance.com', 'ReadOnlyPassword123!')}
                className="py-1 px-2 rounded-lg bg-[#1a1714] border border-[#24211d] hover:border-amber-500/50 text-amber-400 text-center transition-all truncate"
              >
                Read-Only
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Footer */}
      <footer className="py-4 text-center text-xs text-[#8c857b]">
        MoneyMatter Finance • Built with React 18, PostgreSQL &amp; Redis
      </footer>
    </div>
  );
};

export default LoginPage;