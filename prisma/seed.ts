import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { importFaqs, loadTranslations } from "../scripts/lgp/faqs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

// Conteúdo de exemplo em português para popular o site durante o desenvolvimento
// (destinos, embarcações e expedições). As FAQs vêm de content/lgp/faqs.pt.json.
// Substitua por informações reais da operação antes de publicar em produção.

const destinations = [
  {
    slug: "peninsula-antartica",
    name: "Península Antártica",
    summary:
      "A porta de entrada mais visitada do continente, com paisagens de gelo, baías protegidas e grande concentração de vida selvagem.",
    description:
      "A Península Antártica se estende em direção à América do Sul e concentra a maior parte das expedições turísticas ao continente. Em poucos dias de navegação a partir de Ushuaia, os visitantes alcançam baías cercadas por geleiras, canais estreitos como o Estreito de Lemaire e colônias densas de pinguins Gentoo, Chinstrap e Adélia. Estações de pesquisa histórica e atual também fazem parte dos desembarques, dependendo das condições de gelo e do itinerário.",
    heroImage: null,
    highlights: JSON.stringify([
      "Desembarques em Zodiac em baías e enseadas geladas",
      "Colônias de pinguins Gentoo, Chinstrap e Adélia",
      "Observação de baleias jubarte e orcas",
      "Passagem por canais icônicos como o Estreito de Lemaire",
    ]),
    order: 1,
  },
  {
    slug: "georgia-do-sul",
    name: "Geórgia do Sul",
    summary:
      "Uma ilha subantártica de montanhas abruptas e a maior concentração de vida selvagem do Atlântico Sul.",
    description:
      "Geórgia do Sul é considerada por muitos viajantes o destino mais espetacular do Atlântico Sul em termos de vida selvagem. A ilha abriga colônias de milhões de pinguins-rei, além de elefantes-marinhos e lobos-marinhos nas praias. A história da exploração polar também está presente, com o túmulo do explorador Ernest Shackleton na antiga estação baleeira de Grytviken.",
    heroImage: null,
    highlights: JSON.stringify([
      "Colônias de pinguins-rei com centenas de milhares de indivíduos",
      "Praias com elefantes-marinhos e lobos-marinhos",
      "Estação baleeira histórica de Grytviken",
      "Túmulo do explorador Ernest Shackleton",
    ]),
    order: 2,
  },
  {
    slug: "ilhas-malvinas",
    name: "Ilhas Malvinas",
    summary:
      "Paisagens abertas de pradaria costeira, colônias de pinguins-rei e albatrozes, e uma comunidade local acolhedora.",
    description:
      "As Ilhas Malvinas oferecem um contraste de paisagens em relação à Antártica e à Geórgia do Sul, com pradarias costeiras, falésias e uma rica avifauna. É um dos poucos locais da região onde é possível visitar comunidades locais, além de observar colônias de pinguins-rei, pinguins-de-magalhães e albatrozes-errantes em seus habitats naturais.",
    heroImage: null,
    highlights: JSON.stringify([
      "Colônias de pinguins-rei em Volunteer Point",
      "Observação de albatrozes-errantes",
      "Comunidade local em Port Stanley",
      "Praias e falésias costeiras preservadas",
    ]),
    order: 3,
  },
  {
    slug: "circulo-polar-antartico",
    name: "Círculo Polar Antártico",
    summary:
      "Para viajantes que desejam ir além da Península, cruzando a linha simbólica do Círculo Polar Antártico.",
    description:
      "Cruzar o Círculo Polar Antártico exige condições de gelo favoráveis e um itinerário mais longo, mas recompensa os viajantes com paisagens ainda mais remotas e menos visitadas. As expedições que buscam essa latitude costumam incluir dias adicionais de navegação e maior flexibilidade de roteiro, conforme as condições marítimas e de gelo no momento da viagem.",
    heroImage: null,
    highlights: JSON.stringify([
      "Travessia da linha simbólica do Círculo Polar Antártico",
      "Paisagens remotas com menor tráfego de expedições",
      "Icebergs tabulares de grandes dimensões",
      "Roteiro flexível conforme condições de gelo",
    ]),
    order: 4,
  },
];

