import React, { useState } from 'react';
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
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CreditCard,
  Sliders,
  Target,
  Flame,
  Check,
  RefreshCw,
  FileSpreadsheet,
  Building,
  Coffee,
  ShoppingBag,
  DollarSign,
  Activity,
  ChevronRight,
  ChevronDown,
  CheckSquare
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Active tab state for "Plan and Understand" section
  const [activePlanTab, setActivePlanTab] = useState<'budgets' | 'moneyFlow' | 'savings' | 'trackers' | 'fire'>('budgets');
  
  // Interactive spending pace toggle
  const [spendingPaceMode, setSpendingPaceMode] = useState<'month' | 'avg'>('avg');

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
    <div className="min-h-screen bg-[#0b0908] text-[#f2efe9] selection:bg-[#7355be] selection:text-white font-sans transition-colors duration-200">
      
      {/* 1. Header Navigation (MoneyMatter Style) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0908]/90 border-b border-[#24211d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7355be] to-[#9376de] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#7355be]/30">
              M
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              Money<span className="text-[#9376de]">Matter</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#8c857b]">
            <a href="#how-it-works" className="hover:text-[#9376de] transition-colors">
              How It Works
            </a>
            <a href="#plan" className="hover:text-[#9376de] transition-colors">
              Plan &amp; Budgets
            </a>
            <Link to="/docs" className="hover:text-[#9376de] transition-colors">
              Docs
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-[#8c857b] hover:text-white hover:bg-[#1a1714] transition-colors"
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#7355be] hover:bg-[#8365ce] text-white shadow-xs transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight size={13} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#7355be] hover:bg-[#8365ce] text-white shadow-xs transition-all"
              >
                <span>Login</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. SECTION: LIVE DEMO (Exact MoneyMatter Showcase) */}
      <section id="live-demo" className="pt-16 pb-24 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-[#7355be]/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-[#9376de] tracking-wider uppercase bg-[#7355be]/10 border border-[#7355be]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9376de] animate-pulse" />
            M LIVE DEMO
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Click around a real account
          </h1>

          <p className="max-w-xl mx-auto text-sm text-[#8c857b] leading-relaxed">
            The demo opens a full account with sample data. No signup needed.
          </p>

          {/* MoneyMatter Browser Window Mockup */}
          <div className="pt-8 max-w-6xl mx-auto text-left">
            <div className="rounded-2xl border border-[#24211d] bg-[#141210] shadow-2xl overflow-hidden">
              {/* Browser bar */}
              <div className="h-10 px-4 bg-[#1a1714] border-b border-[#24211d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ef6a57]" />
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <div className="w-3 h-3 rounded-full bg-[#4cc38a]" />
                  <div className="ml-4 px-3 py-1 rounded-md bg-[#0b0908] text-[11px] font-mono text-[#8c857b] border border-[#24211d] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4cc38a]" />
                    https://personalfinance.app/dashboard
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#8c857b]">
                  <span className="px-2 py-0.5 rounded bg-[#4cc38a]/10 text-[#4cc38a] border border-[#4cc38a]/30">
                    Redis Cache HIT (0.6ms)
                  </span>
                </div>
              </div>

              {/* App Layout Inside Window */}
              <div className="flex flex-col lg:flex-row">
                {/* Mini Sidebar */}
                <div className="hidden lg:flex w-16 bg-[#100e0c] border-r border-[#24211d] py-5 flex-col items-center justify-between">
                  <div className="space-y-6 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-[#7355be] flex items-center justify-center text-white font-bold text-xs">
                      M
                    </div>
                    <div className="p-2 rounded-lg bg-[#7355be]/20 text-[#9376de]">
                      <Activity size={18} />
                    </div>
                    <div className="p-2 rounded-lg text-[#8c857b] hover:text-white">
                      <CreditCard size={18} />
                    </div>
                    <div className="p-2 rounded-lg text-[#8c857b] hover:text-white">
                      <Calendar size={18} />
                    </div>
                    <div className="p-2 rounded-lg text-[#8c857b] hover:text-white">
                      <PieIcon size={18} />
                    </div>
                    <div className="p-2 rounded-lg text-[#8c857b] hover:text-white">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                  <div className="text-[#8c857b] hover:text-white">
                    <Sliders size={18} />
                  </div>
                </div>

                {/* Dashboard Grid Content */}
                <div className="flex-1 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Card 1: Balance Trend */}
                  <div className="p-5 rounded-2xl bg-[#1a1714] border border-[#24211d] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#8c857b]">
                        <span>Balance trend</span>
                        <span className="px-2 py-0.5 rounded bg-[#24211d] text-white text-[10px]">Total ▾</span>
                      </div>
                      <Sliders size={13} className="text-[#8c857b]" />
                    </div>
                    <div>
                      <div className="text-2xl font-black font-mono text-white tracking-tight">
                        $150,840.93
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="text-[#8c857b] font-mono">OCTOBER 2026</span>
                        <span className="text-[#4cc38a] font-mono font-bold">+$2,928.55 +1.98%</span>
                      </div>
                    </div>
                    {/* Visual Waveform SVG */}
                    <div className="h-20 w-full pt-2">
                      <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="gradViolet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7355be" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#7355be" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,45 Q30,40 60,50 T120,30 T180,35 T240,25 T300,30 L300,70 L0,70 Z"
                          fill="url(#gradViolet)"
                        />
                        <path
                          d="M0,45 Q30,40 60,50 T120,30 T180,35 T240,25 T300,30"
                          fill="none"
                          stroke="#9376de"
                          strokeWidth="2.5"
                        />
                        <circle cx="60" cy="50" r="3.5" fill="#ef6a57" />
                        <circle cx="120" cy="30" r="3.5" fill="#4cc38a" />
                        <circle cx="180" cy="35" r="3.5" fill="#ef6a57" />
                        <circle cx="240" cy="25" r="3.5" fill="#4cc38a" />
                      </svg>
                    </div>
                  </div>

                  {/* Card 2: Cash Flow */}
                  <div className="p-5 rounded-2xl bg-[#1a1714] border border-[#24211d] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#8c857b] flex items-center gap-1.5">
                        <span>Cash flow</span>
                        <span className="text-[10px] text-[#8c857b]">ⓘ</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#8c857b]">
                        <ArrowUpRight size={13} />
                        <Sliders size={13} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black font-mono text-[#4cc38a] tracking-tight">
                          +$2,752.92
                        </span>
                        <span className="text-[11px] font-mono text-[#4cc38a] font-bold">↗ +82% vs prev</span>
                      </div>
                      <div className="text-[11px] text-[#8c857b] font-mono mt-0.5">OCTOBER 2026</div>
                    </div>

                    {/* Segmented Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="h-2 w-full rounded-full bg-[#24211d] flex overflow-hidden">
                        <div className="w-[60%] bg-[#4cc38a]" />
                        <div className="w-[40%] bg-[#ef6a57]" />
                      </div>
                      <div className="grid grid-cols-3 text-[10px] font-mono pt-1">
                        <div>
                          <span className="text-[#8c857b] block">INCOME</span>
                          <span className="text-[#4cc38a] font-bold">$7,980.13</span>
                        </div>
                        <div>
                          <span className="text-[#8c857b] block">EXPENSES</span>
                          <span className="text-[#ef6a57] font-bold">$5,227.21</span>
                        </div>
                        <div>
                          <span className="text-[#8c857b] block">SAVED</span>
                          <span className="text-[#4cc38a] font-bold">34%</span>
                        </div>
                      </div>
                    </div>

                    {/* Mini periods bar chart */}
                    <div className="flex items-end justify-between h-12 pt-1 border-t border-[#24211d]">
                      {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m, i) => (
                        <div key={m} className="flex flex-col items-center gap-1">
                          <div
                            className="w-4 rounded bg-[#4cc38a]/80"
                            style={{ height: `${20 + i * 5}px` }}
                          />
                          <span className="text-[9px] text-[#8c857b]">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Spending Pace */}
                  <div className="p-5 rounded-2xl bg-[#1a1714] border border-[#24211d] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8c857b]">Spending pace</span>
                      <div className="flex items-center gap-1 bg-[#24211d] p-0.5 rounded-lg text-[10px]">
                        <button
                          onClick={() => setSpendingPaceMode('month')}
                          className={`px-2 py-0.5 rounded ${spendingPaceMode === 'month' ? 'bg-[#141210] text-white font-bold' : 'text-[#8c857b]'}`}
                        >
                          vs last mo
                        </button>
                        <button
                          onClick={() => setSpendingPaceMode('avg')}
                          className={`px-2 py-0.5 rounded ${spendingPaceMode === 'avg' ? 'bg-[#141210] text-white font-bold' : 'text-[#8c857b]'}`}
                        >
                          vs 3-mo avg
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#8c857b]">Spent in Nov</div>
                      <div className="text-2xl font-black font-mono text-white tracking-tight">
                        $2,232.83
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-[#8c857b]">On track for ~$4,161</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#4cc38a]/10 text-[#4cc38a] font-bold">
                          -15% vs 3-mo avg
                        </span>
                      </div>
                    </div>
                    <div className="h-16 pt-2">
                      <svg viewBox="0 0 300 60" className="w-full h-full">
                        <path d="M0,50 Q100,45 150,30" fill="none" stroke="#9376de" strokeWidth="2.5" />
                        <path d="M150,30 Q220,20 300,15" fill="none" stroke="#4cc38a" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M0,45 Q150,35 300,20" fill="none" stroke="#48423b" strokeWidth="1.5" />
                        <circle cx="150" cy="30" r="3.5" fill="#9376de" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[#8c857b]">
                      <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#9376de]" /> This month</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#4cc38a] border-b border-dashed" /> Forecast</span>
                    </div>
                  </div>

                  {/* Card 4: Recurring Payments */}
                  <div className="p-5 rounded-2xl bg-[#1a1714] border border-[#24211d] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8c857b]">Recurring payments</span>
                      <ArrowUpRight size={13} className="text-[#8c857b]" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black font-mono text-white">$149.90</span>
                        <span className="text-[11px] text-[#4cc38a] font-mono">2.3% of avg income</span>
                      </div>
                      <div className="text-[11px] text-[#8c857b] mt-1">7 active • ~$1,798.80 per year</div>
                    </div>
                  </div>

                  {/* Card 5: Expenses Structure */}
                  <div className="p-5 rounded-2xl bg-[#1a1714] border border-[#24211d] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8c857b]">Expenses structure</span>
                      <Sliders size={13} className="text-[#8c857b]" />
                    </div>
                    <div>
                      <div className="text-2xl font-black font-mono text-[#ef6a57]">-$5,227.21</div>
                      <div className="text-[11px] text-[#ef6a57] font-bold mt-1">+31.71% vs previous period</div>
                    </div>
                  </div>

                  {/* Card 6: FIRE Progress */}
                  <div className="p-5 rounded-2xl bg-[#1a1714] border border-[#24211d] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8c857b]">FIRE progress</span>
                      <ArrowUpRight size={13} className="text-[#8c857b]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#9376de] font-mono font-bold">
                        <Flame size={14} /> TIME TO FIRE
                      </div>
                      <div className="text-xl font-black font-mono text-white mt-1">11 yrs 4 mos</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Launch inside Mockup */}
              <div className="p-4 bg-[#1a1714] border-t border-[#24211d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-[#8c857b]">
                  Launch any pre-configured demo account with instant token injection:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickDemoLogin('admin@finance.com', 'AdminPassword123!')}
                    className="px-3 py-1.5 rounded-lg bg-[#7355be] hover:bg-[#8365ce] text-white font-bold transition-all text-xs flex items-center gap-1"
                  >
                    <span>Launch Admin</span>
                    <ArrowRight size={12} />
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('user@finance.com', 'UserPassword123!')}
                    className="px-3 py-1.5 rounded-lg bg-[#24211d] hover:bg-[#322e28] text-white font-bold transition-all text-xs"
                  >
                    Standard User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: HOW IT WORKS (MoneyMatter Diagram) */}
      <section id="how-it-works" className="py-24 border-t border-[#24211d] bg-[#0e0c0a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-left max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9376de] tracking-wider uppercase">
              <span>M HOW IT WORKS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              From scattered bank data to a settled picture
            </h2>
            <p className="text-sm text-[#8c857b] leading-relaxed">
              Your transactions arrive messy. By the time you open the app, they are sorted, matched and counted.
            </p>
          </div>

          {/* Diagram Flow: Banks -> Engine -> Settled */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Your banks and files */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-bold text-[#8c857b] uppercase tracking-wider mb-2">
                Your banks and files
              </div>
              
              <div className="p-3.5 rounded-xl bg-[#141210] border border-[#24211d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#24211d] flex items-center justify-center text-[10px] font-bold text-white">
                    mono
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Monobank</div>
                    <div className="text-[10px] font-mono text-[#8c857b]">STREAMBOX RFND</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#4cc38a]">+12.99</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141210] border border-[#24211d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center text-xs font-bold">
                    ☕
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Lunch Flow</div>
                    <div className="text-[10px] font-mono text-[#8c857b]">CORNER COFFEE #0412</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#ef6a57]">-6.50</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141210] border border-[#24211d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                    ▲
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">SimpleFIN</div>
                    <div className="text-[10px] font-mono text-[#8c857b]">ACME PAYROLL OCT</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#4cc38a]">+4200.00</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141210] border border-[#24211d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#24211d] flex items-center justify-center text-xs text-[#8c857b]">
                    📄
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Bank statement</div>
                    <div className="text-[10px] font-mono text-[#8c857b]">TRF TO SAVINGS</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#ef6a57]">-500.00</span>
              </div>

              <div className="text-[11px] text-[#8c857b] pt-1 italic">
                Sample data with fictional merchants.
              </div>
            </div>

            {/* Center: MoneyMatter Auto Engine */}
            <div className="lg:col-span-3">
              <div className="text-xs font-bold text-[#8c857b] uppercase tracking-wider mb-2 text-center lg:text-left">
                Sorted automatically
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1e172a] to-[#141210] border border-[#7355be]/40 shadow-xl shadow-[#7355be]/10 space-y-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#7355be] flex items-center justify-center text-white font-bold text-xs">
                    M
                  </div>
                  <span className="font-extrabold text-sm text-white">MoneyMatter</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-4 h-4 rounded-full bg-[#7355be] flex items-center justify-center text-[10px] text-white">
                      ✓
                    </div>
                    <span>Categorizing</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-4 h-4 rounded-full bg-[#7355be] flex items-center justify-center text-[10px] text-white">
                      ✓
                    </div>
                    <span>Applying your rules</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-4 h-4 rounded-full bg-[#7355be] flex items-center justify-center text-[10px] text-white">
                      ✓
                    </div>
                    <span>Matching transfers and refunds</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-4 h-4 rounded-full bg-[#7355be] flex items-center justify-center text-[10px] text-white">
                      ✓
                    </div>
                    <span>Finding payees</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#7355be]/20 text-[11px] font-mono text-[#9376de]">
                  5 transactions sorted
                </div>
              </div>
            </div>

            {/* Right: Everything settled */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold text-[#8c857b] uppercase tracking-wider mb-2">
                Everything settled
              </div>
              <div className="p-6 rounded-2xl bg-[#141210] border border-[#24211d] space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">All settled</span>
                  <div className="w-5 h-5 rounded-full bg-[#4cc38a] flex items-center justify-center text-[11px] text-black font-black">
                    ✓
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#1a1714] border border-[#24211d]">
                    <div className="text-[11px] text-[#8c857b]">Net worth</div>
                    <div className="text-lg font-black font-mono text-white mt-0.5">$18,262.64</div>
                    <div className="text-[10px] text-[#4cc38a] font-mono mt-1">+$4,122.29</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#1a1714] border border-[#24211d] space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8c857b]">Checking</span>
                      <span className="text-white font-mono font-bold">$5,762.64</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8c857b]">Savings</span>
                      <span className="text-white font-mono font-bold">$12,500.00</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#24211d] text-center">
                  <div className="p-2 rounded-lg bg-[#1a1714]">
                    <span className="text-[10px] text-[#8c857b] block">Income</span>
                    <span className="text-xs font-mono font-bold text-[#4cc38a]">+$4,200.00</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1a1714]">
                    <span className="text-[10px] text-[#8c857b] block">Expenses</span>
                    <span className="text-xs font-mono font-bold text-[#ef6a57]">-$77.71</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1a1714]">
                    <span className="text-[10px] text-[#8c857b] block">Groceries</span>
                    <span className="text-xs font-mono font-bold text-white">$84 of $400</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: AUTOMATION (MoneyMatter Rules & Smart Matching) */}
      <section id="automation" className="py-24 border-t border-[#24211d] bg-[#0b0908] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-left max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9376de] tracking-wider uppercase">
              <span>M AUTOMATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              The tedious part is done before you open the app
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: AI Categorization */}
            <div className="p-6 rounded-2xl bg-[#141210] border border-[#24211d] space-y-5">
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-[#1a1714] border border-[#24211d] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8c857b]">GRN MKT 88213</span>
                  <span className="text-[#8c857b]">→</span>
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#4cc38a]" /> Green Market
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#4cc38a]/10 text-[#4cc38a] text-[10px] font-bold">
                    Groceries
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#1a1714] border border-[#24211d] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8c857b]">CORNER COFFEE #0412</span>
                  <span className="text-[#8c857b]">→</span>
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Corner Coffee
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-[10px] font-bold">
                    Eating out
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#1a1714] border border-[#24211d] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8c857b]">ACME PAYROLL OCT</span>
                  <span className="text-[#8c857b]">→</span>
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7355be]" /> Acme Inc
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#7355be]/20 text-[#9376de] text-[10px] font-bold">
                    Salary
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-[#9376de]" /> AI categorization
                </h3>
                <p className="text-xs text-[#8c857b] mt-1 leading-relaxed">
                  Cryptic bank descriptions become real categories, without a setup step.
                </p>
              </div>
            </div>

            {/* Card 2: Your Rules */}
            <div className="p-6 rounded-2xl bg-[#141210] border border-[#24211d] space-y-5">
              <div className="p-5 rounded-xl bg-[#1a1714] border border-[#24211d] space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#8c857b] uppercase text-[10px] font-bold w-12">WHEN</span>
                  <span className="px-2.5 py-1 rounded bg-[#24211d] text-white">Payee contains Corner Coffee</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#8c857b] uppercase text-[10px] font-bold w-12">THEN</span>
                  <span className="px-2.5 py-1 rounded bg-[#24211d] text-[#f59e0b]">set category to 🍴 Eating out</span>
                </div>
                <div className="pt-2 text-[11px] text-[#4cc38a] flex items-center gap-1.5">
                  <Check size={13} /> Runs on every new transaction
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders size={16} className="text-[#9376de]" /> Your rules
                </h3>
                <p className="text-xs text-[#8c857b] mt-1 leading-relaxed">
                  Decide once how something should be handled, and it stays handled.
                </p>
              </div>
            </div>

            {/* Card 3: Transfers and refunds */}
            <div className="p-6 rounded-2xl bg-[#141210] border border-[#24211d] space-y-5">
              <div className="p-4 rounded-xl bg-[#1a1714] border border-[#24211d] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8c857b] flex items-center gap-1.5">🏦 Checking</span>
                  <span className="font-mono text-[#ef6a57] font-bold">-$500.00</span>
                </div>
                <div className="px-3 py-1 rounded-lg bg-[#24211d] text-[11px] text-[#9376de] flex items-center justify-center gap-1.5 font-mono">
                  <RefreshCw size={12} /> One transfer, both sides matched
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8c857b] flex items-center gap-1.5">🛡️ Savings</span>
                  <span className="font-mono text-[#4cc38a] font-bold">+$500.00</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <RefreshCw size={16} className="text-[#9376de]" /> Transfers and refunds
                </h3>
                <p className="text-xs text-[#8c857b] mt-1 leading-relaxed">
                  Both sides get matched, so moving money never looks like spending it.
                </p>
              </div>
            </div>

            {/* Card 4: Payees and subscriptions */}
            <div className="p-6 rounded-2xl bg-[#141210] border border-[#24211d] space-y-5">
              <div className="p-4 rounded-xl bg-[#1a1714] border border-[#24211d] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono pb-1 border-b border-[#24211d]">
                  <span className="text-[#8c857b]">3 recurring payments found</span>
                  <span className="text-white font-bold">$96.99 / month</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-[10px]">▶</span>
                    Streambox (next Nov 14)
                  </span>
                  <span className="font-mono text-white">$12.99</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-purple-600 flex items-center justify-center text-[10px]">F</span>
                    Fit Club (next Nov 20)
                  </span>
                  <span className="font-mono text-white">$39.00</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard size={16} className="text-[#9376de]" /> Payees and subscriptions
                </h3>
                <p className="text-xs text-[#8c857b] mt-1 leading-relaxed">
                  Merchants are recognized and recurring payments show up on their own.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom 2 pill highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#141210] border border-[#24211d] flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#7355be]/20 text-[#9376de]">
                <CheckSquare size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Account reconciliation</div>
                <div className="text-[11px] text-[#8c857b]">Check your balance against the bank's and settle the difference.</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141210] border border-[#24211d] flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#7355be]/20 text-[#9376de]">
                <FileSpreadsheet size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Statement import</div>
                <div className="text-[11px] text-[#8c857b]">Drop in a bank statement. AI-assisted parsing handles messy files.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION: PLAN AND UNDERSTAND (MoneyMatter Budget Spreadsheet) */}
      <section id="plan" className="py-24 border-t border-[#24211d] bg-[#0e0c0a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-left max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9376de] tracking-wider uppercase">
              <span>M PLAN AND UNDERSTAND</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              See where it goes, then decide where it should
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Nav Pill Tabs */}
            <div className="lg:col-span-4 space-y-2">
              <button
                onClick={() => setActivePlanTab('budgets')}
                className={`w-full p-4 rounded-2xl text-left transition-all border ${
                  activePlanTab === 'budgets'
                    ? 'bg-[#1a1714] border-[#7355be]/50 shadow-lg'
                    : 'bg-[#141210] border-[#24211d] hover:bg-[#1a1714]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${activePlanTab === 'budgets' ? 'bg-[#7355be] text-white' : 'bg-[#24211d] text-[#8c857b]'}`}>
                    <Calendar size={17} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Budgets</div>
                    <div className="text-xs text-[#8c857b] mt-0.5">
                      Assign money to lines and see what is left at a glance.
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActivePlanTab('moneyFlow')}
                className={`w-full p-4 rounded-2xl text-left transition-all border ${
                  activePlanTab === 'moneyFlow'
                    ? 'bg-[#1a1714] border-[#7355be]/50 shadow-lg'
                    : 'bg-[#141210] border-[#24211d] hover:bg-[#1a1714]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${activePlanTab === 'moneyFlow' ? 'bg-[#7355be] text-white' : 'bg-[#24211d] text-[#8c857b]'}`}>
                    <Activity size={17} />
                  </div>
                  <div className="text-sm font-bold text-white">Money flow</div>
                </div>
              </button>

              <button
                onClick={() => setActivePlanTab('savings')}
                className={`w-full p-4 rounded-2xl text-left transition-all border ${
                  activePlanTab === 'savings'
                    ? 'bg-[#1a1714] border-[#7355be]/50 shadow-lg'
                    : 'bg-[#141210] border-[#24211d] hover:bg-[#1a1714]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${activePlanTab === 'savings' ? 'bg-[#7355be] text-white' : 'bg-[#24211d] text-[#8c857b]'}`}>
                    <Target size={17} />
                  </div>
                  <div className="text-sm font-bold text-white">Savings goals</div>
                </div>
              </button>

              <button
                onClick={() => setActivePlanTab('trackers')}
                className={`w-full p-4 rounded-2xl text-left transition-all border ${
                  activePlanTab === 'trackers'
                    ? 'bg-[#1a1714] border-[#7355be]/50 shadow-lg'
                    : 'bg-[#141210] border-[#24211d] hover:bg-[#1a1714]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${activePlanTab === 'trackers' ? 'bg-[#7355be] text-white' : 'bg-[#24211d] text-[#8c857b]'}`}>
                    <PieIcon size={17} />
                  </div>
                  <div className="text-sm font-bold text-white">Trackers</div>
                </div>
              </button>

              <button
                onClick={() => setActivePlanTab('fire')}
                className={`w-full p-4 rounded-2xl text-left transition-all border ${
                  activePlanTab === 'fire'
                    ? 'bg-[#1a1714] border-[#7355be]/50 shadow-lg'
                    : 'bg-[#141210] border-[#24211d] hover:bg-[#1a1714]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${activePlanTab === 'fire' ? 'bg-[#7355be] text-white' : 'bg-[#24211d] text-[#8c857b]'}`}>
                    <Flame size={17} />
                  </div>
                  <div className="text-sm font-bold text-white">FIRE (Financial Independence)</div>
                </div>
              </button>
            </div>

            {/* Right Interactive Table View */}
            <div className="lg:col-span-8 rounded-2xl bg-[#141210] border border-[#24211d] p-6 shadow-2xl overflow-x-auto">
              <div className="min-w-[550px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 text-[11px] font-mono font-bold text-[#8c857b] pb-3 border-b border-[#24211d]">
                  <div className="col-span-6 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded border border-[#8c857b]/40" />
                    LINE GROUP +
                  </div>
                  <div className="col-span-2 text-right">ASSIGNED</div>
                  <div className="col-span-2 text-right">ACTIVITY</div>
                  <div className="col-span-2 text-right">AVAILABLE</div>
                </div>

                {/* Group 1: BILLS */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-2">
                      <ChevronDown size={13} className="text-[#8c857b]" /> BILLS +
                    </span>
                    <span className="text-[11px] font-mono text-[#8c857b]">$1.78K • -$1.49K • $295.96</span>
                  </div>

                  {/* Rent Row */}
                  <div className="grid grid-cols-12 text-xs font-mono py-1.5 items-center">
                    <div className="col-span-6 pl-4 space-y-1">
                      <div className="flex items-center justify-between pr-4">
                        <span className="text-white">Rent</span>
                        <span className="text-[10px] text-[#8c857b]">100% used • $1.4K of $1.4K</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#24211d] rounded-full overflow-hidden">
                        <div className="w-full h-full bg-[#4cc38a]" />
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-white">$1.4K</div>
                    <div className="col-span-2 text-right text-[#ef6a57]">-$1.4K</div>
                    <div className="col-span-2 text-right text-[#8c857b]">$0.00</div>
                  </div>

                  {/* Utilities Row */}
                  <div className="grid grid-cols-12 text-xs font-mono py-1.5 items-center">
                    <div className="col-span-6 pl-4 space-y-1">
                      <div className="flex items-center justify-between pr-4">
                        <span className="text-white">Utilities</span>
                        <span className="text-[10px] text-[#4cc38a]">0% used</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#24211d] rounded-full overflow-hidden">
                        <div className="w-[5%] h-full bg-[#4cc38a]" />
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-white">$120.00</div>
                    <div className="col-span-2 text-right text-[#8c857b]">$0.00</div>
                    <div className="col-span-2 text-right text-[#4cc38a]">$120.50</div>
                  </div>
                </div>

                {/* Group 2: EVERYDAY */}
                <div className="pt-6 space-y-3 border-t border-[#24211d] mt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-2">
                      <ChevronDown size={13} className="text-[#8c857b]" /> EVERYDAY +
                    </span>
                    <span className="text-[11px] font-mono text-[#8c857b]">$2.45K • -$461.65 • $2.58K</span>
                  </div>

                  {/* Groceries */}
                  <div className="grid grid-cols-12 text-xs font-mono py-1.5 items-center">
                    <div className="col-span-6 pl-4 space-y-1">
                      <div className="flex items-center justify-between pr-4">
                        <span className="text-white">Groceries</span>
                        <span className="text-[10px] text-[#4cc38a]">✓ Funded</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#24211d] rounded-full overflow-hidden">
                        <div className="w-[30%] h-full bg-[#4cc38a]" />
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-white">$650.00</div>
                    <div className="col-span-2 text-right text-[#ef6a57]">-$201.42</div>
                    <div className="col-span-2 text-right text-[#4cc38a]">$810.46</div>
                  </div>

                  {/* Eating out - Over Budget! */}
                  <div className="grid grid-cols-12 text-xs font-mono py-1.5 items-center">
                    <div className="col-span-6 pl-4 space-y-1">
                      <div className="flex items-center justify-between pr-4">
                        <span className="text-white">Eating out</span>
                        <span className="text-[10px] text-[#ef6a57] font-bold">Over by $85.51</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#24211d] rounded-full overflow-hidden">
                        <div className="w-full h-full bg-[#ef6a57]" />
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-white">$430.00</div>
                    <div className="col-span-2 text-right text-[#ef6a57]">-$209.57</div>
                    <div className="col-span-2 text-right text-[#ef6a57] font-bold">-$85.51</div>
                  </div>
                </div>

                {/* Table Footer Summary */}
                <div className="grid grid-cols-12 text-xs font-mono font-bold pt-4 mt-6 border-t border-[#24211d] text-white">
                  <div className="col-span-6 pl-4 text-[#8c857b]">Total 12 lines</div>
                  <div className="col-span-2 text-right">$4.82K</div>
                  <div className="col-span-2 text-right text-[#ef6a57]">-$2.09K</div>
                  <div className="col-span-2 text-right text-[#4cc38a]">$4.05K</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION: RBAC ONE-CLICK TESTING */}
      <section id="rbac" className="py-20 bg-[#100e0c] border-t border-[#24211d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#7355be]/15 text-[#9376de] border border-[#7355be]/30">
              <Shield size={13} /> Strict RBAC Access Matrix
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Instant One-Click Demo Role Logins
            </h2>
            <p className="text-xs sm:text-sm text-[#8c857b]">
              Verify route protections, JWT claims, and disabled write permissions in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin */}
            <div className="p-6 rounded-2xl bg-[#141210] border border-[#24211d] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 text-purple-400 flex items-center justify-center font-bold">
                  <Shield size={19} />
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2 text-white">
                    Administrator
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 font-bold uppercase">
                      admin
                    </span>
                  </h3>
                  <p className="text-xs text-[#8c857b] mt-1">
                    Complete oversight of all data records, user management, and roles.
                  </p>
                </div>
                <ul className="text-xs space-y-2 text-[#8c857b]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-purple-400" /> Full access to `/admin/users`
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-purple-400" /> Promote or demote user roles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-purple-400" /> Full CRUD on all transactions
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickDemoLogin('admin@finance.com', 'AdminPassword123!')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#7355be] hover:bg-[#8365ce] text-white shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch as Admin</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Standard User */}
            <div className="p-6 rounded-2xl bg-[#141210] border-2 border-[#7355be] flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#7355be] text-white">
                Default Role
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 text-[#4cc38a] flex items-center justify-center font-bold">
                  <User size={19} />
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2 text-white">
                    Standard User
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/40 text-[#4cc38a] font-bold uppercase">
                      user
                    </span>
                  </h3>
                  <p className="text-xs text-[#8c857b] mt-1">
                    Manage personal income, expenses, categories, and view analytics.
                  </p>
                </div>
                <ul className="text-xs space-y-2 text-[#8c857b]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-[#4cc38a]" /> Add, edit & delete personal data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-[#4cc38a]" /> Automatic cache invalidation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-[#4cc38a]" /> Interactive charts & filters
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickDemoLogin('user@finance.com', 'UserPassword123!')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#4cc38a] hover:bg-[#3db37a] text-black font-extrabold shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch as Standard User</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Read-Only */}
            <div className="p-6 rounded-2xl bg-[#141210] border border-[#24211d] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 flex items-center justify-center font-bold">
                  <Eye size={19} />
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2 text-white">
                    Read-Only User
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 font-bold uppercase">
                      read-only
                    </span>
                  </h3>
                  <p className="text-xs text-[#8c857b] mt-1">
                    Strict view-only mode. Form buttons and mutation endpoints are locked.
                  </p>
                </div>
                <ul className="text-xs space-y-2 text-[#8c857b]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-amber-400" /> View transactions & analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-amber-400" /> Form buttons visually disabled
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-amber-400" /> API returns 403 Forbidden on writes
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickDemoLogin('readonly@finance.com', 'ReadOnlyPassword123!')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch as Read-Only</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-[#24211d] py-12 bg-[#0b0908]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#8c857b]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#7355be] text-white flex items-center justify-center font-black text-[10px]">
              M
            </div>
            <span className="font-bold text-white">MoneyMatter</span>
            <span>• Full Stack Personal Finance Tracker</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/aky2004/Personal-Finance-Tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 text-[#8c857b] hover:text-white"
            >
              GitHub Repository <ExternalLink size={11} />
            </a>
            <a
              href="http://localhost:5001/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 text-[#8c857b] hover:text-white"
            >
              Swagger Docs <ExternalLink size={11} />
            </a>
            <a
              href="http://localhost:5001/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 text-[#8c857b] hover:text-white"
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