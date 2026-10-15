# Regras de trabalho do Destinos Polares

Site em português de expedições polares, publicado em destinospolares.com.br.
Leia este arquivo antes de mudar qualquer coisa.

As regras do Next.js desta versão estão em AGENTS.md, gerado pelo `next dev`:

@AGENTS.md

## A Let's Go Polar é só leitura

A Let's Go Polar (letsgopolar.com) é a base de conteúdo do Destinos Polares.
Você lê de lá e escreve aqui. Nunca o contrário.

Nunca altere nada da Let's Go Polar. Isso vale para:

1. O site letsgopolar.com e o WordPress dele (posts, páginas, FAQs, viagens,
   navios, meta, mídia, configurações, cache).
2. O repositório `ATGRepo/letsgopolar-desk`, mesmo que ele esteja na sessão.
   Nada de commit, branch, push ou pull request lá.
3. O painel desk.letsgopolar.com e os servidores MCP da Let's Go Polar
   (`novamira-letsgopolar-com`, `novamira-desk-letsgopolar`). Use só ferramentas
   de leitura. Se uma tarefa parecer exigir escrita lá, pare e pergunte.

Tudo o que você criar ou alterar fica no repositório `brazil_site`.

## Credenciais

A leitura pública da API do WordPress não precisa de senha. Para campos que a
API pública não mostra (preços, datas, itinerários, cabines, descrição dos
navios), a sessão lê as variáveis de ambiente `LGP_WP_USER` e
`LGP_WP_APP_PASSWORD`. Esse usuário deve ter papel só de leitura.

Nunca peça senha no chat e nunca grave credenciais no repositório. `.env` é
ignorado pelo git.

## Conteúdo

O conteúdo publicado vem da Let's Go Polar. Não invente fatos, números ou
promessas. A tradução é fiel: não acrescenta nem remove informação.

Português do Brasil natural e direto, falando com "você". O glossário de termos
polares (pinguins, baleias, focas, lugares) está nas traduções já feitas em
`content/lgp/faqs.pt.json`. Mantenha os mesmos termos.

O Destinos Polares tem marca própria. Textos que apresentam a Let's Go Polar em
primeira pessoa não são publicados como estão. Por isso a categoria "Sobre a
Let's Go Polar" entra despublicada.

## FAQs

As FAQs são traduções de letsgopolar.com/faqs. O fluxo está no README:

```
npm run lgp:faqs:check    o que é novo, mudou ou saiu em letsgopolar.com
npm run lgp:faqs:import   grava content/lgp/faqs.pt.json no banco
```

`content/lgp/faqs.pt.json` é a fonte. Não edite FAQs vindas da Let's Go Polar
direto no banco, a próxima importação sobrescreve. Se uma edição manual precisa
ficar, marque o item com `locked = true`.

## Antes de commitar

`npx tsc --noEmit` e `npm run lint` precisam passar. Se mexer no schema, crie a
migração com `npx prisma migrate dev --name <nome>`.
