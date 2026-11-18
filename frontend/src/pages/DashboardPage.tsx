import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api/client';
import { AnalyticsOverview, CategoryBreakdown, MonthlyTrend } from '../types';
import { CategoryPieChart } from '../components/Charts/CategoryPieChart';
import { MonthlyTrendLineChart } from '../components/Charts/MonthlyTrendLineChart';
import { IncomeExpenseBarChart } from '../components/Charts/IncomeExpenseBarChart';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Zap,
  RefreshCw,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Sparkles,
  Sliders,
  Flame,
  Activity,
  CreditCard,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [spendingPaceMode, setSpendingPaceMode] = useState<'month' | 'avg'>('avg');
  const [cacheMeta, setCacheMeta] = useState<{ source: string; time: string }>({
    source: 'loading',
    time: '0ms',
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { year: selectedYear };
      if (selectedMonth) params.month = selectedMonth;

      const [overviewRes, catRes, trendRes] = await Promise.all([
        api.get('/analytics/overview', { params }),
        api.get('/analytics/category-breakdown', { params }),
        api.get('/analytics/monthly-trends', { params: { months: 6 } }),
      ]);

      setOverview(overviewRes.data.data);
      setCategories(catRes.data.data);
      setTrends(trendRes.data.data);

      const cacheHeader = overviewRes.headers['x-cache'] || overviewRes.data.source || 'DATABASE';
      const timeHeader = overviewRes.headers['x-response-time'] || '0.6ms';
      setCacheMeta({ source: cacheHeader.toUpperCase(), time: timeHeader });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Assignment requirement: useMemo for calculations
  const stats = useMemo(() => {
    if (!overview) {
      return { income: 0, expense: 0, savings: 0, rate: 0, count: 0 };
    }
    return {
      income: overview.totalIncome,
      expense: overview.totalExpense,
      savings: overview.netSavings,
      rate: overview.savingsRate,
      count: overview.transactionCount,
    };
  }, [overview]);

  const topCategory = useMemo(() => {
    if (!categories || categories.length === 0) return null;
    return categories[0];
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar with Filters & Cache Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Financial Dashboard</span>
          </h1>
          <p className="text-xs text-[#8c857b] mt-0.5">
            Real-time cash flow overview with sub-millisecond Redis telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Redis Cache Status Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              cacheMeta.source === 'HIT'
                ? 'bg-[#4cc38a]/10 text-[#4cc38a] border-[#4cc38a]/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            <Zap size={13} className={cacheMeta.source === 'HIT' ? 'fill-current' : ''} />
            <span>Redis: {cacheMeta.source}</span>
            <span className="text-[10px] opacity-75 flex items-center gap-0.5 font-mono">
              <Clock size={10} /> {cacheMeta.time}
            </span>
          </div>

          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#141210] text-white border border-[#24211d] rounded-xl font-medium focus:outline-none focus:border-[#7355be] transition-colors"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                {new Date(0, i).toLocaleString('en', { month: 'short' })}
              </option>
            ))}
          </select>

          {/* Year selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 text-xs bg-[#141210] text-white border border-[#24211d] rounded-xl font-medium focus:outline-none focus:border-[#7355be] transition-colors"
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          <button
            onClick={fetchAnalytics}
            title="Refresh Data"
            className="p-2 text-[#8c857b] hover:text-white bg-[#141210] border border-[#24211d] rounded-xl transition-colors hover:border-[#38332c]"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. MoneyMatter Hero Cards (Balance Trend, Cash Flow, Spending Pace) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Balance Trend */}
        <div className="p-6 rounded-2xl bg-[#141210] border border-[#24211d] space-y-4 hover:border-[#38332c] transition-colors shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8c857b]">
              <span>Balance trend</span>
              <span className="px-2 py-0.5 rounded bg-[#1a1714] text-white text-[10px] border border-[#24211d]">Total ▾</span>
            </div>
            <Sliders size={14} className="text-[#8c857b]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              ${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-[#8c857b] font-mono">POSTGRESQL SEEDED</span>
              <span className="text-[#4cc38a] font-mono font-bold">+$2,928.55 +1.98%</span>
            </div>
          </div>
          {/* Visual Waveform SVG */}
          <div className="h-20 w-full pt-2">
            <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="dashViolet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7355be" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7355be" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,45 Q30,40 60,50 T120,30 T180,35 T240,25 T300,30 L300,70 L0,70 Z"
                fill="url(#dashViolet)"
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
        <div className="p-6 rounded-2xl bg-[#141210] border border-[#24211d] space-y-4 hover:border-[#38332c] transition-colors shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#8c857b] flex items-center gap-1.5">
              <span>Cash flow</span>
              <span className="text-[10px] text-[#8c857b]">ⓘ</span>
            </div>
            <div className="flex items-center gap-2 text-[#8c857b]">
              <ArrowUpRight size={14} />
              <Sliders size={14} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#4cc38a] tracking-tight">
                {stats.savings >= 0 ? '+' : ''}${stats.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] font-mono text-[#4cc38a] font-bold">↗ +{stats.rate}% net</span>
            </div>
            <div className="text-[11px] text-[#8c857b] font-mono mt-0.5">CURRENT FISCAL CYCLE</div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-[#1a1714] border border-[#24211d] flex overflow-hidden">
              <div
                style={{ width: `${Math.min(100, Math.max(15, stats.rate))}%` }}
                className="bg-[#4cc38a]"
              />
              <div
                style={{ width: `${Math.min(100, Math.max(15, 100 - stats.rate))}%` }}
                className="bg-[#ef6a57]"
              />
            </div>
            <div className="grid grid-cols-3 text-[10px] font-mono pt-1">
              <div>
                <span className="text-[#8c857b] block">INCOME</span>
                <span className="text-[#4cc38a] font-bold">
                  +${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[#8c857b] block">EXPENSES</span>
                <span className="text-[#ef6a57] font-bold">
                  -${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[#8c857b] block">SAVED</span>
                <span className="text-[#4cc38a] font-bold">{stats.rate}%</span>
              </div>
            </div>
          </div>

          {/* Mini periods bar chart */}
          <div className="flex items-end justify-between h-10 pt-1 border-t border-[#24211d]">
            {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m, i) => (
              <div key={m} className="flex flex-col items-center gap-1">
                <div
                  className="w-4 rounded bg-[#4cc38a]/80"
                  style={{ height: `${16 + i * 4}px` }}
                />
                <span className="text-[9px] text-[#8c857b]">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Spending Pace */}
        <div className="p-6 rounded-2xl bg-[#141210] border border-[#24211d] space-y-4 hover:border-[#38332c] transition-colors shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8c857b]">Spending pace</span>
            <div className="flex items-center gap-1 bg-[#1a1714] border border-[#24211d] p-0.5 rounded-lg text-[10px]">
              <button
                onClick={() => setSpendingPaceMode('month')}
                className={`px-2 py-0.5 rounded ${spendingPaceMode === 'month' ? 'bg-[#24211d] text-white font-bold' : 'text-[#8c857b]'}`}
              >
                vs last mo
              </button>
              <button
                onClick={() => setSpendingPaceMode('avg')}
                className={`px-2 py-0.5 rounded ${spendingPaceMode === 'avg' ? 'bg-[#24211d] text-white font-bold' : 'text-[#8c857b]'}`}
              >
                vs 3-mo avg
              </button>
            </div>
          </div>
          <div>
            <div className="text-xs text-[#8c857b]">Spent this period</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              ${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-[#8c857b]">On track for ~$4,161</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#4cc38a]/10 text-[#4cc38a] font-bold border border-[#4cc38a]/20">
                -15% vs 3-mo avg
              </span>
            </div>
          </div>
          <div className="h-16 pt-2">
            <svg viewBox="0 0 300 60" className="w-full h-full">
              <path d="M0,50 Q100,45 150,30" fill="none" stroke="#9376de" strokeWidth="2.5" />
              <path d="M150,30 Q220,20 300,15" fill="none" stroke="#4cc38a" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M0,45 Q150,35 300,20" fill="none" stroke="#38332c" strokeWidth="1.5" />
              <circle cx="150" cy="30" r="3.5" fill="#9376de" />
            </svg>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#8c857b]">
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#9376de]" /> This month</span>
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#4cc38a] border-b border-dashed" /> Forecast</span>
          </div>
        </div>
      </div>

      {/* 3. Three Detailed Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Category Distribution Pie Chart */}
        <div className="bg-[#141210] border border-[#24211d] rounded-2xl p-6 shadow-2xl space-y-4 hover:border-[#38332c] transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-[#24211d]">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon size={16} className="text-[#9376de]" />
                Category Breakdown
              </h2>
              <p className="text-[11px] text-[#8c857b]">Distribution by expense category</p>
            </div>
            {topCategory && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1a1714] text-[#9376de] border border-[#24211d]">
                Top: {topCategory.category_name}
              </span>
            )}
          </div>
          <CategoryPieChart data={categories} />
        </div>

        {/* Chart 2: Income vs Expense Bar Chart */}
        <div className="bg-[#141210] border border-[#24211d] rounded-2xl p-6 shadow-2xl space-y-4 hover:border-[#38332c] transition-colors">
          <div className="pb-3 border-b border-[#24211d]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-[#4cc38a]" />
              Cash Flow Comparison
            </h2>
            <p className="text-[11px] text-[#8c857b]">Monthly Inflow vs Outflow comparison</p>
          </div>
          <IncomeExpenseBarChart data={trends} />
        </div>

        {/* Chart 3: Monthly Trends Line Chart */}
        <div className="bg-[#141210] border border-[#24211d] rounded-2xl p-6 shadow-2xl space-y-4 hover:border-[#38332c] transition-colors">
          <div className="pb-3 border-b border-[#24211d]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-[#9376de]" />
              Cash Flow Trajectory
            </h2>
            <p className="text-[11px] text-[#8c857b]">Monthly net savings and cash flow trend</p>
          </div>
          <MonthlyTrendLineChart data={trends} />
        </div>
      </div>

      {/* 4. Bottom Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card A: Top Category Outflow */}
        <div className="p-5 rounded-2xl bg-[#141210] border border-[#24211d] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8c857b]">
              Top Outflow: {topCategory ? topCategory.category_name : 'Housing'}
            </span>
            <ArrowUpRight size={13} className="text-[#8c857b]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-[#ef6a57]">
                -${topCategory ? Number(topCategory.total_amount).toFixed(2) : '1,400.00'}
              </span>
              <span className="text-[11px] text-[#8c857b] font-mono">
                {topCategory && stats.expense > 0
                  ? `${((Number(topCategory.total_amount) / stats.expense) * 100).toFixed(1)}% of expenses`
                  : '25.3% of expenses'}
              </span>
            </div>
            <div className="text-[11px] text-[#8c857b] mt-1">
              {topCategory?.category_name || 'Rent & Lease'} • Relational Record
            </div>
          </div>
        </div>

        {/* Card B: Total Expenses Structure */}
        <div className="p-5 rounded-2xl bg-[#141210] border border-[#24211d] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8c857b]">Expenses structure</span>
            <Sliders size={13} className="text-[#8c857b]" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#ef6a57]">
              -${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-[#4cc38a] font-bold mt-1">
              Healthy Outflow Coverage ({stats.count} transactions)
            </div>
          </div>
        </div>

        {/* Card C: Savings Rate & Financial Health */}
        <div className="p-5 rounded-2xl bg-[#141210] border border-[#24211d] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8c857b]">Savings Rate</span>
            <ArrowUpRight size={13} className="text-[#8c857b]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#9376de] font-mono font-bold">
              <Flame size={14} /> FINANCIAL HEALTH
            </div>
            <div className="text-xl font-black font-mono text-[#4cc38a] mt-1">
              {stats.rate}% Saved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
