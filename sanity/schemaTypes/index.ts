import { type SchemaTypeDefinition } from 'sanity'
import { profile } from './profile'
import { workExperience } from './work'
import { education } from './education'
import { readingItem } from './reading'
import { project } from './project'
import { highlight } from './highlight'
import { bentoCard } from './bentoCard'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [profile, workExperience, education, readingItem, project, highlight, bentoCard],
}
