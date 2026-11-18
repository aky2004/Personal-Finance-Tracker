import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/client';
import {
  Wallet,
  ArrowRight,
  Zap,
  Shield,
  PieChart as PieIcon,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Layers,
  Database,
  Lock,
  Sun,
  Moon,
  ExternalLink,
  CheckCircle2,
  User,
  Eye,
  Cpu,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleQuickDemoLogin = async (email: string, pass: string) => {
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to authenticate demo user');
    }
  };

  return (
    <div className="min-h-screen bg-surface-light text-ink-light dark:bg-surface-dark dark:text-ink-dark selection:bg-brand selection:text-white transition-colors duration-200">
      {/* 1. Header Navigation (MoneyMatter Style) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-surface-light/80 dark:bg-surface-dark/80 border-b border-borderline-light dark:border-borderline-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand to-violet-600 dark:from-brand-dark dark:to-purple-500 flex items-center justify-center text-white shadow-md shadow-brand/20">
              <Wallet size={19} />
            </div>
            <span className="font-extrabold text-base tracking-tight text-ink-light dark:text-ink-dark">
              Money<span className="text-brand dark:text-brand-dark">Matter</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-ink-muted dark:text-ink-darkmuted">
            <a href="#features" className="hover:text-brand dark:hover:text-brand-dark transition-colors">
              Features
            </a>
            <a href="#rbac" className="hover:text-brand dark:hover:text-brand-dark transition-colors">
              RBAC Matrix
            </a>
            <a
              href="http://localhost:5001/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-brand dark:hover:text-brand-dark transition-colors"
            >
              Swagger API <ExternalLink size={11} />
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-ink-muted dark:text-ink-darkmuted hover:bg-soft-light dark:hover:bg-soft-dark transition-colors"
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand hover:bg-brand-hover text-white shadow-xs transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight size={13} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand hover:bg-brand-hover text-white shadow-xs transition-all"
              >
                <span>Login</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* MoneyMatter violet ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-brand/15 to-purple-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand/10 text-brand dark:bg-brand-dark/15 dark:text-brand-dark border border-brand/20 dark:border-brand-dark/30 shadow-xs">
            <Zap size={14} className="fill-current text-brand dark:text-brand-dark animate-pulse" />
            <span>Sub-Millisecond Redis Caching + PostgreSQL Ledger</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.08]">
            The Modern Standard for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand via-violet-500 to-purple-500 dark:from-brand-dark dark:via-purple-400 dark:to-pink-400">
              Personal Wealth
            </span>{' '}
            Tracking.
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-ink-muted dark:text-ink-darkmuted leading-relaxed font-normal">
            A high-performance personal finance tracker inspired by <strong>MoneyMatter</strong>, designed with <strong>React 18</strong>, <strong>Express</strong>, <strong>PostgreSQL</strong>, and <strong>Redis</strong>. Features cryptographic RBAC access controls, interactive Recharts telemetry, and windowed virtual scrolling.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-brand hover:bg-brand-hover text-white shadow-moneymatter dark:shadow-moneymatter-dark flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Explore MoneyMatter Demo'}</span>
              <ArrowRight size={15} />
            </Link>

            <a
              href="#rbac"
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-panel-light dark:bg-panel-dark text-ink-light dark:text-ink-dark border border-borderline-light dark:border-borderline-dark hover:bg-soft-light dark:hover:bg-soft-dark shadow-xs flex items-center gap-2 transition-all"
            >
              <Shield size={15} className="text-brand dark:text-brand-dark" />
              <span>One-Click Role Test</span>
            </a>

            <a
              href="http://localhost:5001/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-soft-light dark:bg-soft-dark text-ink-muted hover:text-ink-light dark:hover:text-ink-dark transition-all flex items-center gap-1.5"
            >
              <span>Swagger API</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Interactive Preview Mockup Card */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-brand/20 via-purple-500/10 to-transparent border border-borderline-light dark:border-borderline-dark shadow-2xl backdrop-blur-sm">
              <div className="rounded-xl overflow-hidden bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark p-6 sm:p-8 space-y-6 text-left shadow-moneymatter dark:shadow-moneymatter-dark">
                {/* Mockup Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderline-light dark:border-borderline-dark">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-money-red opacity-80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500 opacity-80" />
                    <div className="w-3 h-3 rounded-full bg-money-green opacity-80" />
                    <span className="text-xs font-mono text-ink-muted ml-2">moneymatter.local/dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-money-green dark:text-money-greendark border border-emerald-200 dark:border-emerald-800">
                      <Zap size={11} className="fill-current" /> X-Cache: HIT (0.8ms)
                    </span>
                    <span className="text-xs font-mono text-ink-muted">PostgreSQL + Redis 15m TTL</span>
                  </div>
                </div>

                {/* Mockup KPI Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark">
                    <div className="flex items-center justify-between text-xs text-ink-muted">
                      <span>Total Inflow</span>
                      <TrendingUp size={15} className="text-money-green dark:text-money-greendark" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black font-mono text-money-green dark:text-money-greendark mt-1">
                      +$15,650.00
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark">
                    <div className="flex items-center justify-between text-xs text-ink-muted">
                      <span>Total Outflow</span>
                      <TrendingDown size={15} className="text-money-red dark:text-money-reddark" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black font-mono text-money-red dark:text-money-reddark mt-1">
                      -$5,518.70
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark">
                    <div className="flex items-center justify-between text-xs text-ink-muted">
                      <span>Net Cash Flow</span>
                      <Sparkles size={15} className="text-brand dark:text-brand-dark" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black font-mono text-brand dark:text-brand-dark mt-1">
                      +$10,131.30 (64.7%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. One-Click Role Evaluation Section (RBAC) */}
      <section id="rbac" className="py-16 bg-soft-light/70 dark:bg-soft-dark/50 border-y border-borderline-light dark:border-borderline-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand/10 text-brand dark:bg-brand-dark/15 dark:text-brand-dark border border-brand/20">
              <Shield size={13} /> Role-Based Access Control (RBAC)
            </div>
            <h2 className="text-3xl font-black tracking-tight text-ink-light dark:text-ink-dark">
              One-Click RBAC Role Testing
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-darkmuted">
              Select any role card to sign in instantly and verify route restrictions and UI adaptations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin */}
            <div className="p-6 rounded-2xl bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark shadow-moneymatter dark:shadow-moneymatter-dark flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold">
                  <Shield size={19} />
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2 text-ink-light dark:text-ink-dark">
                    Administrator
                    <span className="text-[10px] px-2 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold uppercase">
                      admin
                    </span>
                  </h3>
                  <p className="text-xs text-ink-muted mt-1">
                    Complete oversight of all data records, global ledgers, and user management.
                  </p>
                </div>
                <ul className="text-xs space-y-2 text-ink-muted dark:text-ink-darkmuted">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-purple-600" /> Full access to `/admin/users`
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-purple-600" /> Promote or demote user roles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-purple-600" /> Full CRUD on all transactions
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickDemoLogin('admin@finance.com', 'AdminPassword123!')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch as Admin</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Standard User */}
            <div className="p-6 rounded-2xl bg-panel-light dark:bg-panel-dark border-2 border-brand/40 shadow-moneymatter dark:shadow-moneymatter-dark flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand text-white shadow-xs">
                Default Role
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-money-green dark:bg-emerald-950 dark:text-money-greendark flex items-center justify-center font-bold">
                  <User size={19} />
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2 text-ink-light dark:text-ink-dark">
                    Standard User
                    <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                      user
                    </span>
                  </h3>
                  <p className="text-xs text-ink-muted mt-1">
                    Manage personal income, expenses, categories, and view analytics.
                  </p>
                </div>
                <ul className="text-xs space-y-2 text-ink-muted dark:text-ink-darkmuted">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-money-green" /> Add, edit & delete personal data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-money-green" /> Automatic cache invalidation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-money-green" /> Interactive charts & filters
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickDemoLogin('user@finance.com', 'UserPassword123!')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand hover:bg-brand-hover text-white shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch as Standard User</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Read-Only */}
            <div className="p-6 rounded-2xl bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark shadow-moneymatter dark:shadow-moneymatter-dark flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
                  <Eye size={19} />
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2 text-ink-light dark:text-ink-dark">
                    Read-Only User
                    <span className="text-[10px] px-2 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold uppercase">
                      read-only
                    </span>
                  </h3>
                  <p className="text-xs text-ink-muted mt-1">
                    Strict view-only mode. Form buttons and mutation endpoints are locked.
                  </p>
                </div>
                <ul className="text-xs space-y-2 text-ink-muted dark:text-ink-darkmuted">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-amber-600" /> View transactions & analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-amber-600" /> Form buttons visually disabled
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-amber-600" /> API returns 403 Forbidden on writes
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickDemoLogin('readonly@finance.com', 'ReadOnlyPassword123!')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch as Read-Only</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand/10 text-brand dark:bg-brand-dark/15 dark:text-brand-dark">
            <Sparkles size={13} /> Technical Specifications
          </div>
          <h2 className="text-3xl font-black tracking-tight text-ink-light dark:text-ink-dark">
            Architecture Highlights
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-darkmuted">
            Engineered to strictly fulfill all requirements of the TechBridge assignment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark shadow-moneymatter dark:shadow-moneymatter-dark space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Zap size={19} />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-ink-light dark:text-ink-dark">Redis Caching (15m TTL)</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Caches analytical aggregations for 15 minutes and category lists for 1 hour. Automated invalidation flushes Redis caches upon transaction mutations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark shadow-moneymatter dark:shadow-moneymatter-dark space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand dark:text-brand-dark flex items-center justify-center">
              <PieIcon size={19} />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-ink-light dark:text-ink-dark">3 Recharts Visualizations</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Category Distribution (Pie Chart), Monthly Trends (Line Chart), and Income vs Expense comparisons (Bar Chart) rendered with MoneyMatter styling.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark shadow-moneymatter dark:shadow-moneymatter-dark space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Layers size={19} />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-ink-light dark:text-ink-dark">Virtual Scrolling Engine</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Windowed virtual list that renders only visible rows in the DOM, allowing thousands of transactions to scroll smoothly at 60 FPS without memory bloat.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark shadow-moneymatter dark:shadow-moneymatter-dark space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-money-green flex items-center justify-center">
              <Database size={19} />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-ink-light dark:text-ink-dark">PostgreSQL Relational Storage</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Structured database schema with relational foreign keys, check constraints, composite indexes, and strict parameterized queries preventing SQL injection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark shadow-moneymatter dark:shadow-moneymatter-dark space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-money-red flex items-center justify-center">
              <Lock size={19} />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-ink-light dark:text-ink-dark">Tiered Rate Limiting</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Protects endpoints using `express-rate-limit`: Auth routes (5 req/15 min), Transaction routes (100 req/hr), and Analytics routes (50 req/hr).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark shadow-moneymatter dark:shadow-moneymatter-dark space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Cpu size={19} />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-ink-light dark:text-ink-dark">React Hook Optimizations</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              `useContext` for global session & theme state, `useCallback` to prevent child re-renders on forms, and `useMemo` for memoizing heavy list filtering and math aggregates.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-borderline-light dark:border-borderline-dark py-12 bg-panel-light dark:bg-panel-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-ink-muted dark:text-ink-darkmuted">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-brand dark:text-brand-dark" />
            <span className="font-bold text-ink-light dark:text-ink-dark">MoneyMatter</span>
            <span>• Full Stack Personal Finance Tracker</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/aky2004/Personal-Finance-Tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              GitHub Repository <ExternalLink size={11} />
            </a>
            <a
              href="http://localhost:5001/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              Swagger Docs <ExternalLink size={11} />
            </a>
            <a
              href="http://localhost:5001/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              Health Check <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
