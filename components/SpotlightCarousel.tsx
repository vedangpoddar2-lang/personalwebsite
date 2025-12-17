'use client';

import { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './SpotlightCarousel.module.css';

interface Highlight {
    _id: string;
    title: string;
    description: string;
    image?: any;
    link?: string;
    order?: number;
}

interface SpotlightCarouselProps {
    items: Highlight[];
}

export default function SpotlightCarousel({ items }: SpotlightCarouselProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (!items || items.length === 0) return null;

    const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {sortedItems.map((item, index) => {
                    const CardContent = (
                        <>
                            <div className={styles.imageWrapper}>
                                {item.image && (
                                    <Image
                                        src={urlFor(item.image).width(600).height(800).url()}
                                        alt={item.title}
                                        fill
                                        className={styles.image}
                                        quality={100}
                                        sizes="(max-width: 768px) 100vw, 300px"
                                    />
                                )}
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>{item.title}</h3>
                                <p className={styles.description}>{item.description}</p>
                            </div>
                        </>
                    );

                    return (
                        <div
                            key={item._id}
                            className={`${styles.card} ${activeIndex === index ? styles.active : ''}`}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        >
                            {item.link ? (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.linkWrapper}>
                                    {CardContent}
                                </a>
                            ) : (
                                CardContent
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
