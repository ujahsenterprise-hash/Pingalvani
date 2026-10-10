"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const emptyForm = {
  id: "",
  title: "",
  language: "Gujarati",
  content_en: "",
  content_hi: "",
  content_gu: "",
  pdfUrl: "",
  audioUrl: "",
};

type Poem = typeof emptyForm & { likes?: number; createdAt?: string };

type UploadKind = "pdf" | "audio";

export default function AdminPoemsPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<UploadKind | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const pdfRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  async function load() {
    setError("");
    const response = await fetch("/api/admin/poems", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to load poems.");
      return;
    }
    setPoems(data);
  }

  useEffect(() => { load(); }, []);

  function startCreate() {
    setForm(emptyForm);
    setEditing(false);
    setShowForm(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(poem: Poem) {
    setForm({
      id: poem.id,
      title: poem.title || "",
      language: poem.language || "Gujarati",
      content_en: poem.content_en || "",
      content_hi: poem.content_hi || "",
      content_gu: poem.content_gu || "",
      pdfUrl: poem.pdfUrl || "",
      audioUrl: poem.audioUrl || "",
    });
    setEditing(true);
    setShowForm(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setShowForm(false);
    setForm(emptyForm);
    setEditing(false);
  }

  async function savePoem() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/poems", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save poem.");
      setMessage(editing ? "Poem updated successfully." : "Poem published successfully.");
      await load();
      if (!editing) setForm(emptyForm);
      setShowForm(false);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save poem.");
    } finally {
      setBusy(false);
    }
  }

  async function deletePoem(id: string) {
    if (!window.confirm("Delete this poem? This action cannot be undone.")) return;
    setError("");
    const response = await fetch("/api/admin/poems", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to delete poem.");
      return;
    }
    setMessage("Poem deleted.");
    await load();
  }

  async function uploadMedia(kind: UploadKind, file: File) {
    setUploading(kind);
    setError("");
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);
      const response = await fetch("/api/admin/poems/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setForm((current) => ({ ...current, [kind === "pdf" ? "pdfUrl" : "audioUrl"]: data.url }));
      setMessage(`${kind === "pdf" ? "PDF" : "Audio"} uploaded to Cloudinary.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(null);
      if (kind === "pdf" && pdfRef.current) pdfRef.current.value = "";
      if (kind === "audio" && audioRef.current) audioRef.current.value = "";
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return poems;
    return poems.filter((poem) =>
      [poem.title, poem.language, poem.content_en, poem.content_hi, poem.content_gu]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [poems, query]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8f1239]">Content Studio</p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">Poems</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">Publish, edit and organize the poet&apos;s work in Gujarati, Hindi and English, with optional PDF and audio files.</p>
        </div>
        <button onClick={startCreate} className="inline-flex w-fit items-center rounded-xl bg-[#8f1239] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8f1239]/15 hover:bg-[#74102f]">+ Upload Poem</button>
      </div>

      {(message || error) && (
        <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
          {error || message}
        </div>
      )}

      {showForm && (
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f1239]">{editing ? "Edit poem" : "New poem"}</p>
              <h2 className="mt-1 font-serif text-2xl font-bold">{editing ? "Update your poem" : "Publish a new poem"}</h2>
            </div>
            <button onClick={cancelForm} className="rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold text-black/60 hover:bg-black/5">Cancel</button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50">Poem title *</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. મારી માટી" className="w-full rounded-xl border border-black/10 bg-[#fbfaf8] px-4 py-3 text-sm outline-none focus:border-[#8f1239]" /></label>
            <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50">Primary language</span><select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full rounded-xl border border-black/10 bg-[#fbfaf8] px-4 py-3 text-sm outline-none focus:border-[#8f1239]"><option>Gujarati</option><option>Hindi</option><option>English</option><option>Multilingual</option></select></label>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <TextArea label="English" value={form.content_en} onChange={(v) => setForm({ ...form, content_en: v })} placeholder="English version..." />
            <TextArea label="Hindi" value={form.content_hi} onChange={(v) => setForm({ ...form, content_hi: v })} placeholder="हिंदी संस्करण..." />
            <TextArea label="Gujarati" value={form.content_gu} onChange={(v) => setForm({ ...form, content_gu: v })} placeholder="ગુજરાતી આવૃત્તિ..." />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <MediaBox title="Poem PDF" description="Optional PDF document · max 20MB" url={form.pdfUrl} uploading={uploading === "pdf"} onChoose={() => pdfRef.current?.click()} onClear={() => setForm({ ...form, pdfUrl: "" })} />
            <MediaBox title="Poem Audio" description="Optional audio recording · max 50MB" url={form.audioUrl} uploading={uploading === "audio"} onChoose={() => audioRef.current?.click()} onClear={() => setForm({ ...form, audioUrl: "" })} />
          </div>
          <input ref={pdfRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && uploadMedia("pdf", e.target.files[0])} />
          <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadMedia("audio", e.target.files[0])} />

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-black/5 pt-5 sm:flex-row sm:justify-end">
            <button onClick={cancelForm} className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold text-black/60 hover:bg-black/5">Cancel</button>
            <button disabled={busy || uploading !== null} onClick={savePoem} className="rounded-xl bg-[#8f1239] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Saving..." : editing ? "Save Changes" : "Publish Poem"}</button>
          </div>
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-black/5 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-black/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f1239]">Library</p><h2 className="mt-1 font-serif text-2xl font-bold">Published poems <span className="font-sans text-sm font-semibold text-black/35">{poems.length}</span></h2></div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search poems..." className="w-full rounded-xl border border-black/10 bg-[#fbfaf8] px-4 py-3 text-sm outline-none focus:border-[#8f1239] sm:max-w-xs" />
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center"><p className="font-serif text-2xl font-bold">{poems.length ? "No poems match your search" : "No poems yet"}</p><p className="mt-2 text-sm text-black/45">{poems.length ? "Try another title or keyword." : "Click Upload Poem to publish the first poem."}</p></div>
        ) : (
          <div className="divide-y divide-black/5">
            {filtered.map((poem) => (
              <article key={poem.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-serif text-xl font-bold">{poem.title}</h3><span className="rounded-full bg-[#f5e9ed] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8f1239]">{poem.language || "Multilingual"}</span></div><p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-black/55">{poem.content_gu || poem.content_hi || poem.content_en}</p><div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-black/40"><span>{poem.likes ?? 0} likes</span>{poem.pdfUrl && <a href={poem.pdfUrl} target="_blank" rel="noreferrer" className="text-[#8f1239] hover:underline">PDF</a>}{poem.audioUrl && <a href={poem.audioUrl} target="_blank" rel="noreferrer" className="text-[#8f1239] hover:underline">Audio</a>}</div></div>
                  <div className="flex shrink-0 gap-2"><button onClick={() => startEdit(poem)} className="rounded-xl border border-black/10 px-4 py-2.5 text-xs font-bold hover:border-[#8f1239]/30 hover:text-[#8f1239]">Edit</button><button onClick={() => deletePoem(poem.id)} className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50">Delete</button></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50">{label}</span><textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={11} className="w-full resize-y rounded-xl border border-black/10 bg-[#fbfaf8] px-4 py-3 text-sm leading-6 outline-none focus:border-[#8f1239]" /></label>;
}

function MediaBox({ title, description, url, uploading, onChoose, onClear }: { title: string; description: string; url: string; uploading: boolean; onChoose: () => void; onClear: () => void }) {
  return <div className="rounded-2xl border border-dashed border-black/15 bg-[#fbfaf8] p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs text-black/40">{description}</p></div><button type="button" disabled={uploading} onClick={onChoose} className="rounded-xl bg-white px-3 py-2 text-xs font-bold shadow-sm ring-1 ring-black/10 disabled:opacity-50">{uploading ? "Uploading..." : url ? "Replace" : "Upload"}</button></div>{url && <div className="mt-3 flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-black/5"><span className="min-w-0 flex-1 truncate text-xs text-black/50">{url}</span><button type="button" onClick={onClear} className="text-xs font-bold text-red-600">Remove</button></div>}</div>;
}
