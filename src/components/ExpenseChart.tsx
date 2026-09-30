'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExpenseSummary, Category } from '@/types';

interface ExpenseChartProps {
  summary: ExpenseSummary[];
  categories: Category[];
}

export default function ExpenseChart({ summary, categories }: ExpenseChartProps) {
  const getCategory = (categoryName: string) => {
    return categories.find(cat => cat.name === categoryName) || categories[categories.length - 1];
  };

  const chartData = summary.map(item => {
    const category = getCategory(item.category);
    return {
      name: item.category,
      value: item.total,
      color: category.color,
      icon: category.icon
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-white">
            {data.icon} {data.name}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            R$ {data.value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Distribuição por Categoria
        </h2>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">Sem dados para exibir</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Distribuição por Categoria
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.icon} ${((entry.value / chartData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
