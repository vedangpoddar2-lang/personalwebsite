import { defineField, defineType } from 'sanity'

export const profile = defineType({
    name: 'profile',
    title: 'Profile (Landing Page)',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'shortDescription',
            title: 'Short Description',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'The text that appears below your photos on the landing page.',
        }),
        defineField({
            name: 'photos',
            title: 'Photos',
            type: 'array',
            of: [{ type: 'image' }],
            description: 'Add a few photos for the landing page center grid.',
        }),
        defineField({
            name: 'bannerText',
            title: 'Bottom Banner Text',
            type: 'string',
            description: 'Text to display in the bottom banner (e.g., "Open to work").',
        }),
        defineField({
            name: 'resume',
            title: 'Resume / CV',
            type: 'file',
            description: 'Upload your CV (PDF recommended).',
        }),
    ],
})
