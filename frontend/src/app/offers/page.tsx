import OffersClient from "./OffersClient";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';
        const res = await fetch(`${apiUrl}/api/offers`, { next: { revalidate: 60 } });
        
        if (!res.ok) throw new Error(`API responded with status: ${res.status}`);
        
        const offers = await res.json();

        return <OffersClient initialOffers={offers} />;
    } catch (error) {
        console.error("[OffersPage] Error fetching offers:", error);
        return <OffersClient initialOffers={[]} error="لم يتم العثور على عروض حالياً" />;
    }
}
