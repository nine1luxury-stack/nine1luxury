
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        return NextResponse.json(notifications);
    } catch {
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, type } = body;

        const notification = await prisma.notification.create({
            data: {
                title,
                description,
                type,
            },
        });

        return NextResponse.json(notification);
    } catch {
        return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, action } = body;

        if (action === "mark_all_read") {
            await prisma.notification.updateMany({
                where: { read: false },
                data: { read: true },
            });
            return NextResponse.json({ success: true });
        }

        if (id) {
            const notification = await prisma.notification.update({
                where: { id },
                data: { read: true },
            });
            return NextResponse.json(notification);
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch {
        return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await prisma.notification.deleteMany();
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to clear notifications" }, { status: 500 });
    }
}
