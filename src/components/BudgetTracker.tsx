'use client';

import { useState, useEffect } from 'react';
import { ExpenseSummary, Category } from '@/types';
import { Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetTrackerProps {
  summary: ExpenseSummary[];
  categories: Category[];
}

export default function BudgetTracker({ summary, categories }: BudgetTrackerProps) {
  const [budgets, setBudgets] = useState<Record<string, number>>({});

  useEffect(() => {
    // Carregar orçamentos do localStorage
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  const getCategory = (categoryName: string) => {
    return categories.find(cat => cat.name === categoryName) || categories[categories.length - 1];
  };

  const getCategorySpent = (categoryName: string) => {
    const categorySummary = summary.find(s => s.category === categoryName);
    return categorySummary ? categorySummary.total : 0;
  };

  const handleBudgetChange = (categoryName: string, value: string) => {
    const newBudgets = { ...budgets };
    newBudgets[categoryName] = parseFloat(value) || 0;
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    if (budget === 0) return 'none';
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'ok';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <Target className="w-6 h-6" />
        Acompanhamento de Orçamento
      </h2>
      
      <div className="space-y-4">
        {categories.map((category) => {
          const spent = getCategorySpent(category.name);
          const budget = budgets[category.name] || 0;
          const status = getBudgetStatus(spent, budget);
          const percentage = budget > 0 ? (spent / budget) * 100 : 0;

          return (
            <div key={category.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Gasto: R$ {spent.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status === 'exceeded' && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  {status === 'warning' && (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  {status === 'ok' && budget > 0 && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Limite mensal (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={budget || ''}
                  onChange={(e) => handleBudgetChange(category.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="Definir limite"
                />
              </div>

              {budget > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {percentage.toFixed(0)}% utilizado
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      R$ {budget.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        status === 'exceeded'
                          ? 'bg-red-500'
                          : status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  {status === 'exceeded' && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ Você excedeu o orçamento em R$ {(spent - budget).toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
