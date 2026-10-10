"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Heart,
  Search,
  Sparkles,
} from "lucide-react";
import PoemCard from "@/components/PoemCard";
import type { Poem } from "@/types/poem";

const languages = [
  { key: "all", label: "All Poems" },
  { key: "Gujarati", label: "ગુજરાતી" },
  { key: "Hindi", label: "हिन्दी" },
  { key: "English", label: "English" },
  { key: "Multilingual", label: "Multilingual" },
];

function getPoemLanguage(poem: Poem): string {
  const availableLanguages = [
    poem.content_gu?.trim() ? "Gujarati" : null,
    poem.content_hi?.trim() ? "Hindi" : null,
    poem.content_en?.trim() ? "English" : null,
  ].filter(Boolean) as string[];

  if (availableLanguages.length === 1) {
    return availableLanguages[0];
  }

  return "Multilingual";
}

export default function PoemsPage() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(
      async () => {
        setLoading(true);

        try {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(query.trim())}`,
            {
              cache: "no-store",
              signal: controller.signal,
            }
          );

          const data = await response.json();
          setPoems(Array.isArray(data) ? data : []);
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            setPoems([]);
          }
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      },
      query.trim() ? 250 : 0
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const filteredPoems = useMemo(() => {
    if (language === "all") {
      return poems;
    }

    return poems.filter(
      (poem) =>
        getPoemLanguage(poem).toLowerCase() === language.toLowerCase()
    );
  }, [poems, language]);

  const featured = filteredPoems[0];
  const visiblePoems = expanded
    ? filteredPoems
    : filteredPoems.slice(0, 6);
  const hasMore = filteredPoems.length > 6;

  const totalLikes = filteredPoems.reduce(
    (sum, poem) => sum + (poem.likes ?? 0),
    0
  );

  const languageCount = new Set(
    filteredPoems.map((poem) => getPoemLanguage(poem))
  ).size;

  return (
    <div className="min-h-screen bg-[#fbf8f4] text-[#181214]">
      <section className="relative overflow-hidden border-b border-black/5 bg-[radial-gradient(circle_at_15%_15%,rgba(143,18,57,.12),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(183,121,31,.12),transparent_28%)] pt-28 sm:pt-32 lg:pt-36">
        <div className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 sm:pb-20 lg:px-10">
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#8f1239]/15 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.22em] text-[#8f1239] shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Poetry Collection
              </div>

              <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[.98] tracking-tight sm:text-6xl lg:text-6xl">
                Words that <span className="text-[#8f1239]">stay</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-black/55 sm:text-lg">
                Explore poems by Pingalshinh Bapu across Gujarati, Hindi and
                English. Read the verses, listen to recitations and discover
                the emotions behind each work.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <Stat
                label="Poems"
                value={filteredPoems.length}
                icon={<BookOpen className="h-4 w-4" />}
              />

              <Stat
                label="Languages"
                value={languageCount}
                icon={<span className="text-xs font-bold">Aa</span>}
              />

              <Stat
                label="Likes"
                value={totalLikes}
                icon={<Heart className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
        <div className="sticky top-3 z-20 mb-10 rounded-3xl border border-black/5 bg-white/90 p-3 shadow-lg shadow-black/5 backdrop-blur-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search poems, words or emotions..."
                className="h-12 w-full rounded-2xl bg-[#f8f5f1] pl-11 pr-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-[#8f1239]/20"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {languages.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLanguage(item.key)}
                  className={`whitespace-nowrap rounded-xl px-4 py-3 text-xs font-bold transition ${
                    language === item.key
                      ? "bg-[#8f1239] text-white shadow-md shadow-[#8f1239]/20"
                      : "bg-[#f8f5f1] text-black/55 hover:bg-[#8f1239]/5 hover:text-[#8f1239]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingGrid />
        ) : filteredPoems.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <>
            {featured && !query && language === "all" && (
              <section className="mb-12 overflow-hidden rounded-[2rem] bg-[#171214] text-white shadow-2xl shadow-black/10">
                <div className="grid lg:grid-cols-[.75fr_1.25fr]">
                  <div className="flex min-h-[280px] flex-col justify-between bg-gradient-to-br from-[#8f1239] to-[#5d0d29] p-7 sm:p-10 lg:p-12">
                    <div>
                      <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-white/75">
                        Featured poem
                      </span>

                      <h2 className="mt-6 font-serif text-4xl font-bold sm:text-5xl">
                        {featured.title}
                      </h2>
                    </div>

                    <p className="mt-8 max-w-sm text-sm leading-6 text-white/65">
                      A featured work from the poetry collection.
                    </p>
                  </div>

                  <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                    <p className="whitespace-pre-line font-serif text-xl leading-9 text-white/85 sm:text-2xl sm:leading-10">
                      {(
                        featured.content_gu ||
                        featured.content_hi ||
                        featured.content_en ||
                        ""
                      )
                        .split("\n")
                        .slice(0, 8)
                        .join("\n")}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-white/45">
                      <span>{getPoemLanguage(featured)}</span>
                      <span>•</span>
                      <span>{featured.likes ?? 0} likes</span>
                      {featured.audioUrl && (
                        <span>• Audio recitation</span>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8f1239]">
                  The collection
                </p>

                <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
                  Poems
                </h2>
              </div>

              <span className="text-xs font-semibold text-black/35">
                {filteredPoems.length}{" "}
                {filteredPoems.length === 1 ? "work" : "works"}
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {visiblePoems.map((poem, index) => (
                <PoemCard
                  key={poem.id}
                  poem={poem}
                  featured={index === 0}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-bold text-black/70 shadow-sm transition hover:-translate-y-0.5 hover:border-[#8f1239]/20 hover:text-[#8f1239]"
                >
                  {expanded
                    ? "Show less"
                    : `Show all ${filteredPoems.length} poems`}

                  {expanded ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8f1239]">
              Keep exploring
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold">
              Discover the poet beyond the page.
            </h2>
          </div>

          <Link
            href="/about"
            className="inline-flex w-fit rounded-full bg-[#8f1239] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#8f1239]/15 transition hover:-translate-y-0.5 hover:bg-[#74102f]"
          >
            Read the story →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm sm:p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8f1239]/8 text-[#8f1239]">
        {icon}
      </div>

      <p className="mt-4 font-serif text-2xl font-bold sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-black/35">
        {label}
      </p>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-[330px] animate-pulse rounded-[2rem] bg-white ring-1 ring-black/5"
        />
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-black/10 bg-white px-6 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8f1239]/8 text-[#8f1239]">
        <BookOpen className="h-6 w-6" />
      </div>

      <h2 className="mt-6 font-serif text-3xl font-bold">
        {query ? "No poems found" : "The collection is waiting"}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/45">
        {query
          ? `We couldn't find a poem matching “${query}”. Try another title or word.`
          : "Poems published from the administration studio will appear here."}
      </p>

      {query && (
        <button
          type="button"
          onClick={() => window.location.assign("/poems")}
          className="mt-6 rounded-full bg-[#8f1239] px-5 py-3 text-sm font-bold text-white"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
