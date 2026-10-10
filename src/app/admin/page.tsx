import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [about, poems, achievements, lifeEvents, photos, videos, awards] = await Promise.all([
    prisma.aboutPage.findUnique({ where: { id: "about-main" } }),
    prisma.poem.count(),
    prisma.achievement.count(),
    prisma.lifeEvent.count({ where: { aboutPageId: "about-main" } }),
    prisma.aboutPhoto.count({ where: { aboutPageId: "about-main" } }),
    prisma.aboutVideo.count({ where: { aboutPageId: "about-main" } }),
    prisma.aboutAward.count({ where: { aboutPageId: "about-main" } }),
  ]);
  return { about, poems, achievements, lifeEvents, photos, videos, awards };
}

const cards = [
  { key: "poems", label: "Poems", href: "/admin/poems", description: "Poetry collection", icon: "P", tone: "bg-[#f1e9ed] text-[#8f1239]" },
  { key: "lifeEvents", label: "Life Events", href: "/admin/about", description: "Biography timeline", icon: "L", tone: "bg-[#f5efe3] text-[#9a6815]" },
  { key: "photos", label: "Photos", href: "/admin/about", description: "About gallery", icon: "F", tone: "bg-[#eeeae5] text-[#5b514b]" },
  { key: "videos", label: "Videos", href: "/admin/about", description: "Video stories", icon: "V", tone: "bg-[#eee9f0] text-[#6e416f]" },
  { key: "awards", label: "Awards", href: "/admin/about", description: "Honours & recognition", icon: "A", tone: "bg-[#f3eee5] text-[#896d30]" },
  { key: "achievements", label: "Achievements", href: "/admin/achievements", description: "Public achievements", icon: "★", tone: "bg-[#f1e9ed] text-[#8f1239]" },
];

export default async function AdminDashboard() {
  const stats = await getStats();
  const profileReady = Boolean(stats.about);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8f1239]">Overview</p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">Good evening.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">Welcome to your content dashboard. Manage the poet's biography, memories, photographs, videos and literary work.</p>
        </div>
        <Link href="/admin/about" className="inline-flex w-fit items-center rounded-xl bg-[#8f1239] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8f1239]/15 transition hover:bg-[#74102f]">Manage About Page →</Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between"><span className="text-xs font-bold uppercase tracking-wider text-black/40">About Page</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${profileReady ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{profileReady ? "Ready" : "Setup"}</span></div>
          <p className="mt-4 font-serif text-2xl font-bold">{stats.about?.name || "Not initialized"}</p>
          <p className="mt-1 text-xs text-black/40">{stats.about?.isPublished ? "Published to website" : "Currently unpublished"}</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wider text-black/40">Achievements</span><p className="mt-4 font-serif text-4xl font-bold">{stats.achievements}</p><p className="mt-1 text-xs text-black/40">Published achievements</p></div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wider text-black/40">Poems</span><p className="mt-4 font-serif text-4xl font-bold">{stats.poems}</p><p className="mt-1 text-xs text-black/40">Total poetry entries</p></div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wider text-black/40">Life Story</span><p className="mt-4 font-serif text-4xl font-bold">{stats.lifeEvents}</p><p className="mt-1 text-xs text-black/40">Timeline events</p></div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wider text-black/40">Media</span><p className="mt-4 font-serif text-4xl font-bold">{stats.photos + stats.videos}</p><p className="mt-1 text-xs text-black/40">Photos & videos</p></div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f1239]">Content areas</p><h2 className="mt-1 font-serif text-2xl font-bold">Manage your story</h2></div><Link href="/admin/about" className="text-xs font-semibold text-[#8f1239] hover:underline">Open About CMS</Link></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {cards.map((card) => <Link key={card.key} href={card.href} className="group flex items-center gap-4 rounded-2xl border border-black/5 p-4 transition hover:-translate-y-0.5 hover:border-[#8f1239]/20 hover:shadow-md">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${card.tone}`}>{card.icon}</span>
              <span className="min-w-0"><span className="block text-sm font-bold">{card.label}</span><span className="mt-0.5 block text-xs text-black/40">{card.description}</span></span>
              <span className="ml-auto text-black/20 transition group-hover:translate-x-1 group-hover:text-[#8f1239]">→</span>
            </Link>)}
          </div>
        </div>

        <div className="rounded-3xl bg-[#171315] p-6 text-white shadow-xl sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d7a25c]">Quick actions</p>
          <h2 className="mt-2 font-serif text-2xl font-bold">Keep the site fresh</h2>
          <div className="mt-6 space-y-2">
            <Link href="/admin/about" className="flex items-center justify-between rounded-xl bg-white/8 px-4 py-3.5 text-sm font-semibold hover:bg-white/12"><span>Edit About page</span><span>→</span></Link>
            <Link href="/admin/about" className="flex items-center justify-between rounded-xl bg-white/8 px-4 py-3.5 text-sm font-semibold hover:bg-white/12"><span>Add photographs</span><span>→</span></Link>
            <Link href="/admin/about" className="flex items-center justify-between rounded-xl bg-white/8 px-4 py-3.5 text-sm font-semibold hover:bg-white/12"><span>Add life event</span><span>→</span></Link>
            <Link href="/" target="_blank" className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3.5 text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white"><span>Preview website</span><span>↗</span></Link>
          </div>
        </div>
      </section>

      <div className="mt-6 rounded-2xl border border-[#8f1239]/10 bg-[#8f1239]/5 px-5 py-4 text-sm text-black/55">
        <span className="font-semibold text-[#8f1239]">Awards:</span> {stats.awards} award record{stats.awards === 1 ? "" : "s"} currently stored. Use the About Page → Awards section to manage recognition details.
      </div>
    </div>
  );
}
