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
            name: 'headline',
            title: 'Headline',
            type: 'string',
            description: 'Short text below name (e.g. Product Engineer)',
        }),
        defineField({
            name: 'nameSize',
            title: 'Name Font Size',
            type: 'string',
            options: {
                list: [
                    { title: 'Small (3rem)', value: '3rem' },
                    { title: 'Medium (4rem)', value: '4rem' },
                    { title: 'Large (5rem)', value: '5rem' },
                    { title: 'Extra Large (6rem)', value: '6rem' },
                ],
            },
            initialValue: '5rem',
            description: 'Adjust the font size of your name.',
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
