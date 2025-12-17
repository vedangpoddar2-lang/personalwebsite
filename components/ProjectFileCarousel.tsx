'use client';

import { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './ProjectFileCarousel.module.css';

interface ProjectFile {
    _key: string;
    title?: string;
    originalFilename: string;
    url: string;
    thumbnail?: any;
}

interface ProjectFileCarouselProps {
    files: ProjectFile[];
}

export default function ProjectFileCarousel({ files }: ProjectFileCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!files || files.length === 0) return <span className={styles.noFiles}>-</span>;

    const currentFile = files[currentIndex];
    const hasMultiple = files.length > 1;

    const nextFile = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % files.length);
    };

    const prevFile = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
    };

    return (
        <div className={styles.carouselWrapper}>
            <div className={styles.carouselContainer}>
                {hasMultiple && (
                    <button onClick={prevFile} className={`${styles.navBtn} ${styles.prevBtn}`} aria-label="Previous file">
                        ‹
                    </button>
                )}

                <a
                    href={`${currentFile.url}?dl=`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.fileLink}
                >
                    <div className={styles.thumbnailWrapper}>
                        {currentFile.thumbnail ? (
                            <Image
                                src={urlFor(currentFile.thumbnail).width(320).url()}
                                alt={currentFile.title || 'Thumbnail'}
                                fill
                                className={styles.thumbnail}
                            />
                        ) : (
                            <div className={styles.fileIcon}>📄</div>
                        )}
                    </div>
                    <div className={styles.fileInfo}>
                        <span className={styles.fileName}>
                            {currentFile.title || currentFile.originalFilename || 'Download File'}
                        </span>
                        {hasMultiple && (
                            <span className={styles.counter}>
                                {currentIndex + 1} / {files.length}
                            </span>
                        )}
                    </div>
                </a>

                {hasMultiple && (
                    <button onClick={nextFile} className={`${styles.navBtn} ${styles.nextBtn}`} aria-label="Next file">
                        ›
                    </button>
                )}
            </div>
        </div>
    );
}
