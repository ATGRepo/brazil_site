import type { Metadata } from "next";
import Link from "next/link";

// Fatos da Antarctica Travel Group tirados da base de conhecimento da Let's Go
// Polar (letsgopolar-desk), entradas verificadas em kb/company-and-service:
// atg-and-lets-go-polar-brand.md, company-milestones.md,
// credentials-and-legal-entity.md e why-use-a-travel-agent.md.
// Regras dessas entradas que valem aqui:
// - nunca escrever "licenciada";
// - não usar a expressão "Seller of Travel" nesta página, só o número do registro;
// - não publicar o número de fretamentos de navio inteiro;
// - contagens de pessoas como "mais de", nunca número exato;
// - "guias dizem que nossos viajantes chegam mais preparados" é relato, não estatística.

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "O Destinos Polares é uma marca Antarctica Travel Group, empresa fundada por Neill Drake, guia na Antártica desde 2016. Conheça a equipe e como trabalhamos.",
};

const NUMBERS = [
  ["Mais de 5.000", "viajantes enviados à Antártica e ao Ártico"],
  ["Mais de 54 mil", "membros na comunidade da Antarctica Travel Group no Facebook"],
  ["Mais de 1.000", "dias que o Neill passou guiando na Antártica"],
  ["Mais de 20", "viagens em grupo organizadas pela própria ATG"],
];

const TEAM = [
  { name: "Neill Drake", role: "Fundador", place: "San Diego, Califórnia" },
  { name: "Ricardo Nisiide", role: "Na equipe desde o começo", place: "Curitiba, Brasil" },
  { name: "Izabela (Bella) Hudson", role: "Cuidado antes e depois da viagem", place: "San Diego, Califórnia" },
  { name: "Muneeba Asghar", role: "Director of Getting Stuff Done", place: "Paquistão" },
  { name: "Nikki Souza", role: "Polar Dream Coordinator", place: "“Uma filha da Terra”" },
  { name: "Chelsea Betancourt", role: "Polar Dream Coordinator", place: "Ramona, Califórnia" },
];

const OPERATORS = [
  "Quark Expeditions",
  "Polar Latitudes",
  "Poseidon Expeditions",
  "Antarctica21",
  "Aurora Expeditions",
  "Oceanwide Expeditions",
  "Swan Hellenic",
  "G Adventures",
  "Antarpply",
  "Terra Nova",
  "Arctic Tern",
];

