import { defineField, defineType } from 'sanity'

export const education = defineType({
    name: 'education',
    title: 'Education',
    type: 'document',
    fields: [
        defineField({
            name: 'institute',
            title: 'Institute Name',
            type: 'string',
        }),
        defineField({
            name: 'degree',
            title: 'Degree / Certificate',
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
        }),
        defineField({
            name: 'logo',
            title: 'Institute Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'logoSize',
            title: 'Logo Size (px)',
            type: 'number',
            description: 'Width/Height of the logo in pixels. Default is 100.',
            initialValue: 100,
            type: 'array',
            options: {
                layout: 'grid',
            },
            description: 'Add images or documents. For documents, you can add a title and a custom thumbnail.',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Caption',
                        }
                    ]
                },
                {
                    type: 'file',
                    fields: [
                        {
                            name: 'title',
                            type: 'string',
                            title: 'Document Title',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'thumbnail',
                            type: 'image',
                            title: 'Thumbnail (Optional)',
                            description: 'Upload a screenshot/image of the document to show on the website.',
                        }
                    ]
                }
            ],
        }),
        defineField({
            name: 'bentoCards',
            title: 'Achievement Cards (Bento Grid)',
            type: 'array',
            of: [{ type: 'bentoCard' }],
            description: 'Add cards to display key achievements in a grid layout.',
        }),

    ],
})
