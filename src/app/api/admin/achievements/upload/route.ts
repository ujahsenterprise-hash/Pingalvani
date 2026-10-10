import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No image uploaded." }, { status: 400 });
    if (!IMAGE_TYPES.has(file.type)) return NextResponse.json({ error: "Only JPG, PNG, WEBP, GIF and AVIF images are allowed." }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Maximum image size is 10 MB." }, { status: 400 });
    const result = await uploadToCloudinary(Buffer.from(await file.arrayBuffer()), "image", file.name, "poet-portfolio/achievements");
    return NextResponse.json({ url: result.secure_url, publicId: result.public_id, provider: "cloudinary" });
  } catch (error) {
    console.error("Achievement image upload error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Image upload failed." }, { status: 500 });
  }
}
