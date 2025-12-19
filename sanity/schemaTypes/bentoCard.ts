import { defineField, defineType } from 'sanity'

export const bentoCard = defineType({
    name: 'bentoCard',
    title: 'Bento Card',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'label',
            title: 'Label (Top Small Text)',
            type: 'string',
            description: 'e.g., ENGINEERING, LEADERSHIP',
        }),
        defineField({
            name: 'size',
            title: 'Card Size',
            type: 'string',
            options: {
                list: [
                    { title: 'Small (Half Width)', value: 'small' },
                    { title: 'Large (Full Width)', value: 'large' },
                ],
                layout: 'radio',
            },
            initialValue: 'small',
        }),
        defineField({
            name: 'type',
            title: 'Content Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Simple Text', value: 'text' },
                    { title: 'Bullet List', value: 'list' },
                    { title: 'Flow / Process', value: 'flow' },
                ],
                layout: 'radio',
            },
            initialValue: 'text',
        }),
        // Content for 'text' type
        defineField({
            name: 'content',
            title: 'Content',
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
            hidden: ({ parent }) => parent?.type !== 'text',
        }),
        // Content for 'list' type
        defineField({
            name: 'listItems',
            title: 'List Items',
            type: 'array',
            of: [{ type: 'string' }],
            hidden: ({ parent }) => parent?.type !== 'list',
        }),
        // Content for 'flow' type
        defineField({
            name: 'flowData',
            title: 'Flow Data',
            type: 'object',
            hidden: ({ parent }) => parent?.type !== 'flow',
            fields: [
                defineField({ name: 'labelFrom', title: 'Label (Start)', type: 'string' }),
                defineField({
                    name: 'valueFrom',
                    title: 'Value (Start)',
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
                    }]
                }),
                defineField({ name: 'labelTo', title: 'Label (End)', type: 'string' }),
                defineField({
                    name: 'valueTo',
                    title: 'Value (End)',
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
                    }]
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'label',
        },
    },
})
