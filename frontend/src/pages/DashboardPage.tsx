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
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
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
      const timeHeader = overviewRes.headers['x-response-time'] || '0ms';
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
          <h1 className="text-xl sm:text-2xl font-black text-ink-light dark:text-ink-dark tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-xs text-ink-muted dark:text-ink-darkmuted mt-0.5">
            Real-time cash flow overview with sub-millisecond Redis telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Redis Cache Status Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${
              cacheMeta.source === 'HIT'
                ? 'bg-emerald-50 text-money-green border-emerald-200/80 dark:bg-emerald-950/40 dark:text-money-greendark dark:border-emerald-900/60'
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60'
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
            className="px-3 py-1.5 text-xs bg-panel-light dark:bg-panel-dark text-ink-light dark:text-ink-dark border border-borderline-light dark:border-borderline-dark rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand"
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
            className="px-3 py-1.5 text-xs bg-panel-light dark:bg-panel-dark text-ink-light dark:text-ink-dark border border-borderline-light dark:border-borderline-dark rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand"
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
            className="p-1.5 text-ink-muted hover:text-brand bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-xl transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. MoneyMatter Hero Net Worth / Cash Flow Card */}
      <div className="p-6 bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-2xl shadow-moneymatter dark:shadow-moneymatter-dark space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-darkmuted">
              Net Cash Flow (Savings)
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${
                stats.savings >= 0 ? 'text-money-green dark:text-money-greendark' : 'text-money-red dark:text-money-reddark'
              }`}>
                {stats.savings >= 0 ? '+' : ''}${stats.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand dark:bg-brand-dark/15 dark:text-brand-dark">
                {stats.rate}% Savings Rate
              </span>
            </div>
          </div>

          {/* Quick Flow Chips */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-money-green dark:text-money-greendark flex items-center justify-center">
                <ArrowDownLeft size={14} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-muted dark:text-ink-darkmuted block">Inflow</span>
                <span className="font-mono text-xs font-bold text-money-green dark:text-money-greendark">
                  +${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-rose-100 dark:bg-rose-900/50 text-money-red dark:text-money-reddark flex items-center justify-center">
                <ArrowUpRight size={14} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-muted dark:text-ink-darkmuted block">Outflow</span>
                <span className="font-mono text-xs font-bold text-money-red dark:text-money-reddark">
                  -${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar (Savings Rate Bar) */}
        <div>
          <div className="flex justify-between text-xs text-ink-muted dark:text-ink-darkmuted mb-1.5 font-medium">
            <span>Budget Utilization</span>
            <span>{stats.count} recorded transaction{stats.count !== 1 ? 's' : ''}</span>
          </div>
          <div className="w-full h-2.5 bg-soft-light dark:bg-soft-dark rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.min(100, Math.max(0, stats.rate))}%` }}
              className="bg-brand dark:bg-brand-dark transition-all duration-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* 3. Three Charts Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Category Distribution Pie Chart */}
        <div className="bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-2xl p-5 shadow-moneymatter dark:shadow-moneymatter-dark space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderline-light dark:border-borderline-dark">
            <div>
              <h2 className="text-sm font-bold text-ink-light dark:text-ink-dark flex items-center gap-2">
                <PieIcon size={16} className="text-brand dark:text-brand-dark" />
                Category Breakdown
              </h2>
              <p className="text-[11px] text-ink-muted dark:text-ink-darkmuted">Distribution by expense category</p>
            </div>
            {topCategory && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-soft-light dark:bg-soft-dark text-brand dark:text-brand-dark">
                Top: {topCategory.category_name}
              </span>
            )}
          </div>
          <CategoryPieChart data={categories} />
        </div>

        {/* Chart 2: Income vs Expense Bar Chart */}
        <div className="bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-2xl p-5 shadow-moneymatter dark:shadow-moneymatter-dark space-y-4">
          <div className="pb-3 border-b border-borderline-light dark:border-borderline-dark">
            <h2 className="text-sm font-bold text-ink-light dark:text-ink-dark flex items-center gap-2">
              <Layers size={16} className="text-money-green dark:text-money-greendark" />
              Cash Flow Comparison
            </h2>
            <p className="text-[11px] text-ink-muted dark:text-ink-darkmuted">Monthly Income vs Outflow comparison</p>
          </div>
          <IncomeExpenseBarChart data={trends} />
        </div>

        {/* Chart 3: Monthly Trends Line Chart */}
        <div className="bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-2xl p-5 shadow-moneymatter dark:shadow-moneymatter-dark space-y-4">
          <div className="pb-3 border-b border-borderline-light dark:border-borderline-dark">
            <h2 className="text-sm font-bold text-ink-light dark:text-ink-dark flex items-center gap-2">
              <TrendingUp size={16} className="text-brand dark:text-brand-dark" />
              Cash Flow Trajectory
            </h2>
            <p className="text-[11px] text-ink-muted dark:text-ink-darkmuted">Monthly net savings and cash flow trend</p>
          </div>
          <MonthlyTrendLineChart data={trends} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
