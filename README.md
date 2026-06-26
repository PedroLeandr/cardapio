# Cardápios Digitais

Plataforma SaaS para restaurantes criarem e partilharem o seu cardápio digital via QR code ou link. Desenvolvido em Portugal.

## O que faz

- Restaurante cria conta, configura o cardápio (categorias + pratos) e gera um QR code
- Clientes acedem ao cardápio pelo telemóvel, sem instalar nada
- O cardápio público só fica online após subscrição do Plano Pro (€30/mês via Stripe)
- Múltiplos temas visuais disponíveis (Modern, Classic, Brasserie, Noite, Vibrante)

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Base de dados | Supabase (PostgreSQL + Auth + Storage) |
| Pagamentos | Stripe (subscriptions) |
| Styling | Tailwind CSS + shadcn/ui |
| Forms | React Hook Form + Zod |
| Drag & Drop | dnd-kit |
| Deploy | Vercel |

## Estrutura

```
app/
├── (auth)/          # Login, Registo, Confirmação de email
├── (public)/        # Cardápio público: /[slug] e /[slug]/[item]
├── dashboard/       # Dashboard do restaurante (categorias, itens, definições, design)
├── api/
│   ├── stripe/      # checkout, portal, webhook
│   ├── create-restaurant/
│   ├── send-confirmation/
│   └── verify-confirmation/
lib/
├── supabase/        # Clients (server, client, admin)
├── stripe.ts
└── utils.ts
components/
├── dashboard/       # Componentes do dashboard
└── menu/            # Temas do cardápio público
```

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=
EMAIL_FROM=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
```

## Correr localmente

```bash
npm install
npm run dev
# http://localhost:3333
```

## Base de dados

O schema SQL está em `supabase/schema.sql`. Correr no Supabase SQL Editor antes de usar a aplicação.

## Fluxo de pagamento

1. Utilizador cria conta e restaurante (grátis)
2. Cardápio público mostra "não disponível" enquanto não houver subscrição ativa
3. Utilizador subscreve Pro via Stripe Checkout
4. Webhook do Stripe atualiza `restaurants.plan = "pro"`
5. Cardápio fica público automaticamente

Se a subscrição for cancelada, `plan` volta a `"free"` e o cardápio fica offline.
