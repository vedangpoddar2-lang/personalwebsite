import { NextRequest, NextResponse } from 'next/server';

// This secret must be set in your Telegram Bot Webhook URL like:
// https://yoursite.com/api/brain/telegram?token=YOUR_SECRET_TOKEN
const TELEGRAM_SECRET_TOKEN = process.env.TELEGRAM_SECRET_TOKEN;

export async function POST(req: NextRequest) {
    try {
        // 1. Verify Secret Token
        const token = req.nextUrl.searchParams.get('token');
        if (token !== TELEGRAM_SECRET_TOKEN && TELEGRAM_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const update = await req.json();

        // 2. Check for Message
        if (!update.message) {
            return NextResponse.json({ ok: true }); // Acknowledge generic updates
        }

        const { text, caption, chat } = update.message;
        const messageText = text || caption || '';

        if (!messageText) {
            return NextResponse.json({ ok: true });
        }

        // 3. Prepare Payload for Ingest API
        // We call our own Ingest API to reuse logic (DRY)
        const ingestUrl = new URL('/api/brain/ingest', req.url);

        const formData = new FormData();
        formData.set('source', 'telegram');
        formData.set('title', `Telegram Note from ${chat.first_name || 'User'}`);

        // Simple URL Detection
        const urlMatch = messageText.match(/(https?:\/\/[^\s]+)/g);
        if (urlMatch && urlMatch[0]) {
            formData.set('type', 'link');
            formData.set('url', urlMatch[0]);
            formData.set('text', messageText); // Keep original text as context
        } else {
            formData.set('type', 'snippet');
            formData.set('text', messageText);
        }

        // 4. Call Ingest
        // We need to pass the ADMIN PIN internally
        const response = await fetch(ingestUrl, {
            method: 'POST',
            headers: {
                'x-admin-pin': process.env.ADMIN_PIN || '1234',
            },
            body: formData,
        });

        if (!response.ok) {
            console.error('Telegram Ingest Failed', await response.text());
        }

        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error('Telegram Handler Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
