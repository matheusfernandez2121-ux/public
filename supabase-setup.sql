-- Script SQL para configurar as tabelas no Supabase
-- Execute este script no SQL Editor do seu projeto Supabase

-- Habilitar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de gastos
CREATE TABLE expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de orçamentos
CREATE TABLE budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL,
  limit_amount DECIMAL(10,2) NOT NULL,
  month TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_budgets_category ON budgets(category);
CREATE INDEX idx_budgets_month ON budgets(month);

-- Habilitar Row Level Security (RLS)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (ajuste conforme necessário)
-- Por enquanto, permitimos acesso público para facilitar o desenvolvimento
-- Em produção, você deve implementar autenticação

CREATE POLICY "Public read access for expenses" ON expenses
  FOR SELECT USING (true);

CREATE POLICY "Public insert access for expenses" ON expenses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access for expenses" ON expenses
  FOR UPDATE USING (true);

CREATE POLICY "Public delete access for expenses" ON expenses
  FOR DELETE USING (true);

CREATE POLICY "Public read access for budgets" ON budgets
  FOR SELECT USING (true);

CREATE POLICY "Public insert access for budgets" ON budgets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access for budgets" ON budgets
  FOR UPDATE USING (true);

CREATE POLICY "Public delete access for budgets" ON budgets
  FOR DELETE USING (true);
