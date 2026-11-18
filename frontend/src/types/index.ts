export type UserRole = 'admin' | 'user' | 'read-only';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  created_at?: string;
  transaction_count?: number;
  total_income?: number;
  total_expense?: number;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  category_id: number | null;
  category_name: string | null;
  category_color: string | null;
  category_icon: string | null;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  description: string;
  created_at?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnalyticsOverview {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  transactionCount: number;
  year?: number;
  month?: number | null;
}

export interface CategoryBreakdown {
  category_name: string;
  color: string;
  icon: string;
  total_amount: number;
  count: number;
}

export interface MonthlyTrend {
  month_str: string;
  display_name: string;
  income: number;
  expense: number;
  net: number;
}
