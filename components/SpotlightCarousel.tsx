'use client';

import { useState, useRef } from 'react';
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
    const [scrollIndex, setScrollIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    if (!items || items.length === 0) return null;

    const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
    const itemsToShow = 3;
    const maxIndex = Math.max(0, sortedItems.length - itemsToShow);

    const handleNext = () => {
        setScrollIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const handlePrev = () => {
        setScrollIndex((prev) => Math.max(prev - 1, 0));
    };

    return (
        <div className={styles.container}>
            <div className={styles.carouselWrapper}>
                <button
                    className={`${styles.navButton} ${styles.prevButton}`}
                    onClick={handlePrev}
                    disabled={scrollIndex === 0}
                    aria-label="Previous items"
                >
                    ←
                </button>

                <div className={styles.viewport} ref={containerRef}>
                    <div
                        className={styles.track}
                        style={{ transform: `translateX(-${scrollIndex * (300 + 40)}px)` }} // 300px card + 40px gap
                    >
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

                <button
                    className={`${styles.navButton} ${styles.nextButton}`}
                    onClick={handleNext}
                    disabled={scrollIndex === maxIndex}
                    aria-label="Next items"
                >
                    →
                </button>
            </div>
        </div>
    );
}
