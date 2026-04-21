'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTimes, FaMagic } from 'react-icons/fa';

export default function BrainActions() {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Toggle with Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.set('source', 'manual');
            formData.set('title', 'Quick Note');

            if (text.startsWith('http')) {
                formData.set('type', 'link');
                formData.set('url', text);
            } else {
                formData.set('type', 'snippet');
                formData.set('text', text);
            }

            const response = await fetch('/api/brain/ingest', {
                method: 'POST',
                headers: { 'x-admin-pin': '1234' },
                body: formData
            });

            if (response.ok) {
                setText('');
                setIsOpen(false);
                router.refresh();
            } else {
                const data = await response.json();
                alert(`Error: ${data.error || 'Failed to save'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 1. The Trigger Button (Fixed Bottom Right) */}
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed', bottom: '30px', right: '30px', zIndex: 100,
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'var(--primary)', color: '#fff',
                    border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', transition: 'transform 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                title="Add to Brain (Cmd+K)"
            >
                <FaPlus />
            </button>

            {/* 2. The Modal Overlay */}
            {isOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(255, 245, 240, 0.9)', // Light frosted glass
                    backdropFilter: 'blur(5px)',
                    zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setIsOpen(false)}>

                    <div style={{
                        width: '600px', background: '#fff', borderRadius: '16px', padding: '30px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)', position: 'relative'
                    }} onClick={e => e.stopPropagation()}>

                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem'
                            }}
                        >
                            <FaTimes color="#999" />
                        </button>

                        <h2 style={{ marginBottom: '20px', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                            Capture Thought
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ position: 'relative' }}>
                                <textarea
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    placeholder="Paste a link or write a thought..."
                                    style={{
                                        width: '100%', height: '180px',
                                        background: '#f8f9fa', color: '#333',
                                        border: '2px solid #eee', borderRadius: '12px', padding: '20px',
                                        fontSize: '1.1rem', resize: 'none', outline: 'none',
                                        fontFamily: 'var(--font-sans)'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = '#eee'}
                                    autoFocus
                                />
                                <FaMagic style={{ position: 'absolute', bottom: '20px', right: '20px', color: '#ccc' }} />
                            </div>

                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#888', fontSize: '0.9rem' }}>
                                    <strong>Cmd+K</strong> to toggle
                                </span>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        background: loading ? '#ccc' : 'var(--primary)',
                                        color: '#fff',
                                        border: 'none', padding: '12px 30px', borderRadius: '30px',
                                        fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}
                                >
                                    {loading ? 'Processing...' : 'Save to Brain'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
