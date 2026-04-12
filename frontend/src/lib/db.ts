import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Helper to execute a Prisma query with a timeout.
 * Prevents the server from hanging indefinitely on DB connection issues.
 */
export async function withDbTimeout<T>(
    queryFn: () => Promise<T>,
    timeoutMs: number = 10000
): Promise<T> {
    return Promise.race([
        queryFn(),
        new Promise<never>((_, reject) =>
            setTimeout(() => {
                const errorMsg = 'Database connection timed out (10s). Please check if your MySQL service is running and the DATABASE_URL is correct.';
                console.error(`[Prisma Timeout]: ${errorMsg}`);
                reject(new Error(errorMsg));
            }, timeoutMs)
        ),
    ]).catch(err => {
        console.error(`[Prisma Error]: ${err.message}`);
        throw err;
    });
}
