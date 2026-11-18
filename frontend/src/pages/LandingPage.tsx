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
  BarChart3,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Wallet size={20} />
            </div>
            <span className="font-black text-lg tracking-tight">
              Finance<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Features
            </a>
            <a href="#rbac" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              RBAC Matrix
            </a>
            <a href="#architecture" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Architecture
            </a>
            <a
              href="http://localhost:5001/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Swagger API <ExternalLink size={12} />
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-sm">
            <Zap size={14} className="text-amber-500 fill-amber-500 animate-pulse" />
            <span>Redis Microsecond Caching + PostgreSQL Engine</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Master Your Money With{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Sub-Millisecond
            </span>{' '}
            Speed.
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            A production-grade Personal Finance Tracker built with <strong>React 18</strong>, <strong>Node.js Express</strong>, <strong>PostgreSQL</strong>, and <strong>Redis</strong>. Features cryptographic RBAC access controls, interactive Recharts telemetry, and windowed virtual scrolling.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Explore Live Demo'}</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href="#rbac"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-sm flex items-center gap-2 transition-all"
            >
              <Shield size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span>One-Click Role Test</span>
            </a>

            <a
              href="http://localhost:5001/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>OpenAPI Docs</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Interactive Preview Mockup */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-sm">
              <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-left">
                {/* Mockup Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-400 ml-2">finance-tracker.local/dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <Zap size={12} className="fill-emerald-500" /> X-Cache: HIT (0.8ms)
                    </span>
                    <span className="text-xs font-mono text-slate-400">PostgreSQL + Redis 15m TTL</span>
                  </div>
                </div>

                {/* Mockup KPI Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Total Income</span>
                      <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                      +$15,650.00
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Total Expenses</span>
                      <TrendingDown size={16} className="text-rose-500" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
                      -$5,518.70
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Net Balance (Savings)</span>
                      <Sparkles size={16} className="text-indigo-500" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">
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
      <section id="rbac" className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <Shield size={13} /> Strict RBAC Policy Enforcement
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              One-Click Role-Based Demo Testing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Click any role card below to instantly sign in and experience how permissions, routes, and UI forms adapt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role 1: Admin */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    Administrator
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold uppercase">
                      admin
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete governance over all data, global records, and user role management.
                  </p>
                </div>
                <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-600" /> Full access to `/admin/users`
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-600" /> Promote or demote accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-600" /> Full CRUD on all transactions
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickDemoLogin('admin@finance.com', 'AdminPassword123!')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch as Admin</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Role 2: Standard User */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/50 shadow-md flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-sm">
                Default Role
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    Standard User
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                      user
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage personal income, expenses, categories, and view analytics.
                  </p>
                </div>
                <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Add, edit & delete personal data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Automatic cache invalidation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Interactive charts & filters
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickDemoLogin('user@finance.com', 'UserPassword123!')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch as Standard User</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Role 3: Read-Only User */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
                  <Eye size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    Read-Only Auditor
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold uppercase">
                      read-only
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Strict view-only mode. Form buttons and mutation endpoints are disabled.
                  </p>
                </div>
                <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-600" /> View transactions & analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-600" /> Form buttons visually disabled
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-600" /> API returns 403 Forbidden on writes
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickDemoLogin('readonly@finance.com', 'ReadOnlyPassword123!')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch as Read-Only</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            <Sparkles size={13} /> Engineered for High Throughput
          </div>
          <h2 className="text-3xl font-black tracking-tight">
            Key Architectural Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Every feature directly implements the technical mandates of the TechBridge assignment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-base">Redis Caching (15m TTL)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Caches analytical aggregations for 15 minutes and category lists for 1 hour with sub-millisecond warm lookups. Automatic cache invalidation occurs immediately upon any transaction write.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <PieIcon size={20} />
            </div>
            <h3 className="font-bold text-base">3 Recharts Visualizations</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Category Distribution (Pie Chart), Monthly Cashflow Trends (Line Chart), and Income vs Expense comparisons (Bar Chart) with smooth tooltips and dynamic filters.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <h3 className="font-bold text-base">Virtual Scrolling Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Windowed virtual list that renders only visible rows in the DOM, allowing thousands of transactions to scroll smoothly at 60 FPS without memory bloat.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Database size={20} />
            </div>
            <h3 className="font-bold text-base">PostgreSQL Relational Storage</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Structured database schema with relational foreign keys, cascade triggers, check constraints, composite indexes, and strict parameterized queries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <h3 className="font-bold text-base">Tiered Rate Limiting</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Protects endpoints using `express-rate-limit`: Auth routes (5 req/15 min), Transaction routes (100 req/hr), and Analytics routes (50 req/hr).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <h3 className="font-bold text-base">React Hook Optimizations</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              `useContext` for global session & theme state, `useCallback` to prevent child re-renders on forms, and `useMemo` for memoizing heavy list filtering and math aggregates.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-indigo-600" />
            <span className="font-bold text-slate-800 dark:text-slate-200">Personal Finance Tracker</span>
            <span>• Full Stack Assignment</span>
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
