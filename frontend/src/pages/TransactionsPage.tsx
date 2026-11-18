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

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const [viewMode, setViewMode] = useState<'table' | 'virtual'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

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

  const clientFilteredList = useMemo(() => {
    return transactions;
  }, [transactions]);

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
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-ink-light dark:text-ink-dark tracking-tight">
            Transactions
          </h1>
          <p className="text-xs text-ink-muted dark:text-ink-darkmuted mt-0.5">
            Full ledger view with search, categorization, and windowed scrolling
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="bg-soft-light dark:bg-soft-dark p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => { setViewMode('table'); fetchTransactions(1, 10); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-panel-light dark:bg-panel-dark text-brand dark:text-brand-dark shadow-xs font-bold'
                  : 'text-ink-muted'
              }`}
            >
              <List size={13} /> Table
            </button>
            <button
              onClick={() => { setViewMode('virtual'); fetchTransactions(1, 100); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'virtual'
                  ? 'bg-panel-light dark:bg-panel-dark text-brand dark:text-brand-dark shadow-xs font-bold'
                  : 'text-ink-muted'
              }`}
            >
              <Sparkles size={13} /> Virtual Feed
            </button>
          </div>

          {/* Add Transaction Button */}
          <button
            onClick={handleOpenAddModal}
            disabled={isReadOnly}
            title={isReadOnly ? 'Read-only users cannot add transactions' : 'New Transaction'}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all ${
              isReadOnly
                ? 'bg-slate-300 dark:bg-slate-850 text-slate-400 cursor-not-allowed opacity-60'
                : 'bg-brand hover:bg-brand-hover text-white'
            }`}
          >
            <Plus size={15} />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Read-only Alert Bar */}
      {isReadOnly && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <ShieldAlert size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Read-Only Mode:</strong> Mutation privileges are locked. Creating, modifying, and deleting transactions are disabled.
          </span>
        </div>
      )}

      {/* Page Flow Summary Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-ink-muted dark:text-ink-darkmuted block">Inflow</span>
          <span className="text-sm sm:text-base font-extrabold font-mono text-money-green dark:text-money-greendark">
            +${listStats.income.toFixed(2)}
          </span>
        </div>
        <div className="p-3 bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-ink-muted dark:text-ink-darkmuted block">Outflow</span>
          <span className="text-sm sm:text-base font-extrabold font-mono text-money-red dark:text-money-reddark">
            -${listStats.expense.toFixed(2)}
          </span>
        </div>
        <div className="p-3 bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-ink-muted dark:text-ink-darkmuted block">Net</span>
          <span className={`text-sm sm:text-base font-extrabold font-mono ${
            listStats.balance >= 0 ? 'text-money-green dark:text-money-greendark' : 'text-money-red dark:text-money-reddark'
          }`}>
            ${listStats.balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-2xl shadow-moneymatter dark:shadow-moneymatter-dark space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-ink-muted" />
            <input
              type="text"
              placeholder="Search description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark rounded-xl text-xs focus:ring-1 focus:ring-brand focus:outline-none"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-2.5 text-ink-muted" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full pl-8 pr-3 py-1.5 bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark rounded-xl text-xs focus:ring-1 focus:ring-brand focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Tag size={14} className="absolute left-3 top-2.5 text-ink-muted" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark rounded-xl text-xs focus:ring-1 focus:ring-brand focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-2.5 text-ink-muted" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark rounded-xl text-xs font-mono focus:ring-1 focus:ring-brand focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-2.5 text-ink-muted" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-soft-light dark:bg-soft-dark border border-borderline-light dark:border-borderline-dark rounded-xl text-xs font-mono focus:ring-1 focus:ring-brand focus:outline-none"
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between text-[11px] text-ink-muted dark:text-ink-darkmuted pt-2 border-t border-borderline-light/60 dark:border-borderline-dark/60">
          <div className="flex items-center gap-2">
            <ArrowUpDown size={13} />
            <span>Sort:</span>
            <button
              onClick={() => {
                if (sortBy === 'date') setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
                else { setSortBy('date'); setSortOrder('DESC'); }
              }}
              className={`font-semibold hover:underline ${sortBy === 'date' ? 'text-brand dark:text-brand-dark' : ''}`}
            >
              Date ({sortBy === 'date' ? sortOrder : 'DESC'})
            </button>
            <span>•</span>
            <button
              onClick={() => {
                if (sortBy === 'amount') setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
                else { setSortBy('amount'); setSortOrder('DESC'); }
              }}
              className={`font-semibold hover:underline ${sortBy === 'amount' ? 'text-brand dark:text-brand-dark' : ''}`}
            >
              Amount ({sortBy === 'amount' ? sortOrder : 'DESC'})
            </button>
          </div>

          <span>{transactions.length} displayed • {pagination.total} total</span>
        </div>
      </div>

      {/* Main Content: Virtual Feed vs Table */}
      {viewMode === 'virtual' ? (
        <VirtualTransactionList
          transactions={clientFilteredList}
          isReadOnly={isReadOnly}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      ) : (
        <div className="bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-2xl overflow-hidden shadow-moneymatter dark:shadow-moneymatter-dark">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-soft-light dark:bg-soft-dark text-ink-muted dark:text-ink-darkmuted uppercase tracking-wider font-bold border-b border-borderline-light dark:border-borderline-dark">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderline-light/60 dark:divide-borderline-dark/60">
                {clientFilteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-ink-muted">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  clientFilteredList.map((tx) => {
                    const isIncome = tx.type === 'income';
                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-soft-light/60 dark:hover:bg-soft-dark/40 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isIncome
                                ? 'bg-emerald-50 text-money-green dark:bg-emerald-950/40 dark:text-money-greendark'
                                : 'bg-rose-50 text-money-red dark:bg-rose-950/40 dark:text-money-reddark'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-ink-muted dark:text-ink-darkmuted">
                          {tx.date}
                        </td>
                        <td className="py-3 px-4 font-semibold text-ink-light dark:text-ink-dark">
                          {tx.description || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {tx.category_name ? (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
                              style={{
                                backgroundColor: `${tx.category_color || '#7355be'}15`,
                                color: tx.category_color || '#7355be',
                              }}
                            >
                              <Tag size={10} />
                              {tx.category_name}
                            </span>
                          ) : (
                            <span className="text-ink-muted opacity-60">Uncategorized</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                          <span className={isIncome ? 'text-money-green dark:text-money-greendark' : 'text-money-red dark:text-money-reddark'}>
                            {isIncome ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditModal(tx)}
                              disabled={isReadOnly}
                              title={isReadOnly ? 'Read-only users cannot edit' : 'Edit'}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isReadOnly
                                  ? 'opacity-25 cursor-not-allowed text-ink-muted'
                                  : 'text-ink-muted hover:text-brand hover:bg-soft-light dark:hover:bg-soft-dark'
                              }`}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              disabled={isReadOnly}
                              title={isReadOnly ? 'Read-only users cannot delete' : 'Delete'}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isReadOnly
                                  ? 'opacity-25 cursor-not-allowed text-ink-muted'
                                  : 'text-ink-muted hover:text-money-red hover:bg-soft-light dark:hover:bg-soft-dark'
                              }`}
                            >
                              <Trash2 size={14} />
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

          {pagination.totalPages > 1 && (
            <div className="p-3.5 border-t border-borderline-light dark:border-borderline-dark flex items-center justify-between text-xs text-ink-muted">
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchTransactions(pagination.page - 1)}
                  className="p-1.5 rounded-lg border border-borderline-light dark:border-borderline-dark disabled:opacity-30 hover:bg-soft-light dark:hover:bg-soft-dark transition-colors"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchTransactions(pagination.page + 1)}
                  className="p-1.5 rounded-lg border border-borderline-light dark:border-borderline-dark disabled:opacity-30 hover:bg-soft-light dark:hover:bg-soft-dark transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
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
