import { prisma } from "@/lib/db";
import OffersClient from "./OffersClient";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
    try {
        const offers = await prisma.offer.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return <OffersClient initialOffers={JSON.parse(JSON.stringify(offers))} />;
    } catch (error) {
        console.error("[OffersPage] Error fetching offers:", error);
        return <OffersClient initialOffers={[]} error="لم يتم العثور على عروض حالياً" />;
    }
}
