import { defineField, defineType } from 'sanity'

export const workExperience = defineType({
    name: 'workExperience',
    title: 'Work Experience',
    type: 'document',
    fields: [
        defineField({
            name: 'company',
            title: 'Company Name',
            type: 'string',
        }),
        defineField({
            name: 'role',
            title: 'Role / Title',
            type: 'string',
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'date',
            description: 'Leave blank if currently working here.',
        }),
        defineField({
            name: 'logo',
            title: 'Company Logo',
            type: 'image',
        }),
        defineField({
            name: 'logoWidth',
            title: 'Logo Width (px)',
            type: 'number',
            description: 'Width of the logo in pixels. Default is 100.',
            initialValue: 100,
        }),
        defineField({
            name: 'shortDescription',
            title: 'Short Description (5 words)',
            type: 'string',
            description: 'A very brief summary for the timeline view.',
        }),
        defineField({
            name: 'tags',
            title: 'Key Highlights',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Short highlights (e.g., "60+ Models", "Team Lead"). Shown above details.',
        }),
        defineField({
            name: 'details',
            title: 'Detailed Description',
            type: 'array',
            of: [{
                type: 'block',
                styles: [
                    { title: 'Small', value: 'small' },
                    { title: 'Normal', value: 'normal' },
                    { title: 'Large', value: 'large' },
                    { title: 'Heading 3', value: 'h3' },
                    { title: 'Heading 4', value: 'h4' },
                    { title: 'Heading 5', value: 'h5' },
                    { title: 'Heading 6', value: 'h6' },
                    { title: 'Quote', value: 'blockquote' },
                ]
            }],
            description: 'Full details shown when expanded.',
        }),
    ],
})
