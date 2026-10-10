import { NextRequest, NextResponse } from 'next/server';
// Using relative path to bypass Next.js 16/Turbopack alias issues
import { prisma } from '../../../../../lib/prisma'; 

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { error: "Poem ID is required" }, 
        { status: 400 }
      );
    }

    // Update the like count for the poem in your Prisma database
    // Note: Adjust the 'where' and 'data' fields if your schema property names differ (e.g., 'likesCount')
    const updatedPoem = await prisma.poem.update({
      where: { id: id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Liked poem ${id}`, 
      likes: updatedPoem.likes 
    });

  } catch (error: any) {
    console.error("Error liking poem:", error);
    return NextResponse.json(
      { error: "Failed to update like count", details: error.message }, 
      { status: 500 }
    );
  }
}