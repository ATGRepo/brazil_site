import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { VideoFacade } from "@/components/video-facade";

// Mesmo modelo da página letsgopolar.com/about-us/, traduzido e com o Destinos
// Polares no lugar da Let's Go Polar onde o texto fala da marca. Fotos e vídeo
// são os da Let's Go Polar, carregados de lá.
// Regras da base de conhecimento (kb/company-and-service) que valem aqui:
// - nunca escrever "licenciada";
// - não usar a expressão "Seller of Travel", só o número do registro;
// - contagens de pessoas como "mais de", nunca número exato;
// - "guias dizem que nossos viajantes chegam mais preparados" é relato, não estatística.

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "O Destinos Polares é uma marca Antarctica Travel Group, empresa fundada por Neill Drake, guia na Antártica desde 2016. Conheça a equipe, a nossa história e como trabalhamos.",
};

const UP = "https://letsgopolar.com/wp-content/uploads";
const CONTACT_EMAIL = "contato@destinospolares.com.br";
const WHATSAPP = "https://wa.me/5541988203015?text=" + encodeURIComponent("Olá! Vim pelo site Destinos Polares.");
const FACEBOOK_GROUP = "https://www.facebook.com/groups/antarcticatravelgroup/";
const CA_SEARCH = "https://oag.ca.gov/travel";
const IAATO = `${UP}/2026/08/iaato-crest-dark-150x150.png`;

const NUMBERS = [
  ["54.000+", "membros na comunidade"],
  ["2.500+", "viajantes em expedições polares"],
  ["1.000+", "dias guiando na Antártica"],
  ["8", "anos reservando expedições polares"],
];

const JUMP = [
  ["#equipe", "Conheça a equipe"],
  ["#historia", "Nossa história"],
  ["#vantagens", "Por que reservar com a gente"],
  ["#avaliacoes", "Avaliações"],
  ["#somos-confiaveis", "Perguntas frequentes"],
];

type Person = { name: string; role: string; bio: string; place: string; photo: string; iaato?: boolean };

const FOUNDER: Person = {
  name: "Neill Drake",
  role: "Fundador e presidente. Guia de expedições polares.",
  bio: "Foi à Antártica em 2015 como passageiro, voltou outras vezes como hóspede e começou a guiar em 2016. São mais de 1.000 dias no gelo desde então, e ele continua guiando. Por isso as respostas que você recebe aqui vêm de alguém que já esteve naquele convés.",
  place: "San Diego, Califórnia",
  photo: `${UP}/2025/10/269974334_10165706578840585_4849978757935040084_n1-1-1-768x658.jpg`,
  iaato: true,
};

const TEAM: Person[] = [
  {
    name: "Izabela Hudson",
    role: "Cuidado antes e depois da viagem.",
    bio: "O seu principal contato nas semanas antes da viagem e depois que você volta. As dúvidas de última hora ficam com a Bella. Oficialmente, a fada do antes e depois da viagem.",
    place: "San Diego, Califórnia",
    photo: `${UP}/2025/10/WhatsApp-Image-2025-10-23-at-16.16.25-1-768x658.jpeg`,
    iaato: true,
  },
  {
    name: "Ricardo Nisiide",
    role: "Logística dos viajantes, listas de passageiros, dados e site.",
    bio: "Faz um milhão de coisas, por isso o cargo oficial é Manager of Awesome.",
    place: "Curitiba, Brasil",
    photo: `${UP}/2026/10/ricardo-nisiide-antarctica-2026.jpg`,
    iaato: true,
  },
  {
    name: "Muneeba Ashgar",
    role: "Director of Getting Stuff Done.",
    bio: "A Muneeba cuida de quase tudo, e dá conta de tudo. Por isso o cargo é o mais honesto possível.",
    place: "Paquistão",
    photo: `${UP}/2025/03/muneeba-editado-768x658.jpg`,
  },
  {
    name: "Chelsea Betancourt",
    role: "Polar Dream Coordinator.",
    bio: "Atende os pedidos dos viajantes e planeja as viagens. Tem coração para o atendimento e uma organização de dar inveja.",
    place: "Ramona, Califórnia",
    photo: `${UP}/2025/10/chelsea-1-1-768x658.jpeg`,
  },
  {
    name: "Nikki Souza",
    role: "Polar Dream Coordinator.",
    bio: "Atende os pedidos dos viajantes e planeja as viagens. Faz parte do time dos sonhos das focas... opa, das vendas. Isso está saindo do controle.",
    place: "Filha da Terra",
    photo: `${UP}/2025/10/nikki-1-1.jpeg`,
  },
  {
    name: "Emily Steward",
    role: "Marketing e redes sociais.",
    bio: "Uma das primeiras pessoas a reservar uma viagem com a ATG. Hoje é ela quem conta para todo mundo sobre as viagens.",
    place: "Tulsa, Oklahoma",
    photo: `${UP}/2026/07/emily.jpeg`,
  },
];

