# Adalto Arcandes — Site institucional e ranking de lives

Site institucional para o cantor Adalto Arcandes (cover de Raul Seixas e rock 70/80/90), com uma área administrativa para lançar diariamente os pontos de cada presenteador nas lives do TikTok, consulta pública por data e ranking acumulado.

Especificação completa em [`specs/001-site-adalto-tiktok-ranking/`](specs/001-site-adalto-tiktok-ranking/) (spec, plano, modelo de dados, contratos de API).

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Postgres + Auth)
- Hospedagem: [Vercel](https://vercel.com/)

## Como este projeto foi desenvolvido

Este site nasceu de um pedido em uma única mensagem — um site institucional para o Adalto com uma ferramenta de ranking das lives — e foi construído inteiramente com um agente de IA (Claude Code), do zero ao deploy, sem escrever nenhuma linha de código manualmente. O processo ficou registrado em três fases:

**1. Especificação antes do código.** Em vez de ir direto para a implementação, o pedido foi formalizado com os comandos do [GitHub Spec Kit](https://github.com/github/spec-kit) (`/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`): primeiro uma especificação funcional completa, com user stories priorizadas, requisitos testáveis e critérios de sucesso (sem mencionar tecnologia); depois uma rodada de esclarecimento sobre pontos ambíguos (ex.: o admin precisa poder editar/excluir um lançamento errado?); em seguida um plano técnico (stack, modelo de dados, contratos de API) e, por fim, uma lista de 34 tarefas rastreáveis. Tudo isso está preservado em [`specs/001-site-adalto-tiktok-ranking/`](specs/001-site-adalto-tiktok-ranking/) — é possível ler a evolução completa do pedido original até a especificação final.

**2. Direção visual com critério, não com "gosto".** A interface não foi desenhada livremente: a skill [Impeccable](https://impeccable.style/) conduziu uma entrevista de produto (`PRODUCT.md`) e depois um "sorteio dirigido" entre sete sistemas visuais concretos derivados do próprio universo do artista (pôster de show de rock, painel de VU-meter, placar de TV, fita cassete, capa de vinil, laminado de backstage, colagem psicodélica do Raul Seixas) — evitando o "visual genérico de IA" ao forçar a escolha a vir de referências reais daquele mundo, não de um gosto médio. O sistema escolhido foi **capa de disco de vinil / encarte**, com elementos emprestados de outras propostas descartadas (disco girando, barras de magnitude nas linhas, feedback instantâneo nos botões do admin, números contando ao carregar o ranking). A decisão e o sistema de design resultante estão documentados em [`DESIGN.md`](DESIGN.md).

**3. Infraestrutura real, não só código local.** O projeto Supabase foi criado pelo usuário e, a partir daí, vinculado e migrado via Supabase CLI (schema, políticas de RLS, views de agregação) direto do terminal; o deploy na Vercel também foi feito via CLI (link do projeto, variáveis de ambiente de produção, deploy). Como o ambiente de desenvolvimento não tinha um navegador conectado, a validação de ponta a ponta foi feita por API contra o banco de dados real: login no Supabase Auth, inserção de um lançamento de teste, leitura pelas rotas públicas (`/api/public/entries`, `/api/public/ranking`), confirmação de que o RLS bloqueia escrita sem autenticação — e remoção dos dados de teste ao final. Uma verificação visual num navegador real (desktop e mobile) ainda é recomendada antes de divulgar o site amplamente.

## Setup local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um projeto no [Supabase](https://supabase.com/dashboard) e aplique as migrações em `supabase/migrations/` (na ordem: `0001_init.sql`, `0002_rls.sql`, `0003_views.sql`) — pelo SQL editor do painel ou via Supabase CLI:

   ```bash
   supabase db push
   ```

3. Crie um usuário administrador no Supabase Auth (Authentication → Users → Add user), com e-mail e senha — essa é a conta usada para acessar `/admin`.

4. Copie `.env.local.example` para `.env.local` e preencha com os valores do seu projeto (Project Settings → API no painel do Supabase):

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

5. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Acesse `http://localhost:3000`.

## Rotas

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | Página institucional |
| `/consulta` | Público | Pontos de uma data específica |
| `/ranking` | Público | Ranking acumulado de todos os presenteadores |
| `/admin/login` | Público | Login do admin |
| `/admin/lancamentos` | Autenticado | Cadastro, edição e exclusão de lançamentos diários |

## Deploy na Vercel

1. Importe o repositório no [Vercel](https://vercel.com/new).
2. Configure as mesmas três variáveis de ambiente do `.env.local` em Project Settings → Environment Variables.
3. Deploy. O build de produção roda `next build` (já validado localmente).

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — serve o build de produção
- `npm run lint` — ESLint

## Design

A direção visual ("capa de disco de vinil / encarte") está documentada em [`DESIGN.md`](DESIGN.md), estabelecida com a skill [Impeccable](https://impeccable.style/).
