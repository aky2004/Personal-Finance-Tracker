import React, { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyTrend } from '../../types';

interface Props {
  data: MonthlyTrend[];
}

export const IncomeExpenseBarChart: React.FC<Props> = memo(({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-ink-muted dark:text-ink-darkmuted">
        <p className="text-xs">No comparison data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-panel-light dark:bg-panel-dark text-ink-light dark:text-ink-dark text-xs rounded-xl p-3 shadow-moneymatter dark:shadow-moneymatter-dark border border-borderline-light dark:border-borderline-dark">
          <p className="font-semibold mb-1 text-ink-muted dark:text-ink-darkmuted">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`bar-${index}`} className="flex justify-between gap-4 font-mono font-medium" style={{ color: entry.fill }}>
              <span>{entry.name}:</span>
              <span>${Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6e5ee" className="dark:stroke-borderline-dark/60" opacity={0.6} />
          <XAxis
            dataKey="display_name"
            tick={{ fill: '#66637a', fontSize: 10, fontFamily: 'Manrope' }}
            axisLine={{ stroke: '#e6e5ee' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#66637a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#e6e5ee' }}
            tickLine={false}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-[11px] text-ink-muted dark:text-ink-darkmuted font-medium">
                {value}
              </span>
            )}
          />
          <Bar dataKey="income" name="Income" fill="#1b7f4d" radius={[5, 5, 0, 0]} />
          <Bar dataKey="expense" name="Expense" fill="#c24129" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

IncomeExpenseBarChart.displayName = 'IncomeExpenseBarChart';
