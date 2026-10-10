"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type About = any;

const tabs = [
  "Overview",
  "Biography",
  "Life Events",
  "Photos",
  "Videos",
  "Awards",
];

export default function AdminAboutPage() {
  const [about, setAbout] = useState<About>(null);
  const router = useRouter();
  const [tab, setTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const r = await fetch("/api/admin/about");

      if (r.status === 401) {
        router.replace("/login");
        return;
      }

      const j = await r.json().catch(() => ({}));

      if (!r.ok) {
        setMessage(j.error || "Unable to load About CMS.");
        return;
      }

      setAbout(j.about);
    } catch {
      setMessage("Unable to connect to the About CMS.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveOverview() {
    setBusy(true);

    const data = {
      ...(about || {}),
      id: about?.id || "about-main",
      name: about?.name || "Pingalshinh Patabhai Narela",
      isPublished: about?.isPublished !== false,
    };

    const r = await fetch("/api/admin/about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "overview",
        data,
      }),
    });

    const j = await r.json();

    setMessage(r.ok ? "Saved successfully." : j.error);

    if (r.ok) {
      await load();
    }

    setBusy(false);
  }

  async function saveItem(type: string, data: any, id?: string) {
    setBusy(true);

    const payload = {
      ...data,
      aboutPageId: about.id,
      sortOrder: Number(data.sortOrder || 0),
      isPublished: data.isPublished !== false,
    };

    const r = await fetch("/api/admin/about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        id,
        data: payload,
      }),
    });

    const j = await r.json();

    setMessage(r.ok ? "Saved successfully." : j.error);

    if (r.ok) {
      await load();
    }

    setBusy(false);
  }

  async function remove(type: string, id: string) {
    if (!confirm("Delete this item?")) return;

    await fetch("/api/admin/about", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        id,
      }),
    });

    await load();
  }

  async function upload(
    file: File,
    resourceType: "image" | "video" = "image"
  ) {
    const fd = new FormData();

    fd.append("file", file);
    fd.append("resourceType", resourceType);

    const r = await fetch("/api/admin/about/upload", {
      method: "POST",
      body: fd,
    });

    const j = await r.json();

    if (!r.ok) {
      throw new Error(j.error || "Upload failed.");
    }

    return j;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f3ef] px-5 py-24">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#8f1239]">
            Administration
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold">Loading About CMS</h1>
          <p className="mt-3 text-sm text-gray-500">Checking your admin session…</p>
        </div>
      </main>
    );
  }

  if (!about) {
    return (
      <main className="min-h-screen bg-[#f7f3ef] px-5 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow">
          <h1 className="font-serif text-3xl font-bold">
            Create About Page
          </h1>

          <p className="mt-2 text-gray-500">
            Enter the name below to initialize the CMS.
          </p>

          <button
            onClick={async () => {
              await saveOverview();
            }}
            className="mt-6 rounded-xl bg-[#8f1239] px-5 py-3 font-semibold text-white"
          >
            Initialize
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ef] text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1239]">
              Content Management
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold">
              About Page
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage every public section, photograph, video, life event and
              award.
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="/about"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold"
            >
              Preview
            </a>
          </div>
        </div>

        {message && (
          <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="mt-8 flex gap-2 overflow-x-auto border-b">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-semibold ${
                tab === t
                  ? "border-b-2 border-[#8f1239] text-[#8f1239]"
                  : "text-gray-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-8">
          {(tab === "Overview" || tab === "Biography") && (
            <OverviewEditor
              about={about}
              setAbout={setAbout}
              onSave={saveOverview}
              upload={upload}
              biographyOnly={tab === "Biography"}
              busy={busy}
            />
          )}

          {tab === "Life Events" && (
            <Collection
              type="lifeEvent"
              title="Life Events / Timeline"
              items={about.lifeEvents}
              fields={[
                ["year", "Year"],
                ["title", "Title"],
                ["description", "Description"],
              ]}
              saveItem={saveItem}
              remove={remove}
            />
          )}

          {tab === "Photos" && (
            <PhotoCollection
              items={about.photos}
              upload={upload}
              saveItem={saveItem}
              remove={remove}
            />
          )}

          {tab === "Videos" && (
            <VideoCollection
              items={about.videos}
              upload={upload}
              saveItem={saveItem}
              remove={remove}
            />
          )}

          {tab === "Awards" && (
            <Collection
              type="award"
              title="Awards & Honours"
              items={about.awards}
              fields={[
                ["year", "Year"],
                ["title", "Title"],
                ["organization", "Organization"],
                ["description", "Description"],
                ["image", "Image URL"],
              ]}
              saveItem={saveItem}
              remove={remove}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </span>

      {multiline ? (
        <textarea
          rows={6}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#8f1239]"
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#8f1239]"
        />
      )}
    </label>
  );
}

function OverviewEditor({
  about,
  setAbout,
  onSave,
  upload,
  biographyOnly,
  busy,
}: any) {
  const set = (k: string, v: any) =>
    setAbout((a: any) => ({
      ...a,
      [k]: v,
    }));

  async function image(k: string, file?: File) {
    if (!file) return;

    try {
      const result = await upload(file, "image");
      set(k, result.url);
    } catch (e: any) {
      alert(e.message);
    }
  }

  const keys: Array<{
    key: string;
    label: string;
    multiline: boolean;
  }> = biographyOnly
    ? [
        {
          key: "biographyTitle",
          label: "Biography Title",
          multiline: false,
        },
        {
          key: "biography",
          label: "Biography",
          multiline: true,
        },
      ]
    : [
        {
          key: "name",
          label: "Name",
          multiline: false,
        },
        {
          key: "subtitle",
          label: "Subtitle",
          multiline: false,
        },
        {
          key: "intro",
          label: "Introduction",
          multiline: true,
        },
        {
          key: "heroImage",
          label: "Hero Image URL",
          multiline: false,
        },
        {
          key: "portraitImage",
          label: "Portrait Image URL",
          multiline: false,
        },
        {
          key: "legacyTitle",
          label: "Legacy Title",
          multiline: false,
        },
        {
          key: "legacyContent",
          label: "Legacy Content",
          multiline: true,
        },
        {
          key: "quote",
          label: "Quote",
          multiline: true,
        },
        {
          key: "quoteAuthor",
          label: "Quote Author",
          multiline: false,
        },
      ];

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2">
        {keys.map((field) => (
          <div
            key={field.key}
            className={
              field.multiline ? "md:col-span-2" : ""
            }
          >
            <Input
              label={field.label}
              value={about[field.key]}
              onChange={(v) => set(field.key, v)}
              multiline={field.multiline}
            />

            {(field.key === "heroImage" ||
              field.key === "portraitImage") &&
              !biographyOnly && (
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 text-sm"
                  onChange={(e) =>
                    image(field.key, e.target.files?.[0])
                  }
                />
              )}
          </div>
        ))}
      </div>

      <label className="mt-5 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={about.isPublished !== false}
          onChange={(e) =>
            set("isPublished", e.target.checked)
          }
        />
        Publish About page
      </label>

      <button
        disabled={busy}
        onClick={onSave}
        className="mt-6 rounded-xl bg-[#8f1239] px-6 py-3 font-semibold text-white"
      >
        {busy ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

function Collection({
  type,
  title,
  items,
  fields,
  saveItem,
  remove,
}: any) {
  const blank = Object.fromEntries(
    fields.map((f: any) => [f[0], ""])
  );

  const [draft, setDraft] = useState<any>(blank);

  const save = async () => {
    await saveItem(type, draft);
    setDraft(blank);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold">
            {title}
          </h2>

          <p className="text-sm text-gray-500">
            {items.length} item(s)
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl border bg-gray-50 p-4 md:grid-cols-2">
        {fields.map((f: any) => (
          <Input
            key={f[0]}
            label={f[1]}
            value={draft[f[0]]}
            onChange={(v) =>
              setDraft((d: any) => ({
                ...d,
                [f[0]]: v,
              }))
            }
            multiline={f[0] === "description"}
          />
        ))}

        <div className="md:col-span-2">
          <button
            onClick={save}
            className="rounded-xl bg-[#8f1239] px-5 py-3 font-semibold text-white"
          >
            + Add {title.slice(0, -1)}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {items.map((item: any) => (
          <article
            key={item.id}
            className="rounded-2xl border p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#8f1239]">
                  {item.year}
                </p>

                <h3 className="font-serif text-xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => remove(type, item.id)}
                className="rounded-lg border px-3 py-2 text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function VideoCollection({
  items,
  upload,
  saveItem,
  remove,
}: any) {
  const [draft, setDraft] = useState<any>({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
    category: "",
  });

  const [uploading, setUploading] = useState(false);

  async function chooseVideo(file?: File) {
    if (!file) return;

    setUploading(true);

    try {
      const result = await upload(file, "video");

      setDraft((d: any) => ({
        ...d,
        videoUrl: result.url,
        cloudinaryPublicId: result.publicId,
      }));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function chooseThumbnail(file?: File) {
    if (!file) return;

    try {
      const result = await upload(file, "image");

      setDraft((d: any) => ({
        ...d,
        thumbnail: result.url,
      }));
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function add() {
    if (!draft.title || !draft.videoUrl) {
      alert("Please provide a title and video.");
      return;
    }

    await saveItem("video", draft);

    setDraft({
      title: "",
      description: "",
      videoUrl: "",
      thumbnail: "",
      category: "",
    });
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold">
        Videos
      </h2>

      <p className="text-sm text-gray-500">
        Upload videos directly to Cloudinary or paste a
        YouTube/Vimeo URL.
      </p>

      <div className="mt-6 grid gap-4 rounded-2xl border bg-gray-50 p-4 md:grid-cols-2">
        <Input
          label="Title"
          value={draft.title}
          onChange={(v) =>
            setDraft((d: any) => ({
              ...d,
              title: v,
            }))
          }
        />

        <Input
          label="Category"
          value={draft.category}
          onChange={(v) =>
            setDraft((d: any) => ({
              ...d,
              category: v,
            }))
          }
        />

        <div>
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
            Upload video to Cloudinary
          </span>

          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
            onChange={(e) =>
              chooseVideo(e.target.files?.[0])
            }
          />

          {uploading && (
            <p className="mt-1 text-xs text-gray-500">
              Uploading video…
            </p>
          )}
        </div>

        <Input
          label="Video URL"
          value={draft.videoUrl}
          onChange={(v) =>
            setDraft((d: any) => ({
              ...d,
              videoUrl: v,
            }))
          }
        />

        <div>
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
            Thumbnail
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              chooseThumbnail(e.target.files?.[0])
            }
          />
        </div>

        <Input
          label="Thumbnail URL"
          value={draft.thumbnail}
          onChange={(v) =>
            setDraft((d: any) => ({
              ...d,
              thumbnail: v,
            }))
          }
        />

        <div className="md:col-span-2">
          <Input
            label="Description"
            value={draft.description}
            onChange={(v) =>
              setDraft((d: any) => ({
                ...d,
                description: v,
              }))
            }
            multiline
          />
        </div>

        <div className="md:col-span-2">
          <button
            disabled={uploading}
            onClick={add}
            className="rounded-xl bg-[#8f1239] px-5 py-3 font-semibold text-white"
          >
            + Add Video
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((v: any) => (
          <article
            key={v.id}
            className="overflow-hidden rounded-2xl border bg-white"
          >
            {v.thumbnail ? (
              <img
                src={v.thumbnail}
                alt=""
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-gray-100 text-sm text-gray-400">
                Video
              </div>
            )}

            <div className="p-4">
              <h3 className="font-semibold">{v.title}</h3>

              <p className="mt-1 text-sm text-gray-500">
                {v.description}
              </p>

              <a
                href={v.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block truncate text-sm text-[#8f1239]"
              >
                {v.videoUrl}
              </a>

              <button
                onClick={() => remove("video", v.id)}
                className="mt-3 rounded-lg border px-3 py-2 text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PhotoCollection({
  items,
  upload,
  saveItem,
  remove,
}: any) {
  const [draft, setDraft] = useState<any>({
    imageUrl: "",
    cloudinaryPublicId: "",
    title: "",
    caption: "",
    altText: "",
    category: "",
    featured: false,
  });

  async function choose(file?: File) {
    if (!file) return;

    try {
      const result = await upload(file, "image");

      setDraft((d: any) => ({
        ...d,
        imageUrl: result.url,
        cloudinaryPublicId: result.publicId,
      }));
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold">
        Photos
      </h2>

      <p className="text-sm text-gray-500">
        Upload and manage photographs shown on the public
        About page.
      </p>

      <div className="mt-6 grid gap-4 rounded-2xl border bg-gray-50 p-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
            Upload image
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              choose(e.target.files?.[0])
            }
          />
        </label>

        <Input
          label="Image URL"
          value={draft.imageUrl}
          onChange={(v) =>
            setDraft((d: any) => ({
              ...d,
              imageUrl: v,
            }))
          }
        />

        <Input
          label="Title"
          value={draft.title}
          onChange={(v) =>
            setDraft((d: any) => ({
              ...d,
              title: v,
            }))
          }
        />

        <Input
          label="Caption"
          value={draft.caption}
          onChange={(v) =>
            setDraft((d: any) => ({
              ...d,
              caption: v,
            }))
          }
        />

        <Input
          label="Alt text"
          value={draft.altText}
          onChange={(v) =>
            setDraft((d: any) => ({
              ...d,
              altText: v,
            }))
          }
        />

        <button
          onClick={async () => {
            await saveItem("photo", draft);

            setDraft({
              imageUrl: "",
              cloudinaryPublicId: "",
              title: "",
              caption: "",
              altText: "",
              category: "",
              featured: false,
            });
          }}
          className="rounded-xl bg-[#8f1239] px-5 py-3 font-semibold text-white"
        >
          + Add Photo
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p: any) => (
          <article
            key={p.id}
            className="overflow-hidden rounded-2xl border bg-white"
          >
            <div className="aspect-video bg-gray-100">
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.altText || ""}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold">
                {p.title || "Untitled photo"}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {p.caption}
              </p>

              <button
                onClick={() => remove("photo", p.id)}
                className="mt-3 rounded-lg border px-3 py-2 text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
