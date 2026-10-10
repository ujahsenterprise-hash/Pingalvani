"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Achievement = {
  id: string;
  title: string;
  year: string | null;
  organization: string | null;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
  cloudinaryPublicId: string | null;
  featured: boolean;
  isPublished: boolean;
  sortOrder: number;
};

const emptyForm = {
  id: "",
  title: "",
  year: "",
  organization: "",
  category: "",
  description: "",
  imageUrl: "",
  cloudinaryPublicId: "",
  featured: false,
  isPublished: true,
  sortOrder: "0",
};

type Form = typeof emptyForm;

export default function AdminAchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [form, setForm] = useState<Form>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);

  async function load() {
    setError("");
    const response = await fetch("/api/admin/achievements", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) return setError(data.error || "Unable to load achievements.");
    setItems(data);
  }

  useEffect(() => { load(); }, []);

  function createNew() {
    setForm(emptyForm);
    setEditing(false);
    setShowForm(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function edit(item: Achievement) {
    setForm({
      id: item.id,
      title: item.title,
      year: item.year || "",
      organization: item.organization || "",
      category: item.category || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      cloudinaryPublicId: item.cloudinaryPublicId || "",
      featured: item.featured,
      isPublished: item.isPublished,
      sortOrder: String(item.sortOrder),
    });
    setEditing(true);
    setShowForm(true);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancel() {
    setShowForm(false);
    setEditing(false);
    setForm(emptyForm);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError("");
    setMessage("");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/admin/achievements/upload", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Image upload failed.");
      setForm((current) => ({ ...current, imageUrl: result.url, cloudinaryPublicId: result.publicId }));
      setMessage("Achievement image uploaded to Cloudinary.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed.");
    } finally {
      setUploading(false);
      if (imageRef.current) imageRef.current.value = "";
    }
  }

  async function save() {
    if (!form.title.trim()) return setError("Please enter an achievement title.");
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/achievements", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save achievement.");
      setMessage(editing ? "Achievement updated successfully." : "Achievement added successfully.");
      await load();
      cancel();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save achievement.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this achievement? This cannot be undone.")) return;
    const response = await fetch("/api/admin/achievements", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const data = await response.json();
    if (!response.ok) return setError(data.error || "Unable to delete achievement.");
    setMessage("Achievement deleted.");
    await load();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => [item.title, item.year, item.organization, item.category, item.description].filter(Boolean).join(" ").toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8f1239]">Content Studio</p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">Achievements</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">Manage awards, milestones, recognitions, speaking appearances and other documented achievements shown on the public website.</p>
        </div>
        <button onClick={createNew} className="w-fit rounded-xl bg-[#8f1239] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8f1239]/15 hover:bg-[#74102f]">+ Add Achievement</button>
      </div>

      {(message || error) && <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>{error || message}</div>}

      {showForm && <section className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f1239]">{editing ? "Edit achievement" : "New achievement"}</p><h2 className="mt-1 font-serif text-2xl font-bold">{editing ? "Update achievement" : "Add a new achievement"}</h2></div>
          <button onClick={cancel} className="rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold text-black/60 hover:bg-black/5">Cancel</button>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Achievement title *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. State Level Poetry Winner" className="md:col-span-2" />
          <Field label="Year / date" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2023" />
          <Field label="Organization / institution" value={form.organization} onChange={(v) => setForm({ ...form, organization: v })} placeholder="Awarding body or institution" />
          <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="Award, Recognition, Speaking, Publication..." />
          <Field label="Display order" value={form.sortOrder} onChange={(v) => setForm({ ...form, sortOrder: v })} placeholder="0" type="number" />
          <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50">Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} placeholder="Describe the achievement, its context and significance..." className="w-full resize-y rounded-xl border border-black/10 bg-[#fbfaf8] px-4 py-3 text-sm leading-6 outline-none focus:border-[#8f1239]" /></label>
          <div className="md:col-span-2 rounded-2xl border border-dashed border-black/15 bg-[#fbfaf8] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold">Achievement image</p><p className="mt-1 text-xs text-black/40">Optional JPG, PNG, WEBP, GIF or AVIF · max 10 MB</p></div><button type="button" disabled={uploading} onClick={() => imageRef.current?.click()} className="w-fit rounded-xl bg-white px-4 py-2.5 text-xs font-bold shadow-sm ring-1 ring-black/10 disabled:opacity-50">{uploading ? "Uploading..." : form.imageUrl ? "Replace image" : "Upload image"}</button></div>
            {form.imageUrl && <div className="mt-4 flex flex-col gap-3 rounded-xl bg-white p-3 ring-1 ring-black/5 sm:flex-row sm:items-center"><img src={form.imageUrl} alt="Achievement preview" className="h-20 w-28 rounded-lg object-cover" /><span className="min-w-0 flex-1 truncate text-xs text-black/50">{form.imageUrl}</span><button type="button" onClick={() => setForm({ ...form, imageUrl: "", cloudinaryPublicId: "" })} className="text-xs font-bold text-red-600">Remove</button></div>}
            <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-5"><Check label="Show on public website" checked={form.isPublished} onChange={(v) => setForm({ ...form, isPublished: v })} /><Check label="Featured achievement" checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} /></div>
        </div>
        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-black/5 pt-5 sm:flex-row sm:justify-end"><button onClick={cancel} className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold text-black/60 hover:bg-black/5">Cancel</button><button disabled={busy || uploading} onClick={save} className="rounded-xl bg-[#8f1239] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving..." : editing ? "Save Changes" : "Add Achievement"}</button></div>
      </section>}

      <section className="mt-6 rounded-3xl border border-black/5 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-black/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f1239]">Library</p><h2 className="mt-1 font-serif text-2xl font-bold">Achievement records <span className="font-sans text-sm font-semibold text-black/35">{items.length}</span></h2></div><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search achievements..." className="w-full rounded-xl border border-black/10 bg-[#fbfaf8] px-4 py-3 text-sm outline-none focus:border-[#8f1239] sm:max-w-xs" /></div>
        {filtered.length === 0 ? <div className="p-12 text-center"><p className="font-serif text-2xl font-bold">{items.length ? "No matches found" : "No achievements yet"}</p><p className="mt-2 text-sm text-black/45">{items.length ? "Try another keyword." : "Add the first achievement to build the public timeline."}</p></div> : <div className="divide-y divide-black/5">{filtered.map((item) => <article key={item.id} className="p-5 sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="flex min-w-0 gap-4">{item.imageUrl ? <img src={item.imageUrl} alt="" className="h-20 w-24 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-[#f5e9ed] font-serif text-2xl font-bold text-[#8f1239]">★</div>}<div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-serif text-xl font-bold">{item.title}</h3>{item.year && <span className="rounded-full bg-[#f5efe3] px-2.5 py-1 text-[10px] font-bold text-[#896d30]">{item.year}</span>}{item.featured && <span className="rounded-full bg-[#f5e9ed] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8f1239]">Featured</span>}{!item.isPublished && <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-black/40">Draft</span>}</div><p className="mt-1 text-xs font-semibold text-black/40">{[item.organization, item.category].filter(Boolean).join(" · ") || "Achievement"}</p><p className="mt-2 line-clamp-3 text-sm leading-6 text-black/55">{item.description || "No description added."}</p></div></div><div className="flex shrink-0 gap-2"><button onClick={() => edit(item)} className="rounded-xl border border-black/10 px-4 py-2.5 text-xs font-bold hover:border-[#8f1239]/30 hover:text-[#8f1239]">Edit</button><button onClick={() => remove(item.id)} className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50">Delete</button></div></div></article>)}</div>}
      </section>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className = "", type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; className?: string; type?: string }) { return <label className={className}><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50">{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-black/10 bg-[#fbfaf8] px-4 py-3 text-sm outline-none focus:border-[#8f1239]" /></label>; }
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-black/65"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#8f1239]" />{label}</label>; }
