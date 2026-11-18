import React, { useRef, useState, useEffect, useMemo, memo } from 'react';
import { Transaction } from '../types';
import { ArrowDownLeft, ArrowUpRight, Calendar, Tag, Trash2, Edit2, ShieldAlert } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  itemHeight?: number;
  height?: number;
  isReadOnly: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
}

export const VirtualTransactionList: React.FC<Props> = memo(({
  transactions,
  itemHeight = 72,
  height = 500,
  isReadOnly,
  onEdit,
  onDelete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalCount = transactions.length;
  const totalHeight = totalCount * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Calculate visible range with overscan
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const overscan = 5;
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(height / itemHeight) + 2 * overscan;
    const end = Math.min(totalCount, start + visibleCount);
    const offset = start * itemHeight;

    return { startIndex: start, endIndex: end, offsetY: offset };
  }, [scrollTop, itemHeight, height, totalCount]);

  const visibleTransactions = useMemo(() => {
    return transactions.slice(startIndex, endIndex);
  }, [transactions, startIndex, endIndex]);

  if (totalCount === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400">
        <p className="text-sm">No transactions match your current filters</p>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
        <span>Virtualized Feed ({totalCount.toLocaleString()} items total, rendering {visibleTransactions.length} in DOM)</span>
        {isReadOnly && (
          <span className="flex items-center gap-1 text-amber-500 font-medium normal-case">
            <ShieldAlert size={14} /> Read-Only Mode
          </span>
        )}
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height, overflowY: 'auto', position: 'relative' }}
        className="divide-y divide-slate-100 dark:divide-slate-800/80"
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
            }}
          >
            {visibleTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  style={{ height: itemHeight }}
                  className="px-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {tx.description || (isIncome ? 'Income' : 'Expense')}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {tx.date}
                        </span>
                        {tx.category_name && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            style={{
                              backgroundColor: `${tx.category_color || '#6366f1'}20`,
                              color: tx.category_color || '#6366f1',
                            }}
                          >
                            <Tag size={10} />
                            {tx.category_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`font-mono font-semibold text-sm ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                    </span>

                    {/* RBAC: Edit/Delete buttons disabled/styled for read-only users */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(tx)}
                        disabled={isReadOnly}
                        title={isReadOnly ? 'Read-only users cannot edit' : 'Edit Transaction'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isReadOnly
                            ? 'opacity-30 cursor-not-allowed text-slate-400'
                            : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                        }`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(tx.id)}
                        disabled={isReadOnly}
                        title={isReadOnly ? 'Read-only users cannot delete' : 'Delete Transaction'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isReadOnly
                            ? 'opacity-30 cursor-not-allowed text-slate-400'
                            : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                        }`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualTransactionList.displayName = 'VirtualTransactionList';
