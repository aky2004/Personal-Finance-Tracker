import React, { memo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CategoryBreakdown } from '../../types';

interface Props {
  data: CategoryBreakdown[];
}

// MoneyMatter signature category palette
const MONEYMATTER_COLORS = [
  '#7355be', // Primary Violet
  '#1b7f4d', // Money Green
  '#c24129', // Expense Terracotta
  '#2563eb', // Checking Blue
  '#f59e0b', // Auto Amber
  '#06b6d4', // Heloc Cyan
  '#8b5cf6', // Student Purple
  '#ec4899', // Medical Pink
  '#ea580c', // Crypto Orange
  '#64748b', // Other Slate
];

export const CategoryPieChart: React.FC<Props> = memo(({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-ink-muted dark:text-ink-darkmuted">
        <p className="text-xs">No expense records found for this period</p>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.category_name,
    value: Number(item.total_amount),
    color: item.color || MONEYMATTER_COLORS[index % MONEYMATTER_COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="bg-panel-light dark:bg-panel-dark text-ink-light dark:text-ink-dark text-xs rounded-xl px-3 py-2 shadow-moneymatter dark:shadow-moneymatter-dark border border-borderline-light dark:border-borderline-dark">
          <p className="font-semibold">{entry.name}</p>
          <p className="text-brand dark:text-brand-dark font-mono font-bold mt-0.5">
            ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

CategoryPieChart.displayName = 'CategoryPieChart';
