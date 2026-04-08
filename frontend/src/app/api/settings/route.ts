import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // @ts-ignore
    const settings = await prisma.setting.findMany();
    
    // Convert array to object { key: value }
    const settingsObject = settings.reduce((acc: Record<string, string>, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Expected body format: { [key: string]: string }
    const updatePromises = Object.entries(body).map(([key, value]) => {
      // @ts-ignore
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