const STORY = [
  {
    title: "O Neill foi primeiro",
    photo: `${UP}/2025/06/IMG_20191228_214654_561-768x960.jpg`,
    alt: "Neill Drake em pé num bote Zodiac entre pedaços de gelo na Antártica",
    text: "O Neill Drake foi à Antártica em 2015 como passageiro e gostou tanto que continuou voltando como hóspede. Criou um grupo no Facebook para manter contato com as pessoas daquela primeira viagem, e o grupo virou, sem querer, a comunidade da Antarctica Travel Group. Em algum momento ele decidiu que esse era o futuro dele, começou a trabalhar como guia e está nisso desde 2016. São mais de 1.000 dias no gelo, e ele continua guiando.",
  },
  {
    title: "A Bella ouviu tudo",
    photo: `${UP}/2025/06/NeilBella_WKR73526_WernerKruse-768x512.jpg`,
    alt: "Neill e Bella juntos num bote Zodiac na Antártica",
    text: "A Bella e o Neill se conheceram em San Diego durante a pandemia e passaram a quarentena juntos. Foram meses ouvindo ele, do outro cômodo, conversar com clientes sobre as viagens, dia após dia. Qual navio, qual mês, o que não vale a pena. Então, quando a empresa precisou de ajuda em 2021, ela já conhecia o mercado de ouvido. Primeiro namorada, depois colega de equipe, e hoje esposa dele. Ela cuida de você nas semanas antes do embarque e acompanha você depois da volta.",
  },
  {
    title: "O Rico entra para o time",
    photo: `${UP}/2026/08/IMG-20231211-WA0040-768x576.jpg`,
    alt: "Neill dando um beijo na cabeça do Rico sob a neve na Antártica",
    text: "O Neill conheceu o Ricardo em 2015, nas Cataratas do Iguaçu. O Ricardo tinha um hostel por lá, e o Neill estava transformando uma Kombi em motorhome. Ele ficou meses. Desde então são melhores amigos, e com o tempo o Ricardo também entrou para a equipe. Ele finalmente chegou à Antártica em fevereiro de 2022. “Como eu vou explicar o que este lugar significa para outra pessoa, se não consigo explicar nem para mim mesmo?” Ele cuida da logística dos viajantes, das listas de passageiros, dos dados e do site. O Neill diz que o Ricardo foi fundamental e que não teria chegado até aqui sem ele.",
  },
];

const REVIEWS = [
  ["A ATG me fez economizar US$ 2.000 em comparação com a cotação da empresa de cruzeiro. Viajando sozinha e reservando uma cabine com varanda, fiquei extremamente feliz. O atendimento foi fora de série.", "Tammie H.", "Svalbard, viajando sozinha"],
  ["Desde o primeiro contato eles se destacaram por serem experientes, transparentes e realmente prestativos, sem nunca forçar a venda. A ATG fez de tudo para que a gente se sentisse totalmente preparado.", "Rachel B.", "Antártica"],
  ["Esta foi a minha segunda viagem com a ATG. Consegui uma ótima oferta com a Albatros pela ATG e fiquei numa cabine com varanda sem dividir, viajando sozinha. Ainda fiz caiaque e o mergulho polar.", "Linda M.", "Groenlândia e Antártica, viajante que voltou"],
  ["Eles tinham uma oferta incrível que era exatamente o que eu queria. Responderam muitas perguntas e tiraram qualquer receio que eu tinha de reservar com um intermediário. Foi tudo muito fácil.", "Todd D.", "Antártica"],
  ["A ATG foi incrível, profissional e rápida nas respostas. Nos sentimos muito preparados para a viagem, e eles conseguiram uma oferta épica para a gente!", "Molly P.", "Antártica"],
  ["Responderam todas as minhas perguntas e mais um pouco, e tudo ficou muito menos confuso. Até me ajudaram a planejar o resto da minha viagem pela América do Sul. O Neill e a equipe dele são os melhores!", "James A.", "Antártica"],
  ["A ATG respondeu minhas perguntas por email muito rápido e também se dispôs a marcar uma ligação. As informações que eles passaram me deixaram confortável para simplesmente ir em frente e reservar aquela viagem única na vida.", "Van D.", "Antártica, reserva de última hora"],
  ["A equipe, principalmente o Neill, foi muito paciente. Foi uma viagem em grupo da ATG, e eu fiquei num grupo onde fiz amigos para a vida toda.", "Veronique B.", "Antártica, viajando sozinha numa viagem em grupo"],
];

// A Albatros não tem página de operadora no feed da Let's Go Polar, então fica sem link.
const OPERATORS: [string | null, string][] = [
  ["quark-expeditions", "Quark Expeditions"],
  [null, "Albatros Expeditions"],
  ["polar-latitudes", "Polar Latitudes Expeditions"],
  ["poseidon-expeditions", "Poseidon Expeditions"],
  ["antarctica21", "Antarctica21"],
  ["aurora-expeditions", "Aurora Expeditions"],
  ["oceanwide", "Oceanwide Expeditions"],
  ["swan-hellenic", "Swan Hellenic"],
  ["g-adventures", "G Adventures"],
  ["antarpply-expeditions", "Antarpply Expeditions"],
  ["terra-nova-expeditions", "Terra Nova Expeditions"],
  ["arctic-tern", "Arctic Tern"],
];

const a = "font-medium text-accent hover:underline";

type Faq = { q: string; a: ReactNode };
type FaqGroup = { id: string; title: string; items: Faq[] };

