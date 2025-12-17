import { client } from '@/sanity/lib/client';

import ReadingList from '@/components/ReadingList';

export const revalidate = 60;

async function getData() {
    const query = `*[_type == "readingItem"] | order(dateAdded desc)`;
    return client.fetch(query);
}

export default async function ReadingPage() {
    const items = await getData();

    return (
        <main>

            <div className="container section">
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Reading & Viewing</h1>
                <p style={{ textAlign: 'center', opacity: 0.7, maxWidth: '600px', margin: '0 auto 3rem' }}>
                    A curated list of articles, videos, and books I'm currently exploring.
                </p>

                {items && items.length > 0 ? (
                    <ReadingList items={items} />
                ) : (
                    <p style={{ textAlign: 'center', opacity: 0.5 }}>No items added yet.</p>
                )}
            </div>
        </main>
    );
}
