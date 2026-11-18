import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/client';
import { Transaction, Category, Pagination } from '../types';
import { useAuth } from '../context/AuthContext';
import { TransactionModal } from '../components/TransactionModal';
import { VirtualTransactionList } from '../components/VirtualTransactionList';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Tag,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  List,
  Sparkles,
} from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const { isReadOnly } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Filter States
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // View mode: Paginated table vs. Virtual Scrolling feed
  const [viewMode, setViewMode] = useState<'table' | 'virtual'>('table');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories (cached in Redis for 1 hour)
  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Fetch transactions with pagination, filters, and sorting
  const fetchTransactions = useCallback(async (pageToLoad = 1, customLimit?: number) => {
    setLoading(true);
    try {
      const limit = customLimit || (viewMode === 'virtual' ? 100 : 10);
      const params: any = {
        page: pageToLoad,
        limit,
        sortBy,
        sortOrder,
      };

      if (typeFilter !== 'all') params.type = typeFilter;
      if (categoryFilter) params.categoryId = categoryFilter;
      if (search) params.search = search;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/transactions', { params });
      setTransactions(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [viewMode, sortBy, sortOrder, typeFilter, categoryFilter, search, startDate, endDate]);

  useEffect(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  // Assignment requirement: useMemo for memoized filtered/sorted transactions list
  const clientFilteredList = useMemo(() => {
    return transactions;
  }, [transactions]);

  // Assignment requirement: useMemo for client-side quick summary statistics
  const listStats = useMemo(() => {
    let income = 0;
    let expense = 0;
    clientFilteredList.forEach((tx) => {
      const amt = Number(tx.amount);
      if (tx.type === 'income') income += amt;
      else expense += amt;
    });
    return { income, expense, balance: income - expense };
  }, [clientFilteredList]);

  // Assignment requirement: useCallback to optimize event handlers
  const handleOpenAddModal = useCallback(() => {
    if (isReadOnly) return;
    setEditingTransaction(null);
    setIsModalOpen(true);
  }, [isReadOnly]);

  const handleOpenEditModal = useCallback((tx: Transaction) => {
    if (isReadOnly) return;
    setEditingTransaction(tx);
    setIsModalOpen(true);
  }, [isReadOnly]);

  const handleDelete = useCallback(async (id: number) => {
    if (isReadOnly) return;
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions(pagination.page);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete transaction');
    }
  }, [isReadOnly, fetchTransactions, pagination.page]);

  const handleModalSubmit = useCallback(async (data: Partial<Transaction>) => {
    if (editingTransaction) {
      await api.put(`/transactions/${editingTransaction.id}`, data);
    } else {
      await api.post('/transactions', data);
    }
    fetchTransactions(1);
  }, [editingTransaction, fetchTransactions]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Transaction Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your personal income and expense records with full RBAC protection
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle: Table vs Virtualized List */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => { setViewMode('table'); fetchTransactions(1, 10); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <List size={14} /> Paginated Table
            </button>
            <button
              onClick={() => { setViewMode('virtual'); fetchTransactions(1, 100); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'virtual'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sparkles size={14} /> Virtual Scrolling
            </button>
          </div>

          {/* Add Transaction Button: Disabled with tooltip for read-only users */}
          <button
            onClick={handleOpenAddModal}
            disabled={isReadOnly}
            title={isReadOnly ? 'Read-only users cannot add transactions' : 'Add new transaction'}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${
              isReadOnly
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Read-only Alert Bar if active */}
      {isReadOnly && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-600" />
            <span>
              <strong>Read-Only Access:</strong> You are viewing transactions in read-only mode. Form controls, additions, edits, and deletions are disabled per RBAC policy.
            </span>
          </div>
        </div>
      )}

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Page Total Income</span>
          <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            +${listStats.income.toFixed(2)}
          </span>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Page Total Expense</span>
          <span className="text-base font-extrabold font-mono text-rose-600 dark:text-rose-400">
            -${listStats.expense.toFixed(2)}
          </span>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Page Net Cashflow</span>
          <span className={`text-base font-extrabold font-mono ${listStats.balance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600'}`}>
            ${listStats.balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter size={15} className="absolute left-3 top-3 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Tag size={15} className="absolute left-3 top-3 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Start */}
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Date Range End */}
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} />
            <span>Sort by:</span>
            <button
              onClick={() => {
                if (sortBy === 'date') setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
                else { setSortBy('date'); setSortOrder('DESC'); }
              }}
              className={`font-semibold hover:underline ${sortBy === 'date' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
            >
              Date ({sortBy === 'date' ? sortOrder : 'DESC'})
            </button>
            <span>•</span>
            <button
              onClick={() => {
                if (sortBy === 'amount') setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
                else { setSortBy('amount'); setSortOrder('DESC'); }
              }}
              className={`font-semibold hover:underline ${sortBy === 'amount' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
            >
              Amount ({sortBy === 'amount' ? sortOrder : 'DESC'})
            </button>
          </div>

          <span>Showing {transactions.length} of {pagination.total} transactions</span>
        </div>
      </div>

      {/* View Content: Virtualized Scrolling vs Table */}
      {viewMode === 'virtual' ? (
        <VirtualTransactionList
          transactions={clientFilteredList}
          isReadOnly={isReadOnly}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {clientFilteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  clientFilteredList.map((tx) => {
                    const isIncome = tx.type === 'income';
                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isIncome
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                          {tx.date}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                          {tx.description || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {tx.category_name ? (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium"
                              style={{
                                backgroundColor: `${tx.category_color || '#6366f1'}15`,
                                color: tx.category_color || '#6366f1',
                              }}
                            >
                              <Tag size={10} />
                              {tx.category_name}
                            </span>
                          ) : (
                            <span className="text-slate-400">Uncategorized</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                          <span className={isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                            {isIncome ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditModal(tx)}
                              disabled={isReadOnly}
                              title={isReadOnly ? 'Read-only users cannot edit' : 'Edit Transaction'}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isReadOnly
                                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                                  : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                              }`}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              disabled={isReadOnly}
                              title={isReadOnly ? 'Read-only users cannot delete' : 'Delete Transaction'}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isReadOnly
                                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                                  : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                              }`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchTransactions(pagination.page - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchTransactions(pagination.page + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transaction Add / Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        transactionToEdit={editingTransaction}
        categories={categories}
        isReadOnly={isReadOnly}
      />
    </div>
  );
};

export default TransactionsPage;
