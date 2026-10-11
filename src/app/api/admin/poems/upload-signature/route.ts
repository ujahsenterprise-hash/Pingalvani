import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const kind = body?.kind;

    if (kind !== "pdf" && kind !== "audio") {
      return NextResponse.json(
        { error: "Invalid upload type." },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured on the server." },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = "poet-portfolio/poems";

    const params = { folder, timestamp };
    const payload = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const signature = crypto
      .createHash("sha1")
      .update(payload + apiSecret)
      .digest("hex");

    return NextResponse.json(
      {
        cloudName,
        apiKey,
        timestamp,
        folder,
        signature,
        resourceType: kind === "pdf" ? "raw" : "video",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Cloudinary signature generation failed:", error);
    return NextResponse.json(
      { error: "Unable to prepare the upload." },
      { status: 500 }
    );
  }
}
