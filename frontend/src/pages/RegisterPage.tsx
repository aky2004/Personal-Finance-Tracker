import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Wallet, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-light dark:bg-surface-dark text-ink-light dark:text-ink-dark transition-colors">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand to-violet-600 dark:from-brand-dark dark:to-purple-500 items-center justify-center text-white shadow-lg shadow-brand/20">
            <Wallet size={24} />
          </Link>
          <h2 className="text-2xl font-black tracking-tight text-ink-light dark:text-ink-dark">
            Create an Account
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-darkmuted">
            Set up your MoneyMatter personal finance profile
          </p>
        </div>

        <div className="bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-2xl p-6 shadow-moneymatter dark:shadow-moneymatter-dark">
          {error && (
            <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-money-red dark:bg-rose-950/40 dark:border-rose-900 dark:text-money-reddark rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink-light dark:text-ink-dark mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-3 text-ink-muted" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-9 pr-3 py-2 bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark rounded-xl text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                />
              </div>
            </div>

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
                  placeholder="e.g. alex@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark rounded-xl text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-light dark:text-ink-dark mb-1">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-3 text-ink-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark rounded-xl text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-light dark:text-ink-dark mb-1">
                Role (RBAC)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark rounded-xl text-xs focus:ring-1 focus:ring-brand focus:outline-none"
              >
                <option value="user">Standard User (Full CRUD over own records)</option>
                <option value="read-only">Read-Only User (View only)</option>
                <option value="admin">Administrator (Full Access + User Management)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-center text-xs text-ink-muted dark:text-ink-darkmuted mt-5">
            Already registered?{' '}
            <Link to="/login" className="text-brand dark:text-brand-dark font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
