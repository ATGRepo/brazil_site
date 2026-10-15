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

## De onde ler

Tudo o que o Destinos Polares precisa da Let's Go Polar está público. Não é
preciso senha, servidor MCP nem acesso ao banco do desk.

| O quê | Onde |
| --- | --- |
| FAQs | API pública do WordPress, `letsgopolar.com/wp-json/wp/v2/faqs` |
| Saídas, datas, cabines, preços, disponibilidade | `letsgopolar.com/all-trips/feed-current.json` |
| Detalhe de uma viagem (itinerário, navio, cabines, fotos, condições) | `letsgopolar.com/all-trips/data/<slug>.json` |

O feed é refeito a partir do banco do desk a cada 15 minutos. O guia
`desk/docs/ACCESS.md` do repositório letsgopolar-desk é para quem altera o desk.
Não use o caminho dele (Novamira, senha de aplicativo, `$wpdb`) a partir daqui.

Preço, data e disponibilidade não se traduzem e podem ser atualizados direto do
feed. Textos são traduzidos uma vez e de novo só quando mudam.

Fotos são da Let's Go Polar e das operadoras. Não publique imagens no
Destinos Polares sem confirmação do direito de uso.

## Credenciais

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
