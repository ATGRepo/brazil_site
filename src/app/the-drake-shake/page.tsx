import { ArticleView, articleMetadata } from "@/components/article-view";
import { ARTICLES } from "@/lib/lgp/content-pages";

export const revalidate = 3600;

export function generateMetadata() {
  return articleMetadata(ARTICLES.drakeShake);
}

export default function Page() {
  return <ArticleView source={ARTICLES.drakeShake} />;
}
