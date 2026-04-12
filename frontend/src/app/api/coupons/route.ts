import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, type, value, minQuantity, isActive } = body;

    if (!code || !value) {
      return NextResponse.json({ error: "Code and value are required" }, { status: 400 });
    }

    // Ensure code is unique
    const existingCoupon = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() }
    });

    if (existingCoupon) {
        return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type: type || "PERCENTAGE",
        value: Number(value),
        minQuantity: Number(minQuantity) || 1,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Failed to create coupon:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