const vessels = [
  {
    slug: "polar-explorer",
    name: "Polar Explorer",
    summary:
      "Navio de expedição de porte médio, com casco reforçado para navegação em áreas com presença de gelo.",
    description:
      "O Polar Explorer é um navio de expedição projetado para navegação polar, com casco reforçado, sistema de estabilização e uma frota de botes Zodiac para os desembarques. As cabines são distribuídas em categorias com vista para o mar, e as áreas comuns incluem sala de observação, auditório para palestras da equipe de expedição e deck de observação externo.",
    capacity: 120,
    heroImage: null,
    gallery: JSON.stringify([]),
    amenities: JSON.stringify([
      "Casco reforçado para navegação em gelo",
      "Frota de botes Zodiac para desembarques",
      "Sala de observação e auditório para palestras",
      "Equipe de expedição com guias naturalistas",
    ]),
  },
  {
    slug: "spirit-of-the-ice",
    name: "Spirit of the Ice",
    summary:
      "Navio de expedição de menor porte, priorizando grupos reduzidos e maior tempo de desembarque por passageiro.",
    description:
      "O Spirit of the Ice opera com um número reduzido de passageiros em relação a outros navios da categoria, o que permite mais tempo de desembarque por pessoa e maior flexibilidade de roteiro. É indicado para viajantes que priorizam grupos menores e uma experiência mais próxima da equipe de expedição.",
    capacity: 80,
    heroImage: null,
    gallery: JSON.stringify([]),
    amenities: JSON.stringify([
      "Grupos reduzidos de passageiros",
      "Maior tempo de desembarque por pessoa",
      "Equipe de expedição com guias naturalistas",
      "Deck de observação panorâmico",
    ]),
  },
];

const expeditions = [
  {
    slug: "classica-antartica",
    name: "Clássica Antártica",
    summary:
      "O itinerário mais procurado: travessia da Passagem de Drake e desembarques na Península Antártica.",
    description:
      "A expedição Clássica Antártica parte de Ushuaia, na Argentina, e cruza a Passagem de Drake em direção à Península Antártica. Ao longo de aproximadamente uma semana na região, o itinerário prevê desembarques diários em Zodiac, sujeitos às condições de tempo e gelo, com foco em colônias de pinguins, geleiras e canais entre ilhas.",
    durationDays: 10,
    season: "Outubro a Março",
    startingFrom: "Ushuaia, Argentina",
    priceFrom: 8500,
    priceCurrency: "USD",
    heroImage: null,
    itinerary: JSON.stringify([
      { day: "1", title: "Embarque em Ushuaia", description: "Embarque no fim da tarde e saída pelo Canal de Beagle." },
      { day: "2–3", title: "Passagem de Drake", description: "Navegação em mar aberto rumo à Antártica, com palestras da equipe de expedição a bordo." },
      { day: "4–8", title: "Península Antártica", description: "Desembarques diários em Zodiac, sujeitos a condições de tempo e gelo." },
      { day: "9–10", title: "Retorno e desembarque", description: "Nova travessia da Passagem de Drake e desembarque em Ushuaia." },
    ]),
    included: JSON.stringify([
      "Acomodação a bordo durante toda a expedição",
      "Todas as refeições durante a viagem",
      "Desembarques em Zodiac com guias naturalistas",
      "Palestras temáticas da equipe de expedição",
      "Roupa de expedição (parca) para o participante",
    ]),
    excluded: JSON.stringify([
      "Passagens aéreas até Ushuaia",
      "Seguro viagem",
      "Bebidas alcoólicas premium",
      "Despesas pessoais",
    ]),
    featured: true,
    order: 1,
    vesselSlug: "polar-explorer",
    destinationSlugs: ["peninsula-antartica"],
  },
  {
    slug: "antartica-georgia-malvinas",
    name: "Antártica, Geórgia do Sul e Malvinas",
    summary:
      "A expedição mais completa da região, reunindo os três destinos em uma única viagem.",
    description:
      "Esta é a expedição mais longa e completa do portfólio, combinando as Ilhas Malvinas, a Geórgia do Sul e a Península Antártica em um único itinerário. É indicada para viajantes que desejam a maior diversidade possível de paisagens e vida selvagem em uma só viagem, incluindo as extensas colônias de pinguins-rei da Geórgia do Sul.",
    durationDays: 20,
    season: "Outubro a Março",
    startingFrom: "Ushuaia, Argentina",
    priceFrom: 16500,
    priceCurrency: "USD",
    heroImage: null,
    itinerary: JSON.stringify([
      { day: "1", title: "Embarque em Ushuaia", description: "Embarque e saída pelo Canal de Beagle." },
      { day: "2–3", title: "Ilhas Malvinas", description: "Desembarques em Port Stanley e colônias de pinguins-rei em Volunteer Point." },
      { day: "4–5", title: "Navegação até a Geórgia do Sul", description: "Dias de navegação com palestras da equipe de expedição." },
      { day: "6–9", title: "Geórgia do Sul", description: "Desembarques em Grytviken e praias com colônias de pinguins-rei e elefantes-marinhos." },
      { day: "10–12", title: "Navegação até a Antártica", description: "Travessia em direção à Península Antártica." },
      { day: "13–17", title: "Península Antártica", description: "Desembarques diários em Zodiac, sujeitos a condições de tempo e gelo." },
      { day: "18–20", title: "Retorno a Ushuaia", description: "Travessia da Passagem de Drake e desembarque final." },
    ]),
    included: JSON.stringify([
      "Acomodação a bordo durante toda a expedição",
      "Todas as refeições durante a viagem",
      "Desembarques em Zodiac com guias naturalistas",
      "Palestras temáticas da equipe de expedição",
      "Roupa de expedição (parca) para o participante",
    ]),
    excluded: JSON.stringify([
      "Passagens aéreas até Ushuaia",
      "Seguro viagem",
      "Bebidas alcoólicas premium",
      "Despesas pessoais",
    ]),
    featured: true,
    order: 2,
    vesselSlug: "polar-explorer",
    destinationSlugs: ["ilhas-malvinas", "georgia-do-sul", "peninsula-antartica"],
  },
  {
    slug: "circulo-polar",
    name: "Círculo Polar Antártico",
    summary:
      "Itinerário voltado a viajantes que já conhecem a Península e buscam ir além, rumo ao Círculo Polar.",
    description:
      "Esta expedição prioriza a travessia do Círculo Polar Antártico, condicionada às condições de gelo no momento da viagem. O roteiro utiliza um navio de menor porte, o que permite maior flexibilidade para aproveitar janelas de bom tempo e alcançar latitudes mais ao sul da Península Antártica.",
    durationDays: 12,
    season: "Dezembro a Fevereiro",
    startingFrom: "Ushuaia, Argentina",
    priceFrom: 11200,
    priceCurrency: "USD",
    heroImage: null,
    itinerary: JSON.stringify([
      { day: "1", title: "Embarque em Ushuaia", description: "Embarque e saída pelo Canal de Beagle." },
      { day: "2–3", title: "Passagem de Drake", description: "Navegação em mar aberto rumo à Antártica." },
      { day: "4–10", title: "Península Antártica e Círculo Polar", description: "Desembarques diários e tentativa de travessia do Círculo Polar Antártico, conforme condições de gelo." },
      { day: "11–12", title: "Retorno e desembarque", description: "Travessia da Passagem de Drake e desembarque em Ushuaia." },
    ]),
    included: JSON.stringify([
      "Acomodação a bordo durante toda a expedição",
      "Todas as refeições durante a viagem",
      "Desembarques em Zodiac com guias naturalistas",
      "Palestras temáticas da equipe de expedição",
      "Roupa de expedição (parca) para o participante",
    ]),
    excluded: JSON.stringify([
      "Passagens aéreas até Ushuaia",
      "Seguro viagem",
      "Bebidas alcoólicas premium",
      "Despesas pessoais",
    ]),
    featured: false,
    order: 3,
    vesselSlug: "spirit-of-the-ice",
    destinationSlugs: ["circulo-polar-antartico", "peninsula-antartica"],
  },
];


