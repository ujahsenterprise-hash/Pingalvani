import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    const poems = await prisma.poem.findMany({
      where: query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { content_en: { contains: query, mode: "insensitive" } },
              { content_hi: { contains: query, mode: "insensitive" } },
              { content_gu: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(poems);
  } catch (error) {
    console.error("Poem search failed:", error);
    return NextResponse.json({ error: "Unable to load poems." }, { status: 500 });
  }
}
