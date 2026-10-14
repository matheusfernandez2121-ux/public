// Cliente para enviar dados para o webhook (opcional - para testes)
export async function sendExpenseToWebhook(expense: {
  description: string;
  amount: number;
  category: string;
  date: string;
}): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || '/api/expenses';
  const apiKey = process.env.NEXT_PUBLIC_WEBHOOK_API_KEY;
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...expense,
        apiKey,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Expense sent to webhook:', data);
  } catch (error) {
    console.error('Error sending expense to webhook:', error);
    throw error;
  }
}
