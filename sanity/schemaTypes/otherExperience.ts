import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'otherExperience',
    title: 'Other Experience',
    type: 'document',
    fields: [
        defineField({
            name: 'company',
            title: 'Company Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'role',
            title: 'Role',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'logo',
            title: 'Company Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'logoWidth',
            title: 'Logo Width (px)',
            type: 'number',
            description: 'Width of the logo in pixels. Default is 50.',
            initialValue: 50,
        }),
        defineField({
            name: 'description',
            title: 'Hover Description',
            type: 'text',
            rows: 3,
            description: 'Short description (2-3 sentences) shown on hover.',
        }),
        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
            initialValue: 0,
        }),
    ],
    preview: {
        select: {
            title: 'company',
            subtitle: 'role',
            media: 'logo',
        },
    },
})
