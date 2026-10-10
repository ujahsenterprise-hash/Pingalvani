 "use client";

import { useEffect, useMemo, useState } from "react";

type LifeEvent = {
  id: string;
  year?: string | null;
  title?: string | null;
  description?: string | null;
  image?: string | null;
};

type AboutPhoto = {
  id: string;
  imageUrl?: string | null;
  title?: string | null;
  caption?: string | null;
  altText?: string | null;
  category?: string | null;
  featured?: boolean;
};

type AboutVideo = {
  id: string;
  title?: string | null;
  description?: string | null;
  videoUrl?: string | null;
  thumbnail?: string | null;
  category?: string | null;
};

type AboutAward = {
  id: string;
  year?: string | null;
  title?: string | null;
  organization?: string | null;
  description?: string | null;
  image?: string | null;
};

type About = {
  id?: string;
  name?: string | null;
  subtitle?: string | null;
  intro?: string | null;
  heroImage?: string | null;
  portraitImage?: string | null;
  biographyTitle?: string | null;
  biography?: string | null;
  legacyTitle?: string | null;
  legacyContent?: string | null;
  quote?: string | null;
  quoteAuthor?: string | null;
  isPublished?: boolean;
  lifeEvents?: LifeEvent[];
  photos?: AboutPhoto[];
  videos?: AboutVideo[];
  awards?: AboutAward[];
};

function normalizeAbout(data: any): About | null {
  const value = data?.about ?? data?.data ?? data;

  if (!value || typeof value !== "object") return null;

  return {
    ...value,
    lifeEvents: Array.isArray(value.lifeEvents) ? value.lifeEvents : [],
    photos: Array.isArray(value.photos) ? value.photos : [],
    videos: Array.isArray(value.videos) ? value.videos : [],
    awards: Array.isArray(value.awards) ? value.awards : [],
  };
}

function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/i.test(url);
}

