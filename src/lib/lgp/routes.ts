// Endereços da Let's Go Polar e a página equivalente no Destinos Polares.
// Usado para trocar os links dentro dos textos copiados de letsgopolar.com.

export const LGP_HOST = "letsgopolar.com";

// Caminho em letsgopolar.com (sem barra final) -> caminho aqui.
export const PAGE_ROUTES: Record<string, string> = {
  "": "/",
  "/dates-and-rates": "/datas-e-precos",
  "/polar-quiz": "/datas-e-precos",
  "/faq": "/perguntas-frequentes",
  "/about-us": "/sobre",
  "/testimonials": "/depoimentos",
  "/guest-reviews": "/avaliacoes",
  "/contact-us": "/contato",
  "/trip-request-form": "/pedido-de-viagem",
  "/current-promotions": "/promocoes",
  "/vip-deals-list": "/lista-vip",
  "/newsletter": "/contato#newsletter",
  "/atg-giveaway": "/sorteio-atg",
  "/all-ships": "/navios",
  "/all-companies": "/operadoras",
  "/learn-about-drake-passage": "/passagem-de-drake",
  "/blog": "/blog",
  "/citizen-science-program": "/ciencia-cidada",
  "/how-to-pack-for-arctic-and-antarctica": "/o-que-levar",
  "/the-drake-shake": "/the-drake-shake",
  "/specialty-trips-antarctica/atg-charter": "/viagens-em-grupo",
};

// Recebe um href de letsgopolar.com e devolve o link equivalente aqui, ou o
// próprio href quando não há página equivalente (arquivos, páginas não clonadas).
export function localHref(href: string, faqSlug?: (lgpSlug: string) => string | undefined, postSlugs?: Set<string>) {
  let url: URL;
  try {
    url = new URL(href, `https://${LGP_HOST}`);
  } catch {
    return href;
  }
  if (url.hostname !== LGP_HOST && url.hostname !== `www.${LGP_HOST}`) return href;
  if (url.pathname.startsWith("/wp-content/")) return url.toString();
  const path = url.pathname.replace(/\/+$/, "");
  const hash = url.hash;

  const trip = path.match(/^\/(?:all-trips|antarctic-trips)\/([a-z0-9-]+)$/);
  if (trip) return `/viagens/${trip[1]}${hash}`;
  const faq = path.match(/^\/faqs\/([a-z0-9-]+)$/);
  if (faq) {
    const pt = faqSlug?.(faq[1]);
    return pt ? `/perguntas-frequentes/${pt}` : "/perguntas-frequentes";
  }
  if (path in PAGE_ROUTES) return PAGE_ROUTES[path] + hash;
  const post = path.match(/^\/([a-z0-9-]+)$/);
  if (post && postSlugs?.has(post[1])) return `/blog/${post[1]}${hash}`;
  return url.toString();
}
