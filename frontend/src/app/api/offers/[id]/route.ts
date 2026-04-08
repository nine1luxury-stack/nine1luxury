import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const offer = await (prisma as any).offer.findUnique({
      where: { id },
    });
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }
    return NextResponse.json(offer);
  } catch (error) {
    console.error("Failed to fetch offer:", error);
    return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { title, description, imageUrl, link, isActive } = body;

    const offer = await (prisma as any).offer.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        link,
        isActive: isActive !== undefined ? isActive : true
      },
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error("Failed to update offer:", error);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await (prisma as any).offer.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Offer deleted" });
  } catch (error) {
    console.error("Failed to delete offer:", error);
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}
