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
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
        <p className="text-sm">No trend data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-lg border border-slate-700">
          <p className="font-semibold mb-1 text-slate-300">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="flex justify-between gap-4 font-mono" style={{ color: entry.color }}>
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
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            dataKey="display_name"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#475569' }}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#475569' }}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{value}</span>}
          />
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#10b981' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#ef4444' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="net"
            name="Net Savings"
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: '#6366f1' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

MonthlyTrendLineChart.displayName = 'MonthlyTrendLineChart';
