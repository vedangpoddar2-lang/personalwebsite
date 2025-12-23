'use client';

import { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import DocumentViewerModal from './DocumentViewerModal';
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

// Helper to check if file is a PDF
const isPDF = (file: ProjectFile): boolean => {
    const filename = file.originalFilename?.toLowerCase() || file.url.toLowerCase();
    return filename.endsWith('.pdf');
};

// Helper to check if file is Excel
const isExcel = (file: ProjectFile): boolean => {
    const filename = file.originalFilename?.toLowerCase() || file.url.toLowerCase();
    return filename.endsWith('.xlsx') || filename.endsWith('.xls');
};

export default function ProjectFileCarousel({ files }: ProjectFileCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerFile, setViewerFile] = useState<ProjectFile | null>(null);

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

    const handleFileClick = (e: React.MouseEvent, file: ProjectFile) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPDF(file)) {
            // Open PDF in viewer modal
            setViewerFile(file);
            setViewerOpen(true);
        } else {
            // For Excel and other files, directly download/open
            window.open(`${file.url}?dl=`, '_blank');
        }
    };

    const getFileTypeLabel = (file: ProjectFile): string => {
        if (isPDF(file)) return '📄 PDF';
        if (isExcel(file)) return '📊 Excel';
        return '📁 File';
    };

    return (
        <>
            <div className={styles.carouselWrapper}>
                <div className={styles.carouselContainer}>
                    {hasMultiple && (
                        <button onClick={prevFile} className={`${styles.navBtn} ${styles.prevBtn}`} aria-label="Previous file">
                            ‹
                        </button>
                    )}

                    <button
                        onClick={(e) => handleFileClick(e, currentFile)}
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
                                <div className={styles.fileIcon}>
                                    {isPDF(currentFile) ? '📄' : isExcel(currentFile) ? '📊' : '📁'}
                                </div>
                            )}
                            {isPDF(currentFile) && (
                                <div className={styles.viewBadge}>View</div>
                            )}
                        </div>
                        <div className={styles.fileInfo}>
                            <span className={styles.fileName}>
                                {currentFile.title || currentFile.originalFilename || 'Download File'}
                            </span>
                            <span className={styles.fileType}>{getFileTypeLabel(currentFile)}</span>
                            {hasMultiple && (
                                <span className={styles.counter}>
                                    {currentIndex + 1} / {files.length}
                                </span>
                            )}
                        </div>
                    </button>

                    {hasMultiple && (
                        <button onClick={nextFile} className={`${styles.navBtn} ${styles.nextBtn}`} aria-label="Next file">
                            ›
                        </button>
                    )}
                </div>
            </div>

            {/* PDF Viewer Modal */}
            {viewerFile && (
                <DocumentViewerModal
                    isOpen={viewerOpen}
                    onClose={() => setViewerOpen(false)}
                    pdfUrl={viewerFile.url}
                    documentTitle={viewerFile.title || viewerFile.originalFilename || 'Document'}
                />
            )}
        </>
    );
}

