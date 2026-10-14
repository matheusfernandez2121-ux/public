import { NextRequest, NextResponse } from 'next/server';
import { saveExpenseToSupabase } from '@/lib/supabase';

// Interface para o payload do webhook
interface ExpensePayload {
  description?: string;
  amount?: number;
  category?: string;
  date?: string;
  merchant?: string;
  apiKey?: string;
}

// Interface para expense
interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
  source: 'manual' | 'webhook';
}

// Mapeamento de categorias comuns do Revolut para nossas categorias
const CATEGORY_MAPPING: Record<string, string> = {
  'groceries': 'Alimentação',
  'supermarket': 'Alimentação',
  'food': 'Alimentação',
  'restaurant': 'Alimentação',
  'coffee': 'Alimentação',
  'transport': 'Transporte',
  'uber': 'Transporte',
  'taxi': 'Transporte',
  'fuel': 'Transporte',
  'parking': 'Transporte',
  'entertainment': 'Lazer',
  'movies': 'Lazer',
  'games': 'Lazer',
  'music': 'Lazer',
  'streaming': 'Lazer',
  'health': 'Saúde',
  'pharmacy': 'Saúde',
  'doctor': 'Saúde',
  'hospital': 'Saúde',
  'housing': 'Moradia',
  'rent': 'Moradia',
  'utilities': 'Moradia',
  'internet': 'Moradia',
  'shopping': 'Outros',
  'retail': 'Outros',
  'other': 'Outros',
};

// Categorias padrão do sistema
const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Lazer',
  'Saúde',
  'Moradia',
  'Outros',
];

// Função para mapear categoria
function mapCategory(category: string): string {
  const normalized = category.toLowerCase();
  
  // Procura mapeamento exato
  if (CATEGORY_MAPPING[normalized]) {
    return CATEGORY_MAPPING[normalized];
  }
  
  // Procura mapeamento parcial
  for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  
  // Se não encontrar, usa 'Outros'
  return 'Outros';
}

// Função para validar API key
function validateApiKey(apiKey: string | undefined): boolean {
  const validApiKey = process.env.WEBHOOK_API_KEY;
  if (!validApiKey) {
    // Se não configurada, aceita qualquer chave (modo desenvolvimento)
    return true;
  }
  return apiKey === validApiKey;
}

// Função para salvar expense (localStorage simulado - em produção usar Supabase)
async function saveExpense(expense: Expense): Promise<void> {
  try {
    // Tenta salvar no Supabase se configurado
    const saved = await saveExpenseToSupabase({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      source: expense.source,
    });
    
    if (saved) {
      console.log('Expense saved to Supabase:', saved);
    } else {
      console.log('Supabase not configured, expense would be saved locally');
    }
  } catch (error) {
    console.error('Error saving expense:', error);
    // Não falha o endpoint se Supabase não estiver configurado
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse do corpo da requisição
    const body: ExpensePayload = await request.json();
    
    // Validar API key se configurada
    if (!validateApiKey(body.apiKey)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    // Extrair e validar dados
    const description = body.description || body.merchant || 'Gasto não identificado';
    const amount = body.amount;
    const category = body.category ? mapCategory(body.category) : 'Outros';
    const date = body.date || new Date().toISOString().split('T')[0];
    
    // Validações
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid amount' },
        { status: 400 }
      );
    }
    
    if (!description) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Description is required' },
        { status: 400 }
      );
    }
    
    // Criar expense
    const expense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      category,
      date,
      created_at: new Date().toISOString(),
      source: 'webhook',
    };
    
    // Salvar expense
    await saveExpense(expense);
    
    // Retornar sucesso
    return NextResponse.json(
      {
        success: true,
        message: 'Expense created successfully',
        expense,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to process expense' },
      { status: 500 }
    );
  }
}

// Endpoint GET para testar se a API está funcionando
export async function GET() {
  return NextResponse.json({
    message: 'Webhook endpoint is active',
    version: '1.0',
    supportedCategories: DEFAULT_CATEGORIES,
  });
}