function getYouTubeEmbed(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }

    const videoId = parsed.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    const match = parsed.pathname.match(/\/(shorts|embed)\/([^/]+)/);
    if (match?.[2]) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
  } catch {
    return null;
  }

  return null;
}

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAbout() {
      try {
        const response = await fetch("/api/about", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.error || "Unable to load About page.");
        }

        if (!cancelled) {
          setAbout(normalizeAbout(data));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load About page."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAbout();

    return () => {
      cancelled = true;
    };
  }, []);

  const publishedPhotos = useMemo(
    () => (about?.photos ?? []).filter((item) => item.imageUrl),
    [about]
  );

  const publishedVideos = useMemo(
    () => (about?.videos ?? []).filter((item) => item.videoUrl),
    [about]
  );

  const publishedEvents = useMemo(
    () => (about?.lifeEvents ?? []).filter((item) => item.title || item.description),
    [about]
  );

  const publishedAwards = useMemo(
    () => (about?.awards ?? []).filter((item) => item.title),
    [about]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f3ef]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="h-10 w-56 animate-pulse rounded bg-black/5" />
          <div className="mt-5 h-5 w-96 max-w-full animate-pulse rounded bg-black/5" />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="aspect-[4/3] animate-pulse rounded-3xl bg-black/5" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded bg-black/5" />
              <div className="h-32 animate-pulse rounded-2xl bg-black/5" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !about) {
    return (
      <main className="min-h-screen bg-[#f7f3ef] px-5 py-24">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1239]">
            About
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-[#171315]">
            About Pingalshinh Patabhai Narela
          </h1>
          <p className="mt-4 text-sm leading-7 text-black/55">
            {error || "About information is currently unavailable."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ef] text-[#171315]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8f1239]">
                About the Poet
              </p>

              <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-5xl">
                {about.name || "Pingalshinh Patabhai Narela"}
              </h1>

              {about.subtitle && (
                <p className="mt-5 text-lg font-medium text-[#8f1239] sm:text-xl">
                  {about.subtitle}
                </p>
              )}

              {about.intro && (
                <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-8 text-black/65 sm:text-lg">
                  {about.intro}
                </p>
              )}
            </div>

            <div className="relative">
              {about.heroImage || about.portraitImage ? (
                <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-xl">
                  <img
                    src={about.heroImage || about.portraitImage || ""}
                    alt={about.name || "Pingalshinh Patabhai Narela"}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-[2rem] bg-[#eadfe2] text-[#8f1239]">
                  <span className="font-serif text-8xl font-bold italic">
                    P
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Biography */}
      {(about.biography || about.portraitImage) && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1239]">
                Biography
              </p>

              <h2 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl">
                {about.biographyTitle || "A Life in Words"}
              </h2>

              {about.portraitImage && (
                <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">
                  <img
                    src={about.portraitImage}
                    alt={about.name || "Portrait"}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-10">
              {about.biography && (
                <div className="whitespace-pre-line text-base leading-8 text-black/70 sm:text-lg">
                  {about.biography}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Life events */}
      {publishedEvents.length > 0 && (
        <section className="border-y border-black/5 bg-white/45">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1239]">
                Life & Journey
              </p>
              <h2 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
                A journey through time
              </h2>
            </div>

            <div className="mt-12">
              <div className="relative ml-3 border-l border-[#8f1239]/20">
                {publishedEvents.map((event) => (
                  <article
                    key={event.id}
                    className="relative ml-8 pb-10 last:pb-0"
                  >
                    <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-[#f7f3ef] bg-[#8f1239]" />

                    <p className="text-sm font-bold tracking-wide text-[#8f1239]">
                      {event.year}
                    </p>

                    {event.title && (
                      <h3 className="mt-2 font-serif text-2xl font-bold">
                        {event.title}
                      </h3>
                    )}

                    {event.description && (
                      <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-black/60 sm:text-base">
                        {event.description}
                      </p>
                    )}

                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title || "Life event"}
                        className="mt-5 max-h-72 rounded-2xl object-cover shadow-sm"
                      />
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quote / Legacy */}
      {(about.quote || about.legacyContent) && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          {about.quote && (
            <blockquote className="rounded-[2rem] bg-[#171315] px-7 py-12 text-white shadow-xl sm:px-12 lg:px-16">
              <span className="font-serif text-6xl leading-none text-[#b7791f]">
                “
              </span>

              <p className="mt-3 max-w-4xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                {about.quote}
              </p>

              {about.quoteAuthor && (
                <footer className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-white/55">
                  {about.quoteAuthor}
                </footer>
              )}
            </blockquote>
          )}

          {about.legacyContent && (
            <div className="mt-12 grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1239]">
                  Legacy
                </p>
                <h2 className="mt-3 font-serif text-4xl font-bold">
                  {about.legacyTitle || "A Lasting Legacy"}
                </h2>
              </div>

              <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-10">
                <p className="whitespace-pre-line text-base leading-8 text-black/65">
                  {about.legacyContent}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Photos */}
      {publishedPhotos.length > 0 && (
        <section className="border-y border-black/5 bg-white/45">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1239]">
              Gallery
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
              Moments & Memories
            </h2>

            <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
              {publishedPhotos.map((photo) => (
                <figure
                  key={photo.id}
                  className="mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <img
                    src={photo.imageUrl || ""}
                    alt={photo.altText || photo.title || "Pingalshinh Patabhai Narela"}
                    className="w-full object-cover transition duration-500 hover:scale-[1.02]"
                  />

                  {(photo.title || photo.caption) && (
                    <figcaption className="p-4">
                      {photo.title && (
                        <h3 className="font-serif text-lg font-bold">
                          {photo.title}
                        </h3>
                      )}
                      {photo.caption && (
                        <p className="mt-1 text-sm leading-6 text-black/55">
                          {photo.caption}
                        </p>
                      )}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {publishedVideos.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1239]">
            Videos
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
            In performance
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {publishedVideos.map((video) => {
              const embedUrl = video.videoUrl
                ? getYouTubeEmbed(video.videoUrl)
                : null;

              return (
                <article
                  key={video.id}
                  className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
                >
                  {embedUrl && isYouTube(video.videoUrl || "") ? (
                    <iframe
                      src={embedUrl}
                      title={video.title || "Pingalshinh video"}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : video.thumbnail ? (
                    <a
                      href={video.videoUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title || "Video thumbnail"}
                        className="aspect-video w-full object-cover transition duration-500 hover:scale-[1.02]"
                      />
                    </a>
                  ) : (
                    <a
                      href={video.videoUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex aspect-video items-center justify-center bg-[#eadfe2] text-sm font-semibold text-[#8f1239]"
                    >
                      Watch video
                    </a>
                  )}

                  <div className="p-5">
                    <h3 className="font-serif text-2xl font-bold">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-black/55">
                        {video.description}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Awards */}
      {publishedAwards.length > 0 && (
        <section className="border-t border-black/5 bg-white/45">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1239]">
              Recognition
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
              Awards & Honours
            </h2>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {publishedAwards.map((award) => (
                <article
                  key={award.id}
                  className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
                >
                  {award.image && (
                    <img
                      src={award.image}
                      alt={award.title || "Award"}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    {award.year && (
                      <p className="text-sm font-bold text-[#8f1239]">
                        {award.year}
                      </p>
                    )}

                    <h3 className="mt-2 font-serif text-2xl font-bold">
                      {award.title}
                    </h3>

                    {award.organization && (
                      <p className="mt-2 text-sm font-semibold text-black/55">
                        {award.organization}
                      </p>
                    )}

                    {award.description && (
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-black/55">
                        {award.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="rounded-[2rem] bg-[#8f1239] px-7 py-12 text-center text-white shadow-xl sm:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
            Pingalshinh Patabhai Narela
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-4xl font-bold sm:text-5xl">
            Words that live beyond a moment.
          </h2>
        </div>
      </section>
    </main>
  );
}
