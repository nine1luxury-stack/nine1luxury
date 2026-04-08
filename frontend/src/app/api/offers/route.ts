import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const offers = await (prisma as any).offer.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(offers);
  } catch (error) {
    console.error("Failed to fetch offers:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, link, isActive } = body;

    if (!title || !link) {
      return NextResponse.json({ error: "Title and link are required" }, { status: 400 });
    }

    const offer = await (prisma as any).offer.create({
      data: {
        title,
        description,
        imageUrl,
        link,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error("Failed to create offer:", error);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}
