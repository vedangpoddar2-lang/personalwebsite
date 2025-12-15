import { defineField, defineType } from 'sanity'

export const readingItem = defineType({
    name: 'readingItem',
    title: 'Reading / Viewing Item',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'link',
            title: 'Link (URL)',
            type: 'url',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Reading (Article/Book)', value: 'reading' },
                    { title: 'Viewing (Video/Movie)', value: 'viewing' },
                    { title: 'Listening (Podcast)', value: 'listening' },
                ],
            },
            initialValue: 'reading',
        }),
        defineField({
            name: 'description',
            title: 'Short Description / Thoughts',
            type: 'text',
        }),
        defineField({
            name: 'dateAdded',
            title: 'Date Added',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
})
