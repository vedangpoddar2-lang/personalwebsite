import { defineField, defineType } from 'sanity'

export const brainResource = defineType({
    name: 'brainResource',
    title: 'Brain Resource',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Snippet (Text)', value: 'snippet' },
                    { title: 'Link (URL)', value: 'link' },
                    { title: 'PDF (Document)', value: 'pdf' },
                    { title: 'Video', value: 'video' },
                    { title: 'Voice Note', value: 'voice' },
                ],
            },
            initialValue: 'link',
        }),
        defineField({
            name: 'source',
            title: 'Ingestion Source',
            type: 'string',
            options: {
                list: [
                    { title: 'Web / Extension', value: 'web' },
                    { title: 'Telegram', value: 'telegram' },
                    { title: 'Email', value: 'email' },
                    { title: 'Manual', value: 'manual' },
                ],
            },
            initialValue: 'manual',
        }),
        defineField({
            name: 'url',
            title: 'Original URL',
            type: 'url',
            hidden: ({ document }) => document?.type === 'snippet',
        }),
        defineField({
            name: 'file',
            title: 'File (PDF/Audio)',
            type: 'file',
            options: {
                storeOriginalFilename: true,
            },
            hidden: ({ document }) => !['pdf', 'voice'].includes(document?.type as string),
        }),
        defineField({
            name: 'content',
            title: 'Content / Transcript',
            type: 'text',
            description: 'The raw text content, parsed PDF text, or voice transcript.',
        }),
        defineField({
            name: 'summary',
            title: 'AI Summary',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
        defineField({
            name: 'sentiment',
            title: 'Sentiment',
            type: 'string',
            options: {
                list: [
                    { title: 'Positive', value: 'positive' },
                    { title: 'Neutral', value: 'neutral' },
                    { title: 'Negative', value: 'negative' },
                    { title: 'Inspirational', value: 'inspirational' },
                    { title: 'Educational', value: 'educational' },
                ]
            }
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'type',
            media: 'file',
        },
    },
})
