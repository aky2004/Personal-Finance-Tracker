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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#141210] border border-[#24211d] p-7 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#24211d] mb-5">
          <h3 className="font-extrabold text-lg text-white">
            {transactionToEdit ? 'Edit Transaction' : 'Record Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="text-[#8c857b] hover:text-white p-1.5 rounded-xl hover:bg-[#1a1714] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-[#ef6a57]/10 border border-[#ef6a57]/30 text-[#ef6a57] rounded-xl text-xs font-medium text-center">
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-[#0e0c0a] border border-[#24211d] p-1 rounded-xl">
            <button
              type="button"
              disabled={isReadOnly}
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-[#ef6a57] text-white shadow-xs'
                  : 'text-[#8c857b] hover:text-white'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              disabled={isReadOnly}
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-[#4cc38a] text-black font-extrabold shadow-xs'
                  : 'text-[#8c857b] hover:text-white'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#8c857b]">
              Amount ($)
            </label>
            <div className="relative">
              <DollarSign size={15} className="absolute left-3.5 top-3 text-[#8c857b]" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                disabled={isReadOnly}
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#0e0c0a] border border-[#24211d] rounded-xl text-xs font-mono font-bold text-white placeholder-[#524b42] focus:outline-none focus:border-[#7355be] transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#8c857b]">
              Category
            </label>
            <div className="relative">
              <Tag size={15} className="absolute left-3.5 top-3 text-[#8c857b]" />
              <select
                disabled={isReadOnly}
                value={categoryId}
                onChange={handleCategoryChange}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#0e0c0a] border border-[#24211d] rounded-xl text-xs text-white focus:outline-none focus:border-[#7355be] transition-colors"
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
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#8c857b]">
              Date
            </label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3.5 top-3 text-[#8c857b]" />
              <input
                type="date"
                required
                disabled={isReadOnly}
                value={date}
                onChange={handleDateChange}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#0e0c0a] border border-[#24211d] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#7355be] transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#8c857b]">
              Description
            </label>
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-3 text-[#8c857b]" />
              <input
                type="text"
                disabled={isReadOnly}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="e.g. Groceries at Trader Joe's"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#0e0c0a] border border-[#24211d] rounded-xl text-xs text-white placeholder-[#524b42] focus:outline-none focus:border-[#7355be] transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#24211d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8c857b] hover:text-white hover:bg-[#1a1714] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isReadOnly || loading}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl text-white shadow-md shadow-[#7355be]/20 transition-all ${
                isReadOnly
                  ? 'bg-[#1a1714] text-[#8c857b] cursor-not-allowed opacity-50'
                  : 'bg-[#7355be] hover:bg-[#8365ce] active:scale-[0.99]'
              }`}
            >
              {loading ? 'Saving...' : transactionToEdit ? 'Save Changes' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

TransactionModal.displayName = 'TransactionModal';
