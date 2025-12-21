'use client';

import { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './EducationList.module.css';
import MediaGallery from './MediaGallery';
import BentoGrid from './BentoGrid';

interface EducationItem {
    _id: string;
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
    logo?: any;
    logoSize?: number;
    shortDescription?: string;
    media?: any[];
    bentoCards?: any[];
}

interface EducationListProps {
    items: EducationItem[];
}

export default function EducationList({ items }: EducationListProps) {
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
        <div className={styles.container}>
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
                                width: item.logoSize ? `${item.logoSize}px` : '100px',
                                minWidth: item.logoSize ? `${item.logoSize}px` : '100px',
                            }}
                        >
                            {item.logo ? (
                                <Image
                                    src={urlFor(item.logo).url()}
                                    alt={item.institute}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: '100%', height: 'auto' }}
                                    className={styles.logo}
                                />
                            ) : (
                                <div className={styles.placeholderLogo} />
                            )}
                        </div>

                        <div className={styles.info}>
                            <h3 className={styles.institute}>{item.institute}</h3>
                            <h4 className={styles.degree}>
                                {item.degree}
                                <span className={styles.inlineDate}>
                                    {new Date(item.startDate).getFullYear()} - {new Date(item.endDate).getFullYear()}
                                </span>
                            </h4>
                            {item.shortDescription && (
                                <p className={styles.shortDesc}>{item.shortDescription}</p>
                            )}
                        </div>

                        <div className={styles.expandIcon}>
                            {expandedIds.includes(item._id) ? '−' : '+'}
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedIds.includes(item._id) && (
                        <div className={styles.expandedContent}>
                            {item.bentoCards && item.bentoCards.length > 0 && (
                                <BentoGrid items={item.bentoCards} />
                            )}

                            {item.media && item.media.length > 0 && (
                                <MediaGallery items={item.media} />
                            )}

                            <div className={styles.projectLinkWrapper}>
                                <a href="/projects" className={styles.projectLink}>
                                    View Related Projects →
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
