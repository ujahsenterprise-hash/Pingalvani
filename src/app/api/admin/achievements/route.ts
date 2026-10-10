import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function clean(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const achievements = await prisma.achievement.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(achievements);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const title = clean(body.title);
    if (!title) return NextResponse.json({ error: "Achievement title is required." }, { status: 400 });
    const achievement = await prisma.achievement.create({
      data: {
        title,
        year: clean(body.year),
        organization: clean(body.organization),
        category: clean(body.category),
        description: clean(body.description),
        imageUrl: clean(body.imageUrl),
        cloudinaryPublicId: clean(body.cloudinaryPublicId),
        featured: body.featured === true,
        isPublished: body.isPublished !== false,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      },
    });
    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    console.error("Create achievement error:", error);
    return NextResponse.json({ error: "Unable to create achievement." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const id = clean(body.id);
    const title = clean(body.title);
    if (!id || !title) return NextResponse.json({ error: "Achievement id and title are required." }, { status: 400 });
    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        title,
        year: clean(body.year),
        organization: clean(body.organization),
        category: clean(body.category),
        description: clean(body.description),
        imageUrl: clean(body.imageUrl),
        cloudinaryPublicId: clean(body.cloudinaryPublicId),
        featured: body.featured === true,
        isPublished: body.isPublished !== false,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      },
    });
    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Update achievement error:", error);
    return NextResponse.json({ error: "Unable to update achievement." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await request.json();
    if (typeof id !== "string" || !id) return NextResponse.json({ error: "Achievement id is required." }, { status: 400 });
    await prisma.achievement.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete achievement error:", error);
    return NextResponse.json({ error: "Unable to delete achievement." }, { status: 500 });
  }
}
