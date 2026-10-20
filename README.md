# Destinos Polares

Site em português de expedições polares à Antártica e ao Ártico, publicado em
destinospolares.com.br. É um clone traduzido do letsgopolar.com: mesmo layout,
mesmas viagens e os mesmos preços, lidos dos JSON públicos da Let's Go Polar.
Não há venda online. O formulário de contato envia o pedido por email.

Stack: Next.js (App Router) + TypeScript + Tailwind CSS + Nodemailer. Não há
banco de dados.

Leia o `CLAUDE.md` antes de mudar qualquer coisa.

## De onde vem cada coisa

| Conteúdo | Origem |
| --- | --- |
| Saídas, datas, cabines, preços, disponibilidade | `letsgopolar.com/dates-board/browse.json` e `letsgopolar.com/all-trips/data/<slug>.json`, com cache de 15 minutos |
| Textos das viagens em português | `content/lgp/strings.pt.json`, memória de tradução chaveada pelo texto em inglês |
| Perguntas frequentes | `content/lgp/faqs.pt.json`, traduções de letsgopolar.com/faqs |

## Rodar localmente

```bash
npm install
cp .env.example .env   # só é preciso para testar o envio do formulário
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Variáveis de ambiente:

- `CONTACT_EMAIL`: email que recebe os pedidos do formulário de contato.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`: servidor
  que envia esses emails. Sem eles, o formulário avisa que não conseguiu enviar.
- `SITE_URL` (opcional): endereço oficial, usado no sitemap e nas URLs canônicas.
  O padrão é `https://destinospolares.com.br`.

## Manter as traduções em dia

```bash
npm run lgp:strings:check                      # textos das viagens sem tradução, do mais usado ao menos usado
npm run lgp:strings:merge -- traducoes.json    # junta { "inglês": "português" } na memória
npm run lgp:faqs:check                         # FAQs novas, alteradas ou removidas em letsgopolar.com
```

`lgp:strings:check` grava as pendências em `content/lgp/strings.pending.json`.
A junção rejeita qualquer tradução cujo HTML não tenha as mesmas tags do original.
Enquanto um texto não tem tradução, a página mostra o original em inglês.

`lgp:faqs:check` grava o inglês do que falta em `content/lgp/faqs.pending.json`.
Traduza e atualize `content/lgp/faqs.pt.json` no mesmo formato, com `slug` em
português e a nova `sourceModified`. A categoria "Sobre a Let's Go Polar" não
aparece no site.

## Produção

O site roda como Node.js Web App na Hostinger, publicado a partir do branch
`main` do GitHub. Build `npm run build`, início `npm start`, Node 20.9 ou mais
novo. Configure as variáveis de ambiente acima no painel do app.
