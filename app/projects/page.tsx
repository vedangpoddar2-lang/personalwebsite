import { client } from '@/sanity/lib/client';

import ProjectTable from '@/components/ProjectTable';

export const revalidate = 60;

async function getData() {
    // Fetch projects and resolve file URLs
    const query = `*[_type == "project"] | order(date desc) {
    _id,
    title,
    shortDescription,
    description,
    date,
    link,
    category,
    files[]{
      _key,
      _type,
      title,
      thumbnail,
      "url": asset->url,
      "originalFilename": asset->originalFilename,
      "mimeType": asset->mimeType,
      "size": asset->size
    }
  }`;
    return client.fetch(query);
}

export default async function ProjectsPage() {
    const items = await getData();

    return (
        <main>

            <div className="container section">
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Research & Projects</h1>
                <p style={{ textAlign: 'center', opacity: 0.7, maxWidth: '600px', margin: '0 auto 3rem' }}>
                    A collection of my academic research, side projects, and other initiatives.
                </p>

                {items && items.length > 0 ? (
                    <ProjectTable items={items} />
                ) : (
                    <p style={{ textAlign: 'center', opacity: 0.5 }}>No projects added yet.</p>
                )}
            </div>
        </main>
    );
}
