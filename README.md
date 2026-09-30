# Controle de Gastos

Sistema de controle de gastos pessoais com dashboard visual, categorização e acompanhamento de orçamento.

## Funcionalidades

- ✅ Registro de gastos com descrição, valor, categoria e data
- ✅ Categorização automática com ícones e cores
- ✅ Gráficos de distribuição por categoria
- ✅ Acompanhamento de orçamento com alertas
- ✅ Histórico completo de transações
- ✅ Interface responsiva e dark mode
- 🔄 Integração com Supabase (opcional)

## Stack Tecnológica

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas
- **Supabase** - Banco de dados e autenticação (opcional)

## Instalação

1. Clone o repositório ou navegue até a pasta do projeto

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional - para integração com Supabase):
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no navegador

## Uso

### Adicionar Gasto
1. Clique no botão "Adicionar Gasto"
2. Preencha a descrição, valor, categoria e data
3. Clique em "Salvar Gasto"

### Definir Orçamento
1. Na seção "Acompanhamento de Orçamento"
2. Digite o limite mensal para cada categoria
3. O sistema mostrará alertas quando você exceder o limite

### Visualizar Gráficos
- O gráfico de pizza mostra a distribuição dos gastos por categoria
- As porcentagens são calculadas automaticamente

### Excluir Gasto
- Clique no ícone de lixeira ao lado de cada gasto para removê-lo

## Configuração do Supabase (Opcional)

Se você quiser persistir os dados na nuvem:

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Crie as tabelas no SQL Editor:

```sql
-- Tabela de gastos
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de orçamentos
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  limit_amount DECIMAL(10,2) NOT NULL,
  month TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Copie a URL e a chave anônima do seu projeto
4. Adicione ao arquivo `.env.local`

## Armazenamento Local

Por padrão, a aplicação usa `localStorage` para armazenar os dados no navegador. Isso permite usar a aplicação imediatamente sem configurar um backend.

## Build para Produção

```bash
npm run build
npm start
```

## Deploy no Vercel

### Opção 1: Deploy via CLI (Recomendado)

1. Instale a CLI do Vercel:
```bash
npm install -g vercel
```

2. Faça login no Vercel:
```bash
vercel login
```

3. Deploy do projeto:
```bash
vercel
```

4. Para deploy em produção:
```bash
vercel --prod
```

### Opção 2: Deploy via GitHub

1. Crie um repositório no GitHub
2. Push do código para o GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/controle-gastos.git
git push -u origin main
```

3. Acesse [vercel.com](https://vercel.com) e importe o repositório
4. O Vercel detectará automaticamente que é um projeto Next.js
5. Configure as variáveis de ambiente no painel do Vercel (se usar Supabase)
6. Clique em "Deploy"

### Variáveis de Ambiente no Vercel

Se você configurou o Supabase, adicione estas variáveis no painel do Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Licença

MIT
