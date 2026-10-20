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

Também são públicos `letsgopolar.com/dates-board/browse.json` (saídas que dá
para reservar, usado no quadro de datas) e `letsgopolar.com/reviews-proto/reviews.json`
(avaliações de clientes). A base de conhecimento (`kb/` e `kb-modular/` no
letsgopolar-desk) é fonte para textos novos.

## O site é um clone da Let's Go Polar

Decisão de 19 Oct 2026, com o Ricardo:

1. O Destinos Polares é o letsgopolar.com traduzido para o português, com o mesmo
   layout, cores e organização das páginas. Muda o nome e o logo.
2. Preço, data, cabine e disponibilidade vêm dos JSON da Let's Go Polar a cada
   15 minutos. Não há cópia própria desses dados.
3. Textos são traduzidos uma vez e guardados pela versão em inglês. Se o texto
   em inglês muda, só ele volta para a tradução.
4. As fotos da Let's Go Polar e das operadoras podem ser usadas, carregadas do
   próprio letsgopolar.com.
5. Formulários de contato e de pedido de viagem enviam para o email do Destinos
   Polares. Nunca para os endpoints da Let's Go Polar (`/wp-json/lgp/v1/*`,
   `submit-request.php`), porque isso seria escrever no sistema deles.

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

## FAQs e traduções

Não há banco de dados. As páginas leem `content/lgp/faqs.pt.json` (FAQs) e
`content/lgp/strings.pt.json` (textos das viagens) direto do disco. O fluxo de
atualização está no README:

```
npm run lgp:strings:check   textos das viagens que faltam traduzir
npm run lgp:strings:merge   junta traduções novas na memória
npm run lgp:faqs:check      FAQs novas, alteradas ou removidas em letsgopolar.com
```

Edite as traduções nesses arquivos. Uma tradução de texto de viagem vale para
todas as viagens que usam o mesmo texto em inglês.

## Deploy

Hostinger, Node.js Web App, a partir do branch `main`. Cada push no `main` vai
para o ar. Trabalhe em outro branch e mescle no `main` só com o ok do Ricardo.

O build usa webpack (`next build --webpack`). O Turbopack falha no build da
Hostinger: ele abre um processo Node separado para o PostCSS, e o ambiente de
build não deixa o processo conectar. Não volte para o Turbopack sem testar lá.

## Antes de commitar

`npx tsc --noEmit`, `npm run lint` e `npm run build` precisam passar.
