import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const requestedType = form.get("resourceType");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const isImage = IMAGE_TYPES.has(file.type);
    const isVideo = VIDEO_TYPES.has(file.type);
    const resourceType = requestedType === "video" || isVideo ? "video" : "image";

    if (resourceType === "image" && !isImage) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WEBP, GIF and AVIF images are allowed." },
        { status: 400 }
      );
    }

    if (resourceType === "video" && !isVideo) {
      return NextResponse.json(
        { error: "Only MP4, WEBM, MOV and M4V videos are allowed." },
        { status: 400 }
      );
    }

    const maxSize = resourceType === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error:
            resourceType === "video"
              ? "Maximum video size is 100 MB."
              : "Maximum image size is 10 MB.",
        },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(
      Buffer.from(await file.arrayBuffer()),
      resourceType,
      file.name
    );

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType,
      provider: "cloudinary",
    });
  } catch (error) {
    console.error("About media upload error:", error);
    return NextResponse.json(
      { error: "Media upload failed. Check your Cloudinary configuration." },
      { status: 500 }
    );
  }
}
