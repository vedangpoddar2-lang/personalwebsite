'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import styles from './EducationList.module.css';
import MediaGallery from './MediaGallery';
import BentoGrid from './BentoGrid';
import { CustomPortableTextComponents } from './PortableTextComponents';

interface EducationItem {
    _id: string;
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
    logo?: any;
    logoSize?: number;
    description: any;
    media?: any[];
    bentoCards?: any[];
}

interface EducationListProps {
    items: EducationItem[];
}

export default function EducationList({ items }: EducationListProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    if (!items || items.length === 0) return null;

    const activeItem = items.find(item => item._id === activeId);

    const handleTabClick = (id: string) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <div className={styles.container}>
            {/* Card Tabs */}
            <div className={styles.tabsGrid}>
                {items.map((item) => (
                    <button
                        key={item._id}
                        className={`${styles.tabCard} ${activeId === item._id ? styles.activeTabCard : ''}`}
                        onClick={() => handleTabClick(item._id)}
                    >
                        <div className={styles.tabContent}>
                            {/* Logo at Top */}
                            <div className={styles.tabLogoWrapper} style={{ width: item.logoSize || 100, height: item.logoSize || 100 }}>
                                {item.logo ? (
                                    <Image
                                        src={urlFor(item.logo).width(300).url()}
                                        alt={item.institute}
                                        width={item.logoSize || 100}
                                        height={item.logoSize || 100}
                                        className={styles.tabLogo}
                                    />
                                ) : (
                                    <div className={styles.placeholderLogo} />
                                )}
                            </div>

                            {/* Details Below */}
                            <div className={styles.tabDetails}>
                                <h3 className={styles.tabInstitute}>{item.institute}</h3>
                                <p className={styles.tabDegree}>{item.degree}</p>
                                <span className={styles.tabDate}>
                                    {new Date(item.startDate).getFullYear()} - {new Date(item.endDate).getFullYear()}
                                </span>
                            </div>
                        </div>

                        {/* Plus Sign in Corner */}
                        <div className={styles.plusIcon}>
                            {activeId === item._id ? '−' : '+'}
                        </div>
                    </button>
                ))}
            </div>

            {/* Expanded Content Area */}
            {activeItem && (
                <div className={styles.expandedContent}>
                    {/* Use BentoGrid if cards exist */}
                    {activeItem.bentoCards && activeItem.bentoCards.length > 0 && (
                        <BentoGrid items={activeItem.bentoCards} />
                    )}

                    {/* Optional: Keep original description as fallback or additional info */}
                    {/* 
                    <div className={styles.description}>
                        <PortableText value={activeItem.description} />
                    </div>
                    */}

                    {activeItem.media && activeItem.media.length > 0 && (
                        <MediaGallery items={activeItem.media} />
                    )}

                    <div className={styles.projectLinkWrapper}>
                        <a href="/projects" className={styles.projectLink}>
                            View Related Projects →
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
