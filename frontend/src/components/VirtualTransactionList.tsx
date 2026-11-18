import React, { useRef, useState, useMemo, memo } from 'react';
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
  itemHeight = 68,
  height = 520,
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
      <div className="h-64 flex flex-col items-center justify-center text-ink-muted dark:text-ink-darkmuted">
        <p className="text-xs">No transactions match your current filters</p>
      </div>
    );
  }

  return (
    <div className="border border-borderline-light dark:border-borderline-dark rounded-2xl overflow-hidden bg-panel-light dark:bg-panel-dark shadow-moneymatter dark:shadow-moneymatter-dark">
      <div className="px-5 py-3 bg-soft-light dark:bg-soft-dark border-b border-borderline-light dark:border-borderline-dark flex justify-between items-center text-xs font-bold text-ink-muted dark:text-ink-darkmuted uppercase tracking-wider">
        <span>Virtualized Stream ({totalCount.toLocaleString()} total • {visibleTransactions.length} in DOM)</span>
        {isReadOnly && (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium normal-case">
            <ShieldAlert size={14} /> Read-Only Mode
          </span>
        )}
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height, overflowY: 'auto', position: 'relative' }}
        className="divide-y divide-borderline-light/60 dark:divide-borderline-dark/60"
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
                  className="px-5 flex items-center justify-between hover:bg-soft-light/60 dark:hover:bg-soft-dark/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-emerald-50 text-money-green dark:bg-emerald-950/40 dark:text-money-greendark'
                          : 'bg-rose-50 text-money-red dark:bg-rose-950/40 dark:text-money-reddark'
                      }`}
                    >
                      {isIncome ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-ink-light dark:text-ink-dark truncate">
                        {tx.description || (isIncome ? 'Income' : 'Expense')}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-ink-muted dark:text-ink-darkmuted mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar size={11} />
                          {tx.date}
                        </span>
                        {tx.category_name && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold"
                            style={{
                              backgroundColor: `${tx.category_color || '#7355be'}15`,
                              color: tx.category_color || '#7355be',
                            }}
                          >
                            <Tag size={9} />
                            {tx.category_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`font-mono font-bold text-xs sm:text-sm ${
                        isIncome
                          ? 'text-money-green dark:text-money-greendark'
                          : 'text-money-red dark:text-money-reddark'
                      }`}
                    >
                      {isIncome ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(tx)}
                        disabled={isReadOnly}
                        title={isReadOnly ? 'Read-only users cannot edit' : 'Edit Transaction'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isReadOnly
                            ? 'opacity-25 cursor-not-allowed text-ink-muted'
                            : 'text-ink-muted hover:text-brand hover:bg-soft-light dark:hover:bg-soft-dark'
                        }`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(tx.id)}
                        disabled={isReadOnly}
                        title={isReadOnly ? 'Read-only users cannot delete' : 'Delete Transaction'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isReadOnly
                            ? 'opacity-25 cursor-not-allowed text-ink-muted'
                            : 'text-ink-muted hover:text-money-red hover:bg-soft-light dark:hover:bg-soft-dark'
                        }`}
                      >
                        <Trash2 size={14} />
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