export default function SobrePage() {
  return (
    <>
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Sobre nós</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            O Destinos Polares é uma marca Antarctica Travel Group.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            A mesma equipe, a mesma experiência e as mesmas viagens da Antarctica Travel Group e da Let&apos;s Go
            Polar, agora em português. A gente não opera navios. A gente conhece os navios, as operadoras e os
            roteiros, e ajuda você a escolher a expedição certa.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-surface-muted">
        <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
          {NUMBERS.map(([value, label]) => (
            <div key={label} className="border-l-2 border-accent pl-4">
              <dt className="text-3xl font-extrabold text-primary">{value}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <section>
          <h2 className="text-2xl font-bold text-primary">Como começou</h2>
          <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-foreground">
            <p>
              O Neill Drake foi à Antártica pela primeira vez em 2015, como passageiro. Voltou outras vezes, ainda
              como passageiro, até decidir que o trabalho nas regiões polares era o futuro dele. Começou a guiar
              expedições e guia na Antártica desde 2016. Já são mais de 1.000 dias no continente.
            </p>
            <p>
              Depois da primeira expedição, o Neill criou um grupo no Facebook para manter contato com os amigos que
              fez a bordo. O grupo cresceu sozinho e virou a comunidade da Antarctica Travel Group, com mais de 54
              mil membros: gente que já foi e gente que quer ir aos polos, trocando dicas, fotos e respostas.
            </p>
            <p>
              Também em 2015, nas Cataratas do Iguaçu, o Neill conheceu o Ricardo Nisiide. O Ricardo tinha um
              hostel por lá, e o Neill estava transformando uma Kombi em motorhome. Viraram melhores amigos, e o
              Ricardo entrou para a empresa logo no começo. Hoje ele trabalha de Curitiba. O Neill diz que o
              Ricardo foi fundamental e que não teria chegado até aqui sem o amigo.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-primary">Uma empresa, três nomes</h2>
          <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-foreground">
            <p>
              A Antarctica Travel Group é a empresa e o nome da comunidade. A Let&apos;s Go Polar é a divisão de
              reservas, criada para atender os dois polos, Antártica e Ártico, com um nome só. O Destinos Polares
              é a mesma empresa falando português.
            </p>
            <p>
              Se você chegou aqui depois de procurar por Antarctica Travel Group ou por Let&apos;s Go Polar, achou
              a mesma equipe.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-primary">A equipe</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-foreground">
            Uma equipe pequena, espalhada pelo mundo. Todo mundo volta às regiões polares todo
            ano, em navios diferentes e com operadoras diferentes. É daí que vem a comparação que a gente faz
            entre elas.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {TEAM.map((person) => (
              <li key={person.name} className="rounded-xl border border-border bg-white p-4">
                <p className="font-semibold text-primary">{person.name}</p>
                <p className="text-sm text-foreground">{person.role}</p>
                <p className="mt-1 text-xs text-muted-foreground">{person.place}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-primary">Como a gente trabalha</h2>
          <ul className="mt-4 space-y-4 text-[17px] leading-relaxed text-foreground">
            <li>
              <strong className="text-primary">Você paga o mesmo preço da operadora.</strong> Não cobramos taxa e não
              colocamos comissão em cima do preço. Às vezes conseguimos um preço melhor ou extras, como crédito a
              bordo.
            </li>
            <li>
              <strong className="text-primary">O pagamento vai, em geral, direto para a operadora.</strong> As
              exceções são as nossas viagens em grupo e algumas operadoras sediadas fora dos Estados Unidos, em que
              recebemos e repassamos o pagamento. Você sempre fica sabendo antes.
            </li>
            <li>
              <strong className="text-primary">Não vendemos passagens aéreas, mas ajudamos você a escolher.</strong>{" "}
              Com a passagem no seu nome, você fala direto com a companhia aérea se um voo atrasar ou for
              cancelado, e ainda acumula milhas.
            </li>
            <li>
              <strong className="text-primary">Não vendemos seguro viagem</strong>, para que a nossa recomendação
              continue isenta. As operadoras exigem seguro com cobertura de evacuação médica.
            </li>
            <li>
              <strong className="text-primary">Acompanhamos você do começo ao fim.</strong> Da escolha da viagem até
              depois da volta: o que levar, gorjetas, equipamento e todas as dúvidas antes do embarque. Os guias a
              bordo costumam nos dizer que os nossos viajantes chegam mais preparados que os outros.
            </li>
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-primary">Operadoras parceiras</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-foreground">
            Trabalhamos com operadoras de navios de expedição de verdade. Entre elas:
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {OPERATORS.map((op) => (
              <li key={op} className="rounded-full border border-border px-3 py-1 text-sm text-primary">
                {op}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 rounded-xl border border-border bg-surface-muted p-6">
          <h2 className="text-lg font-bold text-primary">Dados da empresa</h2>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
            <dt className="text-muted-foreground">Empresa</dt>
            <dd className="text-foreground">Antarctica Travel Group, Inc., San Diego, Califórnia, Estados Unidos</dd>
            <dt className="text-muted-foreground">Fundador e proprietário</dt>
            <dd className="text-foreground">Neill Drake</dd>
            <dt className="text-muted-foreground">Registro no estado da Califórnia</dt>
            <dd className="text-foreground">2166968-70</dd>
            <dt className="text-muted-foreground">Travel Consumer Restitution Corporation</dt>
            <dd className="text-foreground">710090</dd>
          </dl>
        </section>

        <div className="mt-14 rounded-2xl bg-primary p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Vamos planejar a sua expedição?</h2>
          <p className="mx-auto mt-2 max-w-lg text-white/80">
            Conte o que você procura. A gente responde por email com as opções que fazem sentido para você.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/datas-e-precos" className="rounded-md border-2 border-white/80 px-5 py-3 font-semibold hover:bg-white/10">
              Ver datas e preços
            </Link>
            <Link href="/contato" className="rounded-md bg-accent px-5 py-3 font-semibold hover:bg-accent-dark">
              Fale com a gente
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
