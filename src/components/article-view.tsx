import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslatedArticle, type ArticleSource } from "@/lib/lgp/content-pages";

// Página de texto clonada de letsgopolar.com, já traduzida.
// O HTML passa por cleanArticle (só tags de texto, links trocados) e trHtml.
export async function ArticleView({
  source,
  children,
  wide = false,
}: {
  source: ArticleSource;
  children?: React.ReactNode;
  wide?: boolean;
}) {
  const article = await getTranslatedArticle(source);
  if (!article) notFound();
  return (
    <div className={`mx-auto px-4 py-12 sm:px-6 ${wide ? "max-w-5xl" : "max-w-3xl"}`}>
      <div className="lgp-html lgp-article" dangerouslySetInnerHTML={{ __html: article.html }} />
      {children}
    </div>
  );
}

export async function articleMetadata(source: ArticleSource, description?: string): Promise<Metadata> {
  const article = await getTranslatedArticle(source);
  return article ? { title: article.title, description } : {};
}
