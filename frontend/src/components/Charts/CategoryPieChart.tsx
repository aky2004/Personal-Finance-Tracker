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

const DEFAULT_COLORS = [
  '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899',
  '#10b981', '#ef4444', '#06b6d4', '#f97316',
  '#6366f1', '#84cc16',
];

export const CategoryPieChart: React.FC<Props> = memo(({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
        <p className="text-sm">No expense records found for this period</p>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.category_name,
    value: Number(item.total_amount),
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-slate-700">
          <p className="font-semibold">{entry.name}</p>
          <p className="text-amber-400 font-mono">${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#1e293b" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

CategoryPieChart.displayName = 'CategoryPieChart';
