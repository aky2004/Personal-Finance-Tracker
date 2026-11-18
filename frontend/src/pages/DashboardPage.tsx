import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api/client';
import { AnalyticsOverview, CategoryBreakdown, MonthlyTrend } from '../types';
import { CategoryPieChart } from '../components/Charts/CategoryPieChart';
import { MonthlyTrendLineChart } from '../components/Charts/MonthlyTrendLineChart';
import { IncomeExpenseBarChart } from '../components/Charts/IncomeExpenseBarChart';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieIcon,
  Zap,
  RefreshCw,
  Clock,
  Layers,
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

  // Assignment requirement: useMemo to optimize expensive calculations (like totals, averages)
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
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time overview powered by Redis Caching (15 min TTL) & PostgreSQL
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Cache Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              cacheMeta.source === 'HIT'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800'
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800'
            }`}
          >
            <Zap size={13} className={cacheMeta.source === 'HIT' ? 'fill-emerald-500' : ''} />
            <span>Redis Cache: {cacheMeta.source}</span>
            <span className="text-[10px] opacity-75 flex items-center gap-0.5">
              <Clock size={10} /> {cacheMeta.time}
            </span>
          </div>

          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="p-1.5 text-slate-500 hover:text-indigo-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Total Income</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              ${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Earnings and salary inflows</p>
        </div>

        {/* Total Expenses */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Total Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              ${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Outflows across all categories</p>
        </div>

        {/* Net Savings */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Net Balance</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span
              className={`text-2xl font-black font-mono ${
                stats.savings >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600'
              }`}
            >
              ${stats.savings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Income minus expenses</p>
        </div>

        {/* Savings Rate */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Savings Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <PieIcon size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
              {stats.rate}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats.count} recorded transaction{stats.count !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Category Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PieIcon size={16} className="text-amber-500" />
                Category Distribution
              </h2>
              <p className="text-[11px] text-slate-500">Expenses breakdown by category</p>
            </div>
            {topCategory && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                Top: {topCategory.category_name}
              </span>
            )}
          </div>
          <CategoryPieChart data={categories} />
        </div>

        {/* Chart 2: Income vs Expense Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers size={16} className="text-indigo-500" />
              Income vs Expenses
            </h2>
            <p className="text-[11px] text-slate-500">Side-by-side comparison (Last 6 Months)</p>
          </div>
          <IncomeExpenseBarChart data={trends} />
        </div>

        {/* Chart 3: Monthly Trends Line Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" />
              Monthly Trends
            </h2>
            <p className="text-[11px] text-slate-500">Trajectory of cashflow and net savings</p>
          </div>
          <MonthlyTrendLineChart data={trends} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
