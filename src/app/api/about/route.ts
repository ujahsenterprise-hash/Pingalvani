import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const about = await prisma.aboutPage.findFirst({
      where: {
        isPublished: true,
      },
      include: {
        lifeEvents: {
          where: { isPublished: true },
          orderBy: { sortOrder: "asc" },
        },
        photos: {
          where: { isPublished: true },
          orderBy: { sortOrder: "asc" },
        },
        videos: {
          where: { isPublished: true },
          orderBy: { sortOrder: "asc" },
        },
        awards: {
          where: { isPublished: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!about) {
      return NextResponse.json(
        { error: "About page is not available." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { about },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Public About API error:", error);

    return NextResponse.json(
      { error: "Unable to load About page." },
      { status: 500 }
    );
  }
}
