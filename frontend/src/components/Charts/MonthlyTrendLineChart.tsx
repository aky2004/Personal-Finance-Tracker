import React, { memo } from 'react';
import {
  LineChart,
  Line,
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

export const MonthlyTrendLineChart: React.FC<Props> = memo(({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-ink-muted dark:text-ink-darkmuted">
        <p className="text-xs">No trend data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-panel-light dark:bg-panel-dark text-ink-light dark:text-ink-dark text-xs rounded-xl p-3 shadow-moneymatter dark:shadow-moneymatter-dark border border-borderline-light dark:border-borderline-dark">
          <p className="font-semibold mb-1 text-ink-muted dark:text-ink-darkmuted">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="flex justify-between gap-4 font-mono font-medium" style={{ color: entry.color }}>
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
        <LineChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
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
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#1b7f4d"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: '#1b7f4d' }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke="#c24129"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: '#c24129' }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="net"
            name="Net Savings"
            stroke="#7355be"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: '#7355be' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

MonthlyTrendLineChart.displayName = 'MonthlyTrendLineChart';
