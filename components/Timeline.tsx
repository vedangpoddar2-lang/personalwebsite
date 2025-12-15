'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import styles from './Timeline.module.css';

interface WorkItem {
    _id: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    logo?: any;
    shortDescription: string;
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
                    {/* Logo acts as the bullet point */}
                    <div className={styles.logoWrapper}>
                        {item.logo ? (
                            <Image
                                src={urlFor(item.logo).width(300).url()}
                                alt={item.company}
                                width={100}
                                height={100}
                                className={styles.logo}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                        )}
                    </div>

                    <div className={styles.contentColumn}>
                        <div className={styles.header} onClick={() => toggleExpand(item._id)}>
                            <div className={styles.info}>
                                <h3 className={styles.role}>{item.role}</h3>
                                <h4 className={styles.company}>
                                    {item.company}
                                    <span className={styles.inlineDate}>
                                        {new Date(item.startDate).getFullYear()} - {item.endDate ? new Date(item.endDate).getFullYear() : 'Present'}
                                    </span>
                                </h4>
                                <p className={styles.shortDesc}>{item.shortDescription}</p>
                            </div>
                            <div className={styles.expandIcon}>
                                {expandedIds.includes(item._id) ? '−' : '+'}
                            </div>
                        </div>

                        {expandedIds.includes(item._id) && item.details && (
                            <div className={styles.details}>
                                <PortableText value={item.details} />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
