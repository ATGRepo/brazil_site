import type { Metadata } from "next";
import Link from "next/link";
import { getLgpPosts } from "@/lib/lgp/article";
import { tr } from "@/lib/lgp/translate";
import { PageHero } from "@/components/trip-mini-card";
import { formatDate } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog: dicas e truques",
  description: "Dicas para planejar a sua expedição à Antártica e ao Ártico.",
};

export default async function BlogPage() {
  const posts = await getLgpPosts();
  return (
    <>
      <PageHero eyebrow="Guia de viagem polar" title="Blog: dicas e truques" />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white hover:border-accent"
          >
            <div className="relative overflow-hidden aspect-[16/9] bg-surface-muted">
              {post.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              {post.date && <p className="text-xs text-muted-foreground">{formatDate(post.date.slice(0, 10))}</p>}
              <h2 className="mt-1 text-lg font-bold leading-snug text-primary group-hover:text-accent">{tr(post.title)}</h2>
              {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{tr(post.excerpt)}</p>}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
