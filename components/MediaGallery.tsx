'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import styles from './MediaGallery.module.css';

interface MediaGalleryProps {
    items: any[];
}

export default function MediaGallery({ items }: MediaGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (lightboxIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [lightboxIndex]);

    if (!items || items.length === 0) return null;

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % items.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);
        }
    };

    const lightboxContent = lightboxIndex !== null ? (
        <div className={styles.lightbox} onClick={closeLightbox}>
            <button className={styles.closeBtn} onClick={closeLightbox} aria-label="Close">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            {/* Navigation Buttons */}
            {items.length > 1 && (
                <>
                    <button className={styles.prevBtn} onClick={prevImage} aria-label="Previous">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button className={styles.nextBtn} onClick={nextImage} aria-label="Next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </>
            )}

            {/* Content Wrapper */}
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>

                {/* Title at Top */}
                <h3 className={styles.lightboxTitle}>
                    {items[lightboxIndex].title || items[lightboxIndex].caption || "Media Viewer"}
                </h3>

                {items[lightboxIndex]._type === 'image' ? (
                    <>
                        <div className={styles.imageContainer}>
                            <Image
                                src={urlFor(items[lightboxIndex]).url()}
                                alt="Full size"
                                fill
                                className={styles.fullImage}
                                sizes="90vw"
                            />
                        </div>
                        {/* Download Button for Image */}
                        <a
                            href={`${items[lightboxIndex].asset.url}?dl=`}
                            className={styles.downloadBtn}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                        </a>
                    </>
                ) : (
                    <div className={styles.filePreview}>
                        {/* Thumbnail */}
                        {items[lightboxIndex].thumbnail ? (
                            <div className={styles.lightboxThumbnailWrapper}>
                                <Image
                                    src={urlFor(items[lightboxIndex].thumbnail).width(1600).url()}
                                    alt="Document Preview"
                                    fill
                                    className={styles.lightboxThumbnail}
                                    sizes="90vw"
                                />
                            </div>
                        ) : (
                            <div className={styles.previewIcon}>📄</div>
                        )}

                        {/* Download Button for File */}
                        <a
                            href={`${items[lightboxIndex].asset.url}?dl=`}
                            className={styles.downloadBtn}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                        </a>
                    </div>
                )}
            </div>
        </div>
    ) : null;

    return (
        <>
            <div className={styles.galleryContainer}>
                {items.map((file, index) => {
                    const isImage = file._type === 'image';
                    const thumbnailImage = file.thumbnail || (isImage ? file : null);
                    const title = file.title || file.caption || (isImage ? "Image" : "Document");

                    if (!file.asset) return null;

                    return (
                        <div
                            key={file._key || index}
                            className={styles.tile}
                            onClick={() => openLightbox(index)}
                            title={title}
                        >
                            {thumbnailImage ? (
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={urlFor(thumbnailImage).width(400).url()}
                                        alt={title}
                                        fill
                                        className={styles.thumbnail}
                                    />
                                    {!isImage && <div className={styles.docOverlay}>📄</div>}
                                </div>
                            ) : (
                                <div className={styles.fileWrapper}>
                                    <div className={styles.fileIcon}>📄</div>
                                </div>
                            )}
                            <div className={styles.tileLabel}>
                                {title}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Render Lightbox via Portal */}
            {mounted && lightboxContent ? createPortal(lightboxContent, document.body) : null}
        </>
    );
}
