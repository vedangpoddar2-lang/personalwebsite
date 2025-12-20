'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import styles from './Timeline.module.css';
import { CustomPortableTextComponents } from './PortableTextComponents';
import HighlighterTag from './HighlighterTag';

interface WorkItem {
    _id: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    logo?: any;
    logoWidth?: number; // Added optional logoWidth
    shortDescription: string;
    tags?: string[];
    details?: any;
}

interface TimelineProps {
    items: WorkItem[];
}

export default function Timeline({ items }: TimelineProps) {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (expandedIds.length === items.length) {
            setExpandedIds([]); // Collapse all
        } else {
            setExpandedIds(items.map(item => item._id)); // Expand all
        }
    };

    const isAllExpanded = items.length > 0 && expandedIds.length === items.length;

    if (!items || items.length === 0) return null;

    return (
        <div className={styles.timeline}>
            <div className={styles.controls}>
                <button onClick={toggleAll} className={styles.toggleAllBtn}>
                    {isAllExpanded ? 'Collapse All' : 'Expand All'}
                </button>
            </div>
            {items.map((item) => (
                <div key={item._id} className={styles.item}>
                    {/* Header Row: Logo + Info + Expand Icon */}
                    <div className={styles.headerRow} onClick={() => toggleExpand(item._id)}>
                        <div
                            className={styles.logoWrapper}
                            style={{
                                width: item.logoWidth ? `${item.logoWidth}px` : '100px',
                                minWidth: item.logoWidth ? `${item.logoWidth}px` : '100px', // Prevent shrinking
                            }}
                        >
                            {item.logo ? (
                                <Image
                                    src={urlFor(item.logo).url()}
                                    alt={item.company}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: '100%', height: 'auto' }}
                                    className={styles.logo}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                            )}
                        </div>

                        <div className={styles.info}>
                            <h3 className={styles.role}>{item.role}</h3>
                            <h4 className={styles.company}>
                                {item.company}
                                <span className={styles.inlineDate}>
                                    {new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {item.endDate ? new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                                </span>
                            </h4>
                            <p className={styles.shortDesc}>{item.shortDescription}</p>
                        </div>

                        <div className={styles.expandIcon}>
                            {expandedIds.includes(item._id) ? '−' : '+'}
                        </div>
                    </div>

                    {/* Expanded Content: Full Width */}
                    {expandedIds.includes(item._id) && (
                        <div className={styles.expandedContent}>
                            {item.tags && item.tags.length > 0 && (
                                <div className={styles.tags}>
                                    {item.tags.map((tag, index) => (
                                        <HighlighterTag key={index} text={tag} />
                                    ))}
                                </div>
                            )}
                            {item.details && (
                                <div className={`${styles.details} portable-text`}>
                                    <PortableText value={item.details} components={CustomPortableTextComponents} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
