'use client';

import { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './PhotoCarousel.module.css';

interface PhotoCarouselProps {
    photos: any[];
}

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!photos || photos.length === 0) return null;

    const nextPhoto = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    return (
        <div className={styles.carousel}>
            <div className={styles.mainWrapper}>
                <button onClick={prevPhoto} className={`${styles.navBtn} ${styles.prev}`}>
                    ‹
                </button>

                <div className={styles.imageContainer}>
                    <Image
                        key={currentIndex}
                        src={urlFor(photos[currentIndex]).width(1200).height(1200).url()}
                        alt="Profile photo"
                        width={600}
                        height={600}
                        className={styles.mainImage}
                        priority
                    />
                </div>

                <button onClick={nextPhoto} className={`${styles.navBtn} ${styles.next}`}>
                    ›
                </button>
            </div>

            <div className={styles.thumbnails}>
                {photos.map((photo, index) => (
                    <div
                        key={index}
                        className={`${styles.thumbWrapper} ${index === currentIndex ? styles.active : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    >
                        <Image
                            src={urlFor(photo).width(100).height(100).url()}
                            alt={`Thumbnail ${index + 1}`}
                            width={50}
                            height={50}
                            className={styles.thumbImage}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
