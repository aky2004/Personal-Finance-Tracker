import React, { useState, useEffect, useCallback, memo } from 'react';
import { Transaction, Category } from '../types';
import { X, DollarSign, Calendar, Tag, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Transaction>) => Promise<void>;
  transactionToEdit: Transaction | null;
  categories: Category[];
  isReadOnly: boolean;
}

export const TransactionModal: React.FC<Props> = memo(({
  isOpen,
  onClose,
  onSubmit,
  transactionToEdit,
  categories,
  isReadOnly,
}) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAmount(String(transactionToEdit.amount));
      setCategoryId(transactionToEdit.category_id ? String(transactionToEdit.category_id) : '');
      setDate(transactionToEdit.date);
      setDescription(transactionToEdit.description || '');
    } else {
      setType('expense');
      setAmount('');
      setCategoryId('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
    setError(null);
  }, [transactionToEdit, isOpen]);

  // Assignment requirement: useCallback for form event handlers to prevent child re-renders
  const handleTypeChange = useCallback((newType: 'income' | 'expense') => {
    setType(newType);
    setCategoryId('');
  }, []);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
  }, []);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (!date) {
      setError('Please select a valid date');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        type,
        amount: parsedAmount,
        date,
        category_id: categoryId ? parseInt(categoryId, 10) : null,
        description: description.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  }, [isReadOnly, amount, date, onSubmit, type, categoryId, description, onClose]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
            {transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              disabled={isReadOnly}
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              disabled={isReadOnly}
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount ($)
            </label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                disabled={isReadOnly}
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <div className="relative">
              <Tag size={16} className="absolute left-3 top-3 text-slate-400" />
              <select
                disabled={isReadOnly}
                value={categoryId}
                onChange={handleCategoryChange}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select Category (Optional)</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="date"
                required
                disabled={isReadOnly}
                value={date}
                onChange={handleDateChange}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                disabled={isReadOnly}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="e.g. Grocery shopping at Trader Joe's"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isReadOnly || loading}
              className={`px-5 py-2 text-sm font-semibold rounded-xl text-white shadow-md transition-all ${
                isReadOnly
                  ? 'bg-slate-400 cursor-not-allowed opacity-50'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Saving...' : transactionToEdit ? 'Save Changes' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

TransactionModal.displayName = 'TransactionModal';
