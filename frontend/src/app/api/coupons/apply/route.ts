import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code, cartQuantity } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json({ error: "كوبون غير صحيح" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "هذا الكوبون غير فعال حالياً" }, { status: 400 });
    }

    if (cartQuantity && cartQuantity < coupon.minQuantity) {
      return NextResponse.json({ 
        error: `هذا الكوبون صالح فقط عند شراء ${coupon.minQuantity} قطع أو أكثر` 
      }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minQuantity: coupon.minQuantity
      }
    });
  } catch (error) {
    console.error("Failed to apply coupon:", error);
    return NextResponse.json({ error: "Failed to apply coupon" }, { status: 500 });
  }
}
