import { client } from '@/sanity/lib/client';
import BrainGraph from '@/components/Brain/BrainGraph';
import BrainActions from '@/components/Brain/BrainActions';
import { FaPaperclip, FaQuoteRight, FaLink, FaFilePdf } from 'react-icons/fa';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

async function getBrainResources() {
    return await client.fetch(`
        *[_type == "brainResource"] | order(createdAt desc) {
            _id,
            title,
            type,
            summary,
            keywords,
            url,
            content,
            "fileUrl": file.asset->url,
            createdAt
        }
    `);
}

export default async function BrainPage() {
    const resources = await getBrainResources();

    return (
        <main style={{ background: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>
            <BrainActions />

            {/* 1. Header & Graph Visualization */}
            {/* 1. Simple Header */}
            <section style={{ padding: '40px 40px 20px', textAlign: 'center' }}>
                <h1 style={{
                    fontSize: '4rem', fontWeight: '800', margin: 0,
                    color: 'var(--primary)', letterSpacing: '-0.03em', fontFamily: 'var(--font-serif)'
                }}>
                    Second Brain
                </h1>
                <p style={{
                    fontSize: '1.2rem', color: '#666', marginTop: '10px',
                    fontFamily: 'var(--font-sans)'
                }}>
                    A digital garden of thoughts and connections.
                </p>
            </section>

            {/* 2. Split Content Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px', padding: '60px 40px', maxWidth: '1600px', margin: '0 auto' }}>

                {/* LEFT: Snippet Stream */}
                <div className="snippet-stream">
                    <h2 style={{
                        fontSize: '1.5rem', marginBottom: '30px',
                        borderBottom: '3px solid var(--primary)', display: 'inline-block',
                        color: 'var(--foreground)'
                    }}>
                        Stream of Consciousness
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {resources.filter((r: any) => r.type === 'snippet' || !r.type).map((item: any) => (
                            <div key={item._id} style={{
                                background: '#fff', padding: '30px', borderRadius: '16px',
                                borderLeft: '6px solid var(--primary)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                                position: 'relative'
                            }}>
                                <FaQuoteRight style={{ position: 'absolute', top: '20px', right: '20px', color: 'rgba(0, 51, 102, 0.1)', fontSize: '2rem' }} />
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#333', fontFamily: 'var(--font-serif)' }}>
                                    {item.content || item.summary}
                                </p>
                                <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {item.keywords?.map((tag: string) => (
                                        <span key={tag} style={{
                                            fontSize: '0.75rem', color: 'var(--primary)',
                                            background: 'rgba(0, 51, 102, 0.05)', padding: '4px 10px', borderRadius: '20px',
                                            fontWeight: '600'
                                        }}>#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Resource Grid */}
                <div className="resource-grid">
                    <h2 style={{
                        fontSize: '1.5rem', marginBottom: '30px',
                        borderBottom: '3px solid #ff6b6b', display: 'inline-block',
                        color: 'var(--foreground)'
                    }}>
                        Library (Links & PDFs)
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', alignItems: 'start' }}>

                        {/* GRAPH CARD */}
                        <div style={{
                            gridColumn: '1 / -1', // Span full width of grid
                            height: '400px',
                            background: '#fff', borderRadius: '16px', overflow: 'hidden',
                            border: '1px solid rgba(0,0,0,0.05)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            marginBottom: '20px'
                        }}>
                            <BrainGraph resources={resources} />
                        </div>

                        {resources.filter((r: any) => r.type !== 'snippet').map((item: any) => (
                            <a href={item.url || item.fileUrl} target="_blank" key={item._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    background: '#fff', borderRadius: '16px', overflow: 'hidden', height: '100%',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                    display: 'flex', flexDirection: 'column'
                                }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                                    }}
                                >
                                    {/* Thumbnail Placeholder */}
                                    <div style={{
                                        height: '160px', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '3rem', color: item.type === 'pdf' ? '#ff6b6b' : 'var(--primary)',
                                        position: 'relative'
                                    }}>
                                        {item.type === 'pdf' ? <FaFilePdf /> : <FaLink />}
                                        <div style={{
                                            position: 'absolute', bottom: '10px', right: '10px',
                                            padding: '4px 10px', background: '#fff', borderRadius: '10px',
                                            fontSize: '0.7rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                        }}>
                                            {item.type?.toUpperCase()}
                                        </div>
                                    </div>

                                    <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px', lineHeight: '1.3', color: '#111' }}>
                                            {item.title}
                                        </h3>
                                        <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6', flex: 1, marginBottom: '20px' }}>
                                            {item.summary}
                                        </p>
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            {item.keywords?.slice(0, 3).map((tag: string) => (
                                                <span key={tag} style={{
                                                    fontSize: '0.7rem', background: '#f1f3f5', padding: '4px 8px', borderRadius: '4px', color: '#495057'
                                                }}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}
