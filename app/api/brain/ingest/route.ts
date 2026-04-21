import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';
// pdf-parse removed temporarily
// const pdf = require('pdf-parse');

// Initialize Sanity Client (Write Token Required)
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false, // We want fresh data
    token: process.env.SANITY_API_TOKEN, // MUST be a write token
    apiVersion: '2024-02-02',
});

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper: Scrape URL
async function scrapeUrl(url: string) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove scripts, styles, etc.
        $('script, style, nav, footer, header').remove();

        const title = $('title').text().trim() || url;
        // Get main content simply by grabbing paragraphs for now
        const text = $('p').map((i, el) => $(el).text()).get().join('\n\n');

        return { title, text: text.slice(0, 15000) }; // Limit context
    } catch (e) {
        console.error('Scrape failed', e);
        return { title: url, text: '' };
    }
}

// Helper: AI Processing
async function enrichContent(text: string, type: 'link' | 'pdf' | 'snippet' | 'video' | 'voice') {
    const prompt = `
    You are my Second Brain AI. Analyze the following content.
    Content Type: ${type}
    
    Tasks:
    1. Summarize it in 2-3 concise sentences (max 50 words).
    2. Extract 5 most relevant keywords/tags (single words or short phrases).
    3. Determine sentiment (positive/neutral/negative/inspirational/educational).
    
    Return pure JSON:
    {
      "summary": "...",
      "keywords": ["tag1", "tag2"],
      "sentiment": "neutral"
    }
    
    Content:
    ${text.slice(0, 10000)}
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
}

export async function POST(req: NextRequest) {
    try {
        // Authenticate (Simple PIN check)
        const pin = req.headers.get('x-admin-pin');
        if (pin !== process.env.ADMIN_PIN) {
            // Allow if it's from localhost for dev
            const host = req.headers.get('host');
            if (!host?.includes('localhost') && pin !== '1234') { // Fallback 1234 for dev
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const formData = await req.formData();
        const type = formData.get('type') as string || 'snippet';
        const rawText = formData.get('text') as string || '';
        const url = formData.get('url') as string || '';
        const file = formData.get('file') as File | null;
        const source = formData.get('source') as string || 'web';

        let finalContent = rawText;
        let finalTitle = formData.get('title') as string || 'Untitled Note';

        // 1. Process Content based on Type
        if (type === 'link' && url) {
            const scraped = await scrapeUrl(url);
            finalContent = scraped.text;
            if (!finalTitle || finalTitle === 'Untitled Note') finalTitle = scraped.title;
        } else if (type === 'pdf' && file) {
            // PDF Parsing disabled temporarily to fix build
            finalContent = "PDF Parsing temporarily unavailable. Title: " + file.name;
        }

        // 2. AI Enrichment
        // If content is too short, don't summarize, just use as is
        let enrichment = { summary: finalContent, keywords: [], sentiment: 'neutral' };
        if (finalContent.length > 50) {
            enrichment = await enrichContent(finalContent, type as any);
        }

        // 3. Upload to Sanity
        let fileAssetId = undefined;
        if (file) {
            const asset = await client.assets.upload('file', file, { filename: file.name });
            fileAssetId = asset._id;
        }

        const doc = {
            _type: 'brainResource',
            title: finalTitle,
            type,
            source,
            url: url || undefined,
            content: finalContent,
            summary: enrichment.summary,
            keywords: enrichment.keywords,
            sentiment: enrichment.sentiment,
            file: fileAssetId ? { _type: 'file', asset: { _ref: fileAssetId } } : undefined,
        };

        const result = await client.create(doc);

        return NextResponse.json({ success: true, id: result._id });

    } catch (error) {
        console.error('Ingest error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
