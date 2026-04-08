import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

async function proxy(request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
    const { proxy: proxyParams } = await params;
    const path = proxyParams.join('/');
    const queryString = request.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/${path}${queryString}`;

    console.log(`PROXY: ${request.method} /api/${path} -> ${targetUrl}`);

    try {
        const headers = new Headers(request.headers);
        headers.delete('host');
        headers.delete('connection');

        const body = (request.method !== 'GET' && request.method !== 'HEAD')
            ? await request.blob()
            : undefined;

        const response = await fetch(targetUrl, {
            method: request.method,
            headers: headers,
            body: body,
            cache: 'no-store'
        });

        // Forward response
        const responseHeaders = new Headers(response.headers);
        // Ensure we don't double-compress or break encoding
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('content-length');

        const responseBody = await response.arrayBuffer();

        return new NextResponse(responseBody, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
        });

    } catch (error) {
        console.error(`PROXY ERROR: ${path}`, error);
        return NextResponse.json(
            { error: 'Proxy Error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;