async function main() {
  for (const destination of destinations) {
    await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: destination,
      create: destination,
    });
  }

  for (const vessel of vessels) {
    await prisma.vessel.upsert({
      where: { slug: vessel.slug },
      update: vessel,
      create: vessel,
    });
  }

  for (const expedition of expeditions) {
    const { vesselSlug, destinationSlugs, ...data } = expedition;

    const vessel = vesselSlug
      ? await prisma.vessel.findUniqueOrThrow({ where: { slug: vesselSlug } })
      : null;

    await prisma.expedition.upsert({
      where: { slug: expedition.slug },
      update: { ...data, vesselId: vessel?.id ?? null },
      create: { ...data, vesselId: vessel?.id ?? null },
    });

    const savedExpedition = await prisma.expedition.findUniqueOrThrow({
      where: { slug: expedition.slug },
    });

    await prisma.expeditionDestination.deleteMany({
      where: { expeditionId: savedExpedition.id },
    });

    for (const destinationSlug of destinationSlugs) {
      const destination = await prisma.destination.findUniqueOrThrow({
        where: { slug: destinationSlug },
      });
      await prisma.expeditionDestination.create({
        data: {
          expeditionId: savedExpedition.id,
          destinationId: destination.id,
        },
      });
    }
  }

  // FAQs reais, traduzidas de letsgopolar.com (ver scripts/sync-lgp-faqs.ts).
  const faqs = await importFaqs(prisma, loadTranslations());
  console.log(`FAQs: ${faqs.created} criadas, ${faqs.updated} atualizadas.`);

  console.log("Seed concluído.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
