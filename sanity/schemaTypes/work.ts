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
            name: 'shortDescription',
            title: 'Short Description (5 words)',
            type: 'string',
            description: 'A very brief summary for the timeline view.',
        }),
        defineField({
            name: 'details',
            title: 'Detailed Description',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Full details shown when expanded.',
        }),
    ],
})
