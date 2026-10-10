import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getAchievements() {
  return prisma.achievement.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }, { createdAt: "desc" }],
  });
}

export default async function AchievementsPage() {
  const achievements = await getAchievements();
  const featured = achievements.filter((item) => item.featured);

  return (
    <main className="min-h-screen bg-[#f8f5f1] text-[#171315]">
      <section className="relative overflow-hidden border-b border-black/5 px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8f1239]">Achievements & Recognition</p>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-6xl">A journey of words,<br /><span className="text-[#8f1239]">milestones & moments</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-black/55 sm:text-lg">A curated record of recognitions, literary milestones, cultural appearances and meaningful moments from the poet&apos;s journey.</p>
          </div>
          <div className="mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3"><Stat value={String(achievements.length)} label="Published records" /><Stat value={String(featured.length)} label="Featured" /><Stat value={String(new Set(achievements.map((a) => a.year).filter(Boolean)).size)} label="Years represented" /></div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8f1239]">Recognition</p><h2 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Achievements</h2></div><p className="hidden max-w-sm text-right text-sm leading-6 text-black/45 md:block">Every milestone is part of a larger literary and cultural story.</p></div>

          {achievements.length === 0 ? <div className="mt-10 rounded-3xl border border-black/5 bg-white p-12 text-center shadow-sm"><p className="font-serif text-3xl font-bold">The journey continues.</p><p className="mt-3 text-sm text-black/45">Achievements and recognitions will appear here as they are published.</p></div> : <div className="relative mt-12"><div className="absolute bottom-0 left-[15px] top-0 hidden w-px bg-black/10 md:block" /><div className="space-y-5 md:space-y-8">{achievements.map((item, index) => <article key={item.id} className="relative grid gap-5 md:grid-cols-[120px_1fr] md:gap-8"><div className="hidden pt-7 md:block"><div className="relative z-10 flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-[#8f1239] ring-4 ring-[#f8f5f1]" /><span className="font-serif text-lg font-bold text-[#8f1239]">{item.year || String(index + 1).padStart(2, "0")}</span></div></div><div className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="grid md:grid-cols-[220px_1fr]">{item.imageUrl ? <div className="relative min-h-[220px] bg-black/5"><Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 220px" className="object-cover transition duration-500 group-hover:scale-105" /></div> : <div className="flex min-h-[150px] items-center justify-center bg-[#f5e9ed] font-serif text-6xl text-[#8f1239] md:min-h-full">✦</div>}<div className="p-6 sm:p-8"><div className="flex flex-wrap items-center gap-2">{item.year && <span className="rounded-full bg-[#f5efe3] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#896d30]">{item.year}</span>}{item.category && <span className="rounded-full bg-[#f5e9ed] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8f1239]">{item.category}</span>}{item.featured && <span className="text-[10px] font-bold uppercase tracking-wider text-[#8f1239]">Featured</span>}</div><h3 className="mt-4 font-serif text-2xl font-bold leading-tight sm:text-3xl">{item.title}</h3>{item.organization && <p className="mt-2 text-sm font-semibold text-black/45">{item.organization}</p>}{item.description && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-black/55 sm:text-base">{item.description}</p>}</div></div></div></article>)}</div></div>}
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl rounded-[2rem] bg-[#171315] p-8 text-white sm:p-12 lg:p-16"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d7a25c]">The story continues</p><div className="mt-3 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><h2 className="max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl">Recognition is one chapter. The poetry is the journey.</h2><a href="/poems" className="w-fit rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#171315] transition hover:bg-[#f5e9ed]">Explore Poems →</a></div></div></section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) { return <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><p className="font-serif text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-black/45">{label}</p></div>; }