const FAQ: FaqGroup[] = [
  {
    id: "quem-somos",
    title: "Quem somos",
    items: [
      {
        q: "O Destinos Polares é uma agência de viagens confiável?",
        a: (
          <>
            <p>
              Sim. O Destinos Polares é uma marca da Antarctica Travel Group, Inc., empresa registrada na Califórnia,
              com sede em San Diego. A Let&apos;s Go Polar e o Destinos Polares são nomes da mesma empresa: mesma
              pessoa jurídica, mesmo registro e mesma equipe.
            </p>
            <p>
              O nosso número de registro na Califórnia é 2166968-70. O número na Travel Consumer Restitution
              Corporation é 710090. Você pode conferir os dois na{" "}
              <a href={CA_SEARCH} className={a} target="_blank" rel="noopener noreferrer">
                busca oficial do Procurador-Geral da Califórnia
              </a>
              .
            </p>
            <p>
              Reservamos expedições polares há 8 anos e, nesse tempo, levamos mais de 2.500 viajantes à Antártica e
              ao Ártico.
            </p>
            <p>
              Se ainda quiser tirar a dúvida, fale com uma pessoa. É o jeito mais fácil de saber se uma agência de
              viagens é de verdade.
            </p>
          </>
        ),
      },
      {
        q: "A Antarctica Travel Group é uma empresa de verdade?",
        a: (
          <>
            <p>
              Sim. A Antarctica Travel Group, Inc. é uma empresa da Califórnia. A Let&apos;s Go Polar e o Destinos
              Polares são nomes dessa empresa, então os três nomes ficam na mesma pessoa jurídica, com o mesmo
              registro e a mesma equipe.
            </p>
            <p>
              A Antarctica Travel Group começou como uma comunidade e cresceu até virar uma agência de viagens
              polares. As pessoas são as mesmas.
            </p>
          </>
        ),
      },
      {
        q: "Qual é a diferença entre o Destinos Polares, a Let's Go Polar e a Antarctica Travel Group?",
        a: (
          <>
            <p>
              A Antarctica Travel Group é a empresa principal e o lado da comunidade: o grupo no Facebook, o
              conteúdo educativo,{" "}
              <Link href="/the-drake-shake" className={a}>
                o podcast
              </Link>{" "}
              e as nossas viagens em grupo.
            </p>
            <p>
              A Let&apos;s Go Polar é a plataforma de reservas, onde você compara navios, datas, roteiros e preços de
              todas as operadoras com que trabalhamos. O Destinos Polares é a mesma plataforma em português.
            </p>
            <p>Uma empresa só. Se você já reservou com a ATG, já é nosso cliente.</p>
          </>
        ),
      },
      {
        q: "Quem é o dono e quem fundou a Antarctica Travel Group?",
        a: (
          <>
            <p>Fui eu. Meu nome é Neill Drake, sou o fundador e o único dono.</p>
            <p>
              Fui à Antártica pela primeira vez como passageiro em 2015. Comecei a trabalhar lá como guia de
              expedição em 2016. Desde então passei mais de 1.000 dias na Antártica, em navios, operadoras,
              temporadas e roteiros diferentes.
            </p>
            <p>
              Criei a empresa depois de ver muita gente reservar a viagem errada. Escolhiam um navio pelo folheto,
              chegavam lá e descobriam que o roteiro, a cabine ou as atividades não eram o que achavam ter comprado.
              É um jeito ruim de gastar o dinheiro que uma viagem à Antártica custa.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "onde-estamos",
    title: "Onde estamos e o que sabemos",
    items: [
      {
        q: "Onde fica o Destinos Polares?",
        a: (
          <>
            <p>Em San Diego, na Califórnia, e atendemos viajantes do mundo todo.</p>
            <p>
              Temos clientes na Alemanha, no Canadá, na Inglaterra, na Holanda, na Austrália, na Nova Zelândia e na
              América do Sul. Trabalhamos em vários fusos horários e na moeda em que a sua operadora cobra. Quase
              sempre tem alguém da equipe acordado.
            </p>
            <p>
              A equipe também trabalha direto com operadoras de expedição, navios, guias e parceiros locais na
              Argentina, no Chile, na Antártica e no Ártico.
            </p>
          </>
        ),
      },
      {
        q: "Quanta experiência na Antártica a equipe tem de verdade?",
        a: (
          <>
            <p>
              A equipe soma mais de 15 anos de experiência como guias de expedições polares, além dos meus mais de
              1.000 dias na Antártica.
            </p>
            <p>
              Isso quer dizer que as pessoas que orientam você já comandaram as operações de Zodiac, deram as
              instruções aos passageiros, trabalharam nos desembarques, viram o tempo virar e atravessaram{" "}
              <Link href="/passagem-de-drake" className={a}>
                a Passagem de Drake
              </Link>{" "}
              mais vezes do que conseguem contar. Conhecemos esses navios do lado da tripulação, não do folheto.
            </p>
            <p>
              Também voltamos todo ano, em navios diferentes e com empresas diferentes. Fazemos isso de propósito.
              Navegar neles é o único jeito de dizer como uma operadora difere da outra, então seguimos fazendo.
              Roteiros diferentes, programas a bordo diferentes, equipes de expedição diferentes.
            </p>
            <p>
              É daí que vem o conselho prático. Quais cabines balançam mais. Quais navios realmente levam você para
              terra. Como são de verdade os roteiros de 10 e de 20 dias. Quando nascem os filhotes de pinguim. O que
              levar e o que deixar em casa.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "navios-e-operadoras",
    title: "Navios e operadoras",
    items: [
      {
        q: "O Destinos Polares opera os navios?",
        a: (
          <>
            <p>Não, com uma exceção.</p>
            <p>
              Na maioria das reservas, somos uma agência de viagens especializada. A operadora é dona do navio ou o
              freta, contrata o capitão e a equipe de expedição, cuida do roteiro e faz a expedição acontecer. O nosso
              trabalho é ajudar você a escolher a certa, cuidar da reserva e preparar você para a viagem.
            </p>
            <p>
              A exceção são as nossas viagens em grupo e os fretamentos de navio inteiro. Nelas, a Antarctica Travel
              Group é a organizadora e cuida diretamente da parte do grupo.
            </p>
          </>
        ),
      },
      {
        q: "Com quais empresas de cruzeiro para a Antártica vocês trabalham?",
        a: (
          <>
            <p>
              As nossas parceiras atuais são{" "}
              {OPERATORS.map(([slug, name], i) => (
                <span key={name}>
                  {slug ? (
                    <Link href={`/operadoras/${slug}`} className={a}>
                      {name}
                    </Link>
                  ) : (
                    name
                  )}
                  {i < OPERATORS.length - 2 ? ", " : i === OPERATORS.length - 2 ? " e " : "."}
                </span>
              ))}
            </p>
            <p>
              São cerca de 20 navios, de embarcações clássicas para 68 passageiros a navios novos com helicópteros e
              submarinos, além de opções com voo que evitam a Passagem de Drake.
            </p>
            <p>
              Você pode ver todas as empresas e todos os navios na nossa{" "}
              <Link href="/navios" className={a}>
                página de navios
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        q: "Como vocês decidem qual navio recomendar?",
        a: (
          <>
            <p>
              Olhamos a reputação da operadora, o tamanho do navio, a equipe de expedição, o roteiro, a época do ano
              em que você quer ir, as atividades, o tipo de cabine, o estilo a bordo e o que você recebe pelo
              dinheiro.
            </p>
            <p>
              Não existe um navio que seja o melhor. Quem diz que existe tem um navio para vender. Um navio para 200
              passageiros com academia, spa e uma ótima carta de vinhos é a resposta certa para um viajante e a
              errada para o próximo, que quer o máximo de tempo em terra num barco para 68 pessoas.
            </p>
            <p>
              Então primeiro fazemos perguntas. Depois mostramos as vantagens e desvantagens reais de cada opção e
              deixamos você escolher.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "custo",
    title: "Custo e valor",
    items: [
      {
        q: "Reservar pelo Destinos Polares custa mais caro?",
        a: (
          <>
            <p>Não. Esta é a resposta que eu quero que você leia duas vezes.</p>
            <p>
              Não cobramos taxa de planejamento. Não colocamos margem em cima do preço. Você paga o preço da
              operadora, o mesmo que pagaria ligando direto para ela. A nossa comissão vem da operadora, da margem
              dela, e não do seu bolso.
            </p>
            <p>
              Além disso, às vezes temos tarifas de grupo ou preços promocionais em algumas saídas que você não
              consegue direto. Então reservar com a gente custa o mesmo ou menos. Nunca custa mais.
            </p>
          </>
        ),
      },
      {
        q: "Por que reservar pelo Destinos Polares em vez de direto com a empresa de cruzeiro?",
        a: (
          <>
            <p>
              Ligue direto para uma operadora e você vai falar com um vendedor que representa uma empresa só. Ela tem
              quatro navios. Um desses quatro vai ser a sua resposta, não importa o que você pediu.
            </p>
            <p>
              Nós representamos doze operadoras e cerca de vinte navios. Se a viagem certa para você é com uma
              empresa que quase não vendemos, a gente diz.
            </p>
            <p>
              Você também ganha a preparação. Bagagem, enjoo, equipamento de fotografia, voos para Ushuaia, dias de
              folga, seguro viagem, como é de verdade a Passagem de Drake, quais atividades valem o custo extra. Essa
              ajuda continua depois da reserva e só termina quando você volta para casa.
            </p>
            <p>Mesmo preço. Mais opções. Respostas honestas.</p>
          </>
        ),
      },
      {
        q: "Quanto custa uma viagem à Antártica?",
        a: (
          <>
            <p>
              As nossas saídas começam em torno de US$ 5.995 e passam de US$ 30.000 nos roteiros mais longos, nas
              cabines melhores e nas viagens especiais, como Geórgia do Sul, Mar de Weddell ou Círculo Polar
              Antártico.
            </p>
            <p>
              O preço anunciado no site é o preço final, já com impostos, taxas portuárias e licenças. Os principais
              extras são o seguro viagem obrigatório, os seus voos, as gorjetas opcionais e as atividades pagas à
              parte, como caiaque, acampamento, mergulho ou stand up paddle.
            </p>
            <p>
              Você vê os preços e a disponibilidade atualizados na nossa página de{" "}
              <Link href="/datas-e-precos" className={a}>
                datas e preços
              </Link>
              .
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "pagamentos",
    title: "Pagamentos e depois da reserva",
    items: [
      {
        q: "Como funcionam os pagamentos das viagens à Antártica?",
        a: (
          <>
            <p>
              Na grande maioria das vezes você paga direto para a operadora. O seu cartão de crédito ou a sua
              transferência vai para a Quark, a Albatros ou a empresa que você reservou, e não para nós. A gente
              nunca toca no dinheiro.
            </p>
            <p>Há duas exceções.</p>
            <p>
              As nossas viagens em grupo e fretamentos. Nelas a Antarctica Travel Group é a organizadora, então o
              pagamento vem para nós.
            </p>
            <p>
              Algumas operadoras sediadas fora dos Estados Unidos. Transferir dinheiro para o exterior complica a vida
              de viajantes americanos, então em alguns casos recebemos o pagamento e repassamos para a operadora em
              seu nome. Avisamos antes quando isso acontece e por quê.
            </p>
            <p>Você sempre sabe quem vai receber o seu dinheiro antes de enviar.</p>
          </>
        ),
      },
      {
        q: "O que acontece depois que eu reservo um cruzeiro para a Antártica?",
        a: (
          <>
            <p>
              Você recebe uma confirmação da operadora com o código da reserva, a sua cabine e o cronograma de
              pagamentos. Se algo parecer errado, fale com a gente e resolvemos com eles.
            </p>
            <p>
              Daí em diante, ajudamos você com a papelada antes do embarque, os formulários médicos, o horário dos
              voos, as noites de hotel em Ushuaia ou Punta Arenas,{" "}
              <Link href="/o-que-levar" className={a}>
                a bagagem
              </Link>{" "}
              e as atividades que quiser incluir, como caiaque ou acampamento. A maioria das pessoas também entra no
              nosso grupo privado de WhatsApp e na comunidade do Facebook, onde dá para conversar com viajantes que
              já fizeram exatamente a viagem que você reservou.
            </p>
          </>
        ),
      },
      {
        q: "E se eu precisar cancelar ou mudar a viagem?",
        a: (
          <>
            <p>
              As regras de cancelamento e reembolso são da operadora, não nossas. Cada operadora tem a sua política, e
              você vê antes de pagar o sinal. Leia.
            </p>
            <p>
              Se algo der errado, defendemos você junto à operadora. Temos relacionamento com essas empresas e usamos
              isso. Vale mais do que um email padrão de uma central de atendimento.
            </p>
            <p>Nos nossos fretamentos, cuidamos de tudo diretamente.</p>
          </>
        ),
      },
      {
        q: "Vocês vendem seguro viagem?",
        a: (
          <>
            <p>Não, e é de propósito.</p>
            <p>
              Toda operadora polar exige seguro viagem com cobertura de evacuação médica. Não é opcional. Mas, no
              momento em que eu ganho comissão sobre a sua apólice, o meu conselho sobre ela deixa de ser isento.
              Então não vendemos seguro e não indicamos uma empresa só.
            </p>
            <p>
              Dizemos quais limites de cobertura a operadora exige e o que observar nas letras miúdas. Você compra de
              quem quiser.
            </p>
          </>
        ),
      },
      {
        q: "O Destinos Polares reserva voos?",
        a: (
          <>
            <p>Não. Mas ajudamos você a escolher.</p>
            <p>
              Há dois motivos para não fazermos a reserva em si. O primeiro é o que acontece quando algo dá errado. Se
              um voo atrasar ou for cancelado, você quer a passagem no seu nome, para ir ao balcão da companhia ou
              ligar para a central e remarcar na hora. Com a gente no meio, você fica esperando alguém que pode estar
              dormindo em outro fuso horário às quatro da manhã enquanto a sua conexão se perde. O segundo motivo são
              as suas milhas. Reservando você mesmo, os pontos são seus.
            </p>
            <p>
              Então mande as suas datas e o seu aeroporto de origem. Dizemos qual rota funciona, quanto tempo de folga
              deixar antes de o navio partir e quais conexões a gente não arriscaria.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "grupos-e-proximos-passos",
    title: "Viagens em grupo, provas e próximos passos",
    items: [
      {
        q: "O Destinos Polares organiza viagens em grupo para a Antártica?",
        a: (
          <>
            <p>
              Sim. A Antarctica Travel Group organiza{" "}
              <Link href="/viagens-em-grupo" className={a}>
                saídas em grupo e fretamentos de navio inteiro
              </Link>{" "}
              todas as temporadas.
            </p>
            <p>
              Numa viagem em grupo, você navega com pessoas da nossa equipe a bordo e com um grupo de viajantes que
              reservou com a gente. Você tem a equipe de expedição do navio e mais a nossa. Cerca de metade dos
              viajantes dos nossos grupos vai sozinha, e isso explica boa parte de por que eles lotam. Ninguém se sente
              deslocado.
            </p>
            <p>
              Os fretamentos são a versão maior. Ficamos com o navio inteiro e montamos o roteiro e as atividades nós
              mesmos.
            </p>
          </>
        ),
      },
      {
        q: "Onde eu leio avaliações sobre vocês?",
        a: (
          <>
            <p>
              A maior parte do que as pessoas dizem sobre nós acontece no nosso grupo do Facebook e em conversas
              particulares. Crescemos pelo boca a boca e por viajantes que voltam, não por anúncios. Muitos clientes
              nos acharam por uma indicação num grupo de viagem.
            </p>
            <p>
              As avaliações de viajantes estão na nossa{" "}
              <Link href="/avaliacoes" className={a}>
                página de avaliações
              </Link>
              . A nossa{" "}
              <a href={FACEBOOK_GROUP} className={a} target="_blank" rel="noopener noreferrer">
                comunidade no Facebook
              </a>{" "}
              é pública, então você pode ler o que as pessoas postam sobre as viagens sem ninguém filtrar antes.
            </p>
          </>
        ),
      },
      {
        q: "Como eu confiro a empresa ou falo com uma pessoa de verdade?",
        a: (
          <>
            <p>De três jeitos.</p>
            <p>
              Consulte o registro 2166968-70 na{" "}
              <a href={CA_SEARCH} className={a} target="_blank" rel="noopener noreferrer">
                busca oficial do Procurador-Geral da Califórnia
              </a>
              .
            </p>
            <p>
              Leia as nossas avaliações e percorra a{" "}
              <a href={FACEBOOK_GROUP} className={a} target="_blank" rel="noopener noreferrer">
                comunidade da Antarctica Travel Group no Facebook
              </a>
              .
            </p>
            <p>
              Mande uma mensagem e pergunte o que quiser. Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={a}>
                {CONTACT_EMAIL}
              </a>
              . Também respondemos pelo{" "}
              <a href={WHATSAPP} className={a} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              .
            </p>
            <p>
              Não temos horário fixo de atendimento. A equipe está espalhada por vários fusos horários, então quase
              sempre tem alguém por perto. Se você escrever num horário estranho e ninguém responder na hora, a
              resposta chega logo.
            </p>
          </>
        ),
      },
      {
        q: "Vocês ajudam quem vai viajar sozinho?",
        a: (
          <>
            <p>Sim, e você vai estar bem acompanhado. Cerca de metade das pessoas nas nossas saídas em grupo viaja sozinha.</p>
            <p>
              Alguns navios têm cabines individuais. Outros dispensam ou reduzem a taxa de ocupação individual em
              algumas saídas. Alguns colocam você com uma pessoa do mesmo gênero para dividir a cabine, e aí você paga
              a tarifa normal. Conte o seu orçamento e achamos as saídas em que o preço para quem viaja sozinho
              realmente compensa.
            </p>
          </>
        ),
      },
      {
        q: "Qual é o primeiro passo?",
        a: (
          <>
            <p>
              Preencha o{" "}
              <Link href="/pedido-de-viagem" className={a}>
                formulário de pedido de viagem
              </Link>{" "}
              ou fale com a gente. Leva dois minutos. Voltamos com opções reais que combinam com as suas datas, o seu
              orçamento e o que você quer de verdade da viagem.
            </p>
            <p>Sem sinal, sem pressão, sem compromisso.</p>
          </>
        ),
      },
    ],
  },
];

function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] ${
        light ? "text-[#7fd3ea]" : "text-primary"
      }`}
    >
      <span className={`h-0.5 w-5 ${light ? "bg-[#7fd3ea]" : "bg-accent"}`} aria-hidden="true" />
      {children}
    </p>
  );
}

function Iaato() {
  return (
    <p className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-primary">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={IAATO} alt="" className="h-6 w-6" loading="lazy" />
      Guia qualificado pela IAATO
    </p>
  );
}

const btn = "inline-block rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark";
const btnGhost =
  "inline-block rounded-md border border-border bg-white px-6 py-3 font-semibold text-primary hover:border-accent hover:text-accent";

export default function SobrePage() {
  return (
    <>
      {/* Abertura */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
        <div>
          <div className="flex items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${UP}/2024/11/atg-logo-no-bg-300x300.png`} alt="Antarctica Travel Group" className="h-20 w-20" />
            <span className="h-14 w-px bg-border" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-destinos-polares.svg" alt="Destinos Polares" className="h-10 w-auto" />
          </div>
          <h1 className="mt-8 text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
            Sobre a Antarctica Travel Group e o Destinos Polares
          </h1>
          <p className="mt-6 text-2xl leading-snug text-primary">
            Se você procura a <strong>Antarctica Travel Group (ATG)</strong>, está no lugar certo.{" "}
            <strong>O Destinos Polares é a ATG em português.</strong>
          </p>
          <p className="mt-4 text-lg text-muted-foreground">Mesma equipe. Mesmo Neill. Mesmo grupo no Facebook.</p>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-foreground">
            <p>
              A Antarctica Travel Group continua sendo a empresa, tocada pelas mesmas pessoas, e continua sendo o nome
              da{" "}
              <a href={FACEBOOK_GROUP} className={a} target="_blank" rel="noopener noreferrer">
                comunidade de 54.000 pessoas
              </a>{" "}
              de onde ela nasceu. A Let&apos;s Go Polar é a divisão de reservas, criada para atender os dois polos com
              um nome só. O Destinos Polares é a mesma empresa falando português.
            </p>
            <p>Nunca vamos deixar de ser a Antarctica Travel Group. São as nossas raízes e é quem nós somos.</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/pedido-de-viagem" className={btn}>
              Começar meu pedido de viagem
            </Link>
            <a href="#somos-confiaveis" className={btnGhost}>
              Somos confiáveis? Confira você mesmo
            </a>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Leva uns dois minutos. Uma pessoa de verdade responde em até um dia útil.
          </p>
        </div>
        <figure className="overflow-hidden rounded-2xl shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${UP}/2026/08/PXL_20231212_120125083-1024x576.jpg`}
            alt="Neill, Ricardo e Bella juntos no gelo na Antártica"
            className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:aspect-[4/5]"
          />
        </figure>
      </section>

      {/* Números */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-surface-muted md:grid-cols-4">
          {NUMBERS.map(([value, label]) => (
            <div key={label} className="border-border p-5 odd:border-r md:border-r md:last:border-r-0 [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0">
              <dt className="text-3xl font-extrabold text-primary">{value}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Atalhos */}
      <nav className="border-y border-border bg-[#eef7fb]" aria-label="Nesta página">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Ir para</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2 sm:gap-3">
            {JUMP.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="inline-block rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent sm:px-6 sm:text-base">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mensagem do fundador */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="rounded-2xl bg-surface-muted p-7 sm:p-9">
          <div className="space-y-4 text-[17px] leading-relaxed text-foreground">
            <p>
              Criei aquele grupo no Facebook para não perder contato com algumas pessoas com quem viajei. Eu não estava
              montando uma empresa. Cinquenta e quatro mil de vocês transformaram o grupo em uma.
            </p>
            <p>
              Graças a esse grupo, tive a chance de contratar pessoas que trabalham com o que amam. A minha esposa e o
              meu melhor amigo fazem parte da equipe que me apoia todos os dias, e isso ainda parece mentira. Mais de
              dois mil e quinhentos de vocês já reservaram uma viagem polar com esta equipe.
            </p>
            <p>Obrigado. A empresa é tão sua quanto minha.</p>
          </div>
          <p className="mt-6 font-bold text-primary">Neill Drake</p>
          <p className="text-sm text-muted-foreground">Fundador da Antarctica Travel Group e do Destinos Polares</p>
        </div>
        <div>
          <VideoFacade
            id="fwOVmNI25WI"
            title="Uma mensagem do fundador, Neill Drake"
            poster={`${UP}/2026/08/me-6474-1024x715.jpg`}
          />
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Dois minutos do Neill, em inglês, sobre quem somos. O vídeo só carrega do YouTube quando você aperta o play.
          </p>
        </div>
      </section>

      {/* Equipe */}
      <section id="equipe" className="scroll-mt-36 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Kicker>As pessoas</Kicker>
          <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">Conheça a equipe</h2>
          <p className="mt-4 max-w-2xl text-[17px] text-foreground">
            Uma equipe pequena, mas poderosa, de sete pessoas. São elas que cuidam de você, do primeiro email até o dia
            em que você volta para casa.
          </p>

          <div className="mt-10 grid gap-6 border-b border-border pb-10 sm:grid-cols-[250px_1fr] sm:gap-9">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FOUNDER.photo} alt={`${FOUNDER.name}, fundador da Antarctica Travel Group`} loading="lazy" className="aspect-square w-full max-w-[250px] rounded-xl object-cover" />
            <div>
              <h3 className="text-3xl font-bold text-primary">{FOUNDER.name}</h3>
              <p className="mt-2 font-semibold text-foreground">{FOUNDER.role}</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">{FOUNDER.bio}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{FOUNDER.place}</p>
              <Iaato />
            </div>
          </div>

          <ul className="grid gap-x-12 sm:grid-cols-2">
            {TEAM.map((p) => (
              <li key={p.name} className="flex gap-5 border-b border-border py-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.photo} alt={p.name} loading="lazy" className="h-24 w-24 shrink-0 rounded-xl object-cover sm:h-28 sm:w-28" />
                <div>
                  <h3 className="text-lg font-bold text-primary">{p.name}</h3>
                  <p className="text-sm font-semibold text-foreground">{p.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{p.place}</p>
                  {p.iaato && <Iaato />}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-muted px-7 py-6">
            <p className="font-semibold text-primary">São essas as pessoas que leem o seu pedido de viagem.</p>
            <Link href="/pedido-de-viagem" className={btn}>
              Começar meu pedido de viagem
            </Link>
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Como falar com a gente</p>
            <dl className="mt-4 grid gap-x-12 sm:grid-cols-2">
              {[
                ["Email", CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`],
                ["WhatsApp", "+55 41 98820-3015", WHATSAPP],
                ["Podcast The Drake Shake", "info@thedrakeshake.com", "mailto:info@thedrakeshake.com"],
                ["Formulário", "Pedido de viagem", "/pedido-de-viagem"],
              ].map(([label, value, href]) => (
                <div key={label} className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-3">
                  <dt className="font-semibold text-primary">{label}</dt>
                  <dd>
                    <a href={href} className="text-accent hover:underline" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Comunidade */}
      <section className="bg-gradient-to-br from-[#032234] to-[#0a4a6a] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-5xl font-extrabold text-[#2ec4e6]">54.000+</p>
            <h3 className="mt-3 text-3xl font-semibold leading-tight">O grupo que construiu a empresa está aberto para você</h3>
            <p className="mt-4 leading-relaxed text-white/80">
              Se você não nos conheceu pela Antarctica Travel Group no Facebook, venha participar. É um coletivo de
              viajantes polares, de quem já foi e de quem ainda vai, que compartilham o que sabem, fazem as perguntas
              que você está prestes a fazer, postam fotos e distribuem dicas e inspiração o dia inteiro.
            </p>
            <a
              href={FACEBOOK_GROUP}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#1877f2] px-6 py-3 font-semibold text-white hover:bg-[#0f63d1]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
              </svg>
              Entrar no grupo do Facebook
            </a>
            <p className="mt-3 text-sm text-white/60">É grátis, e ninguém precisa reservar nada.</p>
          </div>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${UP}/2025/02/atg-group-photo.png`}
              alt="Um grupo de viajantes da Antarctica Travel Group juntos no gelo"
              loading="lazy"
              className="w-full rounded-2xl object-cover"
            />
            <figcaption className="mt-2 text-sm text-white/60">Membros da comunidade juntos no gelo.</figcaption>
          </figure>
        </div>
      </section>

      {/* História */}
      <section id="historia" className="scroll-mt-36">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Kicker>Nossa história</Kicker>
          <h2 className="mt-3 max-w-xl text-3xl font-bold text-primary sm:text-4xl">
            De um grupo no Facebook a 54.000 membros
          </h2>
          <p className="mt-4 text-[17px] text-foreground">
            Ninguém planejou esta empresa. A versão mais curta e honesta dela são três pessoas.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STORY.map((s) => (
              <article key={s.title} className="overflow-hidden rounded-2xl border border-border bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.photo} alt={s.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-primary">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-8 rounded-2xl bg-surface-muted p-7 sm:p-9 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <h3 className="text-xl font-bold text-primary">Uma equipe pequena, mas poderosa, de sete pessoas</h3>
              <p className="mt-3 leading-relaxed text-foreground">
                Muita gente diz que a empresa onde trabalha parece uma família. A nossa é mesmo. A esposa do fundador
                cuida do relacionamento com os viajantes, e o melhor amigo dele cuida da logística. A comunidade nos
                deu a chance de contratar o resto da equipe pelo mundo e de ir além da Antártica, até o Ártico. Foi por
                isso que nasceu a Let&apos;s Go Polar. Já são mais de 20 viagens em grupo.
              </p>
              <p className="mt-3 leading-relaxed text-foreground">
                O Neill conta a versão longa no{" "}
                <Link href="/the-drake-shake" className={a}>
                  podcast The Drake Shake
                </Link>
                . Ou deixe a gente de lado e leia{" "}
                <Link href="/avaliacoes" className={a}>
                  o que os viajantes dizem quando voltam
                </Link>
                .
              </p>
            </div>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${UP}/2025/06/SvalbardCR1-76-768x512.jpg`}
                alt="Um viajante observa a costa de Svalbard com binóculos do convés de um navio"
                loading="lazy"
                className="w-full rounded-xl object-cover"
              />
              <figcaption className="mt-2 text-sm text-muted-foreground">
                Svalbard. O outro extremo do planeta onde trabalhamos.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section id="vantagens" className="scroll-mt-36 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">Por que reservar com a gente</h2>
          <div className="mt-5 max-w-3xl space-y-4 text-[17px] leading-relaxed text-foreground">
            <p>
              Para os padrões do setor, somos uma empresa pequena. Também somos uma equipe poderosa, e trabalhamos com
              as operadoras que fazem expedições de verdade.
            </p>
            <p>
              Do momento em que você decide ir para a Antártica até depois da volta, a gente cuida de tudo. Acionamos
              contatos no mundo todo para a viagem dar certo e respondemos tudo antes do seu voo.
            </p>
            <p>
              Os guias a bordo nos dizem que os nossos viajantes chegam mais preparados que os de qualquer outro lugar.
              É disso que temos mais orgulho.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "O fundador continua guiando",
                body: <>São mais de 1.000 dias guiando na Antártica, e o Neill continua indo. Quando você pergunta como são os desembarques ou quanto a Passagem de Drake balança, a resposta vem de alguém que já esteve naquele convés, e não de um roteiro de vendas.</>,
              },
              {
                title: "Não custa nada para você",
                body: <>Sem taxa de reserva, sem taxa de planejamento, sem taxa de serviço. A operadora nos paga depois da viagem. As operadoras também mandam para as agências ofertas que nunca publicam, então às vezes igualamos o preço que você achou e às vezes ficamos abaixo.</>,
              },
              {
                title: "Doze operadoras, uma busca",
                body: (
                  <>
                    Reservamos com doze operadoras, então ninguém aqui está empurrando você para o único navio que tem.
                    Pesquise{" "}
                    <Link href="/datas-e-precos" className={a}>
                      todas as viagens que vendemos
                    </Link>{" "}
                    ou veja{" "}
                    <Link href="/operadoras" className={a}>
                      as operadoras e os navios com que trabalhamos
                    </Link>
                    .
                  </>
                ),
              },
              {
                title: "Uma comunidade, não um cadastro de clientes",
                body: <>Cerca de metade das pessoas nas nossas viagens em grupo chega sozinha e volta com amigos. Por trás disso, mais de vinte viagens em grupo da ATG e 54.000 pessoas no grupo do Facebook.</>,
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-white p-6">
                <h3 className="text-lg font-bold text-primary">{c.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[17px] text-foreground">
            As respostas mais longas estão nas perguntas frequentes, sobre por que{" "}
            <Link href="/perguntas-frequentes/reservar-antartica-com-agente-custa-mais" className={a}>
              reservar com a gente custa o mesmo que reservar direto
            </Link>{" "}
            e{" "}
            <Link href="/perguntas-frequentes/por-que-usar-agente-de-viagens-para-a-antartica" className={a}>
              por que as pessoas usam um agente para esta viagem
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Avaliações */}
      <section id="avaliacoes" className="scroll-mt-36 bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Kicker>Nossas avaliações</Kicker>
          <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">O que os viajantes dizem da reserva com a gente</h2>
          <p className="mt-2 text-sm text-muted-foreground">Reservaram com a Antarctica Travel Group (Let&apos;s Go Polar)</p>
          <ul className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
            {REVIEWS.map(([quote, name, trip]) => (
              <li key={name} className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-border bg-white p-6 sm:w-[340px]">
                <span className="text-[#f5b301]" aria-label="5 de 5 estrelas">
                  ★★★★★
                </span>
                <blockquote className="mt-3 flex-1 leading-relaxed text-foreground">&ldquo;{quote}&rdquo;</blockquote>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">{name[0]}</span>
                  <div>
                    <p className="font-semibold text-primary">{name}</p>
                    <p className="text-sm text-muted-foreground">{trip}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">Arraste para o lado para ver mais</p>
          <Link href="/avaliacoes" className={`${btn} mt-6`}>
            Ler todas as avaliações
          </Link>
        </div>
      </section>

      {/* Perguntas frequentes */}
      <section id="somos-confiaveis" className="scroll-mt-36">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Kicker>Perguntas frequentes</Kicker>
          <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">Somos confiáveis? Perguntas frequentes</h2>
          <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-foreground">
            Antes de entregar dinheiro a qualquer agência de viagens por uma viagem à Antártica, você precisa saber com
            quem está lidando. Aqui está tudo o que as pessoas nos perguntam, respondido sem rodeios.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Registro na Califórnia 2166968-70. Travel Consumer Restitution Corporation 710090.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
            <nav aria-label="Temas das perguntas" className="lg:sticky lg:top-36 lg:self-start">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Nesta seção</p>
              <ul className="mt-3 space-y-2 text-sm">
                {FAQ.map((g) => (
                  <li key={g.id}>
                    <a href={`#${g.id}`} className="text-primary hover:text-accent">
                      {g.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-12">
              {FAQ.map((g) => (
                <section key={g.id} id={g.id} className="scroll-mt-36">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">{g.title}</p>
                  <div className="mt-4 space-y-4">
                    {g.items.map((f) => (
                      <article key={f.q} className="rounded-2xl border border-border bg-white p-6">
                        <h3 className="text-lg font-bold text-primary">{f.q}</h3>
                        <div className="mt-3 space-y-3 leading-relaxed text-foreground">{f.a}</div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-muted px-7 py-6">
                <p className="font-semibold text-primary">Ainda tem uma dúvida? Pergunte para uma pessoa.</p>
                <Link href="/pedido-de-viagem" className={btn}>
                  Começar meu pedido de viagem
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fechamento */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl bg-primary p-8 text-center text-white sm:p-12">
          <h2 className="text-3xl font-bold">Conte o que você espera da viagem</h2>
          <p className="mx-auto mt-2 max-w-lg text-white/80">Leva uns dois minutos. Uma pessoa de verdade responde em até um dia útil.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/pedido-de-viagem" className="rounded-md bg-accent px-6 py-3 font-semibold hover:bg-accent-dark">
              Começar meu pedido de viagem
            </Link>
            <Link href="/datas-e-precos" className="rounded-md border-2 border-white/80 px-6 py-3 font-semibold hover:bg-white/10">
              Ver as saídas
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/70">
            Ou comece pelas{" "}
            <Link href="/perguntas-frequentes" className="font-semibold text-white underline">
              perguntas polares, respondidas pela equipe
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
