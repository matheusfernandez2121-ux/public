'use client';

import { Expense, Category } from '@/types';
import { Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, categories, onDelete }: ExpenseListProps) {
  const getCategory = (categoryName: string) => {
    return categories.find(cat => cat.name === categoryName) || categories[categories.length - 1];
  };

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Histórico de Gastos
      </h2>
      
      {sortedExpenses.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">Nenhum gasto registrado</p>
          <p className="text-sm mt-2">Adicione seu primeiro gasto para começar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedExpenses.map((expense) => {
            const category = getCategory(expense.category);
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {expense.description}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(expense.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                    <span
                      className="inline-block mt-1 text-xs px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {expense.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-gray-800 dark:text-white">
                    R$ {expense.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
