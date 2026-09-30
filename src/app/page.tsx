'use client';

import { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseChart from '@/components/ExpenseChart';
import BudgetTracker from '@/components/BudgetTracker';
import { Expense, ExpenseSummary } from '@/types';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [summary, setSummary] = useState<ExpenseSummary[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Dados de exemplo (serão substituídos pelo Supabase)
  const categories = [
    { id: '1', name: 'Alimentação', color: '#ef4444', icon: '🍔' },
    { id: '2', name: 'Transporte', color: '#3b82f6', icon: '🚗' },
    { id: '3', name: 'Lazer', color: '#10b981', icon: '🎮' },
    { id: '4', name: 'Saúde', color: '#f59e0b', icon: '💊' },
    { id: '5', name: 'Moradia', color: '#8b5cf6', icon: '🏠' },
    { id: '6', name: 'Outros', color: '#6b7280', icon: '📦' },
  ];

  useEffect(() => {
    // Carregar dados do localStorage enquanto Supabase não está configurado
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      const parsed = JSON.parse(savedExpenses);
      setExpenses(parsed);
      calculateSummary(parsed);
    }
  }, []);

  const calculateSummary = (expensesData: Expense[]) => {
    const summaryMap = new Map<string, { total: number; count: number }>();
    
    expensesData.forEach(expense => {
      const current = summaryMap.get(expense.category) || { total: 0, count: 0 };
      summaryMap.set(expense.category, {
        total: current.total + expense.amount,
        count: current.count + 1
      });
    });

    const summaryArray = Array.from(summaryMap.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count
    }));

    setSummary(summaryArray);
    setTotalExpenses(expensesData.reduce((sum, exp) => sum + exp.amount, 0));
  };

  const handleAddExpense = (expense: Omit<Expense, 'id' | 'created_at'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    calculateSummary(updatedExpenses);
    setShowForm(false);
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    calculateSummary(updatedExpenses);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Controle de Gastos
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie suas finanças de forma simples e eficiente
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total de Gastos</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  R$ {totalExpenses.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Transações</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {expenses.length}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Categorias</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {categories.length}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <PieChart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Botão Adicionar */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'Cancelar' : 'Adicionar Gasto'}
        </button>

        {/* Formulário */}
        {showForm && (
          <div className="mb-8">
            <ExpenseForm
              categories={categories}
              onSubmit={handleAddExpense}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Grid de Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Gastos */}
          <div>
            <ExpenseList
              expenses={expenses}
              categories={categories}
              onDelete={handleDeleteExpense}
            />
          </div>

          {/* Gráficos e Orçamento */}
          <div className="space-y-8">
            <ExpenseChart summary={summary} categories={categories} />
            <BudgetTracker summary={summary} categories={categories} />
          </div>
        </div>
      </div>
    </main>
  );
}
