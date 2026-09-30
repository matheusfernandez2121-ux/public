export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string;
}

export interface ExpenseSummary {
  category: string;
  total: number;
  count: number;
}
