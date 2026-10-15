# Destinos Polares

Site em português de expedições à Antártica, Geórgia do Sul e Ilhas
Malvinas. O conteúdo (destinos, expedições, embarcações e perguntas
frequentes) é dinâmico, vindo de um banco de dados via Prisma — não é
uma landing page estática. Não há venda ou reserva online: o formulário
de contato encaminha a solicitação por email para a equipe de atendimento.

Stack: Next.js (App Router) + TypeScript + Tailwind CSS + Prisma (SQLite
em desenvolvimento) + Nodemailer.

## Conteúdo de exemplo

Os textos de destinos, expedições e embarcações no seed (`prisma/seed.ts`)
são conteúdo de exemplo, escrito para ilustrar a estrutura do site.
Substitua pelas informações reais da operação antes de publicar em
produção — diretamente no banco, por um script próprio, ou editando o
seed e rodando `npm run seed` novamente.

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha as variáveis:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: string de conexão do banco (SQLite por padrão).
   - `CONTACT_EMAIL`: email que recebe as solicitações do formulário de contato.
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`:
     credenciais SMTP usadas para enviar os emails do formulário de contato.
     Sem essa configuração, as solicitações continuam sendo salvas no banco,
     mas o email não é enviado.

3. Rode as migrações e popule o banco com conteúdo de exemplo:

   ```bash
   npx prisma migrate dev
   npm run seed
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura de conteúdo (Prisma)

Modelos em `prisma/schema.prisma`:

- `Destination` — destinos (Península Antártica, Geórgia do Sul, etc.).
- `Vessel` — embarcações usadas nas expedições.
- `Expedition` — pacotes/itinerários, com relação N:N com destinos e
  relação com uma embarcação.
- `FaqItem` — perguntas frequentes, agrupadas por categoria. As que vêm de
  letsgopolar.com guardam `sourceId`, `sourceSlug` e `sourceModified`.
- `Inquiry` — solicitações recebidas pelo formulário de contato (nome,
  email, mensagem, expedição de interesse e status do envio de email).

Campos de lista (destaques, itinerário, comodidades etc.) são guardados
como texto JSON, já que SQLite não suporta arrays nativamente — veja os
helpers de parsing em `src/lib/content.ts`.

## Perguntas frequentes da Let's Go Polar

As FAQs são traduções das perguntas publicadas em
[letsgopolar.com/faqs](https://letsgopolar.com/faqs/). As traduções ficam em
`content/lgp/faqs.pt.json`, que é a fonte do que vai para o banco. Cada item
guarda o id, o slug e a data de alteração da FAQ original, para saber quando a
versão em inglês mudou depois da tradução.

Fluxo para manter em dia:

1. `npm run lgp:faqs:check` lê a API pública de letsgopolar.com e lista as FAQs
   novas, as alteradas depois da tradução e as removidas. O texto em inglês do
   que falta traduzir vai para `content/lgp/faqs.pending.json`.
2. Traduza esses itens e atualize `content/lgp/faqs.pt.json` (mesmo formato,
   com `slug` em português e a nova `sourceModified`).
3. `npm run lgp:faqs:import` grava tudo no banco. Cada resposta aparece em
   `/perguntas-frequentes/<slug>`.

Regras da importação:

- Atualiza pelo id da FAQ original. Um item com `locked = true` no banco não é
  sobrescrito, então marque assim o que você editou à mão.
- FAQs removidas de letsgopolar.com são despublicadas, não apagadas.
- A categoria "Sobre a Let's Go Polar" entra despublicada.
- O HTML das respostas só pode ter tags de texto simples e `href`. A importação
  falha se encontrar outra coisa.
- Links entre FAQs viram links para as páginas em português. O link do
  formulário de solicitação de viagem vira `/contato`.

## Produção

Para produção, troque o provedor do banco no `prisma/schema.prisma` e no
`prisma.config.ts` de SQLite para Postgres (ou outro banco suportado),
ajuste `DATABASE_URL` e rode `npx prisma migrate deploy`. Configure as
variáveis de SMTP com um provedor de envio de email transacional.

## Scripts

- `npm run dev` — servidor de desenvolvimento.
- `npm run build` — build de produção.
- `npm run start` — roda o build de produção.
- `npm run lint` — checagem de lint.
- `npm run seed` — popula o banco com o conteúdo de exemplo e as FAQs traduzidas.
- `npm run lgp:faqs:check` — compara as FAQs de letsgopolar.com com as traduções.
- `npm run lgp:faqs:import` — grava as FAQs traduzidas no banco.
