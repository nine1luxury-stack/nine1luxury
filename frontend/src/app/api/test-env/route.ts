import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        user: process.env.SMTP_USER,
        hasPass: !!process.env.SMTP_PASS,
        nodeEnv: process.env.NODE_ENV,
        cwd: process.cwd()
    });
}
