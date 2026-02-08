import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await context.params;
        const id = Number(idStr);
        const body = await request.json();

        // Use transaction if we are approving, to ensure stock is updated
        const result = await prisma.$transaction(async (tx) => {
            const updatedReturn = await tx.returnrequest.update({
                where: { id },
                data: {
                    status: body.status,
                    notes: body.notes
                }
            });

            // If status changed to APPROVED, increment stock
            if (body.status === 'APPROVED') {
                if (updatedReturn.variantId) {
                    // Update variant stock based on type
                    const stockField = updatedReturn.type === 'VALID' ? 'stock' :
                        updatedReturn.type === 'DAMAGED' ? 'damagedStock' :
                            updatedReturn.type === 'WASH' ? 'washStock' : 'repackageStock';

                    await tx.productvariant.update({
                        where: { id: updatedReturn.variantId },
                        data: {
                            [stockField]: { increment: updatedReturn.quantity }
                        }
                    });
                } else {
                    // Handle product with no variants (basic product) - assuming first variant or default
                    const firstVariant = await tx.productvariant.findFirst({
                        where: { productId: updatedReturn.productId }
                    });
                    if (firstVariant) {
                        const stockField = updatedReturn.type === 'VALID' ? 'stock' :
                            updatedReturn.type === 'DAMAGED' ? 'damagedStock' :
                                updatedReturn.type === 'WASH' ? 'washStock' : 'repackageStock';
                        await tx.productvariant.update({
                            where: { id: firstVariant.id },
                            data: {
                                [stockField]: { increment: updatedReturn.quantity }
                            }
                        });
                    }
                }
            }

            return updatedReturn;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("PATCH /api/returns/[id] - Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
