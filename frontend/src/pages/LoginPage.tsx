import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Wallet, Lock, Mail, Shield, User, Eye, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-light dark:bg-surface-dark text-ink-light dark:text-ink-dark transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand to-violet-600 dark:from-brand-dark dark:to-purple-500 items-center justify-center text-white shadow-lg shadow-brand/20">
            <Wallet size={24} />
          </Link>
          <h2 className="text-2xl font-black tracking-tight text-ink-light dark:text-ink-dark">
            Money<span className="text-brand dark:text-brand-dark">Matter</span>
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-darkmuted">
            Sign in to access your financial telemetry and ledger
          </p>
        </div>

        {/* Demo Roles Quick Fill Card */}
        <div className="p-4 bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-2xl shadow-moneymatter dark:shadow-moneymatter-dark space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-ink-darkmuted">
            One-Click Demo Credentials (RBAC)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@finance.com', 'AdminPassword123!')}
              className="p-2 text-left rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:border-purple-800 dark:hover:bg-purple-950/60 transition-all text-xs"
            >
              <div className="flex items-center gap-1 font-bold text-purple-700 dark:text-purple-300">
                <Shield size={12} /> Admin
              </div>
              <span className="text-[10px] text-purple-600/80 dark:text-purple-400/80 block mt-0.5">Full privileges</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('user@finance.com', 'UserPassword123!')}
              className="p-2 text-left rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800 dark:hover:bg-emerald-950/60 transition-all text-xs"
            >
              <div className="flex items-center gap-1 font-bold text-money-green dark:text-money-greendark">
                <User size={12} /> Standard
              </div>
              <span className="text-[10px] text-money-green/80 dark:text-money-greendark/80 block mt-0.5">Full CRUD</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('readonly@finance.com', 'ReadOnlyPassword123!')}
              className="p-2 text-left rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:border-amber-800 dark:hover:bg-amber-950/60 transition-all text-xs"
            >
              <div className="flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300">
                <Eye size={12} /> Read-Only
              </div>
              <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 block mt-0.5">View only</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-2xl p-6 shadow-moneymatter dark:shadow-moneymatter-dark">
          {error && (
            <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-money-red dark:bg-rose-950/40 dark:border-rose-900 dark:text-money-reddark rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink-light dark:text-ink-dark mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-3 text-ink-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@finance.com"
                  className="w-full pl-9 pr-3 py-2 bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark rounded-xl text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-light dark:text-ink-dark mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-3 text-ink-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark rounded-xl text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-center text-xs text-ink-muted dark:text-ink-darkmuted mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand dark:text-brand-dark font-bold hover:underline">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
