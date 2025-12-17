'use client';

import { useState } from 'react';
import styles from './SpotlightCarousel.module.css';

interface Highlight {
    _id: string;
    title: string;
    description: string;
    order?: number;
}

interface SpotlightCarouselProps {
    items: Highlight[];
}

export default function SpotlightCarousel({ items }: SpotlightCarouselProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (!items || items.length === 0) return null;

    // Sort by order if available
    const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <div className={styles.container}>
            <div className={styles.pillsRow}>
                {sortedItems.map((item, index) => (
                    <button
                        key={item._id}
                        className={`${styles.pill} ${activeIndex === index ? styles.active : ''}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    >
                        {item.title}
                    </button>
                ))}
            </div>

            <div className={styles.descriptionContainer}>
                {activeIndex !== null && (
                    <div className={styles.descriptionCard}>
                        <p>{sortedItems[activeIndex].description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
