import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { destroyFromCloudinary } from "@/lib/cloudinary";

const includeAll = {
  lifeEvents: { orderBy: { sortOrder: "asc" as const } },
  photos: { orderBy: { sortOrder: "asc" as const } },
  videos: { orderBy: { sortOrder: "asc" as const } },
  awards: { orderBy: { sortOrder: "asc" as const } },
};

async function getAbout() {
  let about = await prisma.aboutPage.findUnique({ where: { id: "about-main" }, include: includeAll });
  if (!about) {
    about = await prisma.aboutPage.create({
      data: { id: "about-main", name: "Pingalshinh", subtitle: "Poet • Writer • Performer", isPublished: true },
      include: includeAll,
    });
  }
  return about;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ about: await getAbout() });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { type, id, data } = body;

  try {
    if (type === "overview") {
      const about = await prisma.aboutPage.upsert({
        where: { id: data.id || "about-main" },
        update: {
          name: data.name,
          subtitle: data.subtitle || null,
          intro: data.intro || null,
          heroImage: data.heroImage || null,
          portraitImage: data.portraitImage || null,
          biographyTitle: data.biographyTitle || null,
          biography: data.biography || null,
          legacyTitle: data.legacyTitle || null,
          legacyContent: data.legacyContent || null,
          quote: data.quote || null,
          quoteAuthor: data.quoteAuthor || null,
          isPublished: Boolean(data.isPublished),
        },
        create: {
          id: "about-main",
          name: data.name || "Pingalshinh Patabhai Narela",
          subtitle: data.subtitle || null,
          intro: data.intro || null,
          heroImage: data.heroImage || null,
          portraitImage: data.portraitImage || null,
          biographyTitle: data.biographyTitle || null,
          biography: data.biography || null,
          legacyTitle: data.legacyTitle || null,
          legacyContent: data.legacyContent || null,
          quote: data.quote || null,
          quoteAuthor: data.quoteAuthor || null,
          isPublished: data.isPublished !== false,
        },
      });
      return NextResponse.json({ about });
    }

    let result;
    if (type === "lifeEvent") {
      result = id
        ? await prisma.lifeEvent.update({ where: { id }, data })
        : await prisma.lifeEvent.create({ data: { ...data, aboutPageId: data.aboutPageId } });
    } else if (type === "photo") {
      result = id
        ? await prisma.aboutPhoto.update({ where: { id }, data })
        : await prisma.aboutPhoto.create({ data: { ...data, aboutPageId: data.aboutPageId } });
    } else if (type === "video") {
      result = id
        ? await prisma.aboutVideo.update({ where: { id }, data })
        : await prisma.aboutVideo.create({ data: { ...data, aboutPageId: data.aboutPageId } });
    } else if (type === "award") {
      result = id
        ? await prisma.aboutAward.update({ where: { id }, data })
        : await prisma.aboutAward.create({ data: { ...data, aboutPageId: data.aboutPageId } });
    } else {
      return NextResponse.json({ error: "Unknown content type." }, { status: 400 });
    }

    return NextResponse.json({ item: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save About content." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { type, id } = await request.json();

  try {
    if (type === "lifeEvent") await prisma.lifeEvent.delete({ where: { id } });
    else if (type === "photo") {
      const item = await prisma.aboutPhoto.delete({ where: { id } });
      if (item.cloudinaryPublicId) {
        await destroyFromCloudinary(item.cloudinaryPublicId, "image");
      }
    } else if (type === "video") {
      const item = await prisma.aboutVideo.delete({ where: { id } });
      if (item.cloudinaryPublicId) {
        await destroyFromCloudinary(item.cloudinaryPublicId, "video");
      }
    } else if (type === "award") await prisma.aboutAward.delete({ where: { id } });
    else return NextResponse.json({ error: "Unknown content type." }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete item." }, { status: 400 });
  }
}
