import type { Metadata } from "next";
import { getTestimonials } from "@/lib/lgp/fleet";
import { tr } from "@/lib/lgp/translate";
import { PageHero } from "@/components/trip-mini-card";
import { REGION_PT } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Depoimentos",
  description: "O que os viajantes dizem sobre o atendimento da nossa equipe.",
};

export default async function TestimonialsPage() {
  const quotes = await getTestimonials();
  return (
    <>
      <PageHero eyebrow="Sobre nós" title="Depoimentos">
        <p>O que os viajantes dizem sobre o atendimento da nossa equipe. Os textos foram traduzidos do inglês.</p>
      </PageHero>
      <div className="mx-auto max-w-5xl columns-1 gap-6 px-4 py-12 sm:px-6 md:columns-2">
        {quotes.map((q) => (
          <blockquote key={q.slug} className="mb-6 break-inside-avoid rounded-xl border border-border bg-white p-6">
            <div className="space-y-3 text-[15px] leading-relaxed text-foreground">
              {q.text
                .split(/\n\s*\n/)
                .filter((p) => p.trim())
                .map((p, i) => (
                  <p key={i}>{tr(p)}</p>
                ))}
            </div>
            <footer className="mt-4">
              <p className="font-semibold text-primary">{q.person}</p>
              <p className="text-sm text-muted-foreground">
                {REGION_PT[q.region] ?? q.region} · {q.ship} · {q.year}
              </p>
            </footer>
          </blockquote>
        ))}
      </div>
    </>
  );
}
