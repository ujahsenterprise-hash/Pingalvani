"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Unable to sign in.");
        return;
      }

      router.replace("/admin/about");
      router.refresh();
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f3ef] px-5 py-24 text-gray-900">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#8f1239] to-[#b7791f] font-serif text-2xl font-bold italic text-white shadow-lg">
              P
            </span>
            <span className="text-left">
              <span className="block text-lg font-bold">Pingalshinh</span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-[#8f1239]/70">
                Poet • Writer • Performer
              </span>
            </span>
          </Link>
        </div>

        <section className="rounded-3xl border border-black/5 bg-white p-7 shadow-xl shadow-black/5 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1239]">
            Administration
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold">Admin Login</h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Sign in to manage the About page, biography, life events, photos,
            videos and awards.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700">
                Admin Password
              </span>
              <input
                autoFocus
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-[#8f1239] focus:ring-4 focus:ring-[#8f1239]/10"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-[#8f1239] px-5 py-3.5 font-semibold text-white shadow-md shadow-[#8f1239]/20 transition hover:bg-[#74102f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in to Admin"}
            </button>
          </form>

          <Link
            href="/"
            className="mt-6 block text-center text-sm font-medium text-gray-500 transition hover:text-[#8f1239]"
          >
            ← Back to website
          </Link>
        </section>
      </div>
    </main>
  );
}
