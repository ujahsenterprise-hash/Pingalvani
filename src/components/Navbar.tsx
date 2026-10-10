"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          rounded-2xl
          border
          border-black/5
          bg-white/95
          px-4
          py-3
          shadow-lg
          backdrop-blur-md
          sm:px-6
        "
      >
        {/* =====================================================
            BRAND
        ===================================================== */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          {/* Same poet photo */}
          <div
            className="
              relative
              h-11
              w-11
              shrink-0
              overflow-hidden
              rounded-xl
              border-2
              border-white
              bg-white
              shadow-md
              ring-1
              ring-black/10
              sm:h-12
              sm:w-12
            "
          >
            <Image
              src="/poet.jpg"
              alt="Pingalshinh Bapu"
              fill
              priority
              sizes="48px"
              className="
                object-cover
                object-center
                brightness-[1.05]
              "
            />
          </div>

          <div className="hidden sm:block">
            <div
              className="
                font-serif
                text-lg
                font-bold
                leading-tight
                text-gray-900
              "
            >
              Pingalshinh Bapu
            </div>

            <div
              className="
                mt-0.5
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-rose-700
              "
            >
              Poet • Writer • Performer
            </div>
          </div>

          {/* Mobile brand name */}
          <div className="sm:hidden">
            <div className="font-serif text-lg font-bold text-gray-900">
              Pingalshinh Bapu
            </div>
          </div>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}
        <div className="hidden items-center gap-8 lg:flex">
          <Link
            href="/"
            className="
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:text-rose-800
            "
          >
            Home
          </Link>

          <Link
            href="/about"
            className="
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:text-rose-800
            "
          >
            About
          </Link>

          <Link
            href="/poems"
            className="
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:text-rose-800
            "
          >
            Poems
          </Link>

          <Link
            href="/achievements"
            className="
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:text-rose-800
            "
          >
            Achievements
          </Link>
        </div>

        {/* =====================================================
            DESKTOP ACTIONS
        ===================================================== */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Language */}
          <button
            type="button"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-black/10
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              transition
              hover:border-rose-200
              hover:bg-rose-50
            "
          >
            <span
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-rose-800
                text-[10px]
                font-bold
                text-white
              "
            >
              HI
            </span>

            <span>हिन्दी</span>

            <span className="text-xs">▼</span>
          </button>

          {/* Explore */}
          <Link
            href="/poems"
            className="
              inline-flex
              items-center
              justify-center
              rounded-full
              bg-rose-800
              px-6
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-md
              transition
              hover:bg-rose-900
              hover:shadow-lg
            "
          >
            Explore Poetry
          </Link>
        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-black/10
            bg-white
            text-rose-800
            transition
            hover:bg-rose-50
            lg:hidden
          "
        >
          <div className="flex w-6 flex-col gap-1.5">
            <span
              className={`h-0.5 w-full rounded-full bg-current transition ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />

            <span
              className={`h-0.5 w-full rounded-full bg-current transition ${
                menuOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`h-0.5 w-full rounded-full bg-current transition ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* =======================================================
          MOBILE MENU
      ======================================================= */}
      {menuOpen && (
        <div
          className="
            mx-4
            mt-2
            overflow-hidden
            rounded-2xl
            border
            border-black/5
            bg-white/98
            p-4
            shadow-xl
            backdrop-blur-md
            lg:hidden
            sm:mx-6
          "
        >
          <div className="flex flex-col">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="
                rounded-xl
                px-4
                py-3
                text-sm
                font-semibold
                text-gray-800
                transition
                hover:bg-rose-50
                hover:text-rose-800
              "
            >
              Home
            </Link>

            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="
                rounded-xl
                px-4
                py-3
                text-sm
                font-semibold
                text-gray-800
                transition
                hover:bg-rose-50
                hover:text-rose-800
              "
            >
              About
            </Link>

            <Link
              href="/poems"
              onClick={() => setMenuOpen(false)}
              className="
                rounded-xl
                px-4
                py-3
                text-sm
                font-semibold
                text-gray-800
                transition
                hover:bg-rose-50
                hover:text-rose-800
              "
            >
              Poems
            </Link>

            <Link
              href="/achievements"
              onClick={() => setMenuOpen(false)}
              className="
                rounded-xl
                px-4
                py-3
                text-sm
                font-semibold
                text-gray-800
                transition
                hover:bg-rose-50
                hover:text-rose-800
              "
            >
              Achievements
            </Link>

            <div className="my-2 border-t border-black/5" />

            <Link
              href="/poems"
              onClick={() => setMenuOpen(false)}
              className="
                mt-1
                flex
                items-center
                justify-center
                rounded-full
                bg-rose-800
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-md
              "
            >
              Explore Poetry
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}