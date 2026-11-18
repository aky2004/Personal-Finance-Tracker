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
      navigate('/');
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        {/* App Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Wallet size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Personal Finance Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to manage your budget, transactions, and analytics
          </p>
        </div>

        {/* Demo Roles Quick Fill Card (Deliverable Requirement) */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            One-Click Demo Credentials (RBAC)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@finance.com', 'AdminPassword123!')}
              className="p-2 text-left rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:border-purple-800 dark:hover:bg-purple-950/70 transition-all text-xs"
            >
              <div className="flex items-center gap-1 font-bold text-purple-700 dark:text-purple-300">
                <Shield size={12} /> Admin
              </div>
              <span className="text-[10px] text-purple-600/80 dark:text-purple-400/80 block mt-0.5">Full privileges</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('user@finance.com', 'UserPassword123!')}
              className="p-2 text-left rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800 dark:hover:bg-emerald-950/70 transition-all text-xs"
            >
              <div className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300">
                <User size={12} /> Standard
              </div>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block mt-0.5">Full CRUD</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('readonly@finance.com', 'ReadOnlyPassword123!')}
              className="p-2 text-left rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:border-amber-800 dark:hover:bg-amber-950/70 transition-all text-xs"
            >
              <div className="flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300">
                <Eye size={12} /> Read-Only
              </div>
              <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 block mt-0.5">View only</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
          {error && (
            <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@finance.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
