import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get("file");
    const kind = String(form.get("kind") || "");
    if (!(file instanceof File)) return NextResponse.json({ error: "Please select a file." }, { status: 400 });
    if (kind !== "pdf" && kind !== "audio") return NextResponse.json({ error: "Invalid upload type." }, { status: 400 });
    if (kind === "pdf" && file.type !== "application/pdf") return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 });
    if (kind === "audio" && !file.type.startsWith("audio/")) return NextResponse.json({ error: "Please select an audio file." }, { status: 400 });

    const maxBytes = kind === "pdf" ? 20 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxBytes) return NextResponse.json({ error: `File is too large. Maximum size is ${kind === "pdf" ? "20MB" : "50MB"}.` }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const resourceType = kind === "pdf" ? "raw" : "video";
    const result = await uploadToCloudinary(buffer, resourceType, file.name, "poet-portfolio/poems");
    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Poem media upload failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 500 });
  }
}
