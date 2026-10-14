import { createClient } from '@supabase/supabase-js';

// Função para obter o client do Supabase (lazy initialization)
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Função para salvar expense no Supabase
export async function saveExpenseToSupabase(expense: {
  description: string;
  amount: number;
  category: string;
  date: string;
  source?: string;
}) {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    console.warn('Supabase not configured, skipping save');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        source: expense.source || 'webhook',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    throw error;
  }
}
