import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    try {
        // Validate the URL is from Sanity CDN
        const parsedUrl = new URL(url);
        const allowedHosts = ['cdn.sanity.io', 'sanity.io'];

        if (!allowedHosts.some(host => parsedUrl.hostname.includes(host))) {
            return NextResponse.json({ error: 'Invalid URL host' }, { status: 403 });
        }

        // Fetch the PDF
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch document' }, { status: response.status });
        }

        const contentType = response.headers.get('content-type') || 'application/pdf';

        // Stream the response body directly
        return new NextResponse(response.body, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('PDF proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
    }
}
