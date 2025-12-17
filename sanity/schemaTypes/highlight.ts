import { defineField, defineType } from 'sanity'

export const highlight = defineType({
    name: 'highlight',
    title: 'Highlight',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Short label for the pill (e.g., "Cornell Case Winner")',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Full achievement description shown on hover.',
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first.',
        }),
    ],
})
