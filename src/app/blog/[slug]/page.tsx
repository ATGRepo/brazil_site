import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslatedArticle } from "@/lib/lgp/content-pages";

export const revalidate = 3600;

function source(slug: string) {
  return { slug, type: "posts" as const };
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) return {};
  const post = await getTranslatedArticle(source(slug));
  return post ? { title: post.title } : {};
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  const post = await getTranslatedArticle(source(slug));
  if (!post) notFound();
  const hasTitle = /^\s*<h1/.test(post.html);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/blog" className="text-sm font-medium text-accent hover:underline">
        ← Blog: dicas e truques
      </Link>
      {!hasTitle && <h1 className="mt-4 text-4xl font-extrabold leading-tight text-primary">{post.title}</h1>}
      <div className="lgp-html lgp-article mt-6" dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
}
