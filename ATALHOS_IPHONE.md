# Configurar Atalhos do iPhone para envio automático de gastos

Este guia explica como configurar o app Atalhos (Shortcuts) do iPhone para enviar automaticamente informações de gastos do Revolut para o seu site.

## Pré-requisitos

- iPhone com iOS 13 ou superior
- App Atalhos instalado (vem nativo no iOS)
- URL do seu site no Vercel (ex: `https://public-alpha-ashen.vercel.app`)
- API Key configurada (opcional, mas recomendado)

## Passo 1: Obter a URL do Webhook

A URL do webhook será:
```
https://seu-site.vercel.app/api/expenses
```

Substitua `seu-site.vercel.app` pela URL real do seu site no Vercel.

## Passo 2: Configurar API Key (Recomendado)

### No Vercel:
1. Acesse o painel do seu projeto no Vercel
2. Vá em Settings → Environment Variables
3. Adicione uma nova variável:
   - Name: `WEBHOOK_API_KEY`
   - Value: Uma chave segura (ex: `sua-chave-secreta-12345`)
4. Clique em Save e redeploie o projeto

### No arquivo .env.local (para desenvolvimento):
```bash
WEBHOOK_API_KEY=sua-chave-secreta-12345
```

## Passo 3: Criar o Atalho no iPhone

### Opção A: Usar notificações do Revolut

1. **Abra o app Atalhos** no seu iPhone
2. **Crie um novo atalho** (+)
3. **Adicione as seguintes ações:**

#### Ação 1: Extrair dados da notificação
- **Buscar:** "Obter conteúdo da notificação"
- Configure para capturar notificações do Revolut

#### Ação 2: Processar o texto
- **Buscar:** "Texto" → "Separar por texto"
- Separe o texto para extrair valor e estabelecimento

#### Ação 3: Preparar os dados
- **Buscar:** "Dicionário"
- Adicione os seguintes campos:
  - `description`: [Nome do estabelecimento]
  - `amount`: [Valor]
  - `category`: [Categoria - ex: "groceries"]
  - `date`: [Data atual]
  - `apiKey`: [Sua API key]

#### Ação 4: Enviar para o webhook
- **Buscar:** "Obter conteúdo da URL"
- URL: `https://seu-site.vercel.app/api/expenses`
- Método: `POST`
- Cabeçalhos:
  - `Content-Type`: `application/json`
- Corpo da solicitação: [Dicionário criado na Ação 3]

#### Ação 5: Confirmar envio
- **Buscar:** "Mostrar notificação"
- Mensagem: "Gasto enviado com sucesso! ✅"

### Opção B: Input manual (Mais simples)

1. **Abra o app Atalhos** no seu iPhone
2. **Crie um novo atalho** (+)
3. **Adicione as seguintes ações:**

#### Ação 1: Pedir descrição
- **Buscar:** "Pedir input"
- Pergunta: "Qual o estabelecimento?"
- Tipo de input: Texto

#### Ação 2: Pedir valor
- **Buscar:** "Pedir input"
- Pergunta: "Qual o valor?"
- Tipo de input: Número

#### Ação 3: Pedir categoria
- **Buscar:** "Escolher do menu"
- Opções: "Alimentação", "Transporte", "Lazer", "Saúde", "Moradia", "Outros"

#### Ação 4: Preparar os dados
- **Buscar:** "Dicionário"
- Adicione os campos:
  - `description`: [Descrição da Ação 1]
  - `amount`: [Valor da Ação 2]
  - `category`: [Categoria da Ação 3]
  - `date`: [Data atual]
  - `apiKey`: [Sua API key]

#### Ação 5: Enviar para o webhook
- **Buscar:** "Obter conteúdo da URL"
- URL: `https://seu-site.vercel.app/api/expenses`
- Método: `POST`
- Cabeçalhos:
  - `Content-Type`: `application/json`
- Corpo da solicitação: [Dicionário criado na Ação 4]

#### Ação 6: Confirmar envio
- **Buscar:** "Mostrar notificação"
- Mensagem: "Gasto de R$[valor] em [descrição] enviado! ✅"

## Passo 4: Adicionar à Tela de Início

1. No app Atalhos, toque no seu atalho
2. Toque nos três pontos (...) no canto superior direito
3. Selecione "Adicionar à Tela de Início"
4. Escolha um ícone e nome (ex: "💰 Novo Gasto")
5. Adicione à sua tela de início

## Passo 5: Automatizar com Atalhos (Opcional)

Você pode configurar automações:
1. Abra o app Atalhos
2. Vá na aba "Automação"
3. Crie uma nova automação
4. Escolha gatilho:
   - "Quando receber notificação do Revolut"
   - Ou "Horário do dia" (para lembrar de registrar gastos)
5. Adicione o atalho criado acima

## Exemplo de Payload JSON

O atalho deve enviar este formato:

```json
{
  "description": "Uber Viagem",
  "amount": 25.50,
  "category": "transport",
  "date": "2026-10-14",
  "apiKey": "sua-chave-secreta-12345"
}
```

## Categorias Suportadas

O sistema mapeia automaticamente categorias do Revolut:

- `groceries`, `supermarket`, `food`, `restaurant`, `coffee` → **Alimentação**
- `transport`, `uber`, `taxi`, `fuel`, `parking` → **Transporte**
- `entertainment`, `movies`, `games`, `music`, `streaming` → **Lazer**
- `health`, `pharmacy`, `doctor`, `hospital` → **Saúde**
- `housing`, `rent`, `utilities`, `internet` → **Moradia**
- Outros → **Outros**

## Testar o Webhook

Você pode testar se o webhook está funcionando:

```bash
curl -X POST https://seu-site.vercel.app/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Teste de webhook",
    "amount": 10.00,
    "category": "groceries",
    "date": "2026-10-14",
    "apiKey": "sua-chave-secreta-12345"
  }'
```

## Solução de Problemas

### Erro 401 Unauthorized
- Verifique se a API key está correta
- Verifique se a variável de ambiente está configurada no Vercel

### Erro 400 Bad Request
- Verifique se todos os campos obrigatórios estão sendo enviados
- O campo `amount` deve ser um número válido

### Dados não aparecem no site
- Verifique se o Supabase está configurado corretamente
- Se não estiver usando Supabase, os dados são salvos apenas em log (para desenvolvimento)

## Dicas

- Adicione o atalho ao menu de ação rápida (forçar toque no ícone do app)
- Use Siri para executar o atalho: "Ei Siri, registrar gasto"
- Configure para pedir confirmação antes de enviar
- Adicione notificação de sucesso para confirmar o envio
