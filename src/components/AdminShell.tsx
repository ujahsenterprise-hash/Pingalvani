"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
  soon?: boolean;
};

function Icon({ name }: { name: string }) {
  const common = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<string, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" />
        <path d="M4 5.5V19" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="m9 13-1 8 4-2 4 2-1-8" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m21 16-5-5L5 20" />
      </>
    ),
    external: (
      <>
        <path d="M14 3h7v7" />
        <path d="M10 14 21 3" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12M18 6 6 18" />
      </>
    ),
    settings: (
      <>
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path
          d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4V19a2 2 0 0 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1A2 2 0 1 1 3 14.7l.1-.1A2 2 0 0 0 1.7 11H1.5a2 2 0 0 1 0-4h.2a2 2 0 0 0 1.4-3.4L3 3.5A2 2 0 1 1 5.8.7l.1.1A2 2 0 0 0 9.3-.6V-.8a2 2 0 0 1 4 0v.2a2 2 0 0 0 3.4 1.4l.1-.1A2 2 0 1 1 19.6 3l-.1.1A2 2 0 0 0 20.9 6h.2a2 2 0 0 1 0 4h-.2a2 2 0 0 0-1.5 5Z"
          transform="translate(0 4) scale(.72)"
        />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" {...common}>
      {paths[name]}
    </svg>
  );
}

const nav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "About Page", href: "/admin/about", icon: "user" },
  { label: "Poems", href: "/admin/poems", icon: "book" },
  { label: "Achievements", href: "/admin/achievements", icon: "award" },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f6f2ee] text-[#171717]">
      <div className="flex min-h-screen">
        {open && (
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-black/5 bg-[#171315] text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-6">
            <Link
              href="/admin"
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#8f1239] to-[#b7791f] font-serif text-2xl font-bold italic shadow-lg">
                P
              </span>
              <span>
                <span className="block font-serif text-lg font-bold">
                  Pingalshinh
                </span>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-white/50">
                  Administration
                </span>
              </span>
            </Link>

            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-white/60 hover:bg-white/10 lg:hidden"
              aria-label="Close navigation"
            >
              <Icon name="close" />
            </button>
          </div>

          <div className="px-4 pt-7">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Workspace
            </p>

            <nav className="mt-3 space-y-1">
              {nav.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-white text-[#8f1239] shadow-sm"
                        : "text-white/70 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <Icon name={item.icon} />
                    <span className="flex-1">{item.label}</span>

                    {item.soon && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wide ${
                          active
                            ? "bg-[#f5e9ed]"
                            : "bg-white/10 text-white/40"
                        }`}
                      >
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold text-white/80">
                Content Studio
              </p>

              <p className="mt-1 text-xs leading-5 text-white/40">
                Manage the poet&apos;s public presence from one place.
              </p>

              <Link
                href="/"
                target="_blank"
                className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/65 hover:text-white"
              >
                <Icon name="external" />
                View website
              </Link>
            </div>

            <button
              onClick={logout}
              className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/60 hover:bg-white/8 hover:text-white"
            >
              <Icon name="logout" />
              Sign out
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-black/5 bg-[#f6f2ee]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <button
              onClick={() => setOpen(true)}
              className="rounded-xl border border-black/10 bg-white p-2.5 lg:hidden"
              aria-label="Open menu"
            >
              <Icon name="menu" />
            </button>

            <div className="hidden lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8f1239]">
                Admin Dashboard
              </p>
              <p className="mt-0.5 text-xs text-black/45">
                Pingalshinh · Poet • Writer • Performer
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="hidden rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-semibold text-black/65 hover:text-[#8f1239] sm:inline-flex"
              >
                View website
              </Link>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8f1239] text-xs font-bold text-white">
                P
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </section>
      </div>
    </div>
  );
}
