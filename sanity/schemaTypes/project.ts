import { defineField, defineType } from 'sanity'

export const project = defineType({
    name: 'project',
    title: 'Project / Research',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Project Title',
            type: 'string',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            description: 'e.g., "Finance", "Tech", "Consulting"',
        }),
        defineField({
            name: 'shortDescription',
            title: 'Short Description',
            type: 'string',
            description: 'Shown in the table view.',
        }),
        defineField({
            name: 'description',
            title: 'Detailed Description',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Shown when expanded.',
        }),
        defineField({
            name: 'link',
            title: 'External Link (Optional)',
            type: 'url',
        }),
        defineField({
            name: 'files',
            title: 'Files (PDF, PPT, Excel, etc.)',
            type: 'array',
            of: [
                {
                    type: 'file',
                    fields: [
                        {
                            name: 'title',
                            type: 'string',
                            title: 'Title',
                            description: 'Display name for the file (e.g., "Pitch Deck")',
                        },
                        {
                            name: 'thumbnail',
                            type: 'image',
                            title: 'Thumbnail',
                            description: 'Optional preview image for the file.',
                        },
                    ],
                },
            ],
            description: 'Upload your project documents here.',
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
        }),
    ],
})
