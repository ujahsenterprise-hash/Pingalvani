import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const poems = await prisma.poem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(poems);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const title = clean(body.title);
    const content_en = clean(body.content_en);
    const content_hi = clean(body.content_hi);
    const content_gu = clean(body.content_gu);
    if (!title) return NextResponse.json({ error: "Poem title is required." }, { status: 400 });
    if (!content_en && !content_hi && !content_gu) return NextResponse.json({ error: "Add poem content in at least one language." }, { status: 400 });

    const poem = await prisma.poem.create({
      data: {
        title,
        content_en,
        content_hi,
        content_gu,
        language: clean(body.language) || null,
        pdfUrl: clean(body.pdfUrl) || null,
        audioUrl: clean(body.audioUrl) || null,
      },
    });
    return NextResponse.json(poem, { status: 201 });
  } catch (error) {
    console.error("Create poem failed:", error);
    return NextResponse.json({ error: "Unable to create poem." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const id = clean(body.id);
    const title = clean(body.title);
    const content_en = clean(body.content_en);
    const content_hi = clean(body.content_hi);
    const content_gu = clean(body.content_gu);
    if (!id) return NextResponse.json({ error: "Poem id is required." }, { status: 400 });
    if (!title) return NextResponse.json({ error: "Poem title is required." }, { status: 400 });
    if (!content_en && !content_hi && !content_gu) return NextResponse.json({ error: "Add poem content in at least one language." }, { status: 400 });

    const poem = await prisma.poem.update({
      where: { id },
      data: {
        title,
        content_en,
        content_hi,
        content_gu,
        language: clean(body.language) || null,
        pdfUrl: clean(body.pdfUrl) || null,
        audioUrl: clean(body.audioUrl) || null,
      },
    });
    return NextResponse.json(poem);
  } catch (error) {
    console.error("Update poem failed:", error);
    return NextResponse.json({ error: "Unable to update poem." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const id = clean(body.id);
    if (!id) return NextResponse.json({ error: "Poem id is required." }, { status: 400 });
    await prisma.poem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete poem failed:", error);
    return NextResponse.json({ error: "Unable to delete poem." }, { status: 500 });
  }
}
